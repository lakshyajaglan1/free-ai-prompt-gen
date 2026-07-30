// ── Before/After Prompt Examples ──
// Hardcoded weak vs. strong prompt pairs per category — no AI needed.

import { GoalCategory } from './types';

export interface BeforeAfterExample {
  category: GoalCategory;
  weak: { label: string; prompt: string; problems: string[] };
  strong: { label: string; prompt: string; strengths: string[] };
}

export const BEFORE_AFTER_EXAMPLES: Record<GoalCategory, BeforeAfterExample> = {
  [GoalCategory.Writing]: {
    category: GoalCategory.Writing,
    weak: {
      label: 'Weak Prompt',
      prompt: 'Write me a blog post about AI.',
      problems: [
        'No target audience specified',
        'No length, format, or structure guidance',
        'Topic is too broad — AI could mean anything',
        'No tone direction',
      ],
    },
    strong: {
      label: 'Strong Prompt',
      prompt:
        '## Role\nYou are an experienced tech blogger who writes for a developer audience.\n\n## Task\nWrite a 1,200-word blog post explaining how retrieval-augmented generation (RAG) works in production applications. Include a practical architecture diagram description and 2 real-world use cases.\n\n## Output Format\nMarkdown with H2 sections, code snippets where relevant, and a TL;DR at the top.\n\n## Tone\nTechnical but approachable — like a senior engineer writing on their personal blog.\n\n## Constraints\n- Max 1,200 words\n- No marketing language\n- Include at least one gotcha/pitfall section',
      strengths: [
        'Specific persona anchors expertise level',
        'Clear word count and structure requirements',
        'Narrowed topic from "AI" to a specific technique',
        'Actionable constraints prevent generic output',
      ],
    },
  },

  [GoalCategory.Coding]: {
    category: GoalCategory.Coding,
    weak: {
      label: 'Weak Prompt',
      prompt: 'Fix my code, it\'s not working.',
      problems: [
        'No code provided',
        'No error description',
        'No language or framework specified',
        'No context about what "working" means',
      ],
    },
    strong: {
      label: 'Strong Prompt',
      prompt:
        '<role>\nSenior TypeScript engineer with Express.js expertise\n</role>\n\n<context>\nMy Express.js API endpoint returns a 500 error when the request body contains nested objects. It works fine with flat JSON. Using Express 4.18, TypeScript 5.3, Node 20.\n</context>\n\n<task>\nIdentify the root cause and provide a fix. Show the corrected code with inline comments explaining what changed and why.\n</task>\n\n<constraints>\n- Don\'t refactor unrelated code\n- Maintain backward compatibility\n- Use built-in middleware only (no new dependencies)\n</constraints>',
      strengths: [
        'Specific error description narrows the search space',
        'Version numbers prevent outdated solutions',
        'Clear output expectations (inline comments)',
        'Constraints prevent unnecessary scope creep',
      ],
    },
  },

  [GoalCategory.ImageGeneration]: {
    category: GoalCategory.ImageGeneration,
    weak: {
      label: 'Weak Prompt',
      prompt: 'Make me a picture of a sunset.',
      problems: [
        'No composition or style direction',
        'No color palette or mood specified',
        'No aspect ratio or resolution info',
        'Could produce literally anything',
      ],
    },
    strong: {
      label: 'Strong Prompt',
      prompt:
        '**Subject:** A solitary lighthouse on a rocky cliff overlooking the ocean at golden hour.\n\n**Style:** Cinematic landscape photography, shot on a Hasselblad with a 50mm lens.\n\n**Lighting:** Golden hour sunlight from the left, warm tones, long shadows, dramatic cloud formations lit from below.\n\n**Color Palette:** Deep amber, burnt orange, navy blue, warm white.\n\n**Mood:** Serene, contemplative, vast.\n\n**Technical:** 16:9 aspect ratio, shallow depth of field on the lighthouse, ocean slightly soft.',
      strengths: [
        'Specific subject with clear composition',
        'Camera and lens reference anchors the style',
        'Detailed lighting direction prevents guesswork',
        'Technical specs ensure usable output',
      ],
    },
  },

  [GoalCategory.VideoGeneration]: {
    category: GoalCategory.VideoGeneration,
    weak: {
      label: 'Weak Prompt',
      prompt: 'Video of a car driving fast.',
      problems: [
        'No camera movement or angle specified',
        'No environment, weather, or time of day details',
        'No frame rate or motion speed guidance',
        'High risk of morphing artifacts or static output',
      ],
    },
    strong: {
      label: 'Strong Prompt',
      prompt:
        '## Role\nCinematic director for automotive film commercials\n\n## Task\nGenerate a 5-second video tracking shot of a matte-black sports car driving along a coastal cliff road at sunset.\n\n## Camera Motion\nLow-angle tracking shot moving parallel to the car at 60fps, panning smoothly as the road curves toward the sun.\n\n## Lighting & Mood\nGolden hour sunlight, warm amber lens flares, wet asphalt reflections, dramatic sea spray mist.\n\n## Constraints\n- 16:9 aspect ratio\n- Photorealistic 35mm film aesthetic\n- Smooth motion with zero morphing or distortion',
      strengths: [
        'Specific camera trajectory and frame rate direction',
        'Rich atmospheric details (wet asphalt, lens flare, mist)',
        'Clear subject dynamics and motion pace',
        'Constraints eliminate morphing and distortion artifacts',
      ],
    },
  },

  [GoalCategory.DataAnalysis]: {
    category: GoalCategory.DataAnalysis,
    weak: {
      label: 'Weak Prompt',
      prompt: 'Analyze this data and tell me what you find.',
      problems: [
        'No specific question or hypothesis',
        'No description of the data structure',
        'No preferred output format',
        '"Tell me what you find" leads to random observations',
      ],
    },
    strong: {
      label: 'Strong Prompt',
      prompt:
        '[Role]\nSenior data analyst specializing in e-commerce analytics\n\n[Context]\nI have 12 months of transaction data (Jan-Dec 2024) with columns: date, product_category, revenue, units_sold, customer_segment, marketing_channel.\n\n[Task]\nIdentify the top 3 revenue drivers by quarter. Flag any anomalies in the Q3→Q4 transition. Calculate month-over-month growth rates per category.\n\n[Output Format]\nExecutive summary (3 bullet points) → Revenue drivers table → Anomaly flags → Growth rate chart recommendation\n\n[Constraints]\n- Use percentages and indexes, not raw revenue\n- Compare against the same period last year where possible\n- Flag findings with >95% statistical confidence only',
      strengths: [
        'Specific data schema enables realistic analysis',
        'Precise questions instead of "find anything"',
        'Statistical confidence threshold prevents noise',
        'Output format matches real business deliverables',
      ],
    },
  },

  [GoalCategory.Research]: {
    category: GoalCategory.Research,
    weak: {
      label: 'Weak Prompt',
      prompt: 'Tell me about machine learning.',
      problems: [
        'Impossibly broad topic',
        'No target knowledge level specified',
        'No desired depth or focus area',
        'No output format — could be 1 sentence or 100 pages',
      ],
    },
    strong: {
      label: 'Strong Prompt',
      prompt:
        '**Role:** A machine learning researcher specializing in NLP, writing for a graduate-level audience.\n\n**Task:** Compare and contrast three approaches to few-shot learning in NLP: (1) prompt tuning, (2) in-context learning, (3) fine-tuning with LoRA. For each, explain the mechanism, computational cost, and when to use it.\n\n**Output Format:** Comparison table (Approach × Mechanism × Cost × Best For × Limitations) followed by a 200-word synthesis.\n\n**Constraints:**\n- Cite key papers (year + first author) for each approach\n- Focus on developments from 2022-2024\n- Assume the reader understands transformers but not these specific techniques',
      strengths: [
        'Narrow focus within a broad field',
        'Specific comparison structure drives depth',
        'Citation requirement ensures verifiable claims',
        'Audience level calibrates the explanation depth',
      ],
    },
  },

  [GoalCategory.MarketingCopy]: {
    category: GoalCategory.MarketingCopy,
    weak: {
      label: 'Weak Prompt',
      prompt: 'Write some marketing copy for my product.',
      problems: [
        'No product description',
        'No target audience',
        'No brand voice or tone direction',
        'No format (headline? email? landing page?)',
      ],
    },
    strong: {
      label: 'Strong Prompt',
      prompt:
        '## Role\nConversion copywriter for B2B SaaS, inspired by Stripe and Linear\'s brand voices.\n\n## Task\nWrite 5 headline variations and 2 subheadlines for each, for a landing page promoting an AI-powered code review tool targeting engineering managers at mid-size companies (50-500 engineers).\n\n## Output Format\nNumbered list: Headline → Subheadline A / Subheadline B\n\n## Tone\nConfident, technically credible, concise — never hype-y.\n\n## Constraints\n- Headlines: max 8 words\n- No clichés: "revolutionize", "game-changer", "cutting-edge"\n- At least one headline should focus on time savings\n- At least one should include a specific number/metric',
      strengths: [
        'Specific product and audience eliminates guesswork',
        'Brand voice references provide clear direction',
        'Anti-cliché constraint prevents generic copy',
        'Structural requirements (word count, metrics) ensure variety',
      ],
    },
  },

  [GoalCategory.Custom]: {
    category: GoalCategory.Custom,
    weak: {
      label: 'Weak Prompt',
      prompt: 'Help me with my project.',
      problems: [
        'No description of the project',
        'No specific ask or deliverable',
        'No context about current progress',
        'Impossible for any AI to give useful help',
      ],
    },
    strong: {
      label: 'Strong Prompt',
      prompt:
        '[Role]\nExperienced project manager who specializes in agile software development\n\n[Context]\nI\'m leading a team of 4 developers building a React dashboard for internal sales metrics. We\'re 3 weeks into a 10-week timeline and just realized our data API is slower than expected (avg 8s response time vs. 2s target).\n\n[Task]\nHelp me create a recovery plan. Identify 3 approaches to handle the slow API (architectural, not just "optimize queries"), estimate impact on timeline, and draft a stakeholder update email.\n\n[Output Format]\n1. Options table: Approach → Effort → Timeline Impact → Risk\n2. Recommended option with justification\n3. Draft stakeholder email (under 150 words)\n\n[Constraints]\n- We can\'t change the backend team\'s timeline\n- Budget allows 1 additional contractor if needed\n- The demo to leadership is fixed at week 8',
      strengths: [
        'Rich context enables realistic recommendations',
        'Multiple deliverables in one structured prompt',
        'Real constraints guide practical (not theoretical) advice',
        'Specific metrics make the situation concrete',
      ],
    },
  },
};

/** Get the before/after example for a category */
export function getBeforeAfter(category: GoalCategory): BeforeAfterExample {
  return BEFORE_AFTER_EXAMPLES[category];
}
