// ── Prompt Template Library ──
// Backwards-compatible export layer delegating to centralized src/data/templates.ts

import { GoalCategory, type PromptTemplate } from './types';
import {
  STARTER_TEMPLATES,
  getTemplateBySlug,
  type StarterTemplate,
} from '../data/templates';

export { STARTER_TEMPLATES, getTemplateBySlug, type StarterTemplate };

export const PROMPT_TEMPLATES: PromptTemplate[] = STARTER_TEMPLATES;

/** Get templates for a specific category */
export function getTemplatesForCategory(category: GoalCategory): PromptTemplate[] {
  return PROMPT_TEMPLATES.filter(
    (t) => t.category === category || t.category === GoalCategory.Custom
  );
}

/** Get a template by ID or slug */
export function getTemplateById(idOrSlug: string): PromptTemplate | undefined {
  return PROMPT_TEMPLATES.find((t) => t.id === idOrSlug || (t as any).slug === idOrSlug);
}
