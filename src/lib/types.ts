// ── Prompt Forge Type Definitions ──

export enum GoalCategory {
  Writing = 'Writing',
  Coding = 'Coding',
  ImageGeneration = 'Image Generation',
  DataAnalysis = 'Data / Analysis',
  Research = 'Research',
  MarketingCopy = 'Marketing / Copy',
  Custom = 'Custom',
}

export enum TargetModel {
  ChatGPT = 'ChatGPT',
  Claude = 'Claude',
  Gemini = 'Gemini',
  Generic = 'Generic / Any',
}

export enum Framework {
  RTF = 'RTF',
  COSTAR = 'CO-STAR',
  TAG = 'TAG',
  APE = 'APE',
}

export interface PromptFields {
  role: string;
  context: string;
  task: string;
  outputFormat: string;
  tone: string;
  constraints: string;
  examples: string;
}

export const EMPTY_FIELDS: PromptFields = {
  role: '',
  context: '',
  task: '',
  outputFormat: '',
  tone: '',
  constraints: '',
  examples: '',
};

export interface SavedPrompt {
  id: string;
  title: string;
  category: GoalCategory;
  framework: Framework;
  targetModel: TargetModel;
  fields: PromptFields;
  assembledPrompt: string;
  timestamp: number;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: GoalCategory;
  fields: Partial<PromptFields>;
}

/** Field key names used across the wizard */
export type FieldKey = keyof PromptFields;

export const ALL_FIELD_KEYS: FieldKey[] = [
  'role',
  'context',
  'task',
  'outputFormat',
  'tone',
  'constraints',
  'examples',
];

/** Human-readable labels for each field */
export const FIELD_LABELS: Record<FieldKey, string> = {
  role: 'Role / Persona',
  context: 'Context / Background',
  task: 'Task',
  outputFormat: 'Output Format',
  tone: 'Tone / Style',
  constraints: 'Constraints',
  examples: 'Examples (Few-Shot)',
};
