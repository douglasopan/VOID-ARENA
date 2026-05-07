import { t } from '../i18n/I18n';
import type { LanguageCode } from '../shared/types';

export type SoloPreset = 'easy' | 'medium' | 'hard';

export interface SoloPresetCallbacks {
  onPreset: (preset: SoloPreset) => void;
  onCustom: () => void;
  onBack: () => void;
}

export class SoloPresetMenu {
  private element: HTMLDivElement | null = null;

  constructor(private readonly root: HTMLElement) {}

  show(callbacks: SoloPresetCallbacks, language: LanguageCode): void {
    this.hide();
    const element = document.createElement('div');
    element.className = 'screen';
    element.innerHTML = `
      <section class="menu-panel preset-panel">
        <h2>${t(language, 'soloPresetTitle')}</h2>
        <p class="subtitle">${t(language, 'soloPresetSubtitle')}</p>
        <div class="preset-grid">
          ${this.presetButton('easy', t(language, 'presetEasy'), t(language, 'presetEasyDesc'))}
          ${this.presetButton('medium', t(language, 'presetMedium'), t(language, 'presetMediumDesc'))}
          ${this.presetButton('hard', t(language, 'presetHard'), t(language, 'presetHardDesc'))}
          <button class="preset-card custom-preset" type="button">
            <strong>${t(language, 'presetCustom')}</strong>
            <span>${t(language, 'presetCustomDesc')}</span>
          </button>
        </div>
        <div class="button-grid">
          <button class="back" type="button">${t(language, 'back')}</button>
        </div>
      </section>
    `;

    element.querySelectorAll<HTMLButtonElement>('[data-preset]').forEach((button) => {
      button.addEventListener('click', () => {
        const preset = button.dataset.preset as SoloPreset | undefined;
        if (preset) {
          callbacks.onPreset(preset);
        }
      });
    });
    element.querySelector<HTMLButtonElement>('.custom-preset')?.addEventListener('click', callbacks.onCustom);
    element.querySelector<HTMLButtonElement>('.back')?.addEventListener('click', callbacks.onBack);
    this.root.appendChild(element);
    this.element = element;
  }

  hide(): void {
    this.element?.remove();
    this.element = null;
  }

  private presetButton(preset: SoloPreset, label: string, description: string): string {
    return `
      <button class="preset-card" type="button" data-preset="${preset}">
        <strong>${label}</strong>
        <span>${description}</span>
      </button>
    `;
  }
}
