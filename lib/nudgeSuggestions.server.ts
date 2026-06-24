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
 * Deterministic 3-angle suggestions — the fallback and test baseline.
 * Mirrors the prompt's angle order: warm reconnect, ask for advice, next step.
 */
export function nudgeSuggestionsHeuristic(ctx: NudgeContext): string[] {
  const name = firstName(ctx.recipient.name);
  const event = ctx.event.name;
  const skill = ctx.shared.skills[0];
  const school = ctx.shared.schools[0];

  // 1. Warm reconnect — references the shared event.
  const warm = school
    ? `Hi ${name} — great running into a fellow ${school} grad at ${event}! Would love to stay connected.`
    : `Hi ${name} — really enjoyed ${event}. Would love to stay in touch!`;

  // 2. Ask for advice — leans on a shared skill when available.
  const advice = skill
    ? `Hey ${name}, since we both work in ${skill}, I'd love to hear how you approach it. Got a few minutes to chat?`
    : `Hey ${name}, I'd love to hear more about what you're working on — mind if I ask you a couple of questions?`;

  // 3. Concrete next step.
  const nextStep = `Hi ${name} — it was great meeting at ${event}. Want to grab a quick coffee or hop on a call to keep the conversation going?`;

  return [warm, advice, nextStep];
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
