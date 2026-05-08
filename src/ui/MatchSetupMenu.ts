import type { MatchConfig } from '../game/MatchConfig';
import { createDefaultMatchConfig, generateMapSeed, normalizeMapSeed } from '../game/MatchConfig';
import { MatchMode } from '../game/MatchMode';
import type { BotDifficultyMix } from '../game/BotDifficulty';
import { t } from '../i18n/I18n';
import type { DayNightMode, GraphicsQuality, LanguageCode, MapSize } from '../shared/types';

export interface MatchSetupCallbacks {
  onStart: (config: MatchConfig) => void;
  onBack: () => void;
}

export class MatchSetupMenu {
  private element: HTMLDivElement | null = null;

  constructor(private readonly root: HTMLElement) {}

  show(playerName: string, callbacks: MatchSetupCallbacks, initial?: Partial<MatchConfig>, language: LanguageCode = 'en'): void {
    this.hide();
    const state: MatchConfig = { ...createDefaultMatchConfig(playerName), ...initial, playerName };
    const element = document.createElement('div');
    element.className = 'screen';
    element.innerHTML = `
      <section class="menu-panel">
        <h2>${t(language, 'customMatchSetup')}</h2>
        <p class="subtitle">${t(language, 'customMatchSubtitle')}</p>
        <div class="form-grid">
          ${this.seedField(language, state.mapSeed || generateMapSeed())}
          ${this.segment(t(language, 'mapSize'), 'mapSize', [
            ['small', t(language, 'small')],
            ['medium', t(language, 'medium')],
            ['large', t(language, 'large')],
            ['huge', t(language, 'huge')]
          ], state.mapSize)}
          ${this.segment(t(language, 'matchMode'), 'matchMode', [
            [MatchMode.Timed, t(language, 'timedMatch')],
            [MatchMode.LastHoleStanding, t(language, 'lastHoleStanding')],
            [MatchMode.TimeTrial, t(language, 'timeTrialMode')],
            [MatchMode.Creative, t(language, 'creativeMode')]
          ], state.matchMode)}
          ${this.segment(t(language, 'matchDuration'), 'durationSeconds', [
            ['120', t(language, 'twoMinutes')],
            ['180', t(language, 'threeMinutes')],
            ['300', t(language, 'fiveMinutes')],
            ['600', t(language, 'tenMinutes')]
          ], String(state.durationSeconds))}
          ${this.segment(t(language, 'bots'), 'botCount', [
            ['0', '0'],
            ['5', '5'],
            ['10', '10'],
            ['25', '25'],
            ['50', '50'],
            ['100', '100']
          ], String(state.botCount))}
          ${this.segment(t(language, 'botSkill'), 'botDifficultyMix', [
            ['relaxed', t(language, 'relaxed')],
            ['balanced', t(language, 'balanced')],
            ['competitive', t(language, 'competitive')],
            ['chaos', t(language, 'chaos')]
          ], state.botDifficultyMix)}
          ${this.segment(t(language, 'inWorldAds'), 'enableAds', [
            ['true', t(language, 'on')],
            ['false', t(language, 'off')]
          ], String(state.enableAds))}
          ${this.segment(t(language, 'chat'), 'enableChat', [
            ['true', t(language, 'on')],
            ['false', t(language, 'off')]
          ], String(state.enableChat))}
          ${this.segment(t(language, 'graphics'), 'graphicsQuality', [
            ['performance', t(language, 'fast')],
            ['balanced', t(language, 'balanced')],
            ['quality', t(language, 'quality')]
          ], state.graphicsQuality)}
          ${this.segment(t(language, 'dayNightMode'), 'dayNightMode', [
            ['day', t(language, 'dayOnly')],
            ['night', t(language, 'nightOnly')],
            ['cycle', t(language, 'dayNightCycle')]
          ], state.dayNightMode)}
          ${this.segment(t(language, 'camera'), 'cameraZoom', [
            ['0.58', t(language, 'close')],
            ['1', t(language, 'normal')],
            ['1.18', t(language, 'far')]
          ], String(state.cameraZoom))}
          ${this.segment(t(language, 'deathCamera'), 'deathCameraEnabled', [
            ['true', t(language, 'on')],
            ['false', t(language, 'off')]
          ], String(state.deathCameraEnabled))}
          ${this.segment(t(language, 'mapElements'), 'objectDensityMultiplier', [
            ['0.65', t(language, 'light')],
            ['1', t(language, 'normal')],
            ['1.35', t(language, 'dense')],
            ['1.7', t(language, 'packed')]
          ], String(state.objectDensityMultiplier))}
          ${this.segment(t(language, 'powerups'), 'powerUpCount', [
            ['0', '0'],
            ['8', '8'],
            ['14', '14'],
            ['28', '28'],
            ['48', '48'],
            ['72', '72'],
            ['96', '96'],
            ['140', '140']
          ], String(state.powerUpCount))}
          ${this.segment(t(language, 'respawnRange'), 'respawnSafeRadius', [
            ['8', '8m'],
            ['12', '12m'],
            ['18', '18m'],
            ['26', '26m']
          ], String(state.respawnSafeRadius))}
          ${this.segment(t(language, 'itemRespawn'), 'itemRespawnEnabled', [
            ['true', t(language, 'on')],
            ['false', t(language, 'off')]
          ], String(state.itemRespawnEnabled))}
        </div>
        <div class="button-grid">
          <button class="primary start-match">${t(language, 'startMatch')}</button>
          <button class="back">${t(language, 'back')}</button>
        </div>
      </section>
    `;

    this.bindSegments(element, state);
    this.bindSeedField(element, state, language);
    element.querySelector('.start-match')?.addEventListener('click', () => {
      state.mapSeed = normalizeMapSeed(state.mapSeed) || generateMapSeed();
      callbacks.onStart({ ...state });
    });
    element.querySelector('.back')?.addEventListener('click', callbacks.onBack);
    this.root.appendChild(element);
    this.element = element;
  }

  hide(): void {
    this.element?.remove();
    this.element = null;
  }

  private segment(label: string, field: string, options: [string, string][], activeValue: string): string {
    const buttons = options
      .map(([value, text]) => `<button data-field="${field}" data-value="${value}" class="${value === activeValue ? 'active' : ''}">${text}</button>`)
      .join('');
    return `<div class="field"><label>${label}</label><div class="segmented">${buttons}</div></div>`;
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

  private bindSeedField(element: HTMLElement, state: MatchConfig, _language: LanguageCode): void {
    const input = element.querySelector<HTMLInputElement>('.seed-input');
    if (!input) {
      return;
    }
    state.mapSeed = normalizeMapSeed(input.value) || generateMapSeed();
    input.value = state.mapSeed;
    input.addEventListener('input', () => {
      state.mapSeed = normalizeMapSeed(input.value);
    });
    element.querySelector<HTMLButtonElement>('.generate-seed')?.addEventListener('click', () => {
      state.mapSeed = generateMapSeed();
      input.value = state.mapSeed;
    });
  }

  private bindSegments(element: HTMLElement, state: MatchConfig): void {
    element.querySelectorAll<HTMLButtonElement>('.segmented button').forEach((button) => {
      button.addEventListener('click', () => {
        const field = button.dataset.field;
        const value = button.dataset.value;
        if (!field || value === undefined) return;

        switch (field) {
          case 'mapSize':
            state.mapSize = value as MapSize;
            break;
          case 'matchMode':
            state.matchMode = value as MatchMode;
            break;
          case 'durationSeconds':
            state.durationSeconds = Number(value);
            break;
          case 'botCount':
            state.botCount = Number(value);
            break;
          case 'botDifficultyMix':
            state.botDifficultyMix = value as BotDifficultyMix;
            break;
          case 'enableAds':
            state.enableAds = value === 'true';
            break;
          case 'enableChat':
            state.enableChat = value === 'true';
            break;
          case 'graphicsQuality':
            state.graphicsQuality = value as GraphicsQuality;
            break;
          case 'dayNightMode':
            state.dayNightMode = value as DayNightMode;
            break;
          case 'cameraZoom':
            state.cameraZoom = Number(value);
            break;
          case 'deathCameraEnabled':
            state.deathCameraEnabled = value === 'true';
            break;
          case 'objectDensityMultiplier':
            state.objectDensityMultiplier = Number(value);
            break;
          case 'powerUpCount':
            state.powerUpCount = Number(value);
            break;
          case 'respawnSafeRadius':
            state.respawnSafeRadius = Number(value);
            break;
          case 'itemRespawnEnabled':
            state.itemRespawnEnabled = value === 'true';
            break;
        }

        const group = button.closest('.segmented');
        group?.querySelectorAll('button').forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
      });
    });
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
