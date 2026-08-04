// ── Prompt Template Library ──
// Pre-built starter templates per category that users can load and tweak.

import { GoalCategory, type PromptTemplate } from './types';

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  // ── Writing ──
  {
    id: 'writing-blog-post',
    name: 'Write a Blog Post',
    description: 'Create a structured blog post with clear sections and a compelling hook.',
    category: GoalCategory.Writing,
    fields: {
      role: 'An experienced content writer who specializes in engaging, SEO-friendly blog posts',
      task: 'Write a comprehensive blog post on [your topic]. Include a compelling introduction, 3-4 main sections with subheadings, practical examples, and a conclusion with a call-to-action.',
      outputFormat: 'Markdown with H2 sections, bullet points for key takeaways, and a TL;DR summary at the top',
      tone: 'Conversational yet informative — like explaining to a smart friend over coffee',
      constraints: 'Keep it between 1,000-1,500 words. Use short paragraphs (2-3 sentences max). Include at least one real-world example per section.',
    },
  },
  {
    id: 'writing-email',
    name: 'Professional Email',
    description: 'Draft a clear, professional email for any business situation.',
    category: GoalCategory.Writing,
    fields: {
      role: 'A professional communications specialist',
      task: 'Write a professional email regarding [your situation]. The email should be clear, courteous, and drive toward a specific action.',
      outputFormat: 'Standard email format with subject line, greeting, body paragraphs, and sign-off',
      tone: 'Professional, direct, and warm — not stiff or corporate',
      constraints: 'Maximum 200 words for the body. Include one clear call-to-action. Avoid jargon.',
    },
  },
  {
    id: 'writing-story',
    name: 'Creative Short Story',
    description: 'Craft a compelling short story with vivid characters and plot.',
    category: GoalCategory.Writing,
    fields: {
      role: 'A published fiction writer known for vivid prose and compelling character development',
      task: 'Write a short story about [your premise]. Build tension through character conflict, use sensory details, and deliver a satisfying (or thought-provoking) ending.',
      outputFormat: 'Prose narrative with scene breaks marked by "***". Include dialogue.',
      tone: 'Literary and immersive — show, don\'t tell',
      constraints: '800-1,200 words. Start in medias res. Avoid exposition dumps.',
    },
  },
  {
    id: 'writing-resume-bullet',
    name: 'Resume Bullet Points',
    description: 'Transform achievements into high-impact, metrics-driven resume bullets.',
    category: GoalCategory.Writing,
    fields: {
      role: 'A executive resume writer and FAANG recruiter',
      task: 'Rewrite my work experiences into Google XYZ format ("Accomplished [X] as measured by [Y], by doing [Z]").',
      outputFormat: 'Bullet list categorized by job title/role',
      tone: 'Confident, action-oriented, and quantified',
      constraints: 'Start every bullet with a strong action verb. Include explicit percentage or numerical impact metrics.',
    },
  },
  {
    id: 'writing-cover-letter',
    name: 'Tailored Cover Letter',
    description: 'Write a persuasive cover letter tailored to a specific job description.',
    category: GoalCategory.Writing,
    fields: {
      role: 'A career consultant and hiring strategist',
      task: 'Write a tailored cover letter connecting my background in [skills] to the target position [job title] at [company].',
      outputFormat: 'Standard business letter (3 paragraphs: Hook, Relevant Value, Call to Action)',
      tone: 'Enthusiastic, polished, and authentic',
      constraints: 'Under 300 words. Do not simply repeat my resume. Highlight alignment with company mission.',
    },
  },

  // ── Coding ──
  {
    id: 'coding-debug',
    name: 'Debug This Code',
    description: 'Get step-by-step debugging help for any programming issue.',
    category: GoalCategory.Coding,
    fields: {
      role: 'A senior software engineer with deep debugging expertise',
      context: 'I\'m seeing [describe the error/unexpected behavior]. The relevant code is [paste code or describe].',
      task: 'Identify the root cause of this bug, explain why it happens, and provide a corrected version with inline comments.',
      outputFormat: 'Step-by-step analysis followed by corrected code in a fenced code block with explanatory comments',
      constraints: 'Don\'t refactor unrelated code. Explain the fix like I\'m a mid-level developer.',
    },
  },
  {
    id: 'coding-write-tests',
    name: 'Write Unit Tests',
    description: 'Generate comprehensive unit tests for existing code.',
    category: GoalCategory.Coding,
    fields: {
      role: 'A QA engineer who writes thorough, maintainable tests',
      task: 'Write unit tests for [describe function/module]. Cover happy path, edge cases, error handling, and boundary conditions.',
      outputFormat: 'Test file using [your test framework, e.g. Jest/Pytest] with descriptive test names and AAA (Arrange-Act-Assert) structure',
      constraints: 'No mocking unless absolutely necessary. Each test should be independent. Include at least one edge case test per function.',
    },
  },
  {
    id: 'coding-explain',
    name: 'Explain This Code',
    description: 'Get a clear, educational explanation of unfamiliar code.',
    category: GoalCategory.Coding,
    fields: {
      role: 'A patient senior developer who excels at teaching complex concepts',
      task: 'Explain this code step by step: [paste code]. Break down what each section does, why it\'s written this way, and what would happen if key parts were changed.',
      outputFormat: 'Numbered list with the code snippet → explanation for each logical block',
      tone: 'Educational and patient — assume I understand the basics but not this specific pattern',
    },
  },
  {
    id: 'coding-api-design',
    name: 'REST / GraphQL API Design',
    description: 'Architect a clean, scalable API endpoint specification.',
    category: GoalCategory.Coding,
    fields: {
      role: 'A principal API architect specializing in OpenAPI specs and RESTful design',
      task: 'Design a RESTful API specification for [entity/feature]. Include endpoints, request/response JSON schemas, status codes, and error formats.',
      outputFormat: 'OpenAPI 3.0 YAML or Markdown tables detailing endpoints, request payloads, and status codes',
      constraints: 'Follow RESTful conventions (plural nouns, correct HTTP verbs). Include rate limiting and auth headers.',
    },
  },
  {
    id: 'coding-refactor-performance',
    name: 'Code Refactoring & Optimization',
    description: 'Refactor code to improve readability, performance, and maintainability.',
    category: GoalCategory.Coding,
    fields: {
      role: 'A staff engineer specializing in performance optimization and clean code principles',
      task: 'Refactor the following code snippet [paste code] to optimize Big-O time/space complexity and adhere to SOLID principles.',
      outputFormat: 'Before/After diff summary, performance benchmark estimation, and refactored code block',
      constraints: 'Maintain backwards compatibility. Do not break existing API contracts.',
    },
  },

  // ── Image Generation ──
  {
    id: 'image-product-photo',
    name: 'Product Photography Prompt',
    description: 'Create a detailed image generation prompt for product shots.',
    category: GoalCategory.ImageGeneration,
    fields: {
      role: 'A commercial product photographer with 15 years of studio experience',
      task: 'Create a detailed image generation prompt for a professional product photo of [your product]. Include lighting setup, composition, background, and mood.',
      outputFormat: 'A single detailed prompt paragraph with comma-separated style keywords at the end',
      tone: 'Clean, premium, commercially appealing',
      constraints: 'White or neutral background. No text overlays. Aspect ratio: 1:1 for social, 16:9 for hero images.',
    },
  },
  {
    id: 'image-illustration',
    name: 'Digital Illustration',
    description: 'Generate a detailed prompt for custom digital artwork.',
    category: GoalCategory.ImageGeneration,
    fields: {
      role: 'A digital artist specializing in modern illustration styles',
      task: 'Create a detailed image generation prompt for a digital illustration of [your scene/concept]. Specify art style, color palette, composition, and key visual elements.',
      outputFormat: 'Structured prompt with sections: Subject, Style, Lighting, Colors, Mood, Technical specs',
      constraints: 'No photorealism. Specify a consistent art style. Include negative prompt suggestions.',
    },
  },
  {
    id: 'image-ui-mockup',
    name: 'App UI Dashboard Mockup',
    description: 'Generate Midjourney prompts for sleek modern software UI concepts.',
    category: GoalCategory.ImageGeneration,
    fields: {
      role: 'A senior UI/UX designer and visual artist',
      task: 'Create a prompt for a modern dark-mode Web SaaS Dashboard UI mockup displaying data analytics, glassmorphism card components, and subtle neon highlights.',
      outputFormat: 'Single fluid descriptive string with Midjourney parameters (--ar 16:9 --v 6.0)',
      tone: 'Sleek, futuristic, clean, high-fidelity UI mockup',
      constraints: 'No blurry elements. High resolution 8k UI render feel.',
    },
  },

  // ── Video Generation ──
  {
    id: 'video-cinematic-drone',
    name: 'Cinematic Drone Shot',
    description: 'Breathtaking aerial drone footage with precise camera movement details.',
    category: GoalCategory.VideoGeneration,
    fields: {
      role: 'A master drone operator and aerial cinematographer',
      task: 'Create a cinematic video generation prompt for a sweeping aerial drone shot revealing [location/subject]. Describe camera trajectory, speed, lighting, and environmental motion.',
      outputFormat: 'Single fluid prompt paragraph specifying camera move, subject focus, lighting, and atmospheric details',
      tone: 'Majestic, epic, serene, photorealistic',
      constraints: '16:9 widescreen, 4K detail look. Smooth forward dolly zoom effect. Natural golden hour lighting. No jittery motion.',
    },
  },
  {
    id: 'video-sora-teaser',
    name: 'Sora / Runway Product Commercial',
    description: 'High-production cinematic video prompt for AI video engines.',
    category: GoalCategory.VideoGeneration,
    fields: {
      role: 'A commercial film director and visual effects supervisor',
      task: 'Write an AI video prompt for a 5-second cinematic product teaser of [product]. Detail focal depth, macro lens movement, lighting bloom, and liquid/particles motion.',
      outputFormat: 'Shot Description -> Camera Specs -> Movement Dynamics -> Atmospheric Lighting',
      tone: 'Hyper-realistic, photorealistic 8K, commercial cinematic',
      constraints: '16:9 aspect ratio, 60fps fluid motion, hyper-detailed macro photography.',
    },
  },

  // ── Data / Analysis ──
  {
    id: 'data-analysis',
    name: 'Analyze a Dataset',
    description: 'Get structured analysis and insights from your data.',
    category: GoalCategory.DataAnalysis,
    fields: {
      role: 'A senior data analyst with expertise in business intelligence',
      context: 'I have a dataset containing [describe data: columns, rows, time period, source].',
      task: 'Analyze this data to find [specific patterns/trends/anomalies]. Provide key findings, statistical significance where applicable, and actionable recommendations.',
      outputFormat: 'Executive summary (3 sentences) → Key Findings table → Detailed Analysis → Recommended Actions',
      constraints: 'Use percentages and comparisons, not just raw numbers. Flag any data quality concerns. Include confidence levels for predictions.',
    },
  },
  {
    id: 'data-sql-query',
    name: 'Write & Optimize SQL Query',
    description: 'Get a well-structured, performant SQL query for complex analytics.',
    category: GoalCategory.DataAnalysis,
    fields: {
      role: 'A principal database engineer who writes optimized BigQuery/PostgreSQL SQL',
      context: 'My database has these tables: [list tables and key columns].',
      task: 'Write a SQL query that [describe what you need]. Include appropriate JOINs, window functions, and aggregation.',
      outputFormat: 'SQL code block with inline comments explaining CTEs and index optimizations.',
      constraints: 'Use CTEs for readability. Avoid Cartesian joins. Handle NULL values explicitly.',
    },
  },

  // ── Research ──
  {
    id: 'research-literature-review',
    name: 'Summarize a Research Paper',
    description: 'Get a structured summary of an academic paper.',
    category: GoalCategory.Research,
    fields: {
      role: 'A PhD researcher who writes concise, critical literature reviews',
      task: 'Summarize this research paper: [title/abstract]. Extract the key contributions, methodology, findings, and limitations.',
      outputFormat: 'Structured summary: Research Question → Method → Key Findings → Limitations → Relevance to [your field]',
      tone: 'Academic and precise — suitable for a literature review section',
      constraints: 'Max 300 words. Distinguish between the authors\' claims and your assessment. Note any methodological concerns.',
    },
  },

  // ── Marketing / Copy ──
  {
    id: 'marketing-landing-page',
    name: 'Write a Product Description',
    description: 'Create a compelling product description that converts.',
    category: GoalCategory.MarketingCopy,
    fields: {
      role: 'A conversion-focused copywriter for premium tech products',
      task: 'Write a product description for [product]. Lead with the primary benefit, address the target customer\'s pain point, and close with a compelling call-to-action.',
      outputFormat: 'Headline (max 10 words) → Subheadline → 3 benefit bullet points → CTA sentence',
      tone: 'Confident, benefit-driven, modern — like Stripe or Linear',
      constraints: 'No superlatives (best, greatest). Focus on outcomes, not features. Use "you" language.',
    },
  },
  {
    id: 'marketing-linkedin-thread',
    name: 'Viral LinkedIn Post',
    description: 'Craft an engaging LinkedIn post with strong hooks and formatted spacing.',
    category: GoalCategory.MarketingCopy,
    fields: {
      role: 'A top LinkedIn ghostwriter and personal branding coach',
      task: 'Write a viral LinkedIn post sharing an insightful story/lesson about [topic].',
      outputFormat: 'Hook line (under 10 words) → Re-hook line → Short 1-sentence paragraphs → Takeaway list → Engagement question',
      tone: 'Authentic, punchy, inspiring',
      constraints: 'Use short lines with line breaks. No corporate jargon or hashtags spam.',
    },
  },

  // ── Custom ──
  {
    id: 'custom-blank',
    name: 'Start from Scratch',
    description: 'A blank canvas — build your prompt from the ground up.',
    category: GoalCategory.Custom,
    fields: {},
  },
  {
    id: 'custom-interview-prep',
    name: 'Interview Preparation',
    description: 'Prepare for a job interview with targeted questions and answers.',
    category: GoalCategory.Custom,
    fields: {
      role: 'A career coach who has prepared candidates for top tech companies',
      task: 'Generate 10 likely interview questions for a [position] at [company type]. For each question, provide a STAR-format answer framework.',
      outputFormat: 'Table: Question → Why they ask it → STAR answer skeleton',
      constraints: 'Mix behavioral, technical, and situational questions. Include at least 2 "curveball" questions.',
    },
  },
];

/** Get templates for a specific category */
export function getTemplatesForCategory(category: GoalCategory): PromptTemplate[] {
  return PROMPT_TEMPLATES.filter((t) => t.category === category || t.category === GoalCategory.Custom);
}

/** Get a template by ID */
export function getTemplateById(id: string): PromptTemplate | undefined {
  return PROMPT_TEMPLATES.find((t) => t.id === id);
}
