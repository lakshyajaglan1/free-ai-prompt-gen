// ── Gemini AI Refine Module ──
// Fully isolated — can be removed without touching the core wizard.
// Uses the user's own API key via direct fetch(), no SDK.

export class RefineError extends Error {
  constructor(
    message: string,
    public readonly code: 'INVALID_KEY' | 'RATE_LIMIT' | 'NETWORK' | 'API_ERROR' | 'MODEL_ERROR'
  ) {
    super(message);
    this.name = 'RefineError';
  }
}

const GEMINI_MODEL = 'gemini-flash-latest';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_INSTRUCTION =
  'You are a prompt engineering expert. Take this prompt and tighten the wording, remove ambiguity, and improve structure. Return ONLY the improved prompt, no commentary, no preamble, no explanation.';

/**
 * Refine a prompt using the Gemini API with the user's own key.
 * @param prompt - The assembled prompt to refine
 * @param apiKey - The user's Gemini API key
 * @returns The AI-refined prompt string
 * @throws RefineError with a plain-language message
 */
export async function refinePrompt(prompt: string, apiKey: string): Promise<string> {
  if (!apiKey || !apiKey.trim()) {
    throw new RefineError(
      'No API key provided. Add your Gemini API key in Settings to use AI refinement.',
      'INVALID_KEY'
    );
  }

  if (!prompt || !prompt.trim()) {
    throw new RefineError(
      'Your prompt is empty. Fill in at least the Task field before refining.',
      'API_ERROR'
    );
  }

  const url = `${GEMINI_API_URL}?key=${encodeURIComponent(apiKey.trim())}`;

  const body = {
    system_instruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }],
    },
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  };

  let response: Response;

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw new RefineError(
      'Network error — check your internet connection and try again.',
      'NETWORK'
    );
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new RefineError(
        'Invalid or expired API key. Double-check your key at aistudio.google.com/apikey and try again.',
        'INVALID_KEY'
      );
    }
    if (response.status === 429) {
      throw new RefineError(
        "Rate limit reached — Google's free tier has a daily limit. Wait a minute and try again, or check your usage at aistudio.google.com.",
        'RATE_LIMIT'
      );
    }
    if (response.status === 404) {
      throw new RefineError(
        'Model error — the requested Gemini model could not be found. Your API key may be invalid/expired or the model configuration may need updating.',
        'MODEL_ERROR'
      );
    }

    throw new RefineError(
      `API error (${response.status}). Your API key may be invalid/expired or the model configuration may need updating.`,
      'API_ERROR'
    );
  }

  let data: any;
  try {
    data = await response.json();
  } catch {
    throw new RefineError(
      'Failed to parse the API response. Try again.',
      'API_ERROR'
    );
  }

  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';

  if (!text) {
    throw new RefineError(
      'The AI returned an empty response. Try adding more detail to your prompt and retry.',
      'API_ERROR'
    );
  }

  return text;
}
