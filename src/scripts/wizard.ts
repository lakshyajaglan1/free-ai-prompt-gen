  import { GoalCategory, TargetModel, Framework, EMPTY_FIELDS, FIELD_LABELS, ALL_FIELD_KEYS, type FieldKey, type SavedPrompt } from '../lib/types';
  import { FRAMEWORK_META, getFrameworkFieldLabel, getFieldsForFramework } from '../lib/frameworks';
  import { assemblePrompt } from '../lib/promptAssembler';
  import { getHint, getTooltip } from '../lib/fieldHints';
  import { getWhyNotes } from '../lib/whyThisWorks';
  import { getTemplatesForCategory, PROMPT_TEMPLATES } from '../lib/promptTemplates';
  import type { PromptTemplate } from '../lib/types';
  import { BEFORE_AFTER_EXAMPLES } from '../lib/beforeAfterExamples';
  import { scorePrompt } from '../lib/promptScoring';
  import { enhancePromptLocally } from '../lib/promptEnhancer';
  import {
    getSavedPrompts,
    savePrompt,
    deletePrompt,
    clearPromptHistory,
    getApiKey,
    saveApiKey,
    clearApiKey,
    clearAllData,
    getTheme,
    saveTheme,
    getAIProvider,
    saveAIProvider,
    getAIModel,
    saveAIModel,
    getCustomEndpoint,
    saveCustomEndpoint,
    getProviderConfig,
    saveProviderConfig,
  } from '../lib/storage';
  import { refinePrompt, ProviderError } from '../lib/geminiRefine';
  import { PROVIDER_INFO, type ProviderType, refinePromptWithAI } from '../lib/aiProviders';

document.addEventListener('DOMContentLoaded', () => {
  // ── State ──
  let state = {
    category: GoalCategory.Writing,
    framework: Framework.RTF,
    targetModel: TargetModel.Generic,
    fields: { ...EMPTY_FIELDS },
  };

  // ── Helper: generate unique ID ──
  function genId(): string {
    return `pf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  // ══════════════════════════════════════
  // MOBILE VIEW SWITCHER (Form vs Preview)
  // ══════════════════════════════════════
  const btnTabForm = document.getElementById('btn-tab-form');
  const btnTabPreview = document.getElementById('btn-tab-preview');
  const wizardLeftCol = document.getElementById('wizard-left-col');
  const wizardRightCol = document.getElementById('wizard-right-col');

  if (btnTabForm && btnTabPreview && wizardLeftCol && wizardRightCol) {
    btnTabForm.addEventListener('click', () => {
      btnTabForm.className = 'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all text-center bg-ink text-on-primary shadow-sm';
      btnTabPreview.className = 'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all text-center text-body hover:text-ink';
      wizardLeftCol.classList.remove('hidden');
      wizardRightCol.classList.add('hidden');
    });

    btnTabPreview.addEventListener('click', () => {
      btnTabPreview.className = 'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all text-center bg-ink text-on-primary shadow-sm';
      btnTabForm.className = 'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all text-center text-body hover:text-ink';
      wizardLeftCol.classList.add('hidden');
      wizardRightCol.classList.remove('hidden');
    });

    const handleWindowResize = () => {
      if (window.innerWidth >= 960) {
        wizardLeftCol.classList.remove('hidden');
        wizardRightCol.classList.remove('hidden');
      }
    };
    window.addEventListener('resize', handleWindowResize);
    handleWindowResize();
  }

  // ══════════════════════════════════════
  // CATEGORY PICKER
  // ══════════════════════════════════════
  const categoryCards = document.querySelectorAll<HTMLElement>('.category-card');
  categoryCards.forEach((card) => {
    card.addEventListener('click', () => {
      const cat = card.dataset.category as string;
      state.category = cat as GoalCategory;
      categoryCards.forEach((c) => (c.dataset.active = 'false'));
      card.dataset.active = 'true';
      updateForm();
      updateBeforeAfter();
      updateStepProgress(2);
    });
  });

  // ══════════════════════════════════════
  // FRAMEWORK PICKER
  // ══════════════════════════════════════
  const frameworkTabs = document.querySelectorAll<HTMLElement>('.framework-tab');
  const frameworkDesc = document.getElementById('framework-description')!;
  frameworkTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const fw = tab.dataset.framework as Framework;
      state.framework = fw;
      frameworkTabs.forEach((t) => (t.dataset.active = 'false'));
      tab.dataset.active = 'true';
      frameworkDesc.textContent = FRAMEWORK_META[fw].description;
      updateForm();
      reassemble();
      updateStepProgress(3);
    });
  });

  // ══════════════════════════════════════
  // MODEL PICKER
  // ══════════════════════════════════════
  const modelTabs = document.querySelectorAll<HTMLElement>('.model-tab');
  const modelDesc = document.getElementById('model-description')!;
  const modelBadge = document.getElementById('preview-model-badge')!;

  const MODEL_DESCRIPTIONS: Record<string, string> = {
    'Generic / Any': 'Clean labeled sections — works well with any AI model.',
    'ChatGPT': "Formatted with Markdown headers (## Role, ## Task) — ChatGPT's preferred structure.",
    'Claude': 'Structured with XML tags (<role>, <task>) — Claude responds exceptionally well to this format.',
    'Gemini': 'Bold-labeled sections (**Role:** ...) — Gemini handles this structured markdown cleanly.',
    'Llama': 'Formatted with Meta Llama <|system|> and <|user|> prompt tokens.',
    'Mistral': 'Formatted with Mistral [INST] instruction tags for open-weights models.',
    'DeepSeek': 'Markdown headers with explicit step-by-step reasoning instructions.',
  };

  modelTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const model = tab.dataset.model as string;
      state.targetModel = model as TargetModel;
      modelTabs.forEach((t) => (t.dataset.active = 'false'));
      tab.dataset.active = 'true';
      modelDesc.textContent = MODEL_DESCRIPTIONS[model] ?? '';
      modelBadge.textContent = model;
      reassemble();
    });
  });

  // ══════════════════════════════════════
  // PROMPT FORM — Dynamic fields
  // ══════════════════════════════════════
  const formFields = document.querySelectorAll<HTMLElement>('.form-field');
  const textareas = document.querySelectorAll<HTMLTextAreaElement>('.form-textarea[data-field-key]');
  const tooltipTriggers = document.querySelectorAll<HTMLElement>('.field-tooltip');

  function updateForm() {
    const visibleFields = getFieldsForFramework(state.framework);

    formFields.forEach((field) => {
      const key = field.dataset.field as FieldKey;
      if (visibleFields.includes(key)) {
        field.style.display = '';
        field.style.animation = 'fadeIn 0.25s ease';
      } else {
        field.style.display = 'none';
      }
    });

    // Update labels and placeholders per framework × category
    textareas.forEach((ta) => {
      const key = ta.dataset.fieldKey as FieldKey;
      const label = ta.closest('.form-field')?.querySelector('label');
      if (label) {
        label.textContent = getFrameworkFieldLabel(state.framework, key, FIELD_LABELS[key]);
      }
      const hint = getHint(key, state.category);
      ta.placeholder = hint.placeholder;
    });
  }

  // Tooltip toggle on click
  tooltipTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const key = trigger.dataset.fieldKey as FieldKey;
      const content = document.querySelector<HTMLElement>(`[data-tooltip-for="${key}"]`);
      if (!content) return;
      if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        content.textContent = getTooltip(key);
      } else {
        content.classList.add('hidden');
      }
    });
  });

  // Real-time input → reassemble
  textareas.forEach((ta) => {
    ta.addEventListener('input', () => {
      const key = ta.dataset.fieldKey as FieldKey;
      state.fields[key] = ta.value;
      reassemble();
      updateStepProgress(4);
    });
  });

  // ══════════════════════════════════════
  // ONE-CLICK AUTO ENHANCE
  // ══════════════════════════════════════
  const btnEnhance = document.getElementById('btn-enhance-prompt');
  const enhanceFeedbackBadge = document.getElementById('enhance-feedback-badge');
  const enhanceFeedbackText = document.getElementById('enhance-feedback-text');

  btnEnhance?.addEventListener('click', () => {
    const result = enhancePromptLocally(state.fields, state.category, state.framework);
    state.fields = { ...result.fields };
    textareas.forEach((ta) => {
      const key = ta.dataset.fieldKey as FieldKey;
      ta.value = state.fields[key] ?? '';
    });
    reassemble();

    if (enhanceFeedbackBadge && enhanceFeedbackText) {
      enhanceFeedbackText.textContent = `✨ Enhanced: ${result.changesMade.slice(0, 2).join(', ')}`;
      enhanceFeedbackBadge.classList.remove('hidden');
      setTimeout(() => {
        enhanceFeedbackBadge.classList.add('hidden');
      }, 4000);
    }
  });

  // ══════════════════════════════════════
  // STEP PROGRESS INDICATOR
  // ══════════════════════════════════════
  function updateStepProgress(activeStep: number) {
    const stepItems = document.querySelectorAll<HTMLElement>('.step-item');
    stepItems.forEach((item) => {
      const stepNum = parseInt(item.dataset.step || '1', 10);
      const badge = item.querySelector('.step-badge') as HTMLElement;
      const label = item.querySelector('span') as HTMLElement;

      if (stepNum < activeStep) {
        item.dataset.state = 'completed';
        if (badge) {
          badge.className = 'w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-medium border border-link bg-link text-on-primary step-badge transition-all';
          badge.textContent = '✓';
        }
      } else if (stepNum === activeStep) {
        item.dataset.state = 'active';
        if (badge) {
          badge.className = 'w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-medium border border-ink bg-ink text-on-primary step-badge transition-all';
          badge.textContent = stepNum.toString();
        }
        if (label) {
          label.className = 'body-sm-strong text-ink hidden sm:inline';
        }
      } else {
        item.dataset.state = 'pending';
        if (badge) {
          badge.className = 'w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-medium border border-hairline bg-canvas-soft text-mute step-badge transition-all';
          badge.textContent = stepNum.toString();
        }
        if (label) {
          label.className = 'body-sm text-mute hidden sm:inline';
        }
      }
    });
  }

  // ══════════════════════════════════════
  // PROMPT ASSEMBLY, PREVIEW, SCORE & STATS
  // ══════════════════════════════════════
  const previewEmpty = document.getElementById('preview-empty')!;
  const previewContent = document.getElementById('preview-content')!;
  const previewText = document.getElementById('preview-text')!;
  const btnCopy = document.getElementById('btn-copy-prompt')! as HTMLButtonElement;
  const btnDownloadTxt = document.getElementById('btn-download-txt')! as HTMLButtonElement;
  const btnDownloadMd = document.getElementById('btn-download-md')! as HTMLButtonElement;
  const btnShare = document.getElementById('btn-share-prompt')! as HTMLButtonElement;
  const btnSave = document.getElementById('btn-save-prompt')! as HTMLButtonElement;
  const copyLabel = document.getElementById('copy-label')!;
  const shareLabel = document.getElementById('share-label')!;

  // Score UI Elements
  const scoreProgressFill = document.getElementById('score-progress-fill') as HTMLElement;
  const scoreGradeBadge = document.getElementById('score-grade-badge') as HTMLElement;
  const scoreLabel = document.getElementById('score-label') as HTMLElement;
  const scoreNumber = document.getElementById('score-number') as HTMLElement;
  const scoreTipsList = document.getElementById('score-tips-list') as HTMLElement;

  // Stats UI Elements
  const statWords = document.getElementById('stat-words') as HTMLElement;
  const statChars = document.getElementById('stat-chars') as HTMLElement;
  const statTokensBadge = document.getElementById('stat-tokens-badge') as HTMLElement;

  function reassemble() {
    const prompt = assemblePrompt(state.fields, state.framework, state.targetModel);

    if (prompt.trim()) {
      previewEmpty.classList.add('hidden');
      previewContent.classList.remove('hidden');
      previewText.textContent = prompt;
      btnCopy.disabled = false;
      if (btnDownloadTxt) btnDownloadTxt.disabled = false;
      if (btnDownloadMd) btnDownloadMd.disabled = false;
      if (btnShare) btnShare.disabled = false;
      btnSave.disabled = false;
    } else {
      previewEmpty.classList.remove('hidden');
      previewContent.classList.add('hidden');
      previewText.textContent = '';
      btnCopy.disabled = true;
      if (btnDownloadTxt) btnDownloadTxt.disabled = true;
      if (btnDownloadMd) btnDownloadMd.disabled = true;
      if (btnShare) btnShare.disabled = true;
      btnSave.disabled = true;
    }

    updateScoreAndStats(prompt);
    updateWhyPanel();
    updateRefineButton();
  }

  function updateScoreAndStats(prompt: string) {
    // 1. Scoring
    const scoreRes = scorePrompt(state.fields, state.framework);

    if (scoreProgressFill) {
      scoreProgressFill.style.width = `${scoreRes.score}%`;
      if (scoreRes.score >= 75) {
        scoreProgressFill.style.background = 'linear-gradient(90deg, #50e3c2 0%, #0070f3 100%)';
      } else if (scoreRes.score >= 40) {
        scoreProgressFill.style.background = 'linear-gradient(90deg, #f5a623 0%, #0070f3 100%)';
      } else {
        scoreProgressFill.style.background = 'linear-gradient(90deg, #ee0000 0%, #f5a623 100%)';
      }
    }

    if (scoreGradeBadge) scoreGradeBadge.textContent = scoreRes.grade;
    if (scoreLabel) scoreLabel.textContent = scoreRes.label;
    if (scoreNumber) scoreNumber.textContent = `${scoreRes.score}/100`;

    const breakdownMax = { completeness: 35, specificity: 30, structure: 20, constraints: 15 } as const;
    (Object.keys(breakdownMax) as Array<keyof typeof breakdownMax>).forEach((dimension) => {
      const score = scoreRes.breakdown[dimension];
      const max = breakdownMax[dimension];
      const percentage = (score / max) * 100;
      const fill = document.getElementById(`breakdown-${dimension}-fill`) as HTMLElement | null;
      const label = document.getElementById(`breakdown-${dimension}-score`);
      if (fill) {
        fill.style.width = `${percentage}%`;
        fill.style.backgroundColor = percentage > 70 ? '#16a34a' : percentage >= 40 ? '#f5a623' : '#ee0000';
      }
      if (label) label.textContent = `${score}/${max}`;
    });
    document.getElementById('score-breakdown')?.classList.toggle('hidden', !state.fields.task.trim());

    if (scoreTipsList) {
      if (scoreRes.tips.length > 0) {
        scoreTipsList.innerHTML = scoreRes.tips
          .map((tip) => `<li class="caption text-body flex items-start gap-2"><span class="text-link">💡</span>${tip}</li>`)
          .join('');
      } else {
        scoreTipsList.innerHTML = `<li class="caption text-success flex items-start gap-2"><span>✅</span> Prompt looks highly structured and complete!</li>`;
      }
    }

    // 2. Stats
    const charCount = prompt.length;
    const wordCount = prompt.trim() ? prompt.trim().split(/\s+/).length : 0;
    const estTokens = Math.ceil(charCount / 4.2);

    if (statWords) statWords.textContent = wordCount.toString();
    if (statChars) statChars.textContent = charCount.toString();
    if (statTokensBadge) statTokensBadge.textContent = `~${estTokens} Tokens`;
  }

  // Copy
  btnCopy.addEventListener('click', async () => {
    const text = previewText.textContent ?? '';
    try {
      await navigator.clipboard.writeText(text);
      copyLabel.textContent = 'Copied!';
      setTimeout(() => (copyLabel.textContent = 'Copy'), 1500);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      copyLabel.textContent = 'Copied!';
      setTimeout(() => (copyLabel.textContent = 'Copy'), 1500);
    }
  });

  // Download .txt
  if (btnDownloadTxt) {
    btnDownloadTxt.addEventListener('click', () => {
      const text = previewText.textContent ?? '';
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prompt-forge-${state.category.toLowerCase().replace(/\s+/g, '-')}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // Download .md
  if (btnDownloadMd) {
    btnDownloadMd.addEventListener('click', () => {
      const text = previewText.textContent ?? '';
      const mdContent = `# AI Prompt: ${state.fields.task.slice(0, 40) || state.category}\n\n*Target Model:* ${state.targetModel}\n*Framework:* ${state.framework}\n*Category:* ${state.category}\n\n---\n\n${text}`;
      const blob = new Blob([mdContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prompt-${state.category.toLowerCase().replace(/\s+/g, '-')}.md`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // Share Link
  if (btnShare) {
    btnShare.addEventListener('click', async () => {
      const params = new URLSearchParams();
      params.set('cat', state.category);
      params.set('fw', state.framework);
      params.set('model', state.targetModel);
      if (state.fields.task) params.set('task', state.fields.task);
      if (state.fields.role) params.set('role', state.fields.role);
      if (state.fields.context) params.set('context', state.fields.context);
      if (state.fields.outputFormat) params.set('fmt', state.fields.outputFormat);
      if (state.fields.constraints) params.set('rules', state.fields.constraints);

      const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}#wizard`;

      try {
        await navigator.clipboard.writeText(shareUrl);
        if (shareLabel) shareLabel.textContent = 'Copied Link!';
        setTimeout(() => { if (shareLabel) shareLabel.textContent = 'Share'; }, 2000);
      } catch {
        prompt('Copy this shareable link:', shareUrl);
      }
    });
  }

  // Save
  btnSave.addEventListener('click', () => {
    const prompt = previewText.textContent ?? '';
    if (!prompt.trim()) return;

    const saved: SavedPrompt = {
      id: genId(),
      title: state.fields.task.slice(0, 60) || state.category,
      category: state.category,
      framework: state.framework,
      targetModel: state.targetModel,
      fields: { ...state.fields },
      assembledPrompt: prompt,
      timestamp: Date.now(),
    };
    savePrompt(saved);

    // Visual feedback
    btnSave.style.background = 'var(--color-cyan-deep)';
    setTimeout(() => {
      btnSave.style.background = '';
    }, 1000);
  });

  // ══════════════════════════════════════
  // WHY THIS WORKS PANEL
  // ══════════════════════════════════════
  const whyList = document.getElementById('why-notes-list')!;

  function updateWhyPanel() {
    const notes = getWhyNotes(state.fields, state.framework);
    whyList.innerHTML = notes
      .map(
        (n) => `<li class="why-note flex items-start gap-2">
          <span class="why-icon" style="flex-shrink: 0;">${n.icon}</span>
          <span class="caption text-body">${n.text}</span>
        </li>`
      )
      .join('');
  }

  // ══════════════════════════════════════
  // BEFORE / AFTER TOGGLE
  // ══════════════════════════════════════
  const baTabs = document.querySelectorAll<HTMLElement>('.ba-tab');
  const baWeakView = document.getElementById('ba-weak-view')!;
  const baStrongView = document.getElementById('ba-strong-view')!;

  baTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const view = tab.dataset.ba;
      baTabs.forEach((t) => (t.dataset.active = 'false'));
      tab.dataset.active = 'true';
      if (view === 'weak') {
        baWeakView.classList.remove('hidden');
        baStrongView.classList.add('hidden');
      } else {
        baWeakView.classList.add('hidden');
        baStrongView.classList.remove('hidden');
      }
    });
  });

  function updateBeforeAfter() {
    const example = BEFORE_AFTER_EXAMPLES[state.category];
    if (!example) return;

    document.getElementById('ba-weak-prompt')!.textContent = example.weak.prompt;
    document.getElementById('ba-strong-prompt')!.textContent = example.strong.prompt;

    document.getElementById('ba-weak-problems')!.innerHTML = example.weak.problems
      .map(
        (p) =>
          `<li class="flex items-start gap-2"><span class="text-error" style="flex-shrink: 0;">✗</span><span class="caption text-body">${p}</span></li>`
      )
      .join('');

    document.getElementById('ba-strong-strengths')!.innerHTML = example.strong.strengths
      .map(
        (s) =>
          `<li class="flex items-start gap-2"><span class="text-cyan-deep" style="flex-shrink: 0;">✓</span><span class="caption text-body">${s}</span></li>`
      )
      .join('');
  }

  // ══════════════════════════════════════
  // HISTORY DRAWER
  // ══════════════════════════════════════
  const historyDrawer = document.getElementById('history-drawer')!;
  const historyBackdrop = document.getElementById('history-backdrop')!;
  const historyList = document.getElementById('history-list')!;
  const historyEmpty = document.getElementById('history-empty')!;

  function openHistory() {
    document.body.style.overflow = 'hidden';
    renderHistoryList();
    historyDrawer.classList.remove('hidden');
    historyBackdrop.classList.remove('hidden');
    historyDrawer.style.animation = 'slideInRight 0.25s ease';
  }

  function closeHistory() {
    document.body.style.overflow = '';
    historyDrawer.style.animation = 'slideOutRight 0.2s ease forwards';
    setTimeout(() => {
      historyDrawer.classList.add('hidden');
      historyBackdrop.classList.add('hidden');
    }, 200);
  }

  function renderHistoryList() {
    const prompts = getSavedPrompts();
    if (prompts.length === 0) {
      historyList.classList.add('hidden');
      historyEmpty.classList.remove('hidden');
      return;
    }

    historyEmpty.classList.add('hidden');
    historyList.classList.remove('hidden');
    historyList.innerHTML = prompts
      .map(
        (p) => `
        <div class="card mb-2 cursor-pointer history-item" data-prompt-id="${p.id}" style="padding: var(--sp-sm) var(--sp-md);">
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1 min-w-0">
              <p class="body-sm-strong text-ink truncate">${escapeHtml(p.title)}</p>
              <div class="flex items-center gap-2 mt-1">
                <span class="badge" style="font-size: 10px; padding: 1px 6px;">${escapeHtml(p.category)}</span>
                <span class="caption text-mute">${timeAgo(p.timestamp)}</span>
              </div>
            </div>
            <button class="btn-icon history-delete" data-delete-id="${p.id}" aria-label="Delete" style="width: 28px; height: 28px; flex-shrink: 0;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>`
      )
      .join('');

    // Wire click-to-load
    historyList.querySelectorAll('.history-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).closest('.history-delete')) return;
        const id = (item as HTMLElement).dataset.promptId!;
        const prompt = prompts.find((p) => p.id === id);
        if (prompt) loadSavedPrompt(prompt);
        closeHistory();
      });
    });

    // Wire delete
    historyList.querySelectorAll('.history-delete').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = (btn as HTMLElement).dataset.deleteId!;
        deletePrompt(id);
        renderHistoryList();
      });
    });
  }

  function loadSavedPrompt(p: SavedPrompt) {
    // Set category
    state.category = p.category;
    categoryCards.forEach((c) => (c.dataset.active = c.dataset.category === p.category ? 'true' : 'false'));

    // Set framework
    state.framework = p.framework;
    frameworkTabs.forEach((t) => (t.dataset.active = t.dataset.framework === p.framework ? 'true' : 'false'));
    frameworkDesc.textContent = FRAMEWORK_META[p.framework].description;

    // Set model
    state.targetModel = p.targetModel;
    modelTabs.forEach((t) => (t.dataset.active = t.dataset.model === p.targetModel ? 'true' : 'false'));
    modelDesc.textContent = MODEL_DESCRIPTIONS[p.targetModel] ?? '';
    modelBadge.textContent = p.targetModel;

    // Set fields
    state.fields = { ...p.fields };
    textareas.forEach((ta) => {
      const key = ta.dataset.fieldKey as FieldKey;
      ta.value = state.fields[key] ?? '';
    });

    updateForm();
    reassemble();
    updateBeforeAfter();

    // Scroll to wizard
    document.getElementById('wizard')?.scrollIntoView({ behavior: 'smooth' });
  }

  document.getElementById('btn-history')!.addEventListener('click', openHistory);
  document.getElementById('btn-close-history')!.addEventListener('click', closeHistory);
  historyBackdrop.addEventListener('click', closeHistory);
  document.getElementById('btn-clear-history')!.addEventListener('click', () => {
    clearPromptHistory();
    renderHistoryList();
  });

  // ══════════════════════════════════════
  // TEMPLATE LIBRARY MODAL WITH SEARCH
  // ══════════════════════════════════════
  const templateModal = document.getElementById('template-modal')!;
  const templateBackdrop = document.getElementById('template-backdrop')!;
  const templateList = document.getElementById('template-list')!;
  const templateSearchInput = document.getElementById('template-search-input') as HTMLInputElement;

  function openTemplates() {
    document.body.style.overflow = 'hidden';
    if (templateSearchInput) templateSearchInput.value = '';
    renderTemplateList();
    templateModal.classList.remove('hidden');
    templateBackdrop.classList.remove('hidden');
  }

  function closeTemplates() {
    document.body.style.overflow = '';
    templateModal.classList.add('hidden');
    templateBackdrop.classList.add('hidden');
  }

  function renderTemplateList(query: string = '') {
    let templates = PROMPT_TEMPLATES;
    const cleanQuery = query.toLowerCase().trim();

    if (cleanQuery) {
      templates = templates.filter(
        (t) =>
          t.name.toLowerCase().includes(cleanQuery) ||
          t.description.toLowerCase().includes(cleanQuery) ||
          t.category.toLowerCase().includes(cleanQuery)
      );
    } else {
      templates = getTemplatesForCategory(state.category);
    }

    if (templates.length === 0) {
      templateList.innerHTML = `<div class="text-center py-8 text-mute"><p class="body-sm">No templates found matching "${escapeHtml(query)}"</p></div>`;
      return;
    }

    templateList.innerHTML = `
      <p class="caption text-mute mb-2">Showing <strong>${templates.length}</strong> template(s)</p>
      ${templates
        .map(
          (t) => `
          <div class="card border border-hairline hover:border-hairline-strong transition-all duration-150 template-item cursor-pointer p-4 bg-canvas flex items-center justify-between gap-4 rounded-lg shadow-sm" data-template-id="${t.id}">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <p class="body-sm-strong text-ink truncate">${escapeHtml(t.name)}</p>
                <span class="badge font-mono text-[10px] px-2 py-0.5">${escapeHtml(t.category)}</span>
              </div>
              <p class="caption text-body line-clamp-2">${escapeHtml(t.description)}</p>
            </div>
            <button type="button" class="btn-secondary-sm shrink-0 font-medium">Use</button>
          </div>`
        )
        .join('')}
    `;

    templateList.querySelectorAll('.template-item').forEach((item) => {
      item.addEventListener('click', () => {
        const id = (item as HTMLElement).dataset.templateId!;
        const template = PROMPT_TEMPLATES.find((t) => t.id === id);
        if (template) loadTemplate(template);
        closeTemplates();
      });
    });
  }

  templateSearchInput?.addEventListener('input', (e) => {
    renderTemplateList((e.target as HTMLInputElement).value);
  });

  function loadTemplate(t: PromptTemplate) {
    // Reset fields then apply template
    state.fields = { ...EMPTY_FIELDS };
    for (const [key, value] of Object.entries(t.fields)) {
      if (value) (state.fields as Record<string, string>)[key] = value;
    }
    textareas.forEach((ta) => {
      const key = ta.dataset.fieldKey as FieldKey;
      ta.value = state.fields[key] ?? '';
    });
    updateForm();
    reassemble();
  }

  document.getElementById('btn-load-template')!.addEventListener('click', openTemplates);
  document.getElementById('btn-close-templates')!.addEventListener('click', closeTemplates);
  templateBackdrop.addEventListener('click', closeTemplates);
  document.querySelectorAll('#desktop-nav-links a, #mobile-menu a').forEach((link) => {
    link.addEventListener('click', closeTemplates);
  });

  // Reset fields button
  document.getElementById('btn-reset-fields')!.addEventListener('click', () => {
    state.fields = { ...EMPTY_FIELDS };
    textareas.forEach((ta) => (ta.value = ''));
    reassemble();
  });

  // ══════════════════════════════════════
  // MULTI-PROVIDER AI SETTINGS MODAL
  // ══════════════════════════════════════
  const settingsModal = document.getElementById('settings-modal')!;
  const settingsBackdrop = document.getElementById('settings-backdrop')!;
  const selectProvider = document.getElementById('select-ai-provider') as HTMLSelectElement;
  const inputModel = document.getElementById('input-ai-model') as HTMLInputElement;
  const inputApiKey = document.getElementById('input-api-key') as HTMLInputElement;
  const keyInputContainer = document.getElementById('key-input-container')!;
  const keyGetLink = document.getElementById('key-get-link') as HTMLAnchorElement;
  const inputEndpoint = document.getElementById('input-custom-endpoint') as HTMLInputElement;
  const endpointContainer = document.getElementById('endpoint-input-container')!;

  const providerCardIcon = document.getElementById('provider-card-icon')!;
  const providerCardName = document.getElementById('provider-card-name')!;
  const providerCardBadge = document.getElementById('provider-card-badge')!;
  const providerCardDocs = document.getElementById('provider-card-docs') as HTMLAnchorElement;
  const providerCardDesc = document.getElementById('provider-card-desc')!;
  const providerStatusDot = document.getElementById('provider-status-dot')!;
  const providerStatusText = document.getElementById('provider-status-text')!;
  const modelPillsContainer = document.getElementById('model-pills-container')!;

  const btnSaveConfig = document.getElementById('btn-save-key')!;
  const btnTestConn = document.getElementById('btn-test-connection')!;
  const testSpinner = document.getElementById('test-spinner')!;
  const testBtnLabel = document.getElementById('test-btn-label')!;
  const settingsFeedback = document.getElementById('settings-feedback')!;
  const settingsFeedbackIcon = document.getElementById('settings-feedback-icon')!;
  const settingsFeedbackText = document.getElementById('settings-feedback-text')!;
  const btnClearKey = document.getElementById('btn-clear-key')!;
  const btnToggleVis = document.getElementById('btn-toggle-key-visibility')!;
  const iconEye = document.getElementById('icon-eye')!;
  const iconEyeOff = document.getElementById('icon-eye-off')!;

  function updateProviderUI(pType: ProviderType) {
    const info = PROVIDER_INFO[pType] || PROVIDER_INFO.gemini;

    providerCardIcon.textContent = info.icon;
    providerCardName.textContent = info.name;
    providerCardDesc.textContent = info.description;
    providerCardDocs.href = info.docs;

    if (info.freeAvailable) {
      providerCardBadge.classList.remove('hidden');
      providerCardBadge.textContent = pType === 'local' ? 'Local / Offline' : 'Free Tier Available';
    } else {
      providerCardBadge.classList.add('hidden');
    }

    if (info.requiresApiKey || pType === 'local') {
      keyInputContainer.classList.remove('hidden');
      inputApiKey.placeholder =
        pType === 'local'
          ? 'Optional (Bearer token if required by LM Studio / vLLM)'
          : info.keyPlaceholder;
      if (info.keyHelpUrl && pType !== 'local') {
        keyGetLink.href = info.keyHelpUrl;
        keyGetLink.classList.remove('hidden');
      } else {
        keyGetLink.classList.add('hidden');
      }
    } else {
      keyInputContainer.classList.add('hidden');
    }

    if (pType === 'local') {
      endpointContainer.classList.remove('hidden');
      inputEndpoint.placeholder = 'http://localhost:11434/api/generate';
    } else {
      endpointContainer.classList.add('hidden');
    }

    // Model pills
    modelPillsContainer.innerHTML = '';
    info.commonModels.forEach((m) => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'badge cursor-pointer hover:border-hairline-strong transition-colors';
      pill.style.fontSize = '11px';
      pill.style.padding = '2px 8px';
      pill.textContent = m;
      pill.addEventListener('click', () => {
        inputModel.value = m;
      });
      modelPillsContainer.appendChild(pill);
    });
  }

  function refreshSettingsUI() {
    const config = getProviderConfig();
    selectProvider.value = config.provider;
    updateProviderUI(config.provider);

    inputModel.value = config.model;
    inputEndpoint.value = config.customEndpoint || '';

    const currentKey = getApiKey();
    if (currentKey) {
      inputApiKey.value = '';
      inputApiKey.placeholder = `••••••••${currentKey.slice(-4)}`;
    } else if (config.provider === 'local') {
      inputApiKey.value = '';
      inputApiKey.placeholder = 'Optional (Bearer token if required by LM Studio / vLLM)';
    } else {
      inputApiKey.value = '';
    }

    const isConfigured = config.provider === 'local' || !!currentKey;
    if (isConfigured) {
      providerStatusDot.style.background = 'var(--color-cyan-deep)';
      providerStatusText.textContent =
        config.provider === 'local'
          ? currentKey
            ? `Configured (Local LLM with key …${currentKey.slice(-4)})`
            : 'Configured (Local LLM)'
          : `Configured (Key ending in …${currentKey.slice(-4)})`;
    } else {
      providerStatusDot.style.background = 'var(--color-hairline-strong)';
      providerStatusText.textContent = 'Not Configured';
    }

    settingsFeedback.classList.add('hidden');
    updateRefineButton();
  }

  selectProvider.addEventListener('change', () => {
    const pType = selectProvider.value as ProviderType;
    updateProviderUI(pType);
    inputModel.value = PROVIDER_INFO[pType].defaultModel;
    if (pType === 'local') {
      inputEndpoint.value = 'http://localhost:11434/api/generate';
    }
  });

  function openSettings() {
    document.body.style.overflow = 'hidden';
    settingsModal.classList.remove('hidden');
    settingsBackdrop.classList.remove('hidden');
    refreshSettingsUI();
  }

  function closeSettings() {
    document.body.style.overflow = '';
    settingsModal.classList.add('hidden');
    settingsBackdrop.classList.add('hidden');
  }

  document.getElementById('btn-settings')!.addEventListener('click', openSettings);
  document.getElementById('btn-close-settings')!.addEventListener('click', closeSettings);
  settingsBackdrop.addEventListener('click', closeSettings);

  btnSaveConfig.addEventListener('click', () => {
    const provider = selectProvider.value as ProviderType;
    const model = inputModel.value.trim() || PROVIDER_INFO[provider].defaultModel;
    const typedKey = inputApiKey.value.trim();
    const endpoint = inputEndpoint.value.trim();

    saveAIProvider(provider);
    saveAIModel(model);
    if (typedKey) {
      saveApiKey(typedKey);
    }
    if (endpoint) {
      saveCustomEndpoint(endpoint);
    } else if (provider === 'local') {
      saveCustomEndpoint('http://localhost:11434/api/generate');
    }

    settingsFeedback.classList.remove('hidden');
    settingsFeedback.style.background = 'var(--color-link-bg-soft)';
    settingsFeedbackIcon.textContent = '✅';
    settingsFeedbackText.textContent = 'Provider settings saved successfully!';
    settingsFeedbackText.style.color = 'var(--color-link-deep)';

    refreshSettingsUI();
  });

  btnTestConn.addEventListener('click', async () => {
    const provider = selectProvider.value as ProviderType;
    const model = inputModel.value.trim() || PROVIDER_INFO[provider].defaultModel;
    const typedKey = inputApiKey.value.trim() || getApiKey();
    const endpoint =
      inputEndpoint.value.trim() || (provider === 'local' ? 'http://localhost:11434/api/generate' : undefined);

    if (provider !== 'local' && !typedKey) {
      settingsFeedback.classList.remove('hidden');
      settingsFeedback.style.background = 'var(--color-error-soft)';
      settingsFeedbackIcon.textContent = '❌';
      settingsFeedbackText.textContent = 'Please enter an API key to test connection.';
      settingsFeedbackText.style.color = 'var(--color-error-deep)';
      return;
    }

    testSpinner.classList.remove('hidden');
    testBtnLabel.textContent = 'Testing...';
    btnTestConn.setAttribute('disabled', 'true');
    settingsFeedback.classList.add('hidden');

    try {
      await refinePromptWithAI('Test connection prompt.', {
        provider,
        model,
        apiKey: typedKey,
        customEndpoint: endpoint,
        maxTokens: 20,
      });

      settingsFeedback.classList.remove('hidden');
      settingsFeedback.style.background = 'var(--color-link-bg-soft)';
      settingsFeedbackIcon.textContent = '✅';
      settingsFeedbackText.textContent = `Successfully connected to ${PROVIDER_INFO[provider].name}!`;
      settingsFeedbackText.style.color = 'var(--color-link-deep)';
    } catch (err: any) {
      settingsFeedback.classList.remove('hidden');
      settingsFeedback.style.background = 'var(--color-error-soft)';
      settingsFeedbackIcon.textContent = '❌';
      settingsFeedbackText.textContent = err?.message || 'Failed to connect to AI provider.';
      settingsFeedbackText.style.color = 'var(--color-error-deep)';
    } finally {
      testSpinner.classList.add('hidden');
      testBtnLabel.textContent = 'Test Connection';
      btnTestConn.removeAttribute('disabled');
    }
  });

  btnClearKey.addEventListener('click', () => {
    clearApiKey();
    saveAIProvider('gemini');
    saveAIModel(PROVIDER_INFO.gemini.defaultModel);
    saveCustomEndpoint('');
    refreshSettingsUI();
  });

  btnToggleVis.addEventListener('click', () => {
    if (inputApiKey.type === 'password') {
      inputApiKey.type = 'text';
      iconEye.classList.add('hidden');
      iconEyeOff.classList.remove('hidden');
    } else {
      inputApiKey.type = 'password';
      iconEye.classList.remove('hidden');
      iconEyeOff.classList.add('hidden');
    }
  });

  document.getElementById('refine-open-settings')?.addEventListener('click', openSettings);
  document.getElementById('refine-error-fix-btn')?.addEventListener('click', openSettings);

  // ══════════════════════════════════════
  // AI REFINE PANEL
  // ══════════════════════════════════════
  const refineNoKey = document.getElementById('refine-no-key')!;
  const btnRefine = document.getElementById('btn-refine')! as HTMLButtonElement;
  const refineLoading = document.getElementById('refine-loading')!;
  const refineError = document.getElementById('refine-error')!;
  const refineErrorText = document.getElementById('refine-error-text')!;
  const refineResult = document.getElementById('refine-result')!;
  const refineResultText = document.getElementById('refine-result-text')!;

  function updateRefineButton() {
    const config = getProviderConfig();
    const hasConfig = config.provider === 'local' ? true : !!config.apiKey;
    const hasPrompt = !!previewText.textContent?.trim();

    if (hasConfig) {
      refineNoKey.style.display = 'none';
      btnRefine.style.display = '';
      btnRefine.disabled = !hasPrompt;
    } else {
      refineNoKey.style.display = 'flex';
      btnRefine.style.display = 'none';
    }
  }

  btnRefine.addEventListener('click', async () => {
    const prompt = previewText.textContent?.trim() ?? '';
    if (!prompt) return;

    btnRefine.style.display = 'none';
    refineLoading.classList.remove('hidden');
    refineError.classList.add('hidden');
    refineResult.classList.add('hidden');

    try {
      const refined = await refinePrompt(prompt);
      refineResultText.textContent = refined;
      refineResult.classList.remove('hidden');
    } catch (err) {
      if (err instanceof ProviderError) {
        refineErrorText.textContent = err.message;
      } else {
        refineErrorText.textContent = 'An unexpected error occurred. Please try again.';
      }
      refineError.classList.remove('hidden');
    } finally {
      refineLoading.classList.add('hidden');
      btnRefine.style.display = '';
    }
  });

  // Copy refined
  document.getElementById('btn-copy-refined')?.addEventListener('click', async () => {
    const text = refineResultText.textContent ?? '';
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  });

  // ══════════════════════════════════════
  // DATA MANAGEMENT — Clear all data
  // ══════════════════════════════════════
  document.getElementById('btn-clear-all-data')?.addEventListener('click', () => {
    if (confirm('Clear all saved prompts and your API key from this browser?')) {
      clearAllData();
      refreshSettingsUI();
      closeSettings();
    }
  });

  // ══════════════════════════════════════
  // UTILITIES
  // ══════════════════════════════════════
  function escapeHtml(str: string): string {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function timeAgo(ts: number): string {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  // ══════════════════════════════════════
  // KEYBOARD SHORTCUTS
  // ══════════════════════════════════════
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeHistory();
      closeTemplates();
      closeSettings();
    }
  });

  // ══════════════════════════════════════
  // THEME TOGGLE (LIGHT / DARK)
  // ══════════════════════════════════════
  const btnThemeToggle = document.getElementById('btn-theme-toggle');
  const sunIcon = document.getElementById('theme-icon-sun');
  const moonIcon = document.getElementById('theme-icon-moon');

  function updateThemeUI() {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      sunIcon?.classList.remove('hidden');
      moonIcon?.classList.add('hidden');
    } else {
      sunIcon?.classList.add('hidden');
      moonIcon?.classList.remove('hidden');
    }
  }

  btnThemeToggle?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      saveTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      saveTheme('dark');
    }
    updateThemeUI();
  });

  // Listen to system preference changes if theme is system
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const saved = getTheme();
    if (saved === 'system') {
      if (e.matches) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
      updateThemeUI();
    }
  });

  // ══════════════════════════════════════
  // URL QUERY PARAMS INITIALIZATION
  // ══════════════════════════════════════
  function loadFromQueryParams() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('task') && !params.has('cat')) return;

    if (params.has('cat')) {
      const cat = params.get('cat') as GoalCategory;
      if (Object.values(GoalCategory).includes(cat)) {
        state.category = cat;
        categoryCards.forEach((c) => (c.dataset.active = c.dataset.category === cat ? 'true' : 'false'));
      }
    }

    if (params.has('fw')) {
      const fw = params.get('fw') as Framework;
      if (Object.values(Framework).includes(fw)) {
        state.framework = fw;
        frameworkTabs.forEach((t) => (t.dataset.active = t.dataset.framework === fw ? 'true' : 'false'));
        if (frameworkDesc) frameworkDesc.textContent = FRAMEWORK_META[fw].description;
      }
    }

    if (params.has('model')) {
      const model = params.get('model') as TargetModel;
      state.targetModel = model;
      modelTabs.forEach((t) => (t.dataset.active = t.dataset.model === model ? 'true' : 'false'));
      if (modelBadge) modelBadge.textContent = model;
    }

    if (params.has('task')) state.fields.task = params.get('task') || '';
    if (params.has('role')) state.fields.role = params.get('role') || '';
    if (params.has('context')) state.fields.context = params.get('context') || '';
    if (params.has('fmt')) state.fields.outputFormat = params.get('fmt') || '';
    if (params.has('rules')) state.fields.constraints = params.get('rules') || '';

    textareas.forEach((ta) => {
      const key = ta.dataset.fieldKey as FieldKey;
      if (state.fields[key]) ta.value = state.fields[key];
    });
  }

  // ══════════════════════════════════════
  // INITIAL RENDER
  // ══════════════════════════════════════
  loadFromQueryParams();
  updateForm();
  reassemble();
  updateBeforeAfter();
  updateRefineButton();
  updateThemeUI();
  if (new URLSearchParams(window.location.search).has('templates')) openTemplates();
});
