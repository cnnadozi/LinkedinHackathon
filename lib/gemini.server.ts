/**
 * Shared Gemini client with retries for transient 503/500 errors.
 * Uses flash-lite — the model most reliably available on the free tier.
 */
import type { ResponseSchema } from "@google/generative-ai";

const GEMINI_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
] as const;
const MAX_RETRIES = 3;
const RETRY_BASE_MS = 1500;

export type GenerateGeminiJsonOptions = {
  responseSchema?: ResponseSchema;
};

function isRetryableError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("[503") || message.includes("[500");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Call Gemini and return the raw response text (JSON mode). */
export async function generateGeminiJson(
  apiKey: string,
  systemInstruction: string,
  payload: unknown,
  options: GenerateGeminiJsonOptions = {},
): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(apiKey);
  const body = JSON.stringify(payload);
  let lastError: unknown;

  for (const modelName of GEMINI_MODELS) {
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction,
      generationConfig: {
        responseMimeType: "application/json",
        ...(options.responseSchema
          ? { responseSchema: options.responseSchema }
          : {}),
      },
    });

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const result = await model.generateContent(body);
        return result.response.text();
      } catch (error) {
        lastError = error;
        if (isRetryableError(error) && attempt < MAX_RETRIES - 1) {
          await sleep(RETRY_BASE_MS * (attempt + 1));
          continue;
        }
        break;
      }
    }
  }

  throw lastError;
}
