import { generateMapSeed, normalizeMapSeed } from '../game/MatchConfig';
import { t } from '../i18n/I18n';
import type { DayNightMode, LanguageCode } from '../shared/types';

export type SoloPreset =
  | 'easy'
  | 'medium'
  | 'hard'
  | 'eliminationRush'
  | 'timeTrial'
  | 'careerBuildings'
  | 'careerCollector'
  | 'careerHunter'
  | 'careerScore'
  | 'creative';

export interface SoloPresetCallbacks {
  onPreset: (preset: SoloPreset, dayNightMode: DayNightMode, mapSeed: string) => void;
  onCustom: (mapSeed: string) => void;
  onBack: () => void;
}

export class SoloPresetMenu {
  private element: HTMLDivElement | null = null;

  constructor(private readonly root: HTMLElement) {}

  show(callbacks: SoloPresetCallbacks, language: LanguageCode): void {
    this.hide();
    let dayNightMode: DayNightMode = 'cycle';
    let mapSeed = generateMapSeed();
    const element = document.createElement('div');
    element.className = 'screen';
    element.innerHTML = `
      <section class="menu-panel preset-panel">
        <h2>${t(language, 'soloPresetTitle')}</h2>
        <p class="subtitle">${t(language, 'soloPresetSubtitle')}</p>
        ${this.seedField(language, mapSeed)}
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
          ${this.presetButton('eliminationRush', t(language, 'eliminationRushMode'), t(language, 'eliminationRushDesc'))}
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
    const seedInput = element.querySelector<HTMLInputElement>('.seed-input');
    const syncSeed = (): string => {
      mapSeed = normalizeMapSeed(seedInput?.value) || generateMapSeed();
      if (seedInput && seedInput.value !== mapSeed) {
        seedInput.value = mapSeed;
      }
      return mapSeed;
    };
    seedInput?.addEventListener('input', () => {
      mapSeed = normalizeMapSeed(seedInput.value);
    });
    element.querySelector<HTMLButtonElement>('.generate-seed')?.addEventListener('click', () => {
      mapSeed = generateMapSeed();
      if (seedInput) {
        seedInput.value = mapSeed;
      }
    });
    element.querySelectorAll<HTMLButtonElement>('[data-preset]').forEach((button) => {
      button.addEventListener('click', () => {
        const preset = button.dataset.preset as SoloPreset | undefined;
        if (preset) {
          callbacks.onPreset(preset, dayNightMode, syncSeed());
        }
      });
    });
    element.querySelector<HTMLButtonElement>('.custom-preset')?.addEventListener('click', () => callbacks.onCustom(syncSeed()));
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

  private seedField(language: LanguageCode, seed: string): string {
    return `
      <label class="field seed-field">${t(language, 'mapSeed')}
        <div class="seed-row">
          <input class="seed-input" maxlength="48" value="${this.escapeHtml(seed)}" aria-label="${t(language, 'mapSeed')}" />
          <button class="generate-seed" type="button">${t(language, 'generateSeed')}</button>
        </div>
        <small>${t(language, 'mapSeedHint')}</small>
      </label>
    `;
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
