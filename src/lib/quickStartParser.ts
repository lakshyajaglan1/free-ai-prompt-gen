// ── Quick Start 1-Line Parser ──
// Detects the best category from a one-line idea and expands it into
// a fully populated PromptFields object — no API key required.

import { GoalCategory, Framework, type PromptFields } from './types';

export interface QuickStartResult {
  category: GoalCategory;
  framework: Framework;
  fields: PromptFields;
}

// ── Keyword-based category detector ──
const CATEGORY_SIGNALS: Array<{ category: GoalCategory; patterns: RegExp[] }> = [
  {
    category: GoalCategory.Coding,
    patterns: [
      /\b(script|code|function|api|endpoint|app|website|bot|python|javascript|typescript|rust|go|java|sql|database|debug|refactor|test|automate|crawl|scrape|parse|cli|backend|frontend|deploy)\b/i,
    ],
  },
  {
    category: GoalCategory.ImageGeneration,
    patterns: [
      /\b(image|photo|picture|illustration|artwork|draw|design|render|midjourney|dall.?e|stable diffusion|portrait|logo|icon|poster|banner|wallpaper|visual|graphic)\b/i,
    ],
  },
  {
    category: GoalCategory.VideoGeneration,
    patterns: [
      /\b(video|film|movie|animation|clip|reel|footage|sora|runway|pika|cinematic|scene|shot|timelapse|motion)\b/i,
    ],
  },
  {
    category: GoalCategory.DataAnalysis,
    patterns: [
      /\b(data|dataset|csv|excel|spreadsheet|analysis|analyze|chart|graph|trend|metric|statistic|sql|query|report|dashboard|kpi|insight)\b/i,
    ],
  },
  {
    category: GoalCategory.Research,
    patterns: [
      /\b(research|study|paper|article|summarize|summary|literature|review|compare|explain|overview|topic|learn|understand)\b/i,
    ],
  },
  {
    category: GoalCategory.MarketingCopy,
    patterns: [
      /\b(marketing|ad|advertisement|copy|slogan|tagline|campaign|email|newsletter|social media|linkedin|twitter|instagram|facebook|product description|landing page|cta|brand|pitch)\b/i,
    ],
  },
  {
    category: GoalCategory.Writing,
    patterns: [
      /\b(write|blog|post|essay|story|article|letter|email|report|document|content|draft|edit|proofread|summarize|caption|bio|resume|cover letter)\b/i,
    ],
  },
];

function detectCategory(idea: string): GoalCategory {
  for (const { category, patterns } of CATEGORY_SIGNALS) {
    if (patterns.some((p) => p.test(idea))) {
      return category;
    }
  }
  return GoalCategory.Writing; // sensible default
}

// ── Domain-specific default generators ──
const DOMAIN_DEFAULTS: Record<GoalCategory, (idea: string) => PromptFields> = {
  [GoalCategory.Coding]: (idea) => ({
    role: 'A senior software engineer with expertise in clean, production-ready code and best practices',
    context: `I need to ${idea.toLowerCase()}. The solution should be maintainable, well-commented, and handle edge cases.`,
    task: `Write the code to ${idea}. Include all necessary imports, clear variable naming, error handling, and a brief usage example at the end.`,
    outputFormat: 'Fenced code block with the language identifier, followed by inline comments explaining key decisions and a usage snippet',
    tone: 'Professional and precise — written for an intermediate developer audience',
    constraints: 'Follow language-specific best practices. Handle errors gracefully. Do not use placeholder comments like "// TODO". Keep functions small and single-purpose.',
    examples: '',
  }),

  [GoalCategory.ImageGeneration]: (idea) => ({
    role: 'A professional art director and generative AI prompt specialist',
    context: `Creating a visual asset: ${idea}.`,
    task: `Generate a detailed image prompt for: ${idea}. Include subject description, art style, composition, lighting, color palette, and camera/lens details.`,
    outputFormat: 'Single structured prompt paragraph, followed by comma-separated style keywords. Include --ar 16:9 for widescreen or --ar 1:1 for square.',
    tone: 'Vivid, precise, and visually descriptive',
    constraints: 'No text or watermarks in the image. Specify lighting and mood clearly. Include at least one negative prompt suggestion (e.g., "blurry, low-res").',
    examples: '',
  }),

  [GoalCategory.VideoGeneration]: (idea) => ({
    role: 'A veteran cinematographer and AI video director skilled in scene composition and motion design',
    context: `Creating a video sequence: ${idea}.`,
    task: `Write a detailed video generation prompt for: ${idea}. Include subject, setting, camera movement, lighting, atmospheric details, and pacing.`,
    outputFormat: 'Shot Description → Camera Specs (angle, lens, movement) → Lighting & Mood → Subject Motion → Aspect Ratio & Frame Rate',
    tone: 'Cinematic and precise — suitable for Sora, Runway, or Pika',
    constraints: '16:9 widescreen. 60fps smooth motion. Photorealistic quality. No sudden cuts or jittery camera movement.',
    examples: '',
  }),

  [GoalCategory.DataAnalysis]: (idea) => ({
    role: 'A senior data analyst and business intelligence expert with experience in statistical modeling and visualization',
    context: `I need to ${idea.toLowerCase()}. The analysis should surface actionable insights.`,
    task: `Perform a thorough analysis to: ${idea}. Identify key trends, anomalies, and provide data-backed recommendations.`,
    outputFormat: 'Executive Summary (3 sentences) → Key Findings table with metrics → Detailed Analysis section → Top 3 Actionable Recommendations',
    tone: 'Analytical and objective — suitable for a business stakeholder audience',
    constraints: 'Use percentages and comparisons rather than raw numbers alone. Flag data quality concerns. Distinguish correlation from causation.',
    examples: '',
  }),

  [GoalCategory.Research]: (idea) => ({
    role: 'A PhD-level researcher and subject-matter expert skilled at synthesizing complex information clearly',
    context: `I want to deeply understand: ${idea}.`,
    task: `Research and explain: ${idea}. Cover the core concepts, key debates or findings, practical implications, and current state of knowledge.`,
    outputFormat: 'Structured report: Overview → Key Concepts → Main Findings/Arguments → Practical Implications → Further Reading suggestions',
    tone: 'Authoritative yet accessible — suitable for an informed non-specialist',
    constraints: 'Distinguish established facts from emerging or contested claims. Flag areas of uncertainty. Keep technical jargon minimal or define it on first use.',
    examples: '',
  }),

  [GoalCategory.MarketingCopy]: (idea) => ({
    role: 'A conversion-focused direct response copywriter with expertise in digital marketing and brand voice',
    context: `Marketing goal: ${idea}.`,
    task: `Write compelling marketing copy for: ${idea}. Lead with the primary benefit, address the target audience pain point, and close with a strong CTA.`,
    outputFormat: 'Headline (≤10 words) → Subheadline → 3 benefit bullet points (outcome-focused) → Body copy (2-3 sentences) → CTA button text',
    tone: 'Confident, benefit-driven, and modern — like Stripe or Linear copy',
    constraints: 'No superlatives (best, greatest, amazing). Focus on tangible outcomes, not features. Use "you" language. Avoid passive voice.',
    examples: '',
  }),

  [GoalCategory.Writing]: (idea) => ({
    role: 'An experienced content strategist and writer known for clear, engaging, and well-structured prose',
    context: `Writing project: ${idea}.`,
    task: `Write ${idea}. Structure it with a compelling opening, well-developed body, and a clear conclusion or call-to-action.`,
    outputFormat: 'Markdown with clear H2 section headers, short paragraphs (2-3 sentences max), and a TL;DR summary at the top',
    tone: 'Conversational yet authoritative — like explaining to a smart, curious friend',
    constraints: 'Avoid passive voice and filler phrases. Keep paragraphs concise. Use specific examples rather than vague statements.',
    examples: '',
  }),

  [GoalCategory.Custom]: (idea) => ({
    role: 'A world-class domain consultant and strategic advisor',
    context: `Task overview: ${idea}.`,
    task: idea,
    outputFormat: 'Structured Markdown with bold section headers, bullet points for key items, and a summary section',
    tone: 'Authoritative, clear, and direct',
    constraints: 'Be specific and avoid generic statements. Structure the response logically. Do not use filler phrases.',
    examples: '',
  }),
};

/** Parse a one-line idea into a fully populated QuickStartResult */
export function parseQuickStart(idea: string): QuickStartResult {
  const trimmedIdea = idea.trim();
  const category = detectCategory(trimmedIdea);
  const fields = DOMAIN_DEFAULTS[category](trimmedIdea);

  // Pick the best framework per category
  const frameworkMap: Record<GoalCategory, Framework> = {
    [GoalCategory.Writing]: Framework.COSTAR,
    [GoalCategory.Coding]: Framework.RTF,
    [GoalCategory.ImageGeneration]: Framework.RTF,
    [GoalCategory.VideoGeneration]: Framework.RTF,
    [GoalCategory.DataAnalysis]: Framework.COSTAR,
    [GoalCategory.Research]: Framework.COSTAR,
    [GoalCategory.MarketingCopy]: Framework.APE,
    [GoalCategory.Custom]: Framework.RTF,
  };

  return {
    category,
    framework: frameworkMap[category],
    fields,
  };
}

// ── Example pills shown in the Quick Start bar ──
export const QUICK_START_EXAMPLES = [
  'Write a Python script to scrape product prices from an e-commerce site',
  'Create a LinkedIn post about lessons learned from launching a startup',
  'Analyze this month\'s sales data and identify top-performing products',
  'Generate a photorealistic portrait of a futuristic cyberpunk cityscape',
  'Write a persuasive product description for a minimalist mechanical keyboard',
  'Explain how transformer neural networks work for a software engineer',
  'Debug and refactor a slow SQL query using CTEs and window functions',
];
