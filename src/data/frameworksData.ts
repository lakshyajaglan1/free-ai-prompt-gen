import { Framework, TargetModel, type FieldKey } from '../lib/types';

export interface FrameworkBeforeAfter {
  title: string;
  category: string;
  scenario: string;
  weakPrompt: string;
  weakProblems: string[];
  strongPrompt: string;
  strongStrengths: string[];
  whyItWorks: string;
}

export interface FrameworkFieldDef {
  key: FieldKey;
  label: string;
  placeholder: string;
  helperText: string;
  defaultValue: string;
}

export interface FrameworkFaq {
  question: string;
  answer: string;
}

export interface FrameworkPageData {
  slug: string;
  frameworkKey: Framework;
  title: string;
  metaTitle: string;
  metaDescription: string;
  badge: string;
  expansion: string;
  summary: string;
  heroPitch: string;
  builderFields: FrameworkFieldDef[];
  defaultModel: TargetModel;
  whenToUse: string[];
  whenToAvoid: string[];
  cognitiveMechanisms: {
    title: string;
    description: string;
  }[];
  examples: FrameworkBeforeAfter[];
  faqs: FrameworkFaq[];
  relatedFrameworks: {
    name: string;
    slug: string;
    reason: string;
  }[];
}

export const FRAMEWORK_PAGES: FrameworkPageData[] = [
  {
    slug: 'rtf-role-task-format',
    frameworkKey: Framework.RTF,
    title: 'RTF Prompt Framework Generator & Guide (Role-Task-Format)',
    metaTitle: 'RTF Prompt Framework Generator & Guide (Role-Task-Format) | Free AI Prompt Gen',
    metaDescription: 'Free RTF Prompt Framework Generator and comprehensive guide. Learn how to structure Role, Task, and Format prompts for ChatGPT, Claude, and Gemini with interactive mini-builder and 3 concrete examples.',
    badge: 'High-Velocity Architecture',
    expansion: 'Role — Task — Format',
    summary: 'RTF is the most agile, versatile 3-part prompt engineering framework. By explicitly anchoring the AI persona (Role), executing an imperative instruction (Task), and establishing strict structural constraints (Format), RTF eliminates hallucinations and ambiguity in over 85% of daily engineering, writing, and research workflows.',
    heroPitch: 'Zero fluff, maximum precision. Build modular, production-ready prompts using the three highest-leverage cognitive anchors.',
    defaultModel: TargetModel.ChatGPT,
    builderFields: [
      {
        key: 'role',
        label: 'Role (R)',
        placeholder: 'e.g. Senior Staff TypeScript & Astro Engineer specializing in Core Web Vitals...',
        helperText: 'Establishes the perspective, seniority, domain vocabulary, and evaluation criteria.',
        defaultValue: 'Senior Performance Engineer and Web Accessibility Specialist',
      },
      {
        key: 'task',
        label: 'Task (T)',
        placeholder: 'e.g. Refactor this Astro component to use server islands and semantic HTML5...',
        helperText: 'The imperative directive detailing what the AI must analyze, produce, or solve.',
        defaultValue: 'Audit this authentication modal component for WCAG 2.1 AA compliance and refactor keyboard focus trapping.',
      },
      {
        key: 'outputFormat',
        label: 'Format (F)',
        placeholder: 'e.g. Unified Markdown diff followed by an executive bullet summary of fixes...',
        helperText: 'The syntax, layout, structural schema, length limit, and code-block specification.',
        defaultValue: 'Markdown table of discovered violations (Severity, Element, Fix) followed by the refactored code block with inline comments.',
      },
      {
        key: 'constraints',
        label: 'Constraints & Boundaries (Optional)',
        placeholder: 'e.g. No external dependencies, keep bundle size under 2KB, do not use any...',
        helperText: 'Negative guardrails, banned libraries, or style limitations.',
        defaultValue: 'Do not introduce third-party libraries. Use native DOM FocusTrap APIs and ensure zero runtime console warnings.',
      },
    ],
    whenToUse: [
      'Fast-paced technical execution where background context is self-evident (coding, code reviews, API spec generation).',
      'Data restructuring tasks such as converting messy JSON or CSV dumps into typed TypeScript interfaces.',
      'Drafting well-defined communications like PR summaries, Git commit messages, release notes, or sprint recaps.',
      'When speed is paramount and you need consistent, predictable output formatting without multi-paragraph preambles.',
    ],
    whenToAvoid: [
      'Complex multi-stakeholder organizational communications where emotional tone, corporate politics, and diverse reader backgrounds dictate success (use CO-STAR instead).',
      'Deep investigative research where the underlying strategic intent and rationale must be aligned first (use APE instead).',
      'Step-by-step sequential workflows with multiple interdependent criteria (use TAG instead).',
    ],
    cognitiveMechanisms: [
      {
        title: 'Persona Anchoring (System 2 Bias)',
        description: 'LLMs predict tokens based on statistical clusters. Declaring a specific role (e.g., "Senior Rust Systems Architect") primes the model\'s attention weights toward idiomatic terminology, design patterns, and rigorous defensive practices rather than beginner tutorials.',
      },
      {
        title: 'Task Bounding (Entropy Reduction)',
        description: 'Vague prompts suffer from high token entropy where the model explores irrelevant solution branches. An imperative, single-focus task instruction confines the latent space to actionable, verifiable steps.',
      },
      {
        title: 'Format Conditioning (Structural Determinism)',
        description: 'Specifying format primes the autoregressive decoder to generate syntactic headers, markdown tables, or JSON delimiters, naturally suppressing conversational chit-chat like "Sure, I would be happy to help you with that!".',
      },
    ],
    examples: [
      {
        title: 'Full-Stack Performance Refactoring',
        category: 'Software Engineering',
        scenario: 'A React developer wants to fix memory leaks and improve render performance in a high-frequency trading dashboard table.',
        weakPrompt: 'Make this React dashboard component faster and fix the memory leak please.',
        weakProblems: [
          'No engineer seniority or domain perspective defined.',
          'No definition of what "faster" means (FPS, bundle size, reconciliation, or network?).',
          'Output format is undefined, leading to chatty explanations without actionable code.',
        ],
        strongPrompt: `## Role
Senior React Core Contributor & WebGL Performance Architect specializing in high-frequency data streams.

## Task
Analyze the attached TradingGrid component for unnecessary re-renders, unmemoized object references, and detached DOM node memory leaks in requestAnimationFrame loops. Provide a refactored implementation.

## Output Format
1. Root-cause diagnosis (3 concise bullet points with Big-O impact).
2. Clean, production-ready TSX code snippet with useMemo and virtualized row rendering.
3. Benchmarking checklist comparing baseline vs. optimized memory allocation.

## Constraints
Zero third-party grid packages. Stick to pure React 19 concurrent features.`,
        strongStrengths: [
          'Anchors high-level expertise in WebGL and performance architecture.',
          'Provides crystal-clear diagnosis criteria and exact refactoring goals.',
          'Enforces a 3-part structured delivery with zero conversational fluff.',
        ],
        whyItWorks: 'By explicitly forcing Role (React Core), Task (memory leak diagnosis + refactor), and Format (Diagnosis -> TSX Code -> Checklist), the model produces immediate, copy-pasteable engineering assets.',
      },
      {
        title: 'REST to GraphQL Schema Migration',
        category: 'Backend Architecture',
        scenario: 'A backend team needs an idiomatic GraphQL schema specification based on existing JSON REST payloads.',
        weakPrompt: 'Convert these REST endpoints into GraphQL schemas.',
        weakProblems: [
          'No schema design conventions (Apollo Federation, Relay, naming conventions).',
          'Missing scalar definitions, pagination standards, and error-handling specs.',
          'Format is ambiguous—could return explanations, raw schema, or resolver boilerplate.',
        ],
        strongPrompt: `## Role
Principal API Architect specializing in GraphQL Enterprise Federation and Relay-compliant schema standards.

## Task
Transform the provided 4 REST JSON response structures into a single, cohesive, Relay-compliant GraphQL SDL (Schema Definition Language) schema.

## Output Format
- Valid, syntax-highlighted GraphQL SDL code block.
- Explicit custom scalar definitions (DateTime, UUID).
- Cursor-based connection pagination types for all collection fields.
- Field-level documentation comments (@doc descriptions).

## Constraints
Do not use offset pagination. Strict adherence to PascalCase for types and camelCase for fields.`,
        strongStrengths: [
          'Enforces Relay cursor-based connection specification.',
          'Demands strict naming conventions and custom scalars.',
          'Zero ambiguity regarding output format—pure GraphQL SDL with documentation comments.',
        ],
        whyItWorks: 'The model recognizes Relay conventions instantly and outputs verified SDL with cursor connections instead of generic, non-scalable schemas.',
      },
      {
        title: 'Technical Incident Post-Mortem Memo',
        category: 'DevOps & SRE',
        scenario: 'An SRE needs an incident report written after a Redis cache exhaustion caused a 45-minute database outage.',
        weakPrompt: 'Write a postmortem for our database outage yesterday caused by Redis running out of memory.',
        weakProblems: [
          'Lacks blame-free SRE tone and professional post-mortem structure.',
          'Misses five-whys analysis, timeline breakdown, and preventative action items.',
          'Prone to generic narrative prose instead of an engineering post-mortem.',
        ],
        strongPrompt: `## Role
Staff Site Reliability Engineer (SRE) and Incident Commander following Google SRE blameless post-mortem standards.

## Task
Draft a comprehensive, blameless incident post-mortem documenting a 45-minute p1 outage triggered by Redis maxmemory eviction misconfiguration and subsequent PostgreSQL connection saturation.

## Output Format
Markdown document with standard SRE headers:
1. Executive Summary & Impact Metrics (Downtime, Affected Users, SLA Breach).
2. Root Cause & 5-Whys Deep Dive.
3. Detailed Timeline (UTC timestamps).
4. Preventative Action Items (Table: Action, Owner, Priority P0-P2, Ticket ID placeholder).

## Constraints
Maintain a strictly blameless tone. Focus on system resilience and automated failover rather than human error.`,
        strongStrengths: [
          'Invokes Google SRE blameless methodology.',
          'Mandates standard executive headers, timeline, and 5-whys root cause analysis.',
          'Formats action items into a prioritized accountability matrix.',
        ],
        whyItWorks: 'The prompt guides the LLM to follow industry-standard SRE conventions, generating an audit-ready post-mortem that leadership and engineering teams can immediately adopt.',
      },
    ],
    faqs: [
      {
        question: 'What is the RTF prompt framework?',
        answer: 'RTF stands for Role, Task, and Format. It is a foundational prompt engineering methodology that conditions an AI model by establishing who it represents (Role), what action it must execute (Task), and the exact structural template it must return (Format).',
      },
      {
        question: 'How does RTF compare to CO-STAR?',
        answer: 'RTF is streamlined and fast—ideal for technical execution, coding, data conversion, and direct instructions where deep context is already understood. CO-STAR (Context, Objective, Style, Tone, Audience, Response) is significantly more detailed and best suited for nuanced business memos, marketing campaigns, and executive communication where stakeholder context and tone are paramount.',
      },
      {
        question: 'Can RTF be used with Claude XML tags or ChatGPT Markdown?',
        answer: 'Yes! RTF is syntax-agnostic. When prompting Anthropic Claude, wrap the components in XML tags (<role>, <task>, <format>). When prompting ChatGPT or Gemini, use Markdown headers (## Role, ## Task, ## Format). Our interactive builder formats RTF cleanly for both styles automatically.',
      },
      {
        question: 'Why is defining the Role so important in RTF?',
        answer: 'LLMs are trained on billions of varied web pages, from casual Reddit threads to elite IEEE research papers. Declaring a precise role (e.g. "Principal Security Researcher") primes the model\'s attention heads toward specialized technical vocabulary, defensive best practices, and high-quality solution patterns.',
      },
      {
        question: 'Can I add constraints to the RTF framework?',
        answer: 'Absolutely. While RTF is named for its 3 core pillars, adding negative constraints (e.g. "Do not use external dependencies", "Limit response to 300 words") provides essential guardrails that prevent hallucinations and scope creep.',
      },
    ],
    relatedFrameworks: [
      { name: 'CO-STAR Framework', slug: 'co-star-prompt-framework', reason: 'Need richer audience, tone, and stakeholder context?' },
      { name: 'TAG Framework', slug: 'tag-prompt-framework', reason: 'Focusing on multi-step operational workflows and measurable goals?' },
      { name: 'APE Framework', slug: 'ape-prompt-framework', reason: 'Want the AI to align deeply with the strategic purpose behind your task?' },
    ],
  },
  {
    slug: 'co-star-prompt-framework',
    frameworkKey: Framework.COSTAR,
    title: 'CO-STAR Prompt Generator & Template Builder',
    metaTitle: 'CO-STAR Prompt Generator & Template Builder | Free AI Prompt Gen',
    metaDescription: 'Free CO-STAR Prompt Generator & Template Builder. Master Context, Objective, Style, Tone, Audience, and Response to craft publication-ready prompts for ChatGPT and Claude.',
    badge: 'Enterprise Gold Standard',
    expansion: 'Context — Objective — Style — Tone — Audience — Response',
    summary: 'Developed by Singapore\'s GovTech Data Science & AI team, CO-STAR is the industry benchmark framework for complex communications and multi-faceted initiatives. It guarantees that the AI accounts for situational background, exact goals, stylistic voice, psychological tone, audience knowledge level, and response syntax.',
    heroPitch: 'The 6-dimensional architecture for high-stakes business, technical strategy, and multi-audience deliverables.',
    defaultModel: TargetModel.Claude,
    builderFields: [
      {
        key: 'context',
        label: 'Context (C)',
        placeholder: 'e.g. Our B2B SaaS startup is migrating 50,000 customers from a legacy v1 API to v2...',
        helperText: 'Background narrative, current situation, business environment, and stakes.',
        defaultValue: 'Our team is launching an enterprise self-hosted tier of our developer telemetry platform to European healthcare customers with strict GDPR and ISO 27001 requirements.',
      },
      {
        key: 'task',
        label: 'Objective (O)',
        placeholder: 'e.g. Draft a product announcement memo and migration checklist...',
        helperText: 'The core deliverable and explicit goal of this communication.',
        defaultValue: 'Draft an executive launch announcement and security compliance overview for Chief Information Security Officers (CISOs).',
      },
      {
        key: 'tone',
        label: 'Style & Tone (S/T)',
        placeholder: 'e.g. Style: Wall Street Journal executive brief; Tone: Authoritative, reassuring...',
        helperText: 'Writing voice, cadence, sentence structure, and emotional frequency.',
        defaultValue: 'Style: Concise Stripe/Vercel engineering editorial; Tone: Authoritative, risk-conscious, and rigorously factual.',
      },
      {
        key: 'role',
        label: 'Audience (A)',
        placeholder: 'e.g. Chief Technology Officers, Security Leads, and Senior DevOps Engineers...',
        helperText: 'Who will read or consume this. Dictates technical depth, acronyms, and assumptions.',
        defaultValue: 'Enterprise CISOs and Security Compliance Auditors with deep knowledge of cryptographical key isolation and zero-trust infrastructure.',
      },
      {
        key: 'outputFormat',
        label: 'Response Format (R)',
        placeholder: 'e.g. Executive Summary -> 3 Key Security Pillars -> Technical Specs Table...',
        helperText: 'The visual layout, section headers, bullet lists, or programmatic data structure.',
        defaultValue: '1. Executive Brief (150 words). 2. Architecture & Data Sovereignty Breakdown (3 H3 subsections). 3. Compliance Matrix Table (Standard, Control, Implementation Evidence).',
      },
      {
        key: 'constraints',
        label: 'Constraints & Boundaries',
        placeholder: 'e.g. Avoid marketing hype words like "revolutionary" or "game-changer"...',
        helperText: 'Negative keywords, claims to avoid, length constraints.',
        defaultValue: 'Avoid marketing buzzwords ("revolutionary", "seamless"). Do not make unsubstantiated HIPAA legal guarantees—state technical controls only.',
      },
    ],
    whenToUse: [
      'High-stakes corporate or public communications where tone and audience reception are critical.',
      'Complex marketing copy, investor memos, and sales proposals requiring precise brand alignment.',
      'Customer-facing crisis management, deprecation notices, or security vulnerability advisories.',
      'When prompt responses will be shared with external executives, legal counsel, or regulatory bodies.',
    ],
    whenToAvoid: [
      'Simple script generation, shell command synthesis, or 10-line code bugfixes.',
      'Rapid ideation when you are still trying to understand the problem space.',
      'Situations where typing 6 full fields causes unnecessary cognitive overhead.',
    ],
    cognitiveMechanisms: [
      {
        title: 'Audience-Calibrated Perplexity',
        description: 'Specifying the exact Audience prevents the AI from either over-explaining foundational concepts to experts or utilizing impenetrable jargon with non-technical stakeholders.',
      },
      {
        title: 'Dual-Vector Voice Control (Style vs. Tone)',
        description: 'Style determines the grammatical architecture (Strunk & White brevity vs. academic prose), while Tone governs the affective sentiment (empathetic, urgent, clinical). Separating them produces pitch-perfect prose.',
      },
      {
        title: 'Contextual Grounding (Hallucination Barrier)',
        description: 'Providing rich business context constrains the LLM from fabricating fictional scenarios, grounding the model within real operational boundaries and compliance constraints.',
      },
    ],
    examples: [
      {
        title: 'Enterprise API Deprecation & Migration Notice',
        category: 'Developer Relations',
        scenario: 'A fintech unicorn must announce the breaking deprecation of their v1 payment webhooks to 12,000 engineering teams.',
        weakPrompt: 'Write an email telling developers we are deprecating API v1 and they have to update to v2 by December.',
        weakProblems: [
          'Sounds abrupt and punitive, risking customer churn and angry social media backlash.',
          'Missing crucial context on why the change occurred (security, latency, scalability).',
          'Lacks technical migration guides, code snippets, and support escalation paths.',
        ],
        strongPrompt: `## Context
We are Stripe-scale payment gateway. Our v1 webhooks use legacy SHA-1 signatures and lack idempotency headers. Effective December 15, v1 endpoints will sunset. 12,000 active merchant engineering teams must migrate to v2 (Ed25519 signatures, automatic replay protection).

## Objective
Write an authoritative, developer-centric deprecation announcement that motivates prompt migration while acknowledging the engineering effort required.

## Style
Linear/Stripe developer documentation style—clean, respectful, transparent, and code-forward.

## Tone
Empathetic yet firm regarding the non-negotiable security deadline. Zero corporate fluff.

## Audience
Senior Backend Engineers, Lead Architects, and DevOps Managers responsible for payment reliability.

## Response Format
1. Direct Lead: What is changing, the exact date, and why security demands it.
2. What Developers Must Do (3-step action roadmap).
3. Code Diff Example (v1 verify vs. v2 verify in Node.js).
4. FAQ & Backward-Compatibility Sandbox testing links.

## Constraints
Never use the phrase "We apologize for the inconvenience." Focus on security empowerment.`,
        strongStrengths: [
          'Establishes deep empathy with engineering teams while maintaining firm security boundaries.',
          'Includes concrete before/after code migration syntax.',
          'Bans apologetic corporate clichés in favor of technical partnership.',
        ],
        whyItWorks: 'The 6-dimensional CO-STAR structure turns a potentially hostile breaking change into a respectful, highly actionable engineering milestone.',
      },
      {
        title: 'B2B SaaS Cold Outreach to Enterprise CISOs',
        category: 'Sales & Marketing',
        scenario: 'A cybersecurity startup offering automated SOC2 compliance monitoring needs to reach enterprise security directors.',
        weakPrompt: 'Write a cold email to a CISO selling our SOC2 compliance automation tool.',
        weakProblems: [
          'Generic sales pitch that will immediately be flagged as spam or ignored.',
          'Ignores the CISO\'s intense paranoia regarding third-party SaaS vendors and data access.',
          'Lacks credibility, metric proof points, and specific industry pain points.',
        ],
        strongPrompt: `## Context
Enterprise security leaders spend an average of 420 engineering hours annually gathering manual audit evidence for SOC2 Type II renewals. Our platform uses zero-read-permission eBPF agents to automate 94% of evidence collection without ever reading customer payloads.

## Objective
Compose a high-converting, 90-word peer-level cold outreach email securing a 15-minute technical validation call.

## Style
Direct, technical peer-to-peer note (similar to a former peer CISO reaching out).

## Tone
Understated, deeply respectful of time, skepticism-acknowledging, and security-conscious.

## Audience
Fortune 1000 Chief Information Security Officers inundated with 50+ vendor pitches daily.

## Response Format
- Subject Line: 3-word curiosity/internal-metric pattern.
- Body: Single 80-word paragraph citing specific audit friction.
- CTA: Low-friction permission question (not "Can I have 30 mins on your calendar?").

## Constraints
No buzzwords ("AI-driven", "synergy", "game-changing"). No meeting calendar links.`,
        strongStrengths: [
          'Understands the exact psychology and defensive skepticism of CISOs.',
          'Applies strict 90-word brevity and bans calendar link spam.',
          'Positions zero-read-permission eBPF as the key technical differentiator.',
        ],
        whyItWorks: 'CO-STAR\'s Audience and Tone anchors align the generation with the exact psychological mindset of the executive reader.',
      },
      {
        title: 'Board of Directors Quarterly AI Strategy Brief',
        category: 'Executive Leadership',
        scenario: 'A VP of Engineering must present their quarterly GenAI infrastructure ROI and risk mitigation to the Board.',
        weakPrompt: 'Help me write an update for the board about our company AI projects and costs.',
        weakProblems: [
          'Fails to address governance, liability, cost predictability, and business moat.',
          'Prone to meandering technical jargon that bores or confuses board members.',
          'No clear return on investment (ROI) or strategic capital allocation framework.',
        ],
        strongPrompt: `## Context
Over the past 6 months, our engineering organization invested $450k in enterprise LLM adoption, deploying internal code generation tools and an automated customer ticket resolution agent. Token costs are currently $32k/month.

## Objective
Author a formal 2-page Board of Directors Executive Briefing summarizing tangible productivity gains, token expenditure trajectory, and intellectual property/data leakage mitigations.

## Style
McKinsey executive briefing memorandum—structured, metric-dense, disciplined, and forward-looking.

## Tone
Pragmatic, sober, highly confident yet vigilant regarding regulatory and copyright risks.

## Audience
Audit & Governance Committee of the Board of Directors, consisting of seasoned investors and former Fortune 500 CEOs.

## Response Format
1. Executive Abstract (Key ROI numbers: hours saved, ticket deflection %, total spend).
2. Capital Efficiency & Token Economics (Table with projections).
3. Risk & Governance Posture (Zero data retention agreements with model providers).
4. Strategic Horizon: Next quarter capital request and milestone targets.

## Constraints
Do not dwell on deep model architectures (transformers, attention). Focus on enterprise value and risk controls.`,
        strongStrengths: [
          'Frames technology through financial ROI, governance, and capital allocation.',
          'Adheres strictly to McKinsey-style executive memorandum cadence.',
          'Isolates board-level governance from low-level technical trivia.',
        ],
        whyItWorks: 'CO-STAR forces the AI to elevate above engineering trivia, speaking directly to board-level risk, capital efficiency, and strategic advantage.',
      },
    ],
    faqs: [
      {
        question: 'Who created the CO-STAR prompt framework?',
        answer: 'CO-STAR was pioneered by Sheila Teo and the Government Technology Agency of Singapore (GovTech) during Singapore\'s landmark National Prompt Engineering Championship, where it won first place for consistency and output quality.',
      },
      {
        question: 'What is the main difference between Style and Tone in CO-STAR?',
        answer: 'Style describes the structural writing mechanics and literary voice (e.g. academic paper, Hemingway brevity, Axios bulleted news). Tone describes the emotional attitude and psychological posture (e.g. empathetic, urgent, authoritative, skeptical). Keeping them distinct allows fine-grained creative control.',
      },
      {
        question: 'When is CO-STAR overkill?',
        answer: 'CO-STAR is overkill for simple utility scripts, rapid code reviews, translation requests, or everyday factual queries. Filling in 6 detailed fields takes 60 seconds; for quick tasks, use RTF instead.',
      },
      {
        question: 'How does CO-STAR prevent AI hallucinations?',
        answer: 'Hallucinations often occur when the model lacks boundary context and is forced to invent facts to complete an answer. The rich Context and Objective fields in CO-STAR ground the model\'s attention within verified boundaries, while the Response format stops the model from rambling.',
      },
      {
        question: 'Can I use CO-STAR with Anthropic Claude?',
        answer: 'Absolutely. Claude excels with CO-STAR when each letter is translated into an XML tag (<context>, <objective>, <style>, <tone>, <audience>, <response>). Our interactive builder outputs this format automatically.',
      },
    ],
    relatedFrameworks: [
      { name: 'RTF Framework', slug: 'rtf-role-task-format', reason: 'Need a faster, lighter framework for rapid technical execution?' },
      { name: 'APE Framework', slug: 'ape-prompt-framework', reason: 'Want to emphasize the strategic Purpose and success Expectation?' },
      { name: 'TAG Framework', slug: 'tag-prompt-framework', reason: 'Designing action-oriented, multi-step operational SOPs?' },
    ],
  },
  {
    slug: 'tag-prompt-framework',
    frameworkKey: Framework.TAG,
    title: 'TAG Prompt Framework Builder (Task-Action-Goal)',
    metaTitle: 'TAG Prompt Framework Builder (Task-Action-Goal) | Free AI Prompt Gen',
    metaDescription: 'Free TAG Prompt Framework Builder and complete guide. Structure Task, Action, and Goal prompts to drive goal-oriented execution in ChatGPT, Claude, and Gemini.',
    badge: 'Outcome-Driven Engine',
    expansion: 'Task — Action — Goal',
    summary: 'TAG (Task, Action, Goal) is an outcome-oriented prompt architecture designed for high-performance operational workflows. By establishing the primary challenge (Task), detailing the exact procedural steps (Action), and anchoring the measurable success criteria (Goal), TAG prevents AI models from hallucinating or taking lazy shortcuts.',
    heroPitch: 'Anchor the deliverable, prescribe the execution path, and define measurable success criteria.',
    defaultModel: TargetModel.Gemini,
    builderFields: [
      {
        key: 'task',
        label: 'Task (T)',
        placeholder: 'e.g. Optimize our SQL analytical queries running on Snowflake...',
        helperText: 'The overarching project, challenge, or operational requirement.',
        defaultValue: 'Refactor our slow-running PostgreSQL analytics query aggregating monthly active user cohort retention.',
      },
      {
        key: 'context',
        label: 'Action Details (A)',
        placeholder: 'e.g. Inspect the EXPLAIN ANALYZE output, rewrite subqueries into CTEs, and add partial indexes...',
        helperText: 'The exact procedural methodology, calculations, steps, or research actions the AI must perform.',
        defaultValue: 'Analyze the provided query plan. Eliminate redundant nested subqueries, replace correlated filters with window functions, and identify candidate composite indexes.',
      },
      {
        key: 'outputFormat',
        label: 'Goal & Acceptance Criteria (G)',
        placeholder: 'e.g. Achieve sub-100ms execution time, provide verification queries, and document index tradeoffs...',
        helperText: 'The measurable outcome, acceptance criteria, and delivered format.',
        defaultValue: 'Target: Reduce execution time by >80%. Output clean SQL with explanatory comments, followed by exact CREATE INDEX DDL statements and a before/after execution complexity summary.',
      },
      {
        key: 'role',
        label: 'Perspective / Domain (Optional)',
        placeholder: 'e.g. Principal Database Reliability Engineer...',
        helperText: 'Optional persona anchor to reinforce domain-specific practices.',
        defaultValue: 'Principal Database Reliability Engineer and PostgreSQL Internals Specialist',
      },
    ],
    whenToUse: [
      'Multi-step operational tasks where procedure and methodology matter just as much as the final answer.',
      'Complex query optimization, performance refactoring, and code migration pipelines.',
      'Standard Operating Procedures (SOPs), compliance workflows, and security remediation plans.',
      'Data science, statistical modeling, and experimental design where assumptions must be verified.',
    ],
    whenToAvoid: [
      'Purely open-ended creative brainstorming where strict goals stifle serendipitous ideas.',
      'Simple transactional tasks where a single RTF prompt can solve the problem in seconds.',
      'Highly subjective emotional messaging with multi-layered interpersonal dynamics.',
    ],
    cognitiveMechanisms: [
      {
        title: 'Action-Step Chain of Thought (CoT)',
        description: 'By isolating "Action", TAG guides the model\'s internal hidden-state generation through intermediate reasoning tokens before generating the final output, dramatically lowering logical errors.',
      },
      {
        title: 'Teleological Goal Conditioning',
        description: 'Teleological prompts define the end-state target. When the AI model knows the exact goal metric (e.g. "sub-100ms execution", "100% test coverage"), it calibrates its reasoning steps against that threshold.',
      },
      {
        title: 'Procedural Guardrails',
        description: 'Prescribing specific action verbs (analyze, eliminate, construct) prevents the model from generating high-level generic advice and forces concrete execution.',
      },
    ],
    examples: [
      {
        title: 'PostgreSQL Cohort Query Optimization',
        category: 'Database Engineering',
        scenario: 'A data engineer has a cohort retention query that times out after 180 seconds on a 50-million row table.',
        weakPrompt: 'This query is taking 3 minutes to run on Postgres. Can you make it faster?',
        weakProblems: [
          'No execution plan, table volume, or indexing context provided.',
          'No methodology specified (indexes, partitions, CTEs, or materialized views?).',
          'No measurable performance target or acceptance criteria.',
        ],
        strongPrompt: `## Task (T)
Optimize an e-commerce customer cohort retention aggregation query running against PostgreSQL 16 on AWS RDS (50M event rows) that currently triggers sequential scans and times out after 180 seconds.

## Action (A)
1. Deconstruct the attached query to eliminate 3 nested subqueries in the WHERE clause.
2. Rewrite the date-bucket grouping logic using window functions (DENSE_RANK and LAG).
3. Identify missing composite BRIN or B-Tree indexes for the (tenant_id, created_at, event_type) filter combination.

## Goal (G)
Achieve sub-500ms execution time. Output:
- Refactored SQL query with inline performance annotations.
- Precise CREATE INDEX CONCURRENTLY DDL statements.
- Big-O time and space complexity comparison between the baseline and new plan.`,
        strongStrengths: [
          'Prescribes exact window function techniques and subquery elimination.',
          'Defines concrete performance target (sub-500ms).',
          'Demands concurrent DDL statements suitable for zero-downtime production deployment.',
        ],
        whyItWorks: 'TAG links the technical action directly to a measurable goal, ensuring the AI performs deep algorithmic optimization rather than cosmetic SQL reformatting.',
      },
      {
        title: 'Zero-Trust Network Access (ZTNA) Architecture SOP',
        category: 'Cybersecurity',
        scenario: 'A security engineer needs a standard operating procedure for onboarding remote contractor laptops under zero-trust guidelines.',
        weakPrompt: 'Write an SOP for contractor laptop security onboarding.',
        weakProblems: [
          'Produces generic high-level checklists without operational teeth.',
          'Missing security compliance frameworks (NIST, CIS, SOC2).',
          'No measurable definition of what constitutes an onboarded and compliant machine.',
        ],
        strongPrompt: `## Task (T)
Establish an automated Zero-Trust Network Access (ZTNA) device onboarding Standard Operating Procedure for external engineering contractors accessing sensitive staging VPCs.

## Action (A)
1. Map device enrollment through MDM posture verification (hardware TPM 2.0, disk encryption, EDR sensor presence).
2. Detail least-privilege role-based access assignment via Okta SCIM and ephemeral WireGuard certificates.
3. Formulate an automated 30-day credential revocation and forensic log rotation cadence.

## Goal (G)
Ensure zero contractor machine ever communicates directly with a private subnet without mutual TLS and active device posture validation. Output a numbered, step-by-step SOP with verification CLI checks and incident escalation triggers.`,
        strongStrengths: [
          'Outlines specific technical controls: TPM 2.0, Okta SCIM, WireGuard, and mTLS.',
          'Anchors measurable goal: zero direct subnet access without posture verification.',
          'Demands operational verification commands for day-to-day engineers.',
        ],
        whyItWorks: 'The Action section guides the AI through every layer of zero-trust architecture, yielding an actionable checklist that can be executed immediately.',
      },
      {
        title: 'Microservices Distributed Tracing Pipeline',
        category: 'Cloud Infrastructure',
        scenario: 'A platform team is migrating 40 microservices from uncoordinated logs to OpenTelemetry distributed tracing.',
        weakPrompt: 'How should we set up OpenTelemetry in our Kubernetes cluster?',
        weakProblems: [
          'Far too broad; will result in a 20-page textbook regurgitation.',
          'No tech stack specifics (Collector deployment mode, sampling strategies).',
          'Lacks measurable business goals for latency debugging and storage costs.',
        ],
        strongPrompt: `## Task (T)
Implement an end-to-end OpenTelemetry (OTel) distributed tracing pipeline across 40 Go and TypeScript microservices deployed on AWS EKS.

## Action (A)
1. Design an OTel DaemonSet collector architecture with tail-based sampling to control storage costs.
2. Formulate the W3C TraceContext propagation strategy across gRPC and HTTP boundary calls.
3. Define Grafana Tempo / Jaeger backend storage tiering using S3 for warm retention.

## Goal (G)
Capture 100% of p99 error and high-latency traces (>1500ms) while sampling only 1% of normal 200 OK traffic. Output an architectural blueprint, OTel collector YAML configuration, and an instrumentation code snippet in Go.`,
        strongStrengths: [
          'Specifies tail-based sampling criteria to solve the real-world cost crisis of distributed tracing.',
          'Targets specific languages (Go & TypeScript) and orchestrators (AWS EKS).',
          'Measurable goal: 100% of p99 errors, 1% of happy path.',
        ],
        whyItWorks: 'By explicitly bounding Task, Action, and Goal, the AI skips basic tutorials and delivers a production-grade collector configuration with tail sampling.',
      },
    ],
    faqs: [
      {
        question: 'What does the TAG prompt framework stand for?',
        answer: 'TAG stands for Task, Action, and Goal. It organizes prompts into what needs to be accomplished (Task), how the AI should proceed or what methods to apply (Action), and what measurable benchmark defines completion (Goal).',
      },
      {
        question: 'How is TAG different from RTF?',
        answer: 'RTF focuses heavily on the persona (Role) and the structural template (Format). TAG focuses instead on the procedural journey (Action) and the measurable success metrics (Goal). Use RTF when format and perspective are critical; use TAG when the execution steps and quantifiable results are paramount.',
      },
      {
        question: 'Why does adding a "Goal" improve AI responses?',
        answer: 'Modern LLMs are autoregressive token predictors. Without an explicit goal, the model tends to terminate as soon as it feels it has answered superficially. Providing acceptance criteria forces the model\'s internal attention to verify whether its response actually satisfies the stated constraints.',
      },
      {
        question: 'Can I combine TAG with Persona roles?',
        answer: 'Yes! While TAG\'s primary pillars are Task, Action, and Goal, adding a concise Role persona (e.g. "Principal Database Architect") at the beginning primes domain-specific vocabulary and elevates output quality.',
      },
    ],
    relatedFrameworks: [
      { name: 'RTF Framework', slug: 'rtf-role-task-format', reason: 'Need a fast 3-part framework emphasizing persona and output syntax?' },
      { name: 'APE Framework', slug: 'ape-prompt-framework', reason: 'Want to clarify the underlying Purpose and strategic Intent?' },
      { name: 'CO-STAR Framework', slug: 'co-star-prompt-framework', reason: 'Need comprehensive audience, tone, and corporate context control?' },
    ],
  },
  {
    slug: 'ape-prompt-framework',
    frameworkKey: Framework.APE,
    title: 'APE Prompt Framework Builder (Action-Purpose-Expectation)',
    metaTitle: 'APE Prompt Framework Builder (Action-Purpose-Expectation) | Free AI Prompt Gen',
    metaDescription: 'Free APE Prompt Framework Builder and guide. Master Action-Purpose-Expectation prompting to align AI answers deeply with user intent and prevent hallucinations.',
    badge: 'Intent-Aligned Core',
    expansion: 'Action — Purpose — Expectation',
    summary: 'APE (Action, Purpose, Expectation) is a purpose-driven prompt framework created to solve the fundamental AI alignment challenge: AI models producing answers that are technically accurate but fail to achieve your true business or strategic intent. By explicitly declaring the "Why" (Purpose) alongside the "What" (Action) and "How" (Expectation), APE ensures total alignment.',
    heroPitch: 'Ground the AI in strategic intent. Never settle for technically correct answers that miss the point.',
    defaultModel: TargetModel.Claude,
    builderFields: [
      {
        key: 'task',
        label: 'Action (A)',
        placeholder: 'e.g. Write a comprehensive Architecture Decision Record (ADR) for transitioning to Event-Driven Microservices...',
        helperText: 'The core activity, document, calculation, or synthesis requested.',
        defaultValue: 'Author an Architecture Decision Record (ADR) evaluating Apache Kafka vs. AWS SQS/SNS for our asynchronous checkout event stream.',
      },
      {
        key: 'context',
        label: 'Purpose (P)',
        placeholder: 'e.g. The purpose is to convince skeptical senior leadership that upfront operational complexity is offset by audit compliance...',
        helperText: 'The underlying strategic "Why". Who is influenced? What decision is unlocked? What problem is solved?',
        defaultValue: 'The purpose is to provide clear technical justification for senior engineering leadership to approve AWS SQS/SNS, highlighting that our 6-person team cannot afford Kafka cluster operational maintenance overhead despite future throughput claims.',
      },
      {
        key: 'outputFormat',
        label: 'Expectation (E)',
        placeholder: 'e.g. Clear Michael Nygard ADR format with Context, Decision, Consequences, and Cost Breakdown...',
        helperText: 'Acceptance standards, structure, voice, criteria for success, and anti-patterns to avoid.',
        defaultValue: 'Standard Michael Nygard ADR format (Title, Status, Context, Decision Drivers, Considered Options, Pros/Cons, Decision Outcome). Must include a monthly operational cost comparison table and an honest appraisal of throughput limits.',
      },
      {
        key: 'tone',
        label: 'Tone & Style (Optional)',
        placeholder: 'e.g. Pragmatic, objective, engineering-focused...',
        helperText: 'Tone guidance to reinforce organizational alignment.',
        defaultValue: 'Pragmatic, sober, highly analytical, and defensive of small-team engineering velocity.',
      },
    ],
    whenToUse: [
      'Architectural Decision Records (ADRs) and strategic engineering proposals where leadership must be convinced.',
      'Customer messaging, pitch decks, and investor narratives where the deeper commercial motive dictates the angle.',
      'Educational curriculum and technical documentation where the learner\'s mental model is the primary success driver.',
      'Whenever past AI prompts yielded outputs that followed instructions literally but missed the whole point.',
    ],
    whenToAvoid: [
      'Mechanical data parsing, regex generation, or simple format conversions.',
      'Tasks where the intent is completely trivial and obvious (e.g. "sort this list alphabetically").',
      'High-velocity code completions where a quick RTF prompt is sufficient.',
    ],
    cognitiveMechanisms: [
      {
        title: 'Intent-Space Convergence',
        description: 'LLMs are trained to maximize reward models based on prompt similarity. When you provide the "Purpose", the model aligns its semantic vector with your strategic objective rather than taking the most generic path.',
      },
      {
        title: 'Expectation Bias Prevention',
        description: 'By explicitly stating expectations (e.g. "Do not gloss over failure modes"), the prompt penalizes the model for producing superficial, overly optimistic marketing fluff.',
      },
      {
        title: 'Pragmatic Tradeoff Evaluation',
        description: 'Purpose-driven prompts enable the AI to make nuanced tradeoffs on your behalf, selecting the best balance between speed, cost, complexity, and maintainability.',
      },
    ],
    examples: [
      {
        title: 'Architecture Decision Record: Kafka vs. SQS',
        category: 'Software Architecture',
        scenario: 'A lead developer needs to justify selecting managed AWS SQS over Apache Kafka to an architect who loves complex tools.',
        weakPrompt: 'Write an ADR comparing Kafka and SQS for our event pipeline.',
        weakProblems: [
          'Produces an academic, neutral pros/cons list without taking a decisive stand.',
          'Fails to consider team size, maintenance cognitive load, or on-call burden.',
          'Missing strategic alignment with the team\'s actual delivery goals.',
        ],
        strongPrompt: `## Action (A)
Draft an Architecture Decision Record (ADR 0024) evaluating Apache Kafka vs. AWS SQS/SNS for our e-commerce order fulfillment event stream (approx. 400 events/second peak).

## Purpose (P)
The purpose is to convince our Director of Engineering to select managed AWS SQS/SNS. Our team consists of only 4 backend engineers with zero dedicated DevOps support; managing Zookeeper/KRaft clusters, rebalancing partitions, and monitoring consumer lag would consume 30% of our weekly engineering capacity.

## Expectation (E)
- Follow the Michael Nygard ADR format (Status: Proposed).
- Deliver an uncompromising Total Cost of Ownership (TCO) breakdown comparing AWS SQS serverless pay-per-use against managed MSK cluster minimum base fees ($350/mo vs $28/mo).
- Provide a clear migration escape hatch: Define the exact throughput threshold (>10,000 events/sec) where re-evaluating Kafka becomes economically and technically justified.`,
        strongStrengths: [
          'Explicitly defines the operational constraint: 4 engineers, zero DevOps.',
          'Demands financial TCO comparison table.',
          'Provides an escape-hatch trigger, eliminating fears of long-term architectural lock-in.',
        ],
        whyItWorks: 'The model understands the political and operational reality of the team, drafting an ADR that successfully persuades leadership while maintaining engineering integrity.',
      },
      {
        title: 'Pre-Seed Startup Investor Teaser Memo',
        category: 'Fundraising & Strategy',
        scenario: 'A technical founder is writing a 1-page investment teaser to secure angel checks for an open-source observability tool.',
        weakPrompt: 'Write an investor pitch for our open-source observability developer tool.',
        weakProblems: [
          'Reads like an enthusiastic product brochure rather than an investment thesis.',
          'Focuses on features (fast queries) instead of venture metrics (TAM, viral loops, enterprise moat).',
          'Fails to explain why incumbents (Datadog) cannot easily copy the innovation.',
        ],
        strongPrompt: `## Action (A)
Author a 1-page pre-seed Investor Executive Memo for "TelemetryFlow", an open-source ClickHouse-native distributed tracing platform.

## Purpose (P)
The purpose is to secure a 30-minute diligence call with tier-1 seed venture capitalists (e.g. Sequoia, Accel, Benchmark). The thesis must prove why Datadog\'s 80% gross margins make them vulnerable to our open-source, decoupled storage model.

## Expectation (E)
- Structure: The Macro Inflection Point -> The Incumbent Tax -> Our Open-Source Wedge -> Traction Metrics (GitHub Stars & Docker pulls) -> The $1.5M Round Ask.
- Tone: High-conviction founder voice, intellectually rigorous, zero buzzword density.
- Explicitly answer the "Why Now?" question regarding ClickHouse query cost efficiency.`,
        strongStrengths: [
          'Frames the product as an economic wedge against high-margin incumbents.',
          'Adheres to the exact mental model of venture capitalists looking for venture scale.',
          'Replaces generic hype with hard market dynamics.',
        ],
        whyItWorks: 'By declaring the Purpose (venture funding diligence), the AI writes from the perspective of an investable founder rather than a product marketer.',
      },
      {
        title: 'Senior Engineering Promotion Business Case',
        category: 'Career & Management',
        scenario: 'A mid-level software engineer is drafting their self-evaluation packet for promotion to Senior Software Engineer.',
        weakPrompt: 'Write a self-evaluation for my promotion to senior engineer showing what I did this year.',
        weakProblems: [
          'Focuses purely on ticket output rather than leadership, mentorship, and system impact.',
          'Sounds either uncomfortably boastful or overly timid and apologetic.',
          'Lacks alignment with the company\'s engineering competency matrix.',
        ],
        strongPrompt: `## Action (A)
Draft the self-evaluation promotion narrative for my transition from Software Engineer II to Senior Software Engineer at a Series C fintech.

## Purpose (P)
The purpose is to substantiate my case before the Staff Engineering Promotion Committee by proving that I have been operating at the Senior level for the past 6 months, particularly across technical de-risking, mentoring junior engineers, and cross-team incident resolution.

## Expectation (E)
- Structure by the 3 core Senior pillars: 1. Technical Complexity & Ownership; 2. Multiplier Effect & Mentorship; 3. Operational Excellence & Reliability.
- Frame each major accomplishment with the STAR method (Situation, Task, Action, Result) with measurable metrics (e.g. 99.99% uptime, reduced latency by 35ms, unblocked 3 sprints).
- Tone: Fact-based, humble yet uncompromisingly confident, championing team collaboration over individual heroism.`,
        strongStrengths: [
          'Understands the specific criteria used by engineering promotion committees.',
          'Enforces the STAR method with measurable operational metrics.',
          'Strikes the exact balance between confidence and collaborative leadership.',
        ],
        whyItWorks: 'The model tailors every sentence to the committee\'s evaluation matrix, spotlighting multiplier impact and technical ownership.',
      },
    ],
    faqs: [
      {
        question: 'What is the APE prompt framework?',
        answer: 'APE stands for Action, Purpose, and Expectation. It is a purpose-driven framework designed to ensure that the AI understands the strategic rationale ("Why") behind a task before generating the deliverable ("What"), while upholding rigorous quality standards ("Expectation").',
      },
      {
        question: 'Why is the "Purpose" field so transformative in APE?',
        answer: 'Without Purpose, AI models fulfill requests with the most mathematically average, generic solution. Explaining *why* you need the output (e.g., "to convince skeptical executives", "to reduce on-call fatigue") lets the model prioritize the exact arguments, tradeoffs, and tone needed to win.',
      },
      {
        question: 'When should I choose APE over RTF or CO-STAR?',
        answer: 'Choose APE when the strategic rationale is the deciding factor in whether the output succeeds—such as in pitch decks, architecture proposals, executive memos, or difficult interpersonal emails. Choose RTF when you just need quick execution, and choose CO-STAR when you have complex multi-stakeholder tone and audience requirements.',
      },
      {
        question: 'Can APE be used for coding tasks?',
        answer: 'Yes! APE is exceptional for software architecture, refactoring proposals, and tech-debt cleanup. Stating the Purpose (e.g., "we need this refactored because junior developers keep introducing race conditions here") directs the AI to write more defensive, well-commented, idiot-proof code.',
      },
    ],
    relatedFrameworks: [
      { name: 'CO-STAR Framework', slug: 'co-star-prompt-framework', reason: 'Need extensive audience segmentation, style, and tone controls?' },
      { name: 'RTF Framework', slug: 'rtf-role-task-format', reason: 'Need lightweight, immediate technical execution with minimal preamble?' },
      { name: 'TAG Framework', slug: 'tag-prompt-framework', reason: 'Designing operational SOPs with step-by-step actions and measurable goals?' },
    ],
  },
];
