/**
 * Personalized event ordering for the events feed.
 *
 * Ranks events for the README's fixed main user — Alice Johnson (user_5736) —
 * by location, industry, skills, and courses. Uses the Gemini API when a
 * GEMINI_API_KEY is configured (prompt in prompts/event-ranking.md); otherwise
 * falls back to a deterministic heuristic so the feed always renders and stays
 * testable without a network call.
 */
import fs from "fs";
import path from "path";
import type { Event } from "@/types/event";

export type MemberProfile = {
  current_location: string;
  industry: string;
  skills: string[];
  courses: string[];
};

const GEMINI_MODEL = "gemini-1.5-flash";
const PROMPT_PATH = path.join(process.cwd(), "prompts", "event-ranking.md");

/** Build the ranking profile for the main user (Alice Johnson, user_5736). */
export function getMainUserProfile(): MemberProfile {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getMainUser, latestJob } = require("../server/lib/data");
  const user = getMainUser();
  const job = user ? latestJob(user) : null;

  // Resolve course ids → course names so the model sees subjects, not opaque ids.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { courses } = require("../server/lib/data");
  const courseById = new Map(courses.map((c: { id: string }) => [c.id, c]));
  const courseNames = (user?.courses ?? [])
    .map((id: string) => (courseById.get(id) as { name?: string })?.name)
    .filter(Boolean) as string[];

  return {
    current_location: user?.current_location ?? "",
    industry: job?.industry ?? "",
    skills: user?.skills ?? [],
    courses: courseNames,
  };
}

/**
 * Deterministic relevance score for one event against the member profile.
 * Higher is more relevant. Mirrors the priority order in the prompt:
 * location > industry > skills > courses.
 */
export function scoreEvent(event: Event, member: MemberProfile): number {
  let score = 0;
  const haystack =
    `${event.name} ${event.description} ${event.industry}`.toLowerCase();

  // Location — same city/region is the strongest signal.
  if (member.current_location && event.location === member.current_location) {
    score += 100;
  } else if (member.current_location && event.location) {
    // Partial credit for a shared city token (e.g. "Seattle").
    const memberCity = member.current_location.split(",")[0].trim().toLowerCase();
    if (memberCity && event.location.toLowerCase().includes(memberCity)) {
      score += 60;
    }
  }

  // Industry match.
  if (member.industry && event.industry === member.industry) {
    score += 40;
  }

  // Skills — any skill referenced in the event text.
  for (const skill of member.skills) {
    if (skill && haystack.includes(skill.toLowerCase())) score += 10;
  }

  // Courses — learning interests referenced in the event text.
  for (const course of member.courses) {
    if (course && haystack.includes(course.toLowerCase())) score += 5;
  }

  return score;
}

/** Stable heuristic ordering — used as the fallback and the test baseline. */
export function rankEventsHeuristic(
  events: Event[],
  member: MemberProfile,
): Event[] {
  return events
    .map((event, index) => ({ event, index, score: scoreEvent(event, member) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.event);
}

/** Reorder `events` to match a list of ids, appending any ids the model dropped. */
export function applyRankedIds(events: Event[], rankedIds: string[]): Event[] {
  const byId = new Map(events.map((event) => [event.id, event]));
  const ordered: Event[] = [];
  const seen = new Set<string>();

  for (const id of rankedIds) {
    const event = byId.get(id);
    if (event && !seen.has(id)) {
      ordered.push(event);
      seen.add(id);
    }
  }
  // Preserve any events the model omitted, in their original order.
  for (const event of events) {
    if (!seen.has(event.id)) ordered.push(event);
  }
  return ordered;
}

/** Call Gemini to rank events; throws on any failure so callers can fall back. */
async function rankEventsWithGemini(
  events: Event[],
  member: MemberProfile,
  apiKey: string,
): Promise<Event[]> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const instructions = fs.readFileSync(PROMPT_PATH, "utf-8");

  const payload = {
    member,
    events: events.map((event) => ({
      id: event.id,
      name: event.name,
      location: event.location,
      industry: event.industry,
      description: event.description,
    })),
  };

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: instructions,
    generationConfig: { responseMimeType: "application/json" },
  });

  const result = await model.generateContent(JSON.stringify(payload));
  const text = result.response.text();
  const parsed = JSON.parse(text) as { ranked_event_ids?: string[] };

  if (!Array.isArray(parsed.ranked_event_ids)) {
    throw new Error("Gemini response missing ranked_event_ids");
  }
  return applyRankedIds(events, parsed.ranked_event_ids);
}

/**
 * Order events for the main user. Tries Gemini first, falls back to the
 * deterministic heuristic when no API key is set or the call fails.
 */
export async function rankEventsForMainUser(events: Event[]): Promise<Event[]> {
  const member = getMainUserProfile();
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      return await rankEventsWithGemini(events, member, apiKey);
    } catch (error) {
      // Never break the feed on a model/network error — log and fall back.
      console.error("Gemini event ranking failed, using heuristic:", error);
    }
  }

  return rankEventsHeuristic(events, member);
}
