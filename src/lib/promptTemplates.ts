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
    id: 'image-social-media',
    name: 'Social Media Visual',
    description: 'Create eye-catching social media imagery.',
    category: GoalCategory.ImageGeneration,
    fields: {
      role: 'A social media visual designer for tech brands',
      task: 'Create an image generation prompt for a [platform] post about [topic]. The visual should stop the scroll and communicate the message instantly.',
      outputFormat: 'One primary prompt + 2 variations with different compositions',
      tone: 'Bold, modern, eye-catching',
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
    id: 'video-animated-character',
    name: 'Animated Character',
    description: 'Dynamic video prompts for stylized 3D character motion and facial expressions.',
    category: GoalCategory.VideoGeneration,
    fields: {
      role: 'An animation director specializing in 3D character animation and expressive motion',
      task: 'Create a video prompt for an animated scene featuring [character] performing [action/expression]. Detail facial expression, movement dynamics, background elements, and art style.',
      outputFormat: 'Structured prompt detailing Character Action, Expression, Camera Angle, and Rendering Style',
      tone: 'Whimsical, expressive, vibrant, high-energy',
      constraints: 'Stylized 3D animation style (Pixar/Disney inspired). Consistent character features. 24fps motion cadence.',
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
    name: 'Write a SQL Query',
    description: 'Get a well-structured SQL query for your data question.',
    category: GoalCategory.DataAnalysis,
    fields: {
      role: 'A database engineer who writes optimized, readable SQL',
      context: 'My database has these tables: [list tables and key columns].',
      task: 'Write a SQL query that [describe what you need]. Include appropriate JOINs, filtering, and aggregation.',
      outputFormat: 'SQL code block with inline comments explaining each section. If complex, break into CTEs.',
      constraints: 'Use ANSI SQL unless a specific dialect is needed. Optimize for readability over cleverness. Handle NULL values explicitly.',
    },
  },
  {
    id: 'data-visualization',
    name: 'Data Visualization Plan',
    description: 'Plan the best way to visualize your data story.',
    category: GoalCategory.DataAnalysis,
    fields: {
      role: 'A data visualization specialist who follows Edward Tufte principles',
      task: 'Recommend the best chart types and visual strategy for presenting [your data story/metric]. Explain why each visualization choice is effective.',
      outputFormat: 'Table: Data point → Chart type → Reasoning → Implementation tip',
      constraints: 'Prefer simplicity over complexity. No 3D charts. Suggest a color palette that works for colorblind users.',
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
  {
    id: 'research-compare-sources',
    name: 'Compare Multiple Sources',
    description: 'Synthesize and compare findings across multiple sources.',
    category: GoalCategory.Research,
    fields: {
      role: 'A research analyst who excels at comparative analysis',
      task: 'Compare these sources on [topic]: [list sources]. Identify areas of agreement, disagreement, and gaps in the literature.',
      outputFormat: 'Comparison matrix table + synthesis paragraph summarizing the state of knowledge',
      constraints: 'Cite specific claims, not just general positions. Flag any methodological differences that explain disagreements.',
    },
  },
  {
    id: 'research-explain-concept',
    name: 'Explain a Complex Concept',
    description: 'Break down a difficult concept into understandable layers.',
    category: GoalCategory.Research,
    fields: {
      role: 'A science communicator who can explain complex topics at multiple levels',
      task: 'Explain [concept] at three levels: (1) for a curious 12-year-old, (2) for a college student, (3) for a domain expert. Use analogies at each level.',
      outputFormat: 'Three labeled sections (Beginner / Intermediate / Expert) with an analogy box for each',
      tone: 'Clear, engaging, accurate — like a great professor',
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
    id: 'marketing-social-post',
    name: 'Generate Social Media Posts',
    description: 'Create platform-specific social media content.',
    category: GoalCategory.MarketingCopy,
    fields: {
      role: 'A social media manager for a [your industry] brand',
      task: 'Write 5 social media post variations for [platform] about [topic/announcement]. Each should have a unique hook.',
      outputFormat: 'Numbered list. Each post: Hook → Body → CTA → Suggested hashtags',
      tone: 'Authentic, engaging, scroll-stopping — not corporate',
      constraints: 'Platform character limits. At least one post should be a question. Include emoji sparingly.',
    },
  },
  {
    id: 'marketing-email-sequence',
    name: 'Email Marketing Sequence',
    description: 'Plan a multi-email nurture or launch sequence.',
    category: GoalCategory.MarketingCopy,
    fields: {
      role: 'An email marketing strategist with a focus on high open and click-through rates',
      task: 'Create a [3/5/7]-email sequence for [goal: launch, nurture, onboarding]. Each email should build on the previous one and drive toward [desired action].',
      outputFormat: 'Per email: Subject line → Preview text → Body outline → CTA → Send timing',
      constraints: 'Subject lines under 50 characters. Each email should have exactly ONE CTA. Include A/B test suggestions for subject lines.',
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
  {
    id: 'custom-learning-plan',
    name: 'Create a Learning Plan',
    description: 'Build a structured learning roadmap for any skill.',
    category: GoalCategory.Custom,
    fields: {
      role: 'An expert educator who designs effective self-study curricula',
      task: 'Create a [timeframe] learning plan for mastering [skill/topic] from [current level] to [target level]. Include milestones, resources, and practice exercises.',
      outputFormat: 'Week-by-week schedule with: Topic → Resources → Practice exercise → Milestone check',
      constraints: 'Assume 1-2 hours of study per day. Prefer free resources. Include both theory and hands-on practice.',
    },
  },
];

/** Get templates for a specific category */
export function getTemplatesForCategory(category: GoalCategory): PromptTemplate[] {
  return PROMPT_TEMPLATES.filter((t) => t.category === category);
}

/** Get a template by ID */
export function getTemplateById(id: string): PromptTemplate | undefined {
  return PROMPT_TEMPLATES.find((t) => t.id === id);
}
