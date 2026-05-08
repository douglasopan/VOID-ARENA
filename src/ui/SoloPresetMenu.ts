import { t } from '../i18n/I18n';
import type { DayNightMode, LanguageCode } from '../shared/types';

export type SoloPreset =
  | 'easy'
  | 'medium'
  | 'hard'
  | 'timeTrial'
  | 'careerBuildings'
  | 'careerCollector'
  | 'careerHunter'
  | 'careerScore'
  | 'creative';

export interface SoloPresetCallbacks {
  onPreset: (preset: SoloPreset, dayNightMode: DayNightMode) => void;
  onCustom: () => void;
  onBack: () => void;
}

export class SoloPresetMenu {
  private element: HTMLDivElement | null = null;

  constructor(private readonly root: HTMLElement) {}

  show(callbacks: SoloPresetCallbacks, language: LanguageCode): void {
    this.hide();
    let dayNightMode: DayNightMode = 'cycle';
    const element = document.createElement('div');
    element.className = 'screen';
    element.innerHTML = `
      <section class="menu-panel preset-panel">
        <h2>${t(language, 'soloPresetTitle')}</h2>
        <p class="subtitle">${t(language, 'soloPresetSubtitle')}</p>
        <div class="field preset-day-night">
          <label>${t(language, 'dayNightMode')}</label>
          <div class="segmented">
            <button type="button" data-day-night="day">${t(language, 'dayOnly')}</button>
            <button type="button" data-day-night="night">${t(language, 'nightOnly')}</button>
            <button type="button" data-day-night="cycle" class="active">${t(language, 'dayNightCycle')}</button>
          </div>
        </div>
        <div class="preset-grid">
          ${this.presetButton('easy', t(language, 'presetEasy'), t(language, 'presetEasyDesc'))}
          ${this.presetButton('medium', t(language, 'presetMedium'), t(language, 'presetMediumDesc'))}
          ${this.presetButton('hard', t(language, 'presetHard'), t(language, 'presetHardDesc'))}
          ${this.presetButton('timeTrial', t(language, 'timeTrialMode'), t(language, 'timeTrialModeDesc'))}
          <button class="preset-card custom-preset" type="button">
            <strong>${t(language, 'presetCustom')}</strong>
            <span>${t(language, 'presetCustomDesc')}</span>
          </button>
        </div>
        <h3 class="preset-section-title">${t(language, 'careerMode')}</h3>
        <div class="preset-grid career-grid">
          ${this.presetButton('careerBuildings', t(language, 'careerBuildings'), t(language, 'careerBuildingsDesc'))}
          ${this.presetButton('careerCollector', t(language, 'careerCollector'), t(language, 'careerCollectorDesc'))}
          ${this.presetButton('careerHunter', t(language, 'careerHunter'), t(language, 'careerHunterDesc'))}
          ${this.presetButton('careerScore', t(language, 'careerScore'), t(language, 'careerScoreDesc'))}
          ${this.presetButton('creative', t(language, 'creativeMode'), t(language, 'creativeModeDesc'))}
        </div>
        <div class="button-grid">
          <button class="back" type="button">${t(language, 'back')}</button>
        </div>
      </section>
    `;

    element.querySelectorAll<HTMLButtonElement>('[data-day-night]').forEach((button) => {
      button.addEventListener('click', () => {
        dayNightMode = (button.dataset.dayNight ?? 'cycle') as DayNightMode;
        button.closest('.segmented')?.querySelectorAll('button').forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
      });
    });
    element.querySelectorAll<HTMLButtonElement>('[data-preset]').forEach((button) => {
      button.addEventListener('click', () => {
        const preset = button.dataset.preset as SoloPreset | undefined;
        if (preset) {
          callbacks.onPreset(preset, dayNightMode);
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
