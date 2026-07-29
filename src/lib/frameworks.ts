// ── Framework metadata & field mappings ──

import { Framework, GoalCategory, type FieldKey } from './types';

export interface FrameworkMeta {
  id: Framework;
  name: string;
  expansion: string;
  description: string;
  fieldOrder: FieldKey[];
}

export const FRAMEWORK_META: Record<Framework, FrameworkMeta> = {
  [Framework.RTF]: {
    id: Framework.RTF,
    name: 'RTF',
    expansion: 'Role — Task — Format',
    description:
      'The simplest and most versatile framework. Define who the AI should be, what it should do, and how it should format the answer.',
    fieldOrder: ['role', 'task', 'outputFormat', 'tone', 'constraints', 'examples'],
  },
  [Framework.COSTAR]: {
    id: Framework.COSTAR,
    name: 'CO-STAR',
    expansion: 'Context — Objective — Style — Tone — Audience — Response',
    description:
      'A comprehensive framework that covers the full communication picture: the situation, what you want, how it should sound, who reads it, and what shape the answer takes.',
    fieldOrder: ['context', 'task', 'tone', 'role', 'outputFormat', 'constraints', 'examples'],
  },
  [Framework.TAG]: {
    id: Framework.TAG,
    name: 'TAG',
    expansion: 'Task — Action — Goal',
    description:
      'A goal-oriented framework that starts from what needs to happen and drives toward a clear outcome. Great for action-heavy prompts.',
    fieldOrder: ['task', 'context', 'role', 'outputFormat', 'constraints', 'examples'],
  },
  [Framework.APE]: {
    id: Framework.APE,
    name: 'APE',
    expansion: 'Action — Purpose — Expectation',
    description:
      'Focuses on why you need the output and what success looks like. Especially useful when you want the AI to understand the deeper intent.',
    fieldOrder: ['task', 'context', 'role', 'outputFormat', 'tone', 'constraints', 'examples'],
  },
};

/** Labels used in CO-STAR to rename generic fields */
export const COSTAR_LABELS: Partial<Record<FieldKey, string>> = {
  context: 'Context (C)',
  task: 'Objective (O)',
  tone: 'Style & Tone (S/T)',
  role: 'Audience (A)',
  outputFormat: 'Response Format (R)',
};

/** Labels used in TAG to rename generic fields */
export const TAG_LABELS: Partial<Record<FieldKey, string>> = {
  task: 'Task (T)',
  context: 'Action Details (A)',
  role: 'Role / Perspective',
  outputFormat: 'Goal Output (G)',
};

/** Labels used in APE to rename generic fields */
export const APE_LABELS: Partial<Record<FieldKey, string>> = {
  task: 'Action (A)',
  context: 'Purpose (P)',
  outputFormat: 'Expectation (E)',
};

/** Get framework-specific label override for a field, or fall back to default */
export function getFrameworkFieldLabel(
  framework: Framework,
  fieldKey: FieldKey,
  defaultLabel: string
): string {
  switch (framework) {
    case Framework.COSTAR:
      return COSTAR_LABELS[fieldKey] ?? defaultLabel;
    case Framework.TAG:
      return TAG_LABELS[fieldKey] ?? defaultLabel;
    case Framework.APE:
      return APE_LABELS[fieldKey] ?? defaultLabel;
    default:
      return defaultLabel;
  }
}

/** Get which fields to show & in what order for a given framework */
export function getFieldsForFramework(framework: Framework): FieldKey[] {
  return FRAMEWORK_META[framework].fieldOrder;
}

/** Get the human-readable description for a framework */
export function getFrameworkDescription(framework: Framework): string {
  return FRAMEWORK_META[framework].description;
}
