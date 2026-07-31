// ── Multi-Provider AI Integration Layer ──
// Supports OpenAI, Anthropic Claude, Google Gemini, Cohere, and Local LLMs (Ollama, LM Studio, vLLM)

export type ProviderType = 'openai' | 'claude' | 'gemini' | 'cohere' | 'local';

export interface ProviderConfig {
  provider: ProviderType;
  model: string;
  apiKey?: string;
  customEndpoint?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ProviderResponse {
  text: string;
  raw?: any;
}

export class ProviderError extends Error {
  constructor(
    message: string,
    public readonly code:
      | 'INVALID_KEY'
      | 'RATE_LIMIT'
      | 'NETWORK'
      | 'API_ERROR'
      | 'MODEL_ERROR'
      | 'INVALID_ENDPOINT'
  ) {
    super(message);
    this.name = 'ProviderError';
  }
}

export interface ProviderInfo {
  id: ProviderType;
  name: string;
  icon: string;
  description: string;
  defaultModel: string;
  keyPlaceholder: string;
  keyHelpUrl: string;
  freeAvailable: boolean;
  docs: string;
  commonModels: string[];
  requiresApiKey: boolean;
}

export const PROVIDER_INFO: Record<ProviderType, ProviderInfo> = {
  openai: {
    id: 'openai',
    name: 'OpenAI',
    icon: '⚡',
    description: 'GPT-4o, GPT-4, and GPT-3.5 Turbo for top-tier prompt reasoning.',
    defaultModel: 'gpt-4',
    keyPlaceholder: 'sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx',
    keyHelpUrl: 'https://platform.openai.com/api-keys',
    freeAvailable: false,
    docs: 'https://platform.openai.com/docs',
    commonModels: ['gpt-4o', 'gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    requiresApiKey: true,
  },
  claude: {
    id: 'claude',
    name: 'Claude (Anthropic)',
    icon: '🧠',
    description: 'Claude 3.5 Sonnet, Claude 3 Opus — excels at nuanced prompt structure.',
    defaultModel: 'claude-3-opus-20240229',
    keyPlaceholder: 'sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx',
    keyHelpUrl: 'https://console.anthropic.com/settings/keys',
    freeAvailable: false,
    docs: 'https://docs.anthropic.com',
    commonModels: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
    requiresApiKey: true,
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    icon: '✨',
    description: 'Gemini 2.0 Flash & 1.5 Pro. High speed with generous free tier.',
    defaultModel: 'gemini-2.0-flash',
    keyPlaceholder: 'AIzaSyxxxxxxxxxxxxxxxxxxxxxxx',
    keyHelpUrl: 'https://aistudio.google.com/apikey',
    freeAvailable: true,
    docs: 'https://ai.google.dev/docs',
    commonModels: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
    requiresApiKey: true,
  },
  cohere: {
    id: 'cohere',
    name: 'Cohere',
    icon: '🎯',
    description: 'Command R+ & Command models optimized for enterprise prompts.',
    defaultModel: 'command',
    keyPlaceholder: 'Paste your Cohere API key…',
    keyHelpUrl: 'https://dashboard.cohere.com/api-keys',
    freeAvailable: true,
    docs: 'https://docs.cohere.com',
    commonModels: ['command', 'command-r-plus', 'command-light'],
    requiresApiKey: true,
  },
  local: {
    id: 'local',
    name: 'Local LLM (Ollama / vLLM)',
    icon: '🖥️',
    description: 'Run locally via Ollama, LM Studio, or vLLM without sending data off-device.',
    defaultModel: 'llama2',
    keyPlaceholder: 'No API key needed for local LLMs',
    keyHelpUrl: 'https://ollama.com',
    freeAvailable: true,
    docs: 'https://github.com/ollama/ollama',
    commonModels: ['llama3', 'llama2', 'mistral', 'codellama', 'qwen2.5'],
    requiresApiKey: false,
  },
};

const SYSTEM_PROMPT =
  'You are a prompt engineering expert. Take this prompt and tighten the wording, remove ambiguity, and improve structure. Return ONLY the improved prompt, no commentary, no preamble, no explanation.';

/**
 * Sanitize API key by trimming whitespace and stripping surrounding quotes
 */
export function sanitizeApiKey(key?: string): string {
  if (!key) return '';
  return key.trim().replace(/^["']|["']$/g, '');
}

/**
 * Abstract Base Class for AI Providers
 */
export abstract class AIProvider {
  abstract readonly name: string;
  abstract readonly defaultModel: string;

  /** Validate API key format */
  abstract validateApiKey(key?: string): boolean;

  /** Resolve endpoint URL */
  abstract getEndpoint(model: string, customEndpoint?: string, apiKey?: string): string;

  /** Format fetch RequestInit object */
  abstract formatRequest(prompt: string, config: ProviderConfig): RequestInit;

  /** Parse JSON response body into output text */
  abstract parseResponse(response: any): string;

  /** Map HTTP status codes to ProviderError */
  handleError(status: number, statusText: string, apiMessage?: string): void {
    const detail = apiMessage ? `: ${apiMessage}` : '';
    if (status === 401 || status === 403) {
      throw new ProviderError(
        `Invalid or expired API key for ${this.name}${detail}. Double-check your key in Settings.`,
        'INVALID_KEY'
      );
    }
    if (status === 429) {
      throw new ProviderError(
        `Rate limit reached for ${this.name}${detail}. Please wait a moment before trying again.`,
        'RATE_LIMIT'
      );
    }
    if (status === 404) {
      throw new ProviderError(
        `Model or endpoint not found for ${this.name}${detail}. Verify the model name and endpoint URL in Settings.`,
        'MODEL_ERROR'
      );
    }
    throw new ProviderError(
      `API error (${status} ${statusText}) from ${this.name}${detail}. Please check your configuration.`,
      'API_ERROR'
    );
  }

  /** Execute refine request against the provider API */
  async refine(prompt: string, config: ProviderConfig): Promise<string> {
    if (!prompt || !prompt.trim()) {
      throw new ProviderError(
        'Your prompt is empty. Fill in at least the Task field before refining.',
        'API_ERROR'
      );
    }

    const sanitizedKey = sanitizeApiKey(config.apiKey);
    const cleanConfig: ProviderConfig = { ...config, apiKey: sanitizedKey };

    if (cleanConfig.provider !== 'local' && (!sanitizedKey || !this.validateApiKey(sanitizedKey))) {
      throw new ProviderError(
        `Invalid API key format for ${this.name}. Please check your key in Settings.`,
        'INVALID_KEY'
      );
    }

    const endpoint = this.getEndpoint(
      cleanConfig.model || this.defaultModel,
      cleanConfig.customEndpoint,
      cleanConfig.apiKey
    );

    if (!endpoint) {
      throw new ProviderError(`Missing endpoint URL for ${this.name}.`, 'INVALID_ENDPOINT');
    }

    const requestInit = this.formatRequest(prompt, cleanConfig);

    let response: Response;
    try {
      response = await fetch(endpoint, requestInit);
    } catch (err) {
      throw new ProviderError(
        `Network error reaching ${this.name} (${endpoint}). Check your connection or local server CORS settings.`,
        'NETWORK'
      );
    }

    let data: any;
    try {
      data = await response.json();
    } catch {
      // Body not JSON
    }

    if (!response.ok) {
      const apiMessage = data?.error?.message || data?.message;
      this.handleError(
        response.status,
        response.statusText,
        typeof apiMessage === 'string' ? apiMessage : undefined
      );
    }

    if (!data) {
      throw new ProviderError(`Failed to parse response JSON from ${this.name}.`, 'API_ERROR');
    }

    const text = this.parseResponse(data);
    if (!text || !text.trim()) {
      throw new ProviderError(
        `The ${this.name} API returned an empty response. Try adding more detail to your prompt.`,
        'API_ERROR'
      );
    }

    return text.trim();
  }
}

// ── Provider Implementations ──

export class OpenAIProvider extends AIProvider {
  readonly name = 'OpenAI';
  readonly defaultModel = 'gpt-4';

  validateApiKey(key?: string): boolean {
    const sanitized = sanitizeApiKey(key);
    return sanitized.length >= 5;
  }

  getEndpoint(_model: string, customEndpoint?: string): string {
    return customEndpoint || 'https://api.openai.com/v1/chat/completions';
  }

  formatRequest(prompt: string, config: ProviderConfig): RequestInit {
    const key = sanitizeApiKey(config.apiKey);
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: config.model || this.defaultModel,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        temperature: config.temperature ?? 0.7,
        max_tokens: config.maxTokens ?? 2048,
      }),
    };
  }

  parseResponse(data: any): string {
    if (data?.error) {
      throw new ProviderError(data.error.message || 'OpenAI API Error', 'API_ERROR');
    }
    return data?.choices?.[0]?.message?.content ?? '';
  }
}

export class ClaudeProvider extends AIProvider {
  readonly name = 'Claude';
  readonly defaultModel = 'claude-3-opus-20240229';

  validateApiKey(key?: string): boolean {
    const sanitized = sanitizeApiKey(key);
    return sanitized.length >= 5;
  }

  getEndpoint(_model: string, customEndpoint?: string): string {
    return customEndpoint || 'https://api.anthropic.com/v1/messages';
  }

  formatRequest(prompt: string, config: ProviderConfig): RequestInit {
    const key = sanitizeApiKey(config.apiKey);
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: config.model || this.defaultModel,
        max_tokens: config.maxTokens ?? 2048,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }],
      }),
    };
  }

  parseResponse(data: any): string {
    if (data?.error) {
      throw new ProviderError(data.error.message || 'Anthropic Claude API Error', 'API_ERROR');
    }
    return data?.content?.[0]?.text ?? '';
  }
}

export class GeminiProvider extends AIProvider {
  readonly name = 'Google Gemini';
  readonly defaultModel = 'gemini-2.0-flash';

  validateApiKey(key?: string): boolean {
    const sanitized = sanitizeApiKey(key);
    return sanitized.length >= 5;
  }

  getEndpoint(model: string, customEndpoint?: string, apiKey?: string): string {
    const m = model || this.defaultModel;
    const baseUrl = customEndpoint || `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`;
    const key = sanitizeApiKey(apiKey);
    return key ? `${baseUrl}?key=${encodeURIComponent(key)}` : baseUrl;
  }

  formatRequest(prompt: string, config: ProviderConfig): RequestInit {
    return {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: config.temperature ?? 0.7,
          maxOutputTokens: config.maxTokens ?? 2048,
        },
      }),
    };
  }

  parseResponse(data: any): string {
    if (data?.error) {
      throw new ProviderError(data.error.message || 'Google Gemini API Error', 'API_ERROR');
    }
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  }
}

export class CohereProvider extends AIProvider {
  readonly name = 'Cohere';
  readonly defaultModel = 'command';

  validateApiKey(key?: string): boolean {
    const sanitized = sanitizeApiKey(key);
    return sanitized.length >= 5;
  }

  getEndpoint(_model: string, customEndpoint?: string): string {
    return customEndpoint || 'https://api.cohere.ai/v1/generate';
  }

  formatRequest(prompt: string, config: ProviderConfig): RequestInit {
    const key = sanitizeApiKey(config.apiKey);
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: config.model || this.defaultModel,
        prompt: `${SYSTEM_PROMPT}\n\nTask to refine:\n${prompt}`,
        temperature: config.temperature ?? 0.7,
        max_tokens: config.maxTokens ?? 2048,
      }),
    };
  }

  parseResponse(data: any): string {
    if (data?.error || data?.message) {
      throw new ProviderError(data.error?.message || data.message || 'Cohere API Error', 'API_ERROR');
    }
    return data?.generations?.[0]?.text || data?.text || data?.reply || '';
  }
}

export class LocalLLMProvider extends AIProvider {
  readonly name = 'Local LLM';
  readonly defaultModel = 'llama2';

  validateApiKey(_key?: string): boolean {
    return true; // Local LLMs optional API key validation
  }

  getEndpoint(_model: string, customEndpoint?: string): string {
    if (!customEndpoint || !customEndpoint.trim()) {
      return 'http://localhost:11434/api/generate';
    }
    let ep = customEndpoint.trim().replace(/\/+$/, '');
    try {
      const parsed = new URL(ep);
      if (parsed.pathname === '' || parsed.pathname === '/') {
        // If user entered a base URL without path (e.g. http://10.75.106.140:1234 or http://localhost:1234), default to /v1/chat/completions
        ep = `${ep}/v1/chat/completions`;
      }
    } catch {
      // Ignore invalid URL formatting
    }
    return ep;
  }

  formatRequest(prompt: string, config: ProviderConfig): RequestInit {
    const endpoint = this.getEndpoint(config.model, config.customEndpoint);
    const isOpenAIStyle = endpoint.includes('/v1/chat/completions') || endpoint.includes('/v1/completions');

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const key = sanitizeApiKey(config.apiKey);
    if (key) {
      headers['Authorization'] = `Bearer ${key}`;
    }

    if (isOpenAIStyle) {
      return {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: config.model || this.defaultModel,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: prompt },
          ],
          temperature: config.temperature ?? 0.7,
        }),
      };
    }

    // Default Ollama format
    return {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: config.model || this.defaultModel,
        prompt: prompt,
        system: SYSTEM_PROMPT,
        stream: false,
        options: {
          temperature: config.temperature ?? 0.7,
        },
      }),
    };
  }

  parseResponse(data: any): string {
    if (data?.error) {
      const msg = typeof data.error === 'string' ? data.error : data.error?.message || data.error?.type || 'Local LLM Error';
      throw new ProviderError(msg, 'API_ERROR');
    }
    if (data?.message && typeof data.message === 'string' && !data?.choices && !data?.response) {
      throw new ProviderError(data.message, 'API_ERROR');
    }
    return data?.choices?.[0]?.message?.content || data?.response || '';
  }
}

/**
 * Factory function to instantiate provider implementation
 */
export function getProvider(type: ProviderType): AIProvider {
  switch (type) {
    case 'openai':
      return new OpenAIProvider();
    case 'claude':
      return new ClaudeProvider();
    case 'gemini':
      return new GeminiProvider();
    case 'cohere':
      return new CohereProvider();
    case 'local':
      return new LocalLLMProvider();
    default:
      return new GeminiProvider();
  }
}

/**
 * Main prompt refinement function
 */
export async function refinePromptWithAI(
  prompt: string,
  config: ProviderConfig
): Promise<string> {
  const provider = getProvider(config.provider || 'gemini');
  return provider.refine(prompt, config);
}
