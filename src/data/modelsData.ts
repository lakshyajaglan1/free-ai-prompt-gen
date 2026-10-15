import { TargetModel } from '../lib/types';

export interface ModelBeforeAfter {
  title: string;
  category: string;
  scenario: string;
  weakPrompt: string;
  weakProblems: string[];
  strongPrompt: string;
  strongStrengths: string[];
  whyItWorks: string;
}

export interface ModelFieldDef {
  key: string;
  label: string;
  placeholder: string;
  helperText: string;
  defaultValue: string;
  type?: 'text' | 'textarea' | 'select';
  options?: { label: string; value: string }[];
}

export interface ModelFaq {
  question: string;
  answer: string;
}

export interface ModelPageData {
  slug: string;
  modelKey: TargetModel | 'Midjourney' | 'Ollama';
  title: string;
  metaTitle: string;
  metaDescription: string;
  badge: string;
  provider: string;
  recommendedSyntax: string;
  summary: string;
  heroPitch: string;
  builderFields: ModelFieldDef[];
  parameters?: {
    name: string;
    description: string;
    example: string;
  }[];
  promptRules: {
    title: string;
    description: string;
  }[];
  whenToUse: string[];
  whenToAvoid: string[];
  examples: ModelBeforeAfter[];
  faqs: ModelFaq[];
  relatedModels: {
    name: string;
    slug: string;
    reason: string;
  }[];
}

export const MODEL_PAGES: ModelPageData[] = [
  {
    slug: 'claude-xml-prompt-generator',
    modelKey: TargetModel.Claude,
    title: 'Claude XML Tag Prompt Generator & Formatter (<role>, <task>)',
    metaTitle: 'Claude XML Tag Prompt Generator & Formatter (<role>, <task>) | Free AI Prompt Gen',
    metaDescription: 'Free Claude XML Tag Prompt Generator. Format your prompts using Anthropic\'s official XML tag syntax (<role>, <context>, <task>, <rules>) for maximum steerability and zero hallucinations.',
    badge: 'Anthropic Official Standard',
    provider: 'Anthropic (Claude 3.5 Sonnet, Opus & Haiku)',
    recommendedSyntax: 'XML Delimiters (<role>, <context>, <task>, <rules>, <output_format>)',
    summary: 'Anthropic officially recommends structuring prompts for Claude using semantic XML tags. Because Claude\'s pre-training explicitly conditions on XML structure, encapsulating instructions, system context, and source data in tags like <role>, <context>, and <task> dramatically improves steerability, eliminates prompt injection, and slashes hallucinations.',
    heroPitch: 'Harness Anthropic\'s native parsing engine. Clean, unambiguous XML tags for peak reasoning and flawless code generation.',
    builderFields: [
      {
        key: 'role',
        label: 'Role Tag (<role>)',
        placeholder: 'e.g. Senior Staff Security Researcher specializing in smart contract auditing...',
        helperText: 'Enclosed in <role> tags to anchor the persona without conversational ambiguity.',
        defaultValue: 'Principal TypeScript Engineer and Web Performance Architect',
      },
      {
        key: 'context',
        label: 'Context Tag (<context>)',
        placeholder: 'e.g. We are deploying an Astro SSR site to Cloudflare Workers with strict 128MB RAM limits...',
        helperText: 'Background environment and technical boundary data enclosed in <context>.',
        defaultValue: 'We are optimizing a high-traffic Astro 5 website with Server Islands deployed on Cloudflare Workers edge nodes.',
      },
      {
        key: 'task',
        label: 'Task Tag (<task>)',
        placeholder: 'e.g. Audit the component below for edge hydration bottlenecks...',
        helperText: 'The core instruction enclosed in <task> tags.',
        defaultValue: 'Analyze the component architecture, isolate client-side bundle weight, and refactor heavy interactive widgets into deferred server islands.',
      },
      {
        key: 'rules',
        label: 'Rules & Guardrails (<rules>)',
        placeholder: 'e.g. Never use client:load on below-the-fold elements. Keep inline JS under 1KB...',
        helperText: 'Strict negative and positive constraints enclosed in <rules>.',
        defaultValue: '1. Never use client:load on below-the-fold elements.\n2. All interactive islands must have accessible fallback states.\n3. Output zero external runtime dependencies.',
      },
      {
        key: 'output_format',
        label: 'Output Format (<output_format>)',
        placeholder: 'e.g. 1. Architecture diagram in ASCII. 2. Refactored Astro code block. 3. Bundle impact table...',
        helperText: 'Specifies the response shape inside <output_format>.',
        defaultValue: '1. Root cause performance analysis (markdown bullets).\n2. Refactored .astro component code block.\n3. Lighthouse performance projection table.',
      },
    ],
    promptRules: [
      {
        title: 'Anthropic XML Separation Rule',
        description: 'Always use semantic XML tags (<context>, <source_text>, <instructions>) to separate user data from instructions. This ensures Claude never mistakes document text for an imperative command.',
      },
      {
        title: 'Use <thinking> Tags for Reasoning',
        description: 'Direct Claude to use `<thinking>...</thinking>` scratchpads to reason step-by-step before producing its final answer. This unlocks deep chain-of-thought accuracy on hard logic and math.',
      },
      {
        title: 'Prefill Claude\'s Response',
        description: 'You can guide Claude\'s output formatting by ending your prompt with an opening tag (e.g. ````json` or `<analysis>`). Claude will immediately begin producing valid content without pleasantries.',
      },
      {
        title: 'Prompt Caching Optimization',
        description: 'Place static system prompts, large documentation, and XML knowledge bases at the top of your prompt to take full advantage of Anthropic Prompt Caching (saving up to 90% in token costs).',
      },
    ],
    whenToUse: [
      'Complex coding, architectural reviews, and multi-file refactoring with Claude 3.5 Sonnet.',
      'Analyzing massive PDFs, legal contracts, or technical documentation where source text must not bleed into instructions.',
      'Zero-shot structured data extraction (JSON, YAML, CSV) requiring airtight consistency.',
      'High-security prompt engineering where user inputs must be shielded against prompt injection.',
    ],
    whenToAvoid: [
      'Casual 5-word consumer chat questions where formatting overhead is unnecessary.',
      'Models that were not tuned on XML tags (e.g., small local 3B parameter models that might misunderstand tags).',
    ],
    examples: [
      {
        title: 'Astro Component Edge Hydration Audit',
        category: 'Web Performance',
        scenario: 'An engineering team needs Claude 3.5 Sonnet to diagnose why their Astro SSR app has sluggish First Input Delay (FID) on mobile.',
        weakPrompt: 'Here is my Astro component. Why is it loading slow on mobile and how do I fix it?',
        weakProblems: [
          'No XML structure to cleanly isolate the source code from instructions.',
          'Doesn\'t leverage Claude\'s reasoning scratchpad.',
          'Missing constraints on acceptable libraries and edge runtime limits.',
        ],
        strongPrompt: `<role>
You are a Principal Web Performance Engineer and Astro core contributor specializing in edge hydration, Partial Hydration, and Core Web Vitals.
</role>

<context>
Our website runs on Astro 5 SSR hosted on Cloudflare Workers (128MB memory limit). Mobile users on 4G connections report a 420ms Interaction to Next Paint (INP) bottleneck on our product detail page.
</context>

<task>
Perform a forensic code review of the attached component. Identify client directive misuse (such as unnecessary client:load) and provide an optimized implementation using Astro Server Islands.
</task>

<rules>
1. Prioritize zero-JavaScript defaults for static content.
2. Use server:defer with a lightweight skeleton fallback for user-specific pricing.
3. Eliminate all third-party state management libraries.
</rules>

<output_format>
- Forensic Bottleneck Breakdown (Table: Line, Anti-Pattern, INP Impact).
- Refactored .astro Component (Complete, production-ready code).
- Hydration Timeline Analysis (Before vs. After).
</output_format>`,
        strongStrengths: [
          'Anthropic-compliant semantic XML tag architecture.',
          'Strict performance guardrails and mobile INP focus.',
          'Structured multi-stage output format with zero conversational fluff.',
        ],
        whyItWorks: 'Claude\'s neural attention is primed by the XML hierarchy, cleanly differentiating the operational role, context, task, and rules.',
      },
      {
        title: 'Smart Contract Reentrancy & Flash Loan Audit',
        category: 'Blockchain Security',
        scenario: 'A Web3 protocols team needs Claude to perform an initial security triage on a Solidity ERC-4626 vault.',
        weakPrompt: 'Check this Solidity code for reentrancy bugs and flash loan attacks.',
        weakProblems: [
          'Lacks threat modeling framework (Checks-Effects-Interactions, CEI).',
          'Code payload easily confused with instructional prompt text.',
          'No formal vulnerability classification (OWASP / SWC-registry).',
        ],
        strongPrompt: `<role>
You are an Elite Web3 Security Auditor and EVM bytecode specialist.
</role>

<context>
The provided contract is an ERC-4626 Yield Vault accepting stETH deposits and interacting with external Uniswap v3 flash swap callbacks.
</context>

<task>
Audit the contract for reentrancy vectors (read-only and cross-contract), integer truncation in fee calculations, and flash-loan price oracle manipulation.
</task>

<rules>
- Reference official SWC-registry IDs for every identified vulnerability.
- Provide Proof-of-Concept exploit flow in Foundry test syntax.
- Formulate precise remediation diffs following the Checks-Effects-Interactions pattern.
</rules>

<thinking>
Before outputting, model the attack graph step-by-step: deposit -> flash loan borrow -> balance manipulation -> vault share dilution -> redemption.
</thinking>

<output_format>
1. Executive Risk Matrix (High/Med/Low).
2. Detailed Findings (Description, SWC-ID, Exploitation Path, Foundry PoC).
3. Remediation Git Diff.
</output_format>`,
        strongStrengths: [
          'Employs explicit `<thinking>` tag to force step-by-step attack graph simulation.',
          'Demands Foundry exploit test cases for reproducible verification.',
          'Tags every finding with official SWC vulnerability IDs.',
        ],
        whyItWorks: 'The `<thinking>` tag instructs Claude to run a full chain-of-thought simulation in its latent space before committing to the output tokens.',
      },
      {
        title: 'Multi-Document Legal NDA Risk Extraction',
        category: 'Legal & Enterprise',
        scenario: 'An in-house corporate counsel needs to review vendor Non-Disclosure Agreements against their company standard terms.',
        weakPrompt: 'Read these 3 NDAs and tell me which clauses are dangerous for us.',
        weakProblems: [
          'Danger of source text overlapping with instructions.',
          'Vague criteria for what "dangerous" means.',
          'Output format is unpredictable narrative prose.',
        ],
        strongPrompt: `<role>
You are a Senior Technology Corporate Counsel specializing in SaaS enterprise procurement, IP indemnification, and trade secret protection.
</role>

<context>
Our company is a Series B SaaS vendor. We cannot accept non-mutual confidentiality, uncapped indemnification for breach of confidentiality, or non-solicitation clauses that exceed 12 months.
</context>

<documents>
[Insert Vendor NDA Text Here]
</documents>

<task>
Extract and redline all clauses in the attached NDA that conflict with our risk posture.
</task>

<rules>
- Flag strict non-negotiables as RED (Dealbreaker).
- Flag unfavorable language as YELLOW (Negotiable).
- Provide exact counter-language for each problematic clause.
</rules>

<output_format>
Markdown audit table with columns: [Clause #] | [Original Language] | [Risk Level] | [Legal Risk Explanation] | [Proposed Redline Replacement]
</output_format>`,
        strongStrengths: [
          'Isolates external document text cleanly inside `<documents>` tags.',
          'Defines explicit color-coded risk taxonomy (RED / YELLOW).',
          'Outputs an actionable redline table ready for vendor negotiations.',
        ],
        whyItWorks: 'Wrapping external data in `<documents>` prevents indirect prompt injection and guarantees that Claude reviews the contract objectively against corporate guidelines.',
      },
    ],
    faqs: [
      {
        question: 'Why does Anthropic recommend XML tags for Claude?',
        answer: 'During training, Anthropic fine-tunes Claude on structured XML tags. Claude recognizes these tags as strong semantic boundaries. This separation prevents the model from getting confused between your instructions, background context, user inputs, and output constraints.',
      },
      {
        question: 'What are the most effective XML tags to use with Claude?',
        answer: 'The most impactful tags are <role>, <context>, <task>, <rules>, <documents> (or <source_data>), <thinking>, and <output_format>. You can also create custom tags like <examples> or <style_guidelines> as needed.',
      },
      {
        question: 'How do <thinking> tags work in Claude?',
        answer: 'By instructing Claude to think inside `<thinking>...</thinking>` tags before answering, you trigger an internal chain-of-thought scratchpad. This allows Claude to plan its logic, check for edge cases, and catch mistakes before producing the final text.',
      },
      {
        question: 'Can I use XML tags with Claude in API calls?',
        answer: 'Yes! XML tags work identically in the Claude Web interface (claude.ai) and the Anthropic API. In fact, in API calls you can also prefill the assistant response with an opening tag (like `<response>`) to guarantee immediate structured output.',
      },
      {
        question: 'Does Claude hallucinate less when using XML tags?',
        answer: 'Yes. Internal benchmarks and Anthropic engineering research confirm that clear XML delineation dramatically reduces instruction drift, accidental token hallucinations, and prompt injection attacks.',
      },
    ],
    relatedModels: [
      { name: 'ChatGPT Markdown Builder', slug: 'chatgpt-markdown-prompt-generator', reason: 'Prefer OpenAI GPT-4o with clear Markdown headers?' },
      { name: 'Google Gemini Builder', slug: 'gemini-prompt-generator', reason: 'Targeting Gemini 1.5 Pro with large multimodal context?' },
      { name: 'Local LLM Builder (Ollama)', slug: 'ollama-local-llm-prompt-generator', reason: 'Running local Llama 3 or Mistral models on your machine?' },
    ],
  },
  {
    slug: 'chatgpt-markdown-prompt-generator',
    modelKey: TargetModel.ChatGPT,
    title: 'ChatGPT System & Markdown Prompt Builder',
    metaTitle: 'ChatGPT System & Markdown Prompt Builder | Free AI Prompt Gen',
    metaDescription: 'Free ChatGPT Markdown Prompt Generator. Craft structured prompts with clear H2 headers, system instructions, and few-shot constraints optimized for OpenAI GPT-4o.',
    badge: 'OpenAI GPT-4o Optimized',
    provider: 'OpenAI (GPT-4o, GPT-4o mini, o1 & o3-mini)',
    recommendedSyntax: 'Markdown Section Headers (## Role, ## Context, ## Instructions, ## Constraints)',
    summary: 'OpenAI models are pre-trained and fine-tuned extensively on structured GitHub Markdown. Utilizing clear ## Level-2 Headers, bulleted constraints, and explicit role definitions anchors GPT-4o\'s multi-head attention mechanism, eliminating generic responses and ensuring strict adherence to complex instructions.',
    heroPitch: 'Clean, hierarchical Markdown architecture engineered for GPT-4o, o1, and the entire OpenAI model family.',
    builderFields: [
      {
        key: 'role',
        label: 'System Persona (## Role)',
        placeholder: 'e.g. Senior Principal Architect specializing in distributed event architectures...',
        helperText: 'Anchors the domain knowledge, perspective, and evaluation standard.',
        defaultValue: 'Staff Software Architect and Cloud Cost Optimization Specialist',
      },
      {
        key: 'context',
        label: 'Operational Context (## Context)',
        placeholder: 'e.g. Our Series A startup AWS bill ballooned to $18k/month due to NAT Gateway egress...',
        helperText: 'Background narrative, infrastructure specs, and current baseline.',
        defaultValue: 'Our AWS monthly cloud bill has escalated to $14,000/month, with 60% driven by cross-AZ data transfer fees and unoptimized NAT Gateway traffic from Kubernetes pods.',
      },
      {
        key: 'task',
        label: 'Core Instructions (## Instructions)',
        placeholder: 'e.g. Formulate an actionable AWS cost remediation plan...',
        helperText: 'Numbered imperative actions for GPT-4o to execute.',
        defaultValue: '1. Diagnose the primary root causes of cross-AZ data transfer in EKS.\n2. Propose architectural remediations (VPC endpoints, topology-aware routing).\n3. Formulate an implementation roadmap prioritized by ROI vs. engineering effort.',
      },
      {
        key: 'constraints',
        label: 'Negative Constraints (## Constraints)',
        placeholder: 'e.g. Do NOT recommend third-party SaaS tools. Do NOT suggest downtime...',
        helperText: 'Crucial boundaries and banned recommendations.',
        defaultValue: '- Do NOT suggest third-party SaaS billing platforms (Datadog, CloudHealth).\n- All remediations must maintain 99.99% high-availability.\n- Limit recommendations to native AWS constructs.',
      },
      {
        key: 'outputFormat',
        label: 'Output Formatting (## Output Format)',
        placeholder: 'e.g. Executive Summary -> Remediation Matrix Table -> Terraform diffs...',
        helperText: 'Defines the exact visual layout and section hierarchy.',
        defaultValue: '1. Executive Cost-Saving Summary (Projected % reduction and dollar savings).\n2. Remediation Matrix (Table: Strategy, Monthly Savings, Effort, Risk).\n3. Terraform configuration snippet for VPC Gateway Endpoints.',
      },
    ],
    promptRules: [
      {
        title: 'Use Level-2 Headers (##)',
        description: 'OpenAI models recognize markdown `## Headers` as primary section delimiters. It helps the model compartmentalize rules, background context, and instructions without cross-bleeding.',
      },
      {
        title: 'Explicit Negative Constraints ("Do NOT")',
        description: 'GPT-4o responds exceptionally well to explicit negative constraints grouped together under a dedicated `## Constraints` header. State clearly what the model must avoid.',
      },
      {
        title: 'Few-Shot Exemplars',
        description: 'When exact formatting is required, provide 1 or 2 concrete examples under a `## Example` header. GPT-4o\'s in-context learning will replicate the pattern with 99%+ fidelity.',
      },
      {
        title: 'System vs. User Separation',
        description: 'For API usage, place your Role and Constraints into the `system` message parameter and your specific Task into the `user` message parameter for maximum steerability.',
      },
    ],
    whenToUse: [
      'Everyday development, code generation, refactoring, and debugging with GPT-4o.',
      'Complex multi-step reasoning, mathematical modeling, and algorithmic problems with OpenAI o1 and o3-mini.',
      'Copywriting, blog posts, email marketing, and landing page messaging with strict tone guidelines.',
      'Data restructuring into JSON, YAML, or markdown tables.',
    ],
    whenToAvoid: [
      'Extremely long-document ingestion (>200k tokens) where Google Gemini\'s 2M token context window is superior.',
      'Local offline inference where privacy regulations prohibit cloud API transmission (use Ollama instead).',
    ],
    examples: [
      {
        title: 'AWS Cloud Cost Optimization Audit',
        category: 'DevOps & FinOps',
        scenario: 'A DevOps lead needs an immediate architectural plan to slash runaway AWS NAT Gateway transfer bills.',
        weakPrompt: 'How can I lower my AWS bill? Our NAT gateway and EKS costs are way too high.',
        weakProblems: [
          'Generates generic advice (e.g. "turn off unused instances").',
          'Ignores the specific networking mechanisms causing cross-AZ data charges.',
          'No implementation details or Terraform code.',
        ],
        strongPrompt: `## Role
Principal AWS Solutions Architect & FinOps Certified Practitioner.

## Context
Our Kubernetes workloads running on AWS EKS generate 45 TB of inter-service traffic monthly, leading to an unexpected $6,500/month bill in Cross-AZ Data Transfer and NAT Gateway processing fees. Microservices communicate via internal REST endpoints without localized routing.

## Instructions
1. Analyze how Kubernetes Topology Aware Routing and VPC Gateway Endpoints (for S3 and DynamoDB) resolve these charges.
2. Outline the exact Helm chart or Kubernetes Service annotation changes required to keep pod traffic in the same Availability Zone.
3. Calculate the projected monthly dollar savings assuming 80% localized traffic.

## Constraints
- Do NOT suggest re-architecting microservices into a monolith.
- Solutions must require zero scheduled cluster downtime.
- Exclude third-party commercial optimization tools.

## Output Format
- Executive FinOps Assessment (1 paragraph + savings estimate).
- Architectural Remediation Blueprint (3 structured H3 sections).
- Ready-to-apply Kubernetes YAML configuration manifest.`,
        strongStrengths: [
          'Leverages clear Markdown headers that OpenAI models parse effortlessly.',
          'Focuses on exact networking mechanics: Topology Aware Routing and Gateway Endpoints.',
          'Requires concrete YAML manifests and projected dollar savings.',
        ],
        whyItWorks: 'The Markdown hierarchy allows GPT-4o to process each section as a distinct constraint, resulting in a concrete, actionable FinOps plan.',
      },
      {
        title: 'Landing Page Hero Copy & Positioning Sprint',
        category: 'Growth & Copywriting',
        scenario: 'A SaaS founder needs high-converting hero section copy targeting developer platform buyers.',
        weakPrompt: 'Write some cool hero headlines and subheadlines for our developer productivity tool.',
        weakProblems: [
          'Yields generic, cheesy marketing tropes ("Unleash your potential", "Work smarter").',
          'Lacks differentiation, audience calibration, and emotional hook.',
          'Missing conversion rate optimization (CRO) methodology.',
        ],
        strongPrompt: `## Role
Elite Developer Marketing Copywriter & Conversion Rate Optimization (CRO) Lead inspired by the stark, developer-first voice of Vercel, Linear, and Supabase.

## Context
We are launching "TurboEnv"—a 100ms local development environment orchestrator that replaces Docker Desktop for remote engineering teams. The product eliminates the "it works on my machine" crisis and battery drain on Apple Silicon laptops.

## Instructions
Draft 5 distinct positioning variations for the above-the-fold Hero section. Each variation must test a different psychological angle:
1. Pain-Forward (Docker slowness & Mac thermal throttling).
2. Velocity-Forward (Instant 100ms start times).
3. Contrarian / Anti-Complex (Zero configuration, pure local binary).
4. Social Proof / Peer Benchmark.
5. Direct Benefit / Bottom-line.

## Constraints
- No corporate buzzwords: Ban "seamless", "synergy", "game-changer", "revolutionary", "supercharge".
- Keep headlines under 8 words; subheadings under 22 words.
- Sentence-case capitalization only.

## Output Format
Markdown table comparing the 5 variations across columns: [Angle] | [Eyebrow Label] | [H1 Headline] | [Subheading] | [Primary CTA Text]`,
        strongStrengths: [
          'References iconic developer brands (Vercel, Linear, Supabase) for stylistic voice.',
          'Forces 5 distinct cognitive angles to test in production.',
          'Imposes strict word limits and bans overused marketing buzzwords.',
        ],
        whyItWorks: 'Markdown headers combined with explicit negative keyword bans prevent GPT-4o from drifting into generic marketing clichés.',
      },
      {
        title: 'Strict JSON Schema Data Extraction',
        category: 'Data Engineering',
        scenario: 'An engineer needs unstructured invoice emails parsed into a strict, validated JSON schema for an automated ERP pipeline.',
        weakPrompt: 'Extract the invoice details from this email into JSON format please.',
        weakProblems: [
          'Returns markdown backticks, conversational introductions, or broken JSON keys.',
          'Inconsistent date formats (ISO vs. US localized).',
          'Missing validation handling for line items or multiple currencies.',
        ],
        strongPrompt: `## Role
Deterministic Data Extraction Pipeline & JSON Schema Validator.

## Context
We are ingesting raw email bodies from automated supplier invoices into our internal NetSuite ERP system. Unparseable JSON breaks the webhook queue.

## Instructions
Parse the provided email snippet into the exact JSON schema defined below. Normalize all dates to ISO 8601 (YYYY-MM-DD) and represent amounts in integer cents (e.g. $10.50 -> 1050).

## JSON Schema Specification
\`\`\`json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "invoice_number": { "type": "string" },
    "vendor_name": { "type": "string" },
    "invoice_date": { "type": "string", "format": "date" },
    "due_date": { "type": "string", "format": "date" },
    "currency": { "type": "string", "enum": ["USD", "EUR", "GBP"] },
    "total_cents": { "type": "integer" },
    "line_items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "description": { "type": "string" },
          "quantity": { "type": "number" },
          "unit_price_cents": { "type": "integer" }
        },
        "required": ["description", "quantity", "unit_price_cents"]
      }
    }
  },
  "required": ["invoice_number", "vendor_name", "invoice_date", "total_cents", "line_items"]
}
\`\`\`

## Constraints
- Output ONLY valid, raw JSON.
- Do NOT wrap in conversational text or markdown explanation.
- If a value cannot be found, populate with null.`,
        strongStrengths: [
          'Embeds the complete JSON schema directly into the prompt.',
          'Standardizes numeric values (cents) to avoid floating-point errors.',
          'Enforces raw JSON output without conversational preambles.',
        ],
        whyItWorks: 'OpenAI models follow markdown code block schemas with near 100% precision when instructed with strict output constraints.',
      },
    ],
    faqs: [
      {
        question: 'Why should I use Markdown headers when prompting ChatGPT?',
        answer: 'OpenAI trained its GPT models extensively on GitHub repositories, documentation sites, and structured markdown. When you use `## Headers`, the model treats each block as a distinct semantic directive, resulting in significantly higher instruction compliance.',
      },
      {
        question: 'What is the best way to give negative constraints to ChatGPT?',
        answer: 'Group all negative constraints under a dedicated `## Constraints` header and use bold negative verbs (e.g. "- Do NOT include third-party packages", "- Never mention competitors"). Grouping them in one place makes it easier for the self-attention mechanism to attend to all rules simultaneously.',
      },
      {
        question: 'How do I stop ChatGPT from being overly conversational and polite?',
        answer: 'Add a constraint: "Eliminate conversational fluff. Do not include introductory pleasantries or closing remarks. Begin directly with the requested output." You can also specify the exact format of the very first line of output.',
      },
      {
        question: 'Is this builder compatible with OpenAI o1 and o3-mini?',
        answer: 'Yes! The new OpenAI reasoning models (o1, o3-mini) respond best to clean, structured markdown headers without emotional hype. Clear constraints help them spend their internal reasoning tokens on your actual problem.',
      },
    ],
    relatedModels: [
      { name: 'Claude XML Generator', slug: 'claude-xml-prompt-generator', reason: 'Prefer Anthropic\'s XML tag structure for complex coding?' },
      { name: 'Google Gemini Builder', slug: 'gemini-prompt-generator', reason: 'Need to analyze huge 1M+ token datasets or video?' },
      { name: 'Local LLM Builder (Ollama)', slug: 'ollama-local-llm-prompt-generator', reason: 'Running local open-source models offline?' },
    ],
  },
  {
    slug: 'gemini-prompt-generator',
    modelKey: TargetModel.Gemini,
    title: 'Google Gemini Structured Prompt Builder',
    metaTitle: 'Google Gemini Structured Prompt Builder | Free AI Prompt Gen',
    metaDescription: 'Free Google Gemini Prompt Generator. Build structured prompts with bold field directives, multi-modal context cues, and high-context window utilization for Gemini 1.5 Pro and 2.0 Flash.',
    badge: '1M+ Context Engineered',
    provider: 'Google DeepMind (Gemini 1.5 Pro, 2.0 Flash & Ultra)',
    recommendedSyntax: 'Bold Field Delimiters (**Role:**, **Context:**, **Task:**, **Format:**)',
    summary: 'Google\'s Gemini models (Gemini 1.5 Pro and Gemini 2.0 Flash) excel at processing massive multimodal context windows of up to 2 million tokens. Gemini responds optimally to bold-prefixed directives (**Role:**, **Context:**, **Directives:**) and explicit search-grounding commands, unlocking near-perfect needle-in-a-haystack recall across huge codebases, long video files, and dense research corpora.',
    heroPitch: 'Harness Google\'s breakthrough 2M-token context window with clear bold directives and multimodal precision.',
    builderFields: [
      {
        key: 'role',
        label: 'Role & Persona (**Role:**)',
        placeholder: 'e.g. Principal AI Research Scientist and Multimodal Vision Specialist...',
        helperText: 'Establishes domain authority and technical depth.',
        defaultValue: 'Lead Research Scientist & Systems Architecture Specialist',
      },
      {
        key: 'context',
        label: 'High-Volume Context (**Context:**)',
        placeholder: 'e.g. Attached are the complete API docs (400 pages) and codebase for our payment system...',
        helperText: 'Leverage Gemini\'s massive context window. Summarize large files, logs, or repositories here.',
        defaultValue: 'We are analyzing the entire historical changelog, Git commit history, and technical RFC documents across 18 microservices to map architectural technical debt.',
      },
      {
        key: 'task',
        label: 'Task & Needle Extraction (**Task:**)',
        placeholder: 'e.g. Identify all deprecated cryptographic hash usages across the uploaded files...',
        helperText: 'Exact instructions, needle-in-a-haystack extraction, or synthesis directives.',
        defaultValue: 'Cross-reference all 18 RFCs against our production deployment configs. Extract every instance where a proposed architectural invariant was violated in actual implementation.',
      },
      {
        key: 'grounding',
        label: 'Grounding & Citations (**Grounding:**)',
        placeholder: 'e.g. Ground every assertion with exact filename, line number, or page citation...',
        helperText: 'Forces Gemini to cite exact sources from the provided context or Google Search.',
        defaultValue: 'Cite the exact document title, section heading, and quote for every identified violation. Do not extrapolate or assume unstated facts.',
      },
      {
        key: 'outputFormat',
        label: 'Output Layout (**Format:**)',
        placeholder: 'e.g. Markdown synthesis table followed by an architectural risk audit score...',
        helperText: 'Specifies visual hierarchy, tables, or JSON output.',
        defaultValue: 'Structured Audit Report: 1. Executive Violation Summary. 2. Cross-Service Discrepancy Matrix (Table: Service, RFC Spec, Code Reality, Risk Tier, Source Citation). 3. Immediate Remediations.',
      },
    ],
    promptRules: [
      {
        title: 'Use Bold Prefix Labels (**Field:**)',
        description: 'Gemini\'s attention mechanism parses bold label prefixes (**Role:**, **Task:**, **Requirements:**) with high fidelity, creating crisp semantic anchors throughout your prompt.',
      },
      {
        title: 'Needle-in-a-Haystack Positioning',
        description: 'When supplying massive context (hundreds of pages, transcripts, or codebases), place your primary context in the middle and place your specific query and output format at the very end.',
      },
      {
        title: 'Strict Grounding Directive',
        description: 'To prevent hallucinations on long documents, explicitly instruct: "Answer using ONLY the provided materials. If the information is not explicitly present, state \'Insufficient data in context\' rather than speculating."',
      },
      {
        title: 'Multimodal Spatial Anchoring',
        description: 'When prompting Gemini with images, video, or audio, refer to timestamps ("at 04:12 in the video") or spatial coordinates ("in the upper-right quadrant of the diagram") for pin-point accuracy.',
      },
    ],
    whenToUse: [
      'Analyzing massive code repositories, multi-hour video recordings, or 500-page PDF reports.',
      'Complex cross-document synthesis requiring deep factual grounding and exact citations.',
      'Real-time information retrieval utilizing Google Search Grounding.',
      'High-throughput, low-latency agentic loops using Gemini 2.0 Flash.',
    ],
    whenToAvoid: [
      'Local offline inference on consumer GPUs without cloud access.',
      'Small, single-sentence queries where lighter models can respond with lower overhead.',
    ],
    examples: [
      {
        title: 'Whole-Codebase Architectural Drift Audit',
        category: 'Software Engineering',
        scenario: 'An engineering director feeds 200,000 lines of source code to Gemini 1.5 Pro to detect architectural pattern violations.',
        weakPrompt: 'Look through our codebase and tell me where we are breaking clean architecture rules.',
        weakProblems: [
          'Too vague for a 200k token context; will result in generic surface observations.',
          'Missing specific architectural rules (domain boundaries, repository patterns).',
          'No file path citations or remediation guidance.',
        ],
        strongPrompt: `**Role:**
Principal Software Architect and Domain-Driven Design (DDD) Governance Auditor.

**Context:**
The attached repository contains 240,000 lines of Go code across 14 microservices. Our stated architecture strictly mandates that domain entities must NEVER import database drivers or HTTP framework packages (hexagonal ports-and-adapters architecture).

**Task:**
Perform an exhaustive architectural dependency audit across all packages:
1. Scan all files in the \`/domain\` and \`/core\` directories for forbidden imports (\`database/sql\`, \`github.com/lib/pq\`, \`net/http\`, \`github.com/gin-gonic/gin\`).
2. Identify instances where database persistence logic has leaked into domain services instead of repository interfaces.

**Grounding & Verification:**
Every reported violation must cite the exact file path, line number range, and the forbidden import statement. If a service is 100% compliant, explicitly certify it.

**Format:**
- Compliance Scorecard (Table: Microservice, Architecture Tier, Violation Count, Status).
- Detailed Finding Breakdown (File Link, Violation Pattern, Refactoring Fix).
- Recommended Dependency Inversion Interface diff for the worst offender.`,
        strongStrengths: [
          'Maximizes Gemini\'s 1M+ token context window to audit an entire codebase simultaneously.',
          'Establishes explicit, non-negotiable architectural boundaries (Hexagonal DDD).',
          'Demands exact line-number citations, eliminating hallucinations.',
        ],
        whyItWorks: 'Gemini\'s long-context attention heads excel at exhaustive global scans when given concrete, boolean-evaluable criteria and bold labels.',
      },
      {
        title: '1-Hour Technical Keynote Video Synthesis',
        category: 'Multimodal Video',
        scenario: 'A product manager uploads a 60-minute Google I/O keynote recording to extract all developer API announcements and launch timelines.',
        weakPrompt: 'Summarize the attached conference video and tell me what was announced.',
        weakProblems: [
          'Yields high-level marketing platitudes without developer-relevant technical details.',
          'Missing timestamps, API deprecation schedules, and SDK availability dates.',
          'Fails to leverage Gemini\'s native video-audio multimodal parsing.',
        ],
        strongPrompt: `**Role:**
Senior Technical Analyst and Developer Ecosystem Reporter.

**Context:**
Attached is the 58-minute video recording of the Cloud Developer Keynote.

**Task:**
Synthesize all engineering announcements, SDK updates, and pricing shifts made during the presentation:
1. Isolate every new API release, breaking deprecation notice, and beta availability window.
2. Cross-reference slide diagrams shown on screen with the spoken audio commentary by presenters.

**Grounding:**
For every listed announcement, include the precise video timestamp (MM:SS) where the slide was shown or the speaker made the declaration.

**Format:**
1. Executive Timeline (Chronological table: Timestamp, Announcement, Affected Runtime, Availability).
2. Deep Dive: Top 3 Breakthrough Architectural Announcements (Technical details, benchmark claims, code examples shown on slides).
3. Immediate Action Checklist for Engineering Teams.`,
        strongStrengths: [
          'Capitalizes on Gemini\'s native video and audio timeline indexing.',
          'Requires exact video timestamps (MM:SS) for immediate human verification.',
          'Extracts on-screen code snippets from slides that audio-only models would miss.',
        ],
        whyItWorks: 'Gemini processes video frames and audio synchronized in the same multimodal latent space, pinpointing exact presentation moments.',
      },
      {
        title: 'Clinical Research Systematic Literature Review',
        category: 'Scientific Research',
        scenario: 'A bioinformatician uploads 45 clinical trial PDFs (600+ pages) to synthesize drug efficacy and side-effect profiles.',
        weakPrompt: 'What do these research papers say about the efficacy of this drug?',
        weakProblems: [
          'High risk of hallucinated p-values and sample sizes.',
          'Fails to distinguish between phase I, II, and III trials.',
          'Lacks statistical rigor and confidence intervals.',
        ],
        strongPrompt: `**Role:**
Senior Biostatistician and Systematic Reviewer following PRISMA clinical synthesis guidelines.

**Context:**
The attached 45 clinical research manuscripts document randomized controlled trials (RCTs) evaluating GLP-1 receptor agonists in non-diabetic cardiovascular patients.

**Task:**
Synthesize the reported primary cardiovascular outcomes (MACE: Major Adverse Cardiovascular Events) and gastrointestinal adverse events across all 45 studies:
1. Extract patient cohort sizes (N), study duration, hazard ratios (HR), and 95% confidence intervals (CI).
2. Perform a qualitative heterogeneity assessment across trial methodologies.

**Grounding & Accuracy:**
Strict zero-hallucination standard: Extract statistics verbatim from study tables. Cite the Lead Author, Year, Table/Page number for every data point. If a metric was not reported, record as "NR".

**Format:**
- PRISMA Evidence Synthesis Table: [Study] | [N] | [Dose] | [MACE HR (95% CI)] | [Discontinuation Rate] | [Citation]
- Forest Plot Text Approximation.
- Methodological Risk of Bias Assessment.`,
        strongStrengths: [
          'Applies rigorous scientific synthesis guidelines (PRISMA).',
          'Enforces exact tabular data extraction with explicit "Not Reported" handling.',
          'Requires statistical precision (hazard ratios, confidence intervals).',
        ],
        whyItWorks: 'Bold labels combined with explicit grounding constraints ensure Gemini acts as an infallible research assistant across hundreds of pages of scientific data.',
      },
    ],
    faqs: [
      {
        question: 'Why does Google Gemini perform better with bold field labels?',
        answer: 'Gemini\'s attention architecture responds strongly to bold prefix markers (**Role:**, **Task:**, **Context:**, **Directives:**). These markers act as high-weight visual and syntactic dividers across its massive context window.',
      },
      {
        question: 'How much context can Gemini 1.5 Pro and 2.0 Flash handle?',
        answer: 'Gemini 1.5 Pro and 2.0 Flash support up to 2,000,000 tokens of multimodal context natively—equivalent to roughly 1.5 million words, 1 hour of video, or 60,000 lines of code in a single prompt session.',
      },
      {
        question: 'How do I prevent hallucinations when using Gemini\'s large context window?',
        answer: 'Include a dedicated **Grounding:** directive instructing Gemini to answer using ONLY the provided materials, cite exact source locations (page numbers, filenames, or timestamps), and explicitly output "Information not found in context" if an answer cannot be verified.',
      },
      {
        question: 'Can Gemini analyze video and audio natively?',
        answer: 'Yes! Unlike older models that require text transcriptions, Gemini directly ingests raw MP4 video and audio files. You can ask questions about visual slides, physical actions, and tone of voice with precise timestamps.',
      },
    ],
    relatedModels: [
      { name: 'Claude XML Generator', slug: 'claude-xml-prompt-generator', reason: 'Focusing on deep code generation with Anthropic Claude?' },
      { name: 'ChatGPT Markdown Builder', slug: 'chatgpt-markdown-prompt-generator', reason: 'Building prompts for OpenAI GPT-4o or o1?' },
      { name: 'Visual AI (Midjourney & Video)', slug: 'midjourney-and-video-prompt-generator', reason: 'Generating AI images and cinematic video?' },
    ],
  },
  {
    slug: 'midjourney-and-video-prompt-generator',
    modelKey: 'Midjourney',
    title: 'Midjourney, Sora & Runway AI Visual Prompt Builder',
    metaTitle: 'Midjourney, Sora & Runway AI Visual Prompt Builder | Free AI Prompt Gen',
    metaDescription: 'Free Midjourney, Sora, and Runway AI Visual Prompt Builder. Craft cinematic visual prompts with aspect ratios, camera angles, lighting, lens types, and negative parameters.',
    badge: 'Cinematic Visual Engineering',
    provider: 'Visual AI (Midjourney v6.1, Runway Gen-3, Sora, Flux.1 & DALL-E 3)',
    recommendedSyntax: 'Descriptor Stacks (Subject, Medium, Environment, Lighting, Camera Lens) + Parameter Flags (--ar, --v, --s, --no)',
    summary: 'Visual and video diffusion models do not think like conversational chatbots. They respond to weighted visual tokens: Subject, Medium, Photographic Style, Lighting, Camera Lens, Color Grading, and strict command flags like --ar 16:9, --stylize 250, and --no blur. Our visual builder translates your conceptual ideas into camera-grade diffusion instructions.',
    heroPitch: 'Ditch conversational chat. Build camera-grade prompts with lighting, lens selection, and official parameter flags.',
    builderFields: [
      {
        key: 'subject',
        label: 'Subject & Core Action',
        placeholder: 'e.g. A solitary Cyberpunk courier standing on an illuminated rainy Tokyo bridge...',
        helperText: 'The primary focal point, character, object, or architectural structure.',
        defaultValue: 'A solitary female software engineer in a brutalist concrete office overlooking a rainy neon metropolis',
      },
      {
        key: 'medium',
        label: 'Medium & Visual Style',
        placeholder: 'e.g. 35mm film photography, 3D Octane Render, Bauhaus poster, Oil painting...',
        helperText: 'Defines the artistic medium, texture, and rendering style.',
        defaultValue: 'Cinematic 35mm editorial film photography, Kodak Portra 400 grain, analog texture',
      },
      {
        key: 'lighting',
        label: 'Lighting & Atmosphere',
        placeholder: 'e.g. Volumetric golden hour sunlight, moody cyberpunk neon chiaroscuro, soft studio diffused...',
        helperText: 'Light direction, shadow quality, atmospheric haze, and time of day.',
        defaultValue: 'Moody twilight chiaroscuro, soft cyan and amber rim lighting reflecting off wet glass surfaces',
      },
      {
        key: 'camera',
        label: 'Camera Lens, Angle & Shot Type',
        placeholder: 'e.g. Wide-angle 24mm drone shot, 85mm portrait lens f/1.4, macro extreme close-up...',
        helperText: 'Focal length, aperture depth of field, perspective, and camera distance.',
        defaultValue: 'Shot on Hasselblad 500C, 80mm Zeiss lens at f/2.0, shallow depth of field with creamy bokeh',
      },
      {
        key: 'aspectRatio',
        label: 'Aspect Ratio (--ar)',
        placeholder: 'e.g. 16:9, 9:16, 21:9, 4:5...',
        helperText: 'Midjourney aspect ratio parameter flag.',
        defaultValue: '16:9',
      },
      {
        key: 'parameters',
        label: 'Parameter Flags (--s, --v, --no)',
        placeholder: 'e.g. --v 6.1 --s 250 --no blur, watermark, deformed...',
        helperText: 'Stylize, version, quality, and negative parameter exclusions.',
        defaultValue: '--v 6.1 --s 250 --c 5 --no blur, oversaturated, cartoon, watermark, text',
      },
    ],
    parameters: [
      { name: '--ar <ratio>', description: 'Sets the aspect ratio (e.g. --ar 16:9 for landscape, --ar 9:16 for vertical reels, --ar 1:1 for square).', example: '--ar 16:9' },
      { name: '--v <version>', description: 'Specifies the Midjourney model generation algorithm (v6.1 is current standard).', example: '--v 6.1' },
      { name: '--s <0-1000>', description: 'Stylize value. Low (50) sticks strictly to prompt; high (750) adds intense artistic flair.', example: '--s 250' },
      { name: '--c <0-100>', description: 'Chaos parameter. Higher values yield wildly different, unexpected exploratory concepts.', example: '--c 10' },
      { name: '--no <items>', description: 'Negative prompting. Strips unwanted elements (e.g. text, extra limbs, blur, cartoon).', example: '--no text, watermark, blur' },
      { name: '--video', description: 'Generates an animated video seed showing the diffusion generation process.', example: '--video' },
    ],
    promptRules: [
      {
        title: 'Banish Conversational Filler Words',
        description: 'Never write "Please generate an image of..." or "A beautiful photo of...". Diffusion models treat words like "beautiful" as ambiguous noise. Use concrete nouns, specific camera gear, and exact lighting descriptors.',
      },
      {
        title: 'Word Order Determines Attention Weight',
        description: 'Tokens at the beginning of the prompt carry the highest statistical weight in diffusion U-Nets. Put your primary Subject and Action first, followed by Medium, Environment, Lighting, and Camera.',
      },
      {
        title: 'Specify Physical Camera Hardware',
        description: 'Naming real cameras (Hasselblad H6D-100c, Leica M11) and lenses (35mm f/1.4, 85mm anamorphic) signals the model to render authentic focal compression, chromatic aberration, and natural depth of field.',
      },
      {
        title: 'Video AI Movement Direction (Runway / Sora)',
        description: 'For video models like Runway Gen-3 and Sora, add explicit temporal camera movements: "Slow continuous push-in forward", "Orbiting crane shot at 24fps", "Tracking shot from behind subject".',
      },
    ],
    whenToUse: [
      'Generating commercial marketing visuals, photorealistic hero banners, and concept art in Midjourney v6.1 and Flux.1.',
      'Crafting cinematic, temporal camera directions for AI video generators (Runway Gen-3 Alpha, OpenAI Sora, Luma Dream Machine).',
      'Architectural renders, product photography, editorial fashion, and UI mockup backgrounds.',
    ],
    whenToAvoid: [
      'Generating functional code, software architecture, or analytical prose (use Claude or ChatGPT instead).',
      'Complex mathematical problem solving or structured database queries.',
    ],
    examples: [
      {
        title: 'Cinematic Architectural Villa Photography',
        category: 'Architecture & Design',
        scenario: 'An architect needs a breathtaking hero image for a modern brutalist ocean villa for a design magazine.',
        weakPrompt: 'A nice modern house by the ocean with cool lights and glass windows realistic high quality.',
        weakProblems: [
          'Full of useless filler words ("nice", "cool", "realistic high quality").',
          'No camera lens, exposure, architectural style, or lighting physics defined.',
          'Default 1:1 aspect ratio looks like an amateur Instagram post.',
        ],
        strongPrompt: `Architectural digest editorial photograph of a minimalist cantilevered concrete villa embedded into rugged Icelandic coastal cliffs, massive floor-to-ceiling glass walls, warm recessed 2700K interior lighting, mist-covered turbulent dark ocean waves crashing below, overcast twilight atmosphere, shot on Phase One XF IQ4 150MP, Rodenstock 32mm f/4 lens, long exposure water motion, natural granite textures, muted scandinavian color grading --ar 16:9 --v 6.1 --s 200 --no plastic, CGI, oversaturated, render, cartoon`,
        strongStrengths: [
          'Names specific medium format camera (Phase One) and wide architectural lens (Rodenstock 32mm).',
          'Defines exact kelvin lighting temperature (2700K) and cliff geography.',
          'Locks 16:9 cinematic ratio and strips artificial CGI rendering tropes with `--no`.',
        ],
        whyItWorks: 'The diffusion model recognizes professional architectural photography cues, generating authentic glass reflections and realistic long-exposure water textures.',
      },
      {
        title: 'Editorial Cyberpunk Character Portrait',
        category: 'Character & Concept Art',
        scenario: 'A game studio needs a concept art portrait of a cybernetic augmented surgeon in Neo-Seoul.',
        weakPrompt: 'Cyberpunk doctor with robot eyes in futuristic city 4k resolution masterpiece.',
        weakProblems: [
          '"4k resolution masterpiece" is obsolete snake-oil prompting that degrades v6 diffusion models.',
          'Missing portrait focal length and depth of field.',
          'Skin texture will look plastic and waxy without film stock grounding.',
        ],
        strongPrompt: `Intimate close-up portrait of an exhausted cybernetic neural surgeon in Neo-Seoul, delicate brushed-titanium ocular implants with subtle pulsing amber diagnostic LEDs, wearing sterile matte-black scrubs, sweat and rain droplets on realistic skin with visible pores, moody cyan volumetric steam rising in background, shot on Leica M11, 85mm Summilux f/1.4 lens, razor-sharp focus on the subject's gaze with ultra-creamy optical bokeh, Kodak Vision3 500T cinema film grain, gritty hyper-realistic aesthetic --ar 4:5 --v 6.1 --s 150 --c 3 --no waxy skin, doll, anime, airbrushed, cartoon, oversaturated`,
        strongStrengths: [
          'Specifies high-end 85mm f/1.4 lens and authentic cinema film stock (Kodak Vision3 500T).',
          'Demands realistic skin pores and water droplets to defeat waxy AI diffusion artifacts.',
          'Uses --ar 4:5 for vertical editorial portrait orientation.',
        ],
        whyItWorks: 'Focusing on tactile physical details (brushed titanium, skin pores, optic bokeh) guides the model away from cartoonish AI tropes toward photorealism.',
      },
      {
        title: 'Cinematic AI Video Scene (Runway Gen-3 / Sora)',
        category: 'AI Video Generation',
        scenario: 'A filmmaker needs a dynamic establishing shot of an abandoned spacecraft hangar on Mars.',
        weakPrompt: 'Spaceship hangar on Mars movie scene moving camera high quality video.',
        weakProblems: [
          'No camera path, frame rate, lighting direction, or scale cues.',
          'Video models need explicit velocity and direction to avoid morphing artifacts.',
          'Lacks cinematic atmosphere and environmental physics.',
        ],
        strongPrompt: `Cinematic wide establishing shot of a massive subterranean spacecraft hangar on Mars. A decommissioned titanium exploration vessel sits covered in fine red iron-oxide dust. Slow continuous cinematic camera push-in tracking forward through rising atmospheric steam and amber emergency hazard lights, 24fps shutter angle, dramatic high-contrast anamorphic lens flare, deep dust motes drifting through volumetric sunlight beams penetrating cracked ceiling skylights, ultra-stable gimbal stabilization, epic science-fiction atmosphere --ar 21:9 --v 6.1`,
        strongStrengths: [
          'Defines exact temporal movement: "Slow continuous cinematic camera push-in tracking forward".',
          'Enforces 24fps cinematic film shutter aesthetics and anamorphic lens flare.',
          'Ultra-wide 21:9 cinemascope aspect ratio.',
        ],
        whyItWorks: 'Temporal video models (Runway, Sora, Luma) rely on explicit motion vectors and atmospheric physics (drifting dust motes, rising steam) to maintain object permanence across frames.',
      },
    ],
    faqs: [
      {
        question: 'Why shouldn\'t I use words like "photorealistic", "4K", or "masterpiece"?',
        answer: 'In modern diffusion models like Midjourney v6.1 and Flux.1, words like "4K" or "photorealistic" are obsolete legacy baggage. The models are already trained on ultra-high-resolution images. Including generic adjectives wastes token attention and can actually bias the model toward spammy stock photography.',
      },
      {
        question: 'What does the --stylize parameter do in Midjourney?',
        answer: 'The `--s` or `--stylize` parameter (values from 0 to 1000, default 100) controls how heavily Midjourney applies its artistic aesthetic. Lower values (50-100) adhere strictly to your exact prompt words. Higher values (250-750) introduce lush, cinematic visual flourishes at the expense of prompt literalism.',
      },
      {
        question: 'How do camera lenses affect Midjourney outputs?',
        answer: 'Mentioning specific lenses changes the perspective geometry of the image. An "85mm f/1.4 lens" produces tight portrait compression with beautiful shallow depth of field (bokeh). A "24mm wide-angle lens" expands the field of view and introduces subtle dynamic barrel distortion suitable for landscapes and architecture.',
      },
      {
        question: 'Can these prompts be used for Runway Gen-3 and Sora video?',
        answer: 'Yes! Our visual builder includes temporal motion directions (pan, tilt, push-in, 24fps) that are directly recognized by cutting-edge video diffusion systems like Runway Gen-3 Alpha, Luma Dream Machine, and OpenAI Sora.',
      },
    ],
    relatedModels: [
      { name: 'Claude XML Prompt Generator', slug: 'claude-xml-prompt-generator', reason: 'Need technical code and text generation instead of images?' },
      { name: 'ChatGPT Markdown Builder', slug: 'chatgpt-markdown-prompt-generator', reason: 'Building structured marketing copy or creative stories?' },
      { name: 'Google Gemini Builder', slug: 'gemini-prompt-generator', reason: 'Analyzing image and video inputs with 1M+ multimodal context?' },
    ],
  },
  {
    slug: 'ollama-local-llm-prompt-generator',
    modelKey: 'Ollama',
    title: 'Local LLM Prompt Builder for Ollama & LM Studio',
    metaTitle: 'Local LLM Prompt Builder for Ollama & LM Studio | Free AI Prompt Gen',
    metaDescription: 'Free Local LLM Prompt Builder for Ollama and LM Studio. Optimize prompts with ChatML, Llama 3 special tokens, strict constraints, and low-latency instruction formats.',
    badge: '100% Private & Offline',
    provider: 'Local AI (Ollama, LM Studio, vLLM, Llama 3.3, Mistral, DeepSeek-R1 & Qwen 2.5)',
    recommendedSyntax: 'ChatML & Model-Native Special Tokens (<|system|>, <|user|>, [INST])',
    summary: 'Running open-weight models locally via Ollama, LM Studio, or vLLM offers complete data privacy and zero API costs, but quantized 4-bit and 8-bit GGUF models have lower tolerance for messy prompting. Our Local LLM Builder formats prompts with native chat templates (Llama 3 special tokens, Mistral [INST] tags, ChatML), strict role demarcation, and concise instructions to prevent runaway token loops and hallucination.',
    heroPitch: 'Zero telemetry, 100% private. Build precision prompts formatted for quantized local open-source models.',
    builderFields: [
      {
        key: 'templateFormat',
        label: 'Local Chat Template Format',
        placeholder: 'Select template...',
        helperText: 'Select your local model\'s native token template.',
        defaultValue: 'Llama3',
        type: 'select',
        options: [
          { label: 'Llama 3.x (<|start_header_id|>system / user)', value: 'Llama3' },
          { label: 'ChatML (<|im_start|>system / user)', value: 'ChatML' },
          { label: 'Mistral / Mixtral ([INST] ... [/INST])', value: 'Mistral' },
          { label: 'DeepSeek-R1 (### Reasoning & Instruction)', value: 'DeepSeek' },
        ],
      },
      {
        key: 'systemPrompt',
        label: 'System Prompt / Persona',
        placeholder: 'e.g. You are an expert local Linux system administrator and Bash scripting specialist...',
        helperText: 'Injected into the local model\'s system prompt boundary.',
        defaultValue: 'You are an expert Linux Systems Administrator and Rust CLI developer. You provide minimal, highly efficient solutions without conversational pleasantries.',
      },
      {
        key: 'userTask',
        label: 'User Task & Local Input',
        placeholder: 'e.g. Write a shell script to monitor directory size changes...',
        helperText: 'The core task or code execution request.',
        defaultValue: 'Write an asynchronous Rust utility using Tokio that monitors an incoming directory for new CSV files, validates their schema, and streams records into an SQLite database.',
      },
      {
        key: 'constraints',
        label: 'Strict Quantization Constraints',
        placeholder: 'e.g. Keep response under 400 tokens. Output valid Rust only...',
        helperText: 'Vital for smaller models (8B/14B) to prevent rambling and memory exhaustion.',
        defaultValue: '- Return ONLY compile-ready Rust code with necessary Cargo.toml dependencies in comments.\n- Zero conversational preamble or postscript.\n- Handle all errors with the anyhow crate without unwrap() calls.',
      },
    ],
    parameters: [
      { name: 'num_ctx (Context Window)', description: 'Set in your Modelfile (e.g. `PARAMETER num_ctx 8192`) to prevent GPU VRAM out-of-memory errors.', example: 'PARAMETER num_ctx 8192' },
      { name: 'temperature (0.0 - 1.0)', description: 'Keep low (0.1 - 0.3) for coding and deterministic data tasks on 8B models to eliminate hallucinations.', example: 'PARAMETER temperature 0.2' },
      { name: 'top_p & top_k', description: 'Top_p (0.9) and Top_k (40) constrain the token sampling pool, speeding up tokens/sec on consumer GPUs.', example: 'PARAMETER top_p 0.9' },
      { name: 'stop tokens', description: 'Explicit stop tokens prevent local models from hallucinating additional conversational turns.', example: 'PARAMETER stop "<|eot_id|>"' },
    ],
    promptRules: [
      {
        title: 'Respect the Native Token Delimiters',
        description: 'Quantized models like Llama-3.3-8B and Mistral-7B rely heavily on their exact tokenizer training tokens (`<|start_header_id|>`, `[INST]`). Mismatched templates cause massive quality degradation.',
      },
      {
        title: 'Lower the Temperature for Small Models',
        description: 'On 7B-14B local models, high temperatures (>0.7) quickly trigger token loops and logical contradictions. Keep temperature at 0.1 - 0.2 for code, sysadmin scripts, and data parsing.',
      },
      {
        title: 'Force Single-Turn Concise Output',
        description: 'Local consumer GPUs have limited memory bandwidth (tokens/sec). Instruct the model: "Answer with code only. No explanations unless requested." This saves VRAM and gives instant answers.',
      },
      {
        title: 'Manage the KV Cache (num_ctx)',
        description: 'Every token stored in the KV cache consumes VRAM. Don\'t set `num_ctx 128000` on an 8GB GPU; use realistic context limits (4096 or 8192) to maintain high token generation speeds.',
      },
    ],
    whenToUse: [
      'Confidential source code, proprietary IP, and internal company databases that cannot be sent to third-party cloud APIs.',
      'Offline field environments, airplanes, or air-gapped secure government/banking networks.',
      'High-volume local batch processing where cloud token billing would be cost-prohibitive.',
      'Rapid CLI scripting and desktop integration via Ollama and LM Studio.',
    ],
    whenToAvoid: [
      'Massive 1M+ token document synthesis requiring enterprise multi-GPU server clusters (use Gemini instead).',
      'Tasks that exceed the reasoning capabilities of consumer open-weight models (e.g. frontier-tier competitive math).',
    ],
    examples: [
      {
        title: 'Private Offline Bash Log Analyzer',
        category: 'SysAdmin & Linux',
        scenario: 'A DevOps engineer wants a quick Bash script to parse Nginx error logs on an air-gapped staging server without cloud AI access.',
        weakPrompt: 'How do I check my nginx error logs with bash script?',
        weakProblems: [
          '8B local models will ramble on with 5 different generic approaches.',
          'Missing error handling, log rotation support, and regex optimization.',
          'Wastes local GPU tokens on conversational filler.',
        ],
        strongPrompt: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>
You are an expert Linux System Administrator and Bash scripting specialist. You provide minimal, secure, POSIX-compliant scripts with zero conversational filler.<|eot_id|>
<|start_header_id|>user<|end_header_id|>
Write an optimized Bash one-liner / script to parse /var/log/nginx/error.log.
Task:
1. Extract the top 10 unique client IP addresses triggering upstream timeouts (504).
2. Resolve reverse DNS for each IP if available.
3. Output as a clean terminal table.

Constraints:
- Code only. No conversational introduction or wrap-up.
- Use native awk, sort, uniq, and xargs.<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>`,
        strongStrengths: [
          'Pre-formatted with native Llama 3 header tokens (`<|start_header_id|>`).',
          'Ends with `<|start_header_id|>assistant<|end_header_id|>` to immediately trigger local generation.',
          'Strict constraint: "Code only. No conversational introduction."',
        ],
        whyItWorks: 'Local quantized models immediately start producing shell code because the assistant turn is opened cleanly, saving memory and generation time.',
      },
      {
        title: 'Local Rust High-Throughput Directory Watcher',
        category: 'Systems Programming',
        scenario: 'A developer needs a local high-performance Rust service to ingest telemetry files into SQLite.',
        weakPrompt: 'Write a Rust program to watch a folder for files and put them in sqlite.',
        weakProblems: [
          '7B/8B models often introduce hallucinated crate APIs or unwrap() panics.',
          'No async runtime specification (Tokio vs. standard sync).',
          'Missing schema and error-handling guardrails.',
        ],
        strongPrompt: `<|im_start|>system
You are a Principal Systems Programmer specializing in idiomatic Rust and high-concurrency async services. You write memory-safe code adhering to Clippy standards with zero unwraps.<|im_end|>
<|im_start|>user
Write a complete, single-file Rust binary using Tokio, notify, and rusqlite.
Requirements:
1. Asynchronously watch a local directory (/tmp/telemetry_inbox) for newly created .json files.
2. Parse each incoming JSON payload (fields: timestamp: u64, device_id: String, metric_value: f64).
3. Insert records into a local SQLite table with a prepared transaction.
4. Delete the source JSON file upon successful database commit.

Constraints:
- Must use \`tokio::sync::mpsc\` to decouple file watching from database writes.
- Handle all I/O and JSON parsing errors using \`anyhow::Result\` without panicking.
- Provide the complete \`Cargo.toml\` dependencies at the top in a comment block.<|im_end|>
<|im_start|>assistant`,
        strongStrengths: [
          'Employs ChatML syntax (`<|im_start|>`) standard for Qwen 2.5 and Mistral GGUFs.',
          'Explicitly demands MPSC channel decoupling and anyhow error handling.',
          'Provides complete Cargo.toml dependencies in comments.',
        ],
        whyItWorks: 'Local models generate far more reliable Rust code when constrained to standard battle-tested crates (Tokio, Notify, Rusqlite, Anyhow).',
      },
      {
        title: 'Air-Gapped Patient Medical Record Summarizer',
        category: 'Healthcare & HIPAA',
        scenario: 'A hospital data analyst needs to extract medication dosages from clinical notes on a private offline workstation without internet access.',
        weakPrompt: 'Summarize this doctor note and list all the medications and doses.',
        weakProblems: [
          'Extreme risk of hallucinating dosages or drug names on local 8B models.',
          'Missing clinical verification structure.',
          'No warning flags for missing or ambiguous prescription data.',
        ],
        strongPrompt: `[INST] You are an offline Clinical Documentation Specialist operating on an air-gapped workstation.
Extreme precision rule: Extract ONLY medications and dosages explicitly stated in the clinical text. Do NOT calculate, convert, or infer any dosage. If an administration frequency is missing, mark as "Unspecified".

Clinical Note:
"""
[Insert Clinical Encounter Text Here]
"""

Task:
Extract all prescribed medications into a Markdown table with columns:
| Medication Name | Stated Dosage | Frequency / Route | Status (Current / Discontinued / New) | Quoted Evidence from Text |

Constraints:
- Absolute zero speculation.
- If no medications are mentioned, return "No medications identified in document."
- No external internet queries. [/INST]`,
        strongStrengths: [
          'Uses native Mistral `[INST]` delimiters.',
          'Enforces defensive zero-inference rule: "If an administration frequency is missing, mark as Unspecified".',
          'Demands verbatim quoted evidence for every extracted prescription.',
        ],
        whyItWorks: 'Forcing the local model to quote source evidence directly inside the table prevents statistical hallucinations on quantized weights.',
      },
    ],
    faqs: [
      {
        question: 'Why do local models need different prompts than cloud APIs?',
        answer: 'Most local models run on quantized weights (4-bit or 8-bit GGUF) on consumer GPUs with limited VRAM. They have less tolerance for long conversational preambles and can get stuck in repetition loops if chat template tokens (<|im_start|>, [INST]) are malformed.',
      },
      {
        question: 'How do I load these prompts into Ollama?',
        answer: 'You can use these prompts directly in your terminal (`ollama run llama3.3 "..."`), in your API calls (`http://localhost:11434/api/generate`), or paste them into local web UIs like Open WebUI, Enchanted, or LM Studio.',
      },
      {
        question: 'What is the best temperature setting for local models?',
        answer: 'For coding, system administration, and structured data extraction, set temperature low (0.1 - 0.3). This keeps the model deterministic and prevents hallucinated syntax on 8B and 14B parameter models.',
      },
      {
        question: 'What are stop tokens and why are they important in Ollama?',
        answer: 'Stop tokens tell the inference engine when to cease generating tokens. Without proper stop tokens (such as `<|eot_id|>` in Llama 3), a local model may continue generating artificial user questions and replying to itself indefinitely.',
      },
    ],
    relatedModels: [
      { name: 'Claude XML Generator', slug: 'claude-xml-prompt-generator', reason: 'Need enterprise-grade reasoning with Anthropic Claude?' },
      { name: 'ChatGPT Markdown Builder', slug: 'chatgpt-markdown-prompt-generator', reason: 'Building prompts for OpenAI GPT-4o or o1?' },
      { name: 'Google Gemini Builder', slug: 'gemini-prompt-generator', reason: 'Working with huge 1M+ token context windows?' },
    ],
  },
];
