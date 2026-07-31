import { refinePromptWithAI, ProviderError, type ProviderConfig } from './aiProviders';
import { getProviderConfig } from './storage';

export { ProviderError };
export type { ProviderConfig };

/**
 * Refine prompt using the configured AI provider.
 * Backwards compatible function wrapper around multi-provider AI refinement.
 */
export async function refinePrompt(prompt: string, apiKey?: string): Promise<string> {
  // Get config from storage
  let config = getProviderConfig();

  // Allow override for backwards compatibility
  if (apiKey) {
    config.apiKey = apiKey;
  }

  // Validate config
  if (config.provider !== 'local' && (!config.apiKey || !config.apiKey.trim())) {
    throw new ProviderError('AI provider not configured. Add your API key in Settings.', 'INVALID_KEY');
  }

  // Use new unified function
  return refinePromptWithAI(prompt, config);
}
