/**
 * AI-suggested nudge messages for post-event follow-ups.
 *
 * Drafts 3 opening messages (warm reconnect / ask for advice / propose a next
 * step) the main user — Alice Johnson (user_5736) — can send to someone they
 * attended an event with. Signals come from the existing connection engine
 * (shared skills, schools, post themes) plus the recipient's headline/company,
 * scoped to the single event both people attended.
 *
 * Uses the Gemini API when GEMINI_API_KEY is set (prompt in
 * prompts/nudge-suggestions.md); otherwise returns deterministic heuristic
 * messages so the nudge window always has suggestions and stays testable.
 */
import fs from "fs";
import path from "path";

const GEMINI_MODEL = "gemini-1.5-flash";
const PROMPT_PATH = path.join(process.cwd(), "prompts", "nudge-suggestions.md");

export type NudgeContext = {
  sender: { name: string };
  recipient: {
    name: string;
    headline: string;
    company: string | null;
    industry: string | null;
  };
  event: { name: string };
  shared: { skills: string[]; schools: string[]; themes: string[] };
};

/** First name only — recipients are addressed informally. */
function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || name;
}

/**
 * Assemble the nudge context for a recipient + the event both attended.
 * Pulls shared skills/schools/themes from the connection engine; the event
 * name is the shared anchor (not all mutual events).
 */
export function buildNudgeContext(
  targetUserId: string,
  eventName: string,
): NudgeContext | null {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getMainUser, userById, memberHeadline, latestJob } = require("../server/lib/data");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getConnectionSuggestions } = require("../server/lib/suggestions");

  const sender = getMainUser();
  const recipient = userById[targetUserId];
  if (!sender || !recipient || recipient.id === sender.id) return null;

  const suggestions = getConnectionSuggestions(targetUserId, sender.id);
  const job = latestJob(recipient);

  return {
    sender: { name: sender.name },
    recipient: {
      name: recipient.name,
      headline: memberHeadline(recipient),
      company: job?.company ?? null,
      industry: job?.industry ?? null,
    },
    event: { name: eventName },
    shared: {
      skills: suggestions?.sharedSkills ?? [],
      schools: suggestions?.sharedSchools ?? [],
      themes: suggestions?.sharedThemes ?? [],
    },
  };
}

/**
 * Deterministic talking-point ideas — the fallback and test baseline.
 * These are cues about what to mention/ask, NOT finished messages.
 * Mirrors the prompt's angle order: shared event, something in common, about them.
 */
export function nudgeSuggestionsHeuristic(ctx: NudgeContext): string[] {
  const name = firstName(ctx.recipient.name);
  const event = ctx.event.name;
  const skill = ctx.shared.skills[0];
  const school = ctx.shared.schools[0];
  const company = ctx.recipient.company;

  // 1. Shared event — suggest mentioning the event both attended.
  const sharedEvent = `Mention the ${event} event you both attended.`;

  // 2. Something in common — strongest shared signal (school → skill → fallback).
  const inCommon = school
    ? `Bring up that you both studied at ${school}.`
    : skill
      ? `Bring up your shared background in ${skill}.`
      : `Find common ground from their background and the event you shared.`;

  // 3. About them — ask about their work/role/company.
  const aboutThem = company
    ? `Ask ${name} about their work as ${ctx.recipient.headline.split(" at ")[0]} at ${company}.`
    : `Ask ${name} about what they're working on right now.`;

  return [sharedEvent, inCommon, aboutThem];
}

/** Validate a model response into exactly 3 non-empty strings. */
function parseSuggestions(text: string): string[] {
  const parsed = JSON.parse(text) as { suggestions?: unknown };
  const list = parsed.suggestions;
  if (
    !Array.isArray(list) ||
    list.length !== 3 ||
    !list.every((s) => typeof s === "string" && s.trim().length > 0)
  ) {
    throw new Error("Gemini response missing 3 valid suggestions");
  }
  return list as string[];
}

/** Call Gemini for nudge suggestions; throws on any failure so callers fall back. */
async function nudgeSuggestionsWithGemini(
  ctx: NudgeContext,
  apiKey: string,
): Promise<string[]> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const instructions = fs.readFileSync(PROMPT_PATH, "utf-8");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: instructions,
    generationConfig: { responseMimeType: "application/json" },
  });

  const result = await model.generateContent(JSON.stringify(ctx));
  return parseSuggestions(result.response.text());
}

/**
 * Generate 3 nudge suggestions for the recipient + shared event.
 * Tries Gemini first, falls back to the heuristic when no key or on error.
 */
export async function generateNudgeSuggestions(
  targetUserId: string,
  eventName: string,
): Promise<string[] | null> {
  const ctx = buildNudgeContext(targetUserId, eventName);
  if (!ctx) return null;

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      return await nudgeSuggestionsWithGemini(ctx, apiKey);
    } catch (error) {
      // Never block the nudge window on a model/network error — log and fall back.
      console.error("Gemini nudge suggestions failed, using heuristic:", error);
    }
  }

  return nudgeSuggestionsHeuristic(ctx);
}

export type MutualEvent = { id: string; name: string };

export type NudgePanel = {
  recipient: { name: string; headline: string };
  /** Common interests/industries/topics both people share. */
  sharedThemes: string[];
  /** Events both attended in the last 6 months (most recent first). */
  mutualEvents: MutualEvent[];
  /** AI conversation starters, each tappable to insert into the composer. */
  talkingPoints: string[];
};

/**
 * Assemble the full AI connection panel for a recipient + shared event:
 * shared themes, mutual events (last 6 months), and AI talking points.
 * Factual sections come from the connection engine; talking points come from
 * Gemini (with the heuristic fallback).
 */
export async function getNudgePanel(
  targetUserId: string,
  eventName: string,
): Promise<NudgePanel | null> {
  const ctx = buildNudgeContext(targetUserId, eventName);
  if (!ctx) return null;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getMainUser } = require("../server/lib/data");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getConnectionSuggestions } = require("../server/lib/suggestions");

  const suggestions = getConnectionSuggestions(targetUserId, getMainUser()?.id);

  // Shared themes — merge post themes with shared skills (both are "things in
  // common"), de-duplicated, so the section is populated even when one is empty.
  const sharedThemes = [
    ...new Set([
      ...(suggestions?.sharedThemes ?? []),
      ...(suggestions?.sharedSkills ?? []),
    ]),
  ];

  const mutualEvents: MutualEvent[] = (suggestions?.mutualEvents ?? []).map(
    (event: { id: string; name: string }) => ({ id: event.id, name: event.name }),
  );

  const talkingPoints = await generateNudgeSuggestions(targetUserId, eventName);

  return {
    recipient: { name: ctx.recipient.name, headline: ctx.recipient.headline },
    sharedThemes,
    mutualEvents,
    talkingPoints: talkingPoints ?? [],
  };
}
