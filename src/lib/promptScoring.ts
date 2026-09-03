// ── Real-time Prompt Scoring Engine ──
import type { PromptFields, Framework } from './types';
import { getFieldsForFramework } from './frameworks';

export interface ScoreResult {
  score: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  label: string;
  tips: string[];
  breakdown: {
    completeness: number; // Max 35
    specificity: number;  // Max 30
    structure: number;    // Max 20
    constraints: number;  // Max 15
  };
}

const VAGUE_WORDS = ['good', 'nice', 'awesome', 'something', 'stuff', 'things', 'etc'];

export function scorePrompt(fields: PromptFields, framework: Framework): ScoreResult {
  const visibleFields = getFieldsForFramework(framework);
  let completeness = 0;
  let specificity = 0;
  let structure = 0;
  let constraints = 0;
  const tips: string[] = [];

  // 1. Completeness (Max 35)
  const requiredTaskFilled = Boolean(fields.task && fields.task.trim().length >= 10);
  if (requiredTaskFilled) completeness += 15;
  else tips.push('Add a clear, detailed Task (at least 10 characters).');

  const filledCount = visibleFields.filter((key) => fields[key] && fields[key].trim().length > 0).length;
  const fillRatio = visibleFields.length > 0 ? filledCount / visibleFields.length : 0;
  completeness += Math.round(fillRatio * 20);

  if (!fields.role || fields.role.trim().length < 5) {
    tips.push('Assign a clear Role / Persona to prime the AI\'s expertise.');
  }

  if (!fields.outputFormat || fields.outputFormat.trim().length < 5) {
    tips.push('Specify the exact Output Format (e.g. Markdown headers, JSON schema, bullet list).');
  }

  // 2. Specificity (Max 30)
  const fullText = Object.values(fields).join(' ');
  const wordCount = fullText.trim().split(/\s+/).filter(Boolean).length;

  if (wordCount >= 80) specificity += 15;
  else if (wordCount >= 40) specificity += 10;
  else if (wordCount >= 20) specificity += 5;
  else tips.push('Expand your input details; longer, contextual prompts yield higher precision.');

  const hasNumbersOrMetrics = /\b\d+(\.\d+)?%?\b/.test(fullText) || /\b(words|paragraphs|bullets|steps)\b/i.test(fullText);
  if (hasNumbersOrMetrics) specificity += 10;
  else tips.push('Include specific quantities, word limits, or numeric targets.');

  const hasVagueWords = VAGUE_WORDS.some((w) => new RegExp(`\\b${w}\\b`, 'i').test(fullText));
  if (!hasVagueWords && wordCount > 10) specificity += 5;
  else if (hasVagueWords) tips.push('Replace vague words (e.g., "good", "stuff", "best") with explicit criteria.');

  // 3. Structure & Formatting Guidance (Max 20)
  const hasFormattingKeywords = /\b(markdown|json|table|bullet|h1|h2|xml|code block|section|list)\b/i.test(fullText);
  if (hasFormattingKeywords) structure += 12;
  else tips.push('Mention structural elements like "bullet points", "table", or "Markdown".');

  if (fields.examples && fields.examples.trim().length > 15) {
    structure += 8;
  } else {
    tips.push('Provide a few-shot Example of input/output to anchor the AI\'s reasoning.');
  }

  // 4. Constraints & Guardrails (Max 15)
  if (fields.constraints && fields.constraints.trim().length >= 10) {
    constraints += 15;
  } else {
    const hasNegativePrompt = /\b(no|don't|do not|avoid|never|without|exclude)\b/i.test(fullText);
    if (hasNegativePrompt) constraints += 10;
    else tips.push('Set negative constraints (e.g., "Do not use jargon", "Avoid passive voice").');
  }

  const rawScore = completeness + specificity + structure + constraints;
  const finalScore = Math.min(100, Math.max(0, rawScore));

  let grade: ScoreResult['grade'] = 'F';
  let label = 'Needs Work';

  if (finalScore >= 90) {
    grade = 'S';
    label = 'Masterclass Prompt';
  } else if (finalScore >= 75) {
    grade = 'A';
    label = 'Excellent';
  } else if (finalScore >= 60) {
    grade = 'B';
    label = 'Strong';
  } else if (finalScore >= 40) {
    grade = 'C';
    label = 'Fair';
  } else if (finalScore >= 20) {
    grade = 'D';
    label = 'Basic';
  }

  return {
    score: finalScore,
    grade,
    label,
    tips: tips.slice(0, 3), // Top 3 actionable suggestions
    breakdown: {
      completeness,
      specificity,
      structure,
      constraints,
    },
  };
}
