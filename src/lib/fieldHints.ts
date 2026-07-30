// ── Field Hints — Teaching Layer ──
// Tooltips and placeholders that explain *why* each field improves the prompt.

import { GoalCategory, type FieldKey } from './types';

export interface FieldHint {
  tooltip: string;
  placeholder: string;
}

/** Why each field matters — the tool's main differentiator */
const FIELD_TOOLTIPS: Record<FieldKey, string> = {
  role: 'Giving the AI a specific persona (e.g. "senior backend engineer") anchors its vocabulary, expertise level, and tone — leading to dramatically more relevant answers.',
  context:
    'Background info tells the AI about your audience, constraints, and situation. Without it, the AI guesses — and often guesses wrong.',
  task: 'The clearest, most specific ask. Vague tasks produce vague answers. Start with an action verb: "Write", "Analyze", "Compare", "List".',
  outputFormat:
    'Specifying whether you want a table, bullet list, JSON, code block, or essay reduces ambiguity by ~40% and prevents "wall of text" responses.',
  tone: 'Tone direction (formal, casual, technical, friendly) keeps the AI from defaulting to a generic voice. Even a single adjective helps.',
  constraints:
    'Constraints like word limits, topics to avoid, or must-include items prevent hallucination and scope creep. They act as guardrails.',
  examples:
    'Few-shot examples are the most powerful prompting technique. Even one example of ideal input→output teaches the AI your exact expectations.',
};

/** Default placeholders by category × field */
const CATEGORY_PLACEHOLDERS: Record<GoalCategory, Record<FieldKey, string>> = {
  [GoalCategory.Writing]: {
    role: 'e.g. "An experienced technical writer who specializes in developer documentation"',
    context: 'e.g. "I\'m writing a blog post for junior developers learning React for the first time"',
    task: 'e.g. "Write a 1,200-word tutorial on React hooks with practical examples"',
    outputFormat: 'e.g. "Markdown with code blocks, H2 sections, and a summary at the end"',
    tone: 'e.g. "Friendly but authoritative — like a senior colleague explaining over coffee"',
    constraints: 'e.g. "Max 1,200 words. Use only functional components. Avoid class-based examples."',
    examples: 'Paste an example of the style/format you want…',
  },
  [GoalCategory.Coding]: {
    role: 'e.g. "A senior full-stack engineer with 10 years of TypeScript experience"',
    context: 'e.g. "I have an Express.js API that\'s returning 500 errors on the /users endpoint"',
    task: 'e.g. "Debug this endpoint, find the root cause, and provide a fix with explanation"',
    outputFormat: 'e.g. "Code block with inline comments explaining each change"',
    tone: 'e.g. "Technical and precise, as if writing a code review comment"',
    constraints: 'e.g. "Use TypeScript strict mode. No external libraries. Keep backward-compatible."',
    examples: 'Paste relevant code or expected output format…',
  },
  [GoalCategory.ImageGeneration]: {
    role: 'e.g. "A digital artist specializing in photorealistic product photography"',
    context: 'e.g. "I need a hero image for a SaaS landing page promoting a project management tool"',
    task: 'e.g. "Create a detailed prompt for a clean, modern workspace scene with a laptop"',
    outputFormat: 'e.g. "A single prompt paragraph with style keywords, lighting, and composition details"',
    tone: 'e.g. "Cinematic, premium, minimalist"',
    constraints: 'e.g. "16:9 aspect ratio. No text in the image. Neutral color palette."',
    examples: 'Paste an example image description you liked…',
  },
  [GoalCategory.VideoGeneration]: {
    role: 'e.g. "A cinematic director and AI video prompt engineer specializing in Sora and Runway Gen-2"',
    context: 'e.g. "I\'m generating a 5-second video clip for a sci-fi film teaser"',
    task: 'e.g. "Create a detailed prompt for a futuristic cyberpunk city at night with flying vehicles"',
    outputFormat: 'e.g. "A detailed video prompt specifying camera motion, lighting, motion speed, and aspect ratio"',
    tone: 'e.g. "Cinematic, atmospheric, photorealistic, epic"',
    constraints: 'e.g. "16:9 aspect ratio, 24fps film look. Smooth slow camera pan right. No morphing artifacts."',
    examples: 'Paste an example video prompt or cinematic camera direction…',
  },
  [GoalCategory.DataAnalysis]: {
    role: 'e.g. "A senior data analyst at a Fortune 500 company"',
    context: 'e.g. "I have a CSV with 50K rows of customer purchase data from 2023-2024"',
    task: 'e.g. "Analyze seasonal purchasing trends and identify the top 3 revenue drivers"',
    outputFormat: 'e.g. "Executive summary + key findings table + recommended next steps"',
    tone: 'e.g. "Data-driven and concise — suitable for presenting to C-suite executives"',
    constraints: 'e.g. "Focus on Q4 trends. Use percentages, not raw numbers. Include confidence levels."',
    examples: 'Paste sample data rows or expected output format…',
  },
  [GoalCategory.Research]: {
    role: 'e.g. "A PhD-level research assistant specializing in machine learning"',
    context: 'e.g. "I\'m writing a literature review on transformer architectures published since 2020"',
    task: 'e.g. "Summarize the key developments in efficient transformers with citations"',
    outputFormat: 'e.g. "Annotated bibliography format with 3-sentence summaries per paper"',
    tone: 'e.g. "Academic and precise — suitable for a peer-reviewed journal"',
    constraints: 'e.g. "Only papers from 2020-2024. Include DOI links when possible. Max 15 papers."',
    examples: 'Paste an example summary entry…',
  },
  [GoalCategory.MarketingCopy]: {
    role: 'e.g. "A conversion copywriter for B2B SaaS products"',
    context: 'e.g. "We\'re launching a new AI-powered customer support tool for e-commerce companies"',
    task: 'e.g. "Write 5 variations of a landing page headline and 2 subheadlines for each"',
    outputFormat: 'e.g. "Numbered list with headline → subheadline pairs"',
    tone: 'e.g. "Bold, benefit-driven, slightly playful — like Notion or Linear"',
    constraints: 'e.g. "Headlines max 8 words. Avoid clichés like \'revolutionize\'. Include social proof angle."',
    examples: 'Paste competitor headlines or brand voice examples…',
  },
  [GoalCategory.Custom]: {
    role: 'Who should the AI act as?',
    context: 'What background info does the AI need?',
    task: 'What do you want the AI to do?',
    outputFormat: 'How should the response be formatted?',
    tone: 'What tone or style should the AI use?',
    constraints: 'Any limits, things to avoid, or must-include items?',
    examples: 'Paste an example of what you want…',
  },
};

/** Get hint data for a field within a category */
export function getHint(
  fieldKey: FieldKey,
  category: GoalCategory = GoalCategory.Custom
): FieldHint {
  return {
    tooltip: FIELD_TOOLTIPS[fieldKey],
    placeholder: CATEGORY_PLACEHOLDERS[category]?.[fieldKey] ?? CATEGORY_PLACEHOLDERS[GoalCategory.Custom][fieldKey],
  };
}

/** Get just the tooltip for a field */
export function getTooltip(fieldKey: FieldKey): string {
  return FIELD_TOOLTIPS[fieldKey];
}
