// ── Local Rule-Based Prompt Enhancer ──
import { GoalCategory, Framework, type PromptFields } from './types';

export interface EnhancementResult {
  fields: PromptFields;
  changesMade: string[];
}

const CATEGORY_ROLES: Record<string, string> = {
  [GoalCategory.Writing]: 'An expert content strategist and senior writer known for clear, engaging prose',
  [GoalCategory.Coding]: 'A senior software engineer and architect with 15+ years of production experience',
  [GoalCategory.ImageGeneration]: 'A master digital art director and photographer specialized in detailed generative art prompts',
  [GoalCategory.VideoGeneration]: 'A veteran cinematographer and director of photography skilled in scene motion & lighting',
  [GoalCategory.DataAnalysis]: 'A lead data analyst and BI architect expert in statistical modeling and SQL optimization',
  [GoalCategory.Research]: 'A PhD researcher and domain analyst adept at synthesizing complex literature',
  [GoalCategory.MarketingCopy]: 'A high-converting direct response copywriter and conversion rate specialist',
  [GoalCategory.Custom]: 'A world-class domain consultant and strategist',
};

const CATEGORY_FORMATS: Record<string, string> = {
  [GoalCategory.Writing]: 'Markdown headers, crisp bullet points for key takeaways, and a TL;DR summary at the top',
  [GoalCategory.Coding]: 'Fenced code blocks with language identifiers, inline comments explaining non-trivial logic, and a quick usage snippet',
  [GoalCategory.ImageGeneration]: 'Structured parameter block: [Subject], [Style & Lens], [Lighting & Atmosphere], [Color Palette], [Aspect Ratio]',
  [GoalCategory.VideoGeneration]: 'Scene Progression: Shot Type → Camera Motion → Lighting/Mood → Subject Pacing → Aspect Ratio',
  [GoalCategory.DataAnalysis]: 'Executive Summary → Data Findings Table → Methodology → Actionable Recommendations',
  [GoalCategory.Research]: 'Structured Synthesis: Core Thesis → Methodology → Evidence & Analysis → Limitations & Future Work',
  [GoalCategory.MarketingCopy]: 'Attention Hook → Core Benefit Stack → Customer Pain Point Solution → Single Clear Call-To-Action (CTA)',
  [GoalCategory.Custom]: 'Clear Markdown sections with bold headers, bullet lists, and a concise summary',
};

const CATEGORY_CONSTRAINTS: Record<string, string> = {
  [GoalCategory.Writing]: 'Avoid fluff or passive voice. Keep paragraphs under 3-4 sentences. Use direct "you" phrasing.',
  [GoalCategory.Coding]: 'Follow best practices and clean code principles. Handle edge cases. Do not omit error handling or use placeholder comments.',
  [GoalCategory.ImageGeneration]: 'Focus on visual descriptors, avoid text inside images, specify lighting and lens focal length.',
  [GoalCategory.VideoGeneration]: 'Ensure smooth camera movements without sudden jumps, spec 60fps cinematic fluidity, widescreen 16:9.',
  [GoalCategory.DataAnalysis]: 'Provide clear metric comparisons with percentages. Highlight statistical anomalies and avoid unverified assumptions.',
  [GoalCategory.Research]: 'Maintain objective academic tone. Cite assumptions clearly and flag areas needing additional empirical data.',
  [GoalCategory.MarketingCopy]: 'Avoid buzzwords or empty superlatives (e.g. "best ever"). Focus strictly on tangible customer outcomes.',
  [GoalCategory.Custom]: 'Be specific, structured, and avoid generic or vague statements.',
};

export function enhancePromptLocally(
  fields: PromptFields,
  category: GoalCategory,
  framework: Framework
): EnhancementResult {
  const enhanced = { ...fields };
  const changesMade: string[] = [];

  // 1. Role Enhancement
  if (!enhanced.role || enhanced.role.trim().length < 8) {
    enhanced.role = CATEGORY_ROLES[category] || CATEGORY_ROLES[GoalCategory.Writing];
    changesMade.push('Assigned expert persona');
  } else if (!/expert|senior|master|specialist|strategist|architect/i.test(enhanced.role)) {
    enhanced.role = `${enhanced.role.trim()} (acting with senior-level mastery and precision)`;
    changesMade.push('Sharpened role authority');
  }

  // 2. Task Polish
  if (enhanced.task && enhanced.task.trim().length > 0) {
    if (!/\b(step|detailed|comprehensive|specific|clear)\b/i.test(enhanced.task)) {
      enhanced.task = `${enhanced.task.trim()}. Provide a thorough, step-by-step resolution.`;
      changesMade.push('Enhanced task depth');
    }
  }

  // 3. Output Format Enhancement
  if (!enhanced.outputFormat || enhanced.outputFormat.trim().length < 5) {
    enhanced.outputFormat = CATEGORY_FORMATS[category] || CATEGORY_FORMATS[GoalCategory.Custom];
    changesMade.push('Specified optimal output format');
  }

  // 4. Tone / Style Polish
  if (!enhanced.tone || enhanced.tone.trim().length < 3) {
    enhanced.tone = 'Authoritative, clear, and direct without fluff';
    changesMade.push('Set professional tone');
  }

  // 5. Constraints Enhancement
  if (!enhanced.constraints || enhanced.constraints.trim().length < 5) {
    enhanced.constraints = CATEGORY_CONSTRAINTS[category] || CATEGORY_CONSTRAINTS[GoalCategory.Custom];
    changesMade.push('Added guardrails & constraints');
  } else if (!/do not|avoid|never|no /i.test(enhanced.constraints)) {
    enhanced.constraints = `${enhanced.constraints.trim()}. Do not include generic placeholders or conversational preamble.`;
    changesMade.push('Added negative constraints');
  }

  // 6. Examples (Few-Shot) hint check
  if (!enhanced.examples || enhanced.examples.trim().length === 0) {
    if (category === GoalCategory.Coding) {
      enhanced.examples = `Input: [Sample Code or Schema]\nExpected Output: [Formatted Code Solution + Tests]`;
      changesMade.push('Added example template structure');
    }
  }

  return {
    fields: enhanced,
    changesMade: changesMade.length > 0 ? changesMade : ['Polished sentence structure & formatting'],
  };
}
