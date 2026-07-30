// ── localStorage Wrapper ──
// All localStorage access wrapped in try/catch. Never throws.

import type { SavedPrompt } from './types';

const STORAGE_KEYS = {
  history: 'promptforge_history',
  apiKey: 'promptforge_gemini_key',
} as const;

const MAX_SAVED_PROMPTS = 10;

// ── Prompt History ──

export function getSavedPrompts(): SavedPrompt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.history);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePrompt(prompt: SavedPrompt): void {
  try {
    const existing = getSavedPrompts();
    // Prepend new prompt, keep max
    const updated = [prompt, ...existing.filter((p) => p.id !== prompt.id)].slice(
      0,
      MAX_SAVED_PROMPTS
    );
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(updated));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

export function deletePrompt(id: string): void {
  try {
    const existing = getSavedPrompts();
    const updated = existing.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(updated));
  } catch {
    // Fail silently
  }
}

export function clearPromptHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.history);
  } catch {
    // Fail silently
  }
}

// ── API Key ──

export function getApiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.apiKey) ?? '';
  } catch {
    return '';
  }
}

export function saveApiKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.apiKey, key.trim());
  } catch {
    // Fail silently
  }
}

export function clearApiKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.apiKey);
  } catch {
    // Fail silently
  }
}

// ── Theme Preference ──

export function getTheme(): 'light' | 'dark' | 'system' {
  try {
    const raw = localStorage.getItem('promptforge_theme');
    if (raw === 'dark' || raw === 'light' || raw === 'system') return raw;
    return 'system';
  } catch {
    return 'system';
  }
}

export function saveTheme(theme: 'light' | 'dark' | 'system'): void {
  try {
    localStorage.setItem('promptforge_theme', theme);
  } catch {
    // Fail silently
  }
}

// ── Clear All ──

export function clearAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.history);
    localStorage.removeItem(STORAGE_KEYS.apiKey);
    localStorage.removeItem('promptforge_theme');
  } catch {
    // Fail silently
  }
}

/** Check if localStorage is available */
export function isStorageAvailable(): boolean {
  try {
    const test = '__promptforge_test__';
    localStorage.setItem(test, '1');
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
