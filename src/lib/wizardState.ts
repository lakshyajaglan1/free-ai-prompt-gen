// ── Wizard State Manager ──
// Central reactive state using CustomEvents on `document`.
// All components listen to `promptforge:statechange` and update their DOM.

import {
  GoalCategory,
  TargetModel,
  Framework,
  EMPTY_FIELDS,
  type PromptFields,
  type FieldKey,
} from './types';

export interface WizardState {
  category: GoalCategory;
  framework: Framework;
  targetModel: TargetModel;
  fields: PromptFields;
  assembledPrompt: string;
  refinedPrompt: string;
  isRefining: boolean;
  refineError: string;
}

const DEFAULT_STATE: WizardState = {
  category: GoalCategory.Writing,
  framework: Framework.RTF,
  targetModel: TargetModel.Generic,
  fields: { ...EMPTY_FIELDS },
  assembledPrompt: '',
  refinedPrompt: '',
  isRefining: false,
  refineError: '',
};

let _state: WizardState = { ...DEFAULT_STATE };

/** Get a snapshot of the current state */
export function getState(): Readonly<WizardState> {
  return _state;
}

/** Update state and dispatch change event */
export function updateState(partial: Partial<WizardState>): void {
  _state = { ..._state, ...partial };
  document.dispatchEvent(
    new CustomEvent('promptforge:statechange', {
      detail: { ..._state },
    })
  );
}

/** Update a single field value and dispatch */
export function updateField(key: FieldKey, value: string): void {
  const newFields = { ..._state.fields, [key]: value };
  updateState({ fields: newFields });
}

/** Reset fields (keep category/framework/model) */
export function resetFields(): void {
  updateState({
    fields: { ...EMPTY_FIELDS },
    assembledPrompt: '',
    refinedPrompt: '',
    refineError: '',
  });
}

/** Full reset to defaults */
export function resetAll(): void {
  _state = { ...DEFAULT_STATE, fields: { ...EMPTY_FIELDS } };
  document.dispatchEvent(
    new CustomEvent('promptforge:statechange', {
      detail: { ..._state },
    })
  );
}

/** Subscribe to state changes */
export function onStateChange(
  callback: (state: WizardState) => void
): () => void {
  const handler = (e: Event) => {
    callback((e as CustomEvent<WizardState>).detail);
  };
  document.addEventListener('promptforge:statechange', handler);
  return () => document.removeEventListener('promptforge:statechange', handler);
}

/** Generate a unique ID for saved prompts */
export function generateId(): string {
  return `pf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
