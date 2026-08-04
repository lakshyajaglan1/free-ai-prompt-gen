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
    case TargetModel.Llama:
      return assembleLlamaFormat(filledSections);
    case TargetModel.Mistral:
      return assembleMistralFormat(filledSections);
    case TargetModel.DeepSeek:
      return assembleDeepSeekFormat(filledSections);
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

/** Llama format - uses system & user prompt structure */
function assembleLlamaFormat(sections: Section[]): string {
  const roleSec = sections.find((s) => s.key === 'role');
  const otherSecs = sections.filter((s) => s.key !== 'role');

  let result = '';
  if (roleSec) {
    result += `<|system|>\nYou are ${roleSec.value}</s>\n<|user|>\n`;
  } else {
    result += `<|user|>\n`;
  }

  result += otherSecs.map(({ key, value }) => `### ${getSectionName(key)}\n${value}`).join('\n\n');
  result += `</s>\n<|assistant|>`;
  return result;
}

/** Mistral format - uses [INST] instruction tags */
function assembleMistralFormat(sections: Section[]): string {
  const formatted = sections
    .map(({ key, value }) => `[${getSectionName(key)}]: ${value}`)
    .join('\n\n');
  return `[INST] ${formatted} [/INST]`;
}

/** DeepSeek format - Markdown headers with explicit chain-of-thought instructions */
function assembleDeepSeekFormat(sections: Section[]): string {
  const headers = sections
    .map(({ key, value }) => `### ${getSectionName(key)}\n${value}`)
    .join('\n\n');
  return `${headers}\n\n### Reasoning\nThink step-by-step before producing the final response.`;
}
