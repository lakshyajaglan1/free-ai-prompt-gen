// ── Prompt Assembly Engine ──
// Pure string-template functions — no AI, no DOM, no side effects.

import { Framework, TargetModel, type PromptFields } from './types';
import { FRAMEWORK_META } from './frameworks';

/**
 * Assemble a complete prompt from form fields, framework, and target model.
 * Skips empty/blank fields gracefully.
 */
export function assemblePrompt(
  fields: PromptFields,
  framework: Framework,
  targetModel: TargetModel,
): string {
  const orderedFields = FRAMEWORK_META[framework].fieldOrder;
  const filledSections = orderedFields
    .filter((key) => fields[key].trim().length > 0)
    .map((key) => ({ key, value: fields[key].trim() }));

  if (filledSections.length === 0) {
    return '';
  }

  switch (targetModel) {
    case TargetModel.Claude:
      return assembleClaudeFormat(filledSections);
    case TargetModel.ChatGPT:
      return assembleChatGPTFormat(filledSections);
    case TargetModel.Gemini:
      return assembleGeminiFormat(filledSections);
    case TargetModel.Generic:
    default:
      return assembleGenericFormat(filledSections);
  }
}

type Section = { key: string; value: string };

const SECTION_NAMES: Record<string, string> = {
  role: 'Role',
  context: 'Context',
  task: 'Task',
  outputFormat: 'Output Format',
  tone: 'Tone & Style',
  constraints: 'Constraints',
  examples: 'Examples',
};

function getSectionName(key: string): string {
  return SECTION_NAMES[key] ?? key;
}

/** Claude prefers XML-tag structure */
function assembleClaudeFormat(sections: Section[]): string {
  return sections
    .map(({ key, value }) => {
      const tag = key.toLowerCase().replace(/\s+/g, '_');
      return `<${tag}>\n${value}\n</${tag}>`;
    })
    .join('\n\n');
}

/** ChatGPT responds well to markdown headers */
function assembleChatGPTFormat(sections: Section[]): string {
  return sections
    .map(({ key, value }) => `## ${getSectionName(key)}\n${value}`)
    .join('\n\n');
}

/** Gemini — structured markdown with clear labels */
function assembleGeminiFormat(sections: Section[]): string {
  return sections
    .map(({ key, value }) => `**${getSectionName(key)}:** ${value}`)
    .join('\n\n');
}

/** Generic — clean labeled sections */
function assembleGenericFormat(sections: Section[]): string {
  return sections
    .map(({ key, value }) => `[${getSectionName(key)}]\n${value}`)
    .join('\n\n');
}
