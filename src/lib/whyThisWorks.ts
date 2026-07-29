// ── "Why This Works" panel logic ──
// Returns 2-3 bullet notes explaining what makes the current prompt effective.

import type { PromptFields, FieldKey } from './types';
import { Framework } from './types';

interface WhyNote {
  icon: string;
  text: string;
}

/** Field-level effectiveness notes */
const FIELD_NOTES: Record<FieldKey, WhyNote> = {
  role: {
    icon: '🎭',
    text: 'Specifying a persona anchors the AI\'s vocabulary, expertise depth, and perspective — producing more consistent, domain-appropriate responses.',
  },
  context: {
    icon: '🌍',
    text: 'Providing background context reduces ambiguity by ~50%. The AI stops guessing your situation and starts solving your actual problem.',
  },
  task: {
    icon: '🎯',
    text: 'A clear, action-verb-led task is the single strongest predictor of prompt quality. Vague asks produce vague outputs.',
  },
  outputFormat: {
    icon: '📐',
    text: 'Declaring the output shape (table, JSON, bullets, code) eliminates "wall of text" responses and makes the output immediately usable.',
  },
  tone: {
    icon: '🗣️',
    text: 'Tone direction prevents the AI from defaulting to its generic "assistant" voice. Even one adjective (e.g. "casual") dramatically shifts the output.',
  },
  constraints: {
    icon: '🚧',
    text: 'Constraints act as guardrails — they prevent scope creep, hallucination, and off-topic detours. Think of them as the AI\'s "don\'t" list.',
  },
  examples: {
    icon: '💡',
    text: 'Few-shot examples are the most powerful prompting technique available. One concrete input→output pair teaches more than a paragraph of instructions.',
  },
};

/** Framework-level notes */
const FRAMEWORK_NOTES: Record<Framework, WhyNote> = {
  [Framework.RTF]: {
    icon: '🏗️',
    text: 'The RTF framework (Role-Task-Format) gives you the three most impactful prompt levers in the simplest structure.',
  },
  [Framework.COSTAR]: {
    icon: '⭐',
    text: 'CO-STAR covers the full communication picture — who\'s speaking, to whom, in what style — making it ideal for nuanced, audience-aware content.',
  },
  [Framework.TAG]: {
    icon: '🏹',
    text: 'TAG\'s goal-driven structure keeps the AI focused on outcomes rather than process, which tends to produce more actionable responses.',
  },
  [Framework.APE]: {
    icon: '🧠',
    text: 'APE\'s emphasis on purpose and expectation helps the AI understand *why* you need the output, leading to better judgment calls.',
  },
};

/**
 * Get 2-3 "why this works" notes based on which fields are filled.
 * Always includes the framework note + up to 2 filled-field notes.
 */
export function getWhyNotes(
  fields: PromptFields,
  framework: Framework
): WhyNote[] {
  const notes: WhyNote[] = [];

  // Always include the framework note
  notes.push(FRAMEWORK_NOTES[framework]);

  // Add notes for filled fields (prioritize the most impactful ones)
  const priorityOrder: FieldKey[] = [
    'examples',
    'outputFormat',
    'role',
    'constraints',
    'context',
    'tone',
    'task',
  ];

  for (const key of priorityOrder) {
    if (notes.length >= 3) break;
    if (fields[key] && fields[key].trim().length > 0) {
      notes.push(FIELD_NOTES[key]);
    }
  }

  // If nothing is filled yet, add a general tip
  if (notes.length === 1) {
    notes.push({
      icon: '✨',
      text: 'Start filling in the fields above to see how each one strengthens your prompt. Every field you add reduces ambiguity.',
    });
  }

  return notes;
}
