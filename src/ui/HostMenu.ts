import type { MatchConfig } from '../game/MatchConfig';
import { createDefaultMatchConfig } from '../game/MatchConfig';
import { MatchMode } from '../game/MatchMode';
import type { BotDifficultyMix } from '../game/BotDifficulty';
import { t } from '../i18n/I18n';
import type { DayNightMode, GraphicsQuality, LanguageCode, MapSize } from '../shared/types';

export interface HostCallbacks {
  onHost: (config: MatchConfig) => void;
  onBack: () => void;
}

export class HostMenu {
  private element: HTMLDivElement | null = null;

  constructor(private readonly root: HTMLElement) {}

  show(playerName: string, callbacks: HostCallbacks, initial?: Partial<MatchConfig>, language: LanguageCode = 'en'): void {
    this.hide();
    const state: MatchConfig = {
      ...createDefaultMatchConfig(playerName),
      ...initial,
      roomName: `${playerName}'s Arena`,
      maxPlayers: 16,
      fillBots: true,
      botCount: 15
    };
    const element = document.createElement('div');
    element.className = 'screen';
    element.innerHTML = `
      <section class="menu-panel">
        <h2>${t(language, 'hostTitle')}</h2>
        <p class="subtitle">${t(language, 'hostSubtitle')}</p>
        <div class="form-grid">
          <label class="field">${t(language, 'roomName')}<input class="room-name-input" maxlength="28" value="${state.roomName}" /></label>
          ${this.segment(t(language, 'maxPlayers'), 'maxPlayers', [
            ['8', '8'],
            ['16', '16'],
            ['32', '32'],
            ['64', '64'],
            ['100', '100']
          ], String(state.maxPlayers))}
          ${this.segment(t(language, 'fillEmptySlots'), 'fillBots', [
            ['true', t(language, 'on')],
            ['false', t(language, 'off')]
          ], String(state.fillBots))}
          ${this.segment(t(language, 'botSkill'), 'botDifficultyMix', [
            ['relaxed', t(language, 'relaxed')],
            ['balanced', t(language, 'balanced')],
            ['competitive', t(language, 'competitive')],
            ['chaos', t(language, 'chaos')]
          ], state.botDifficultyMix)}
          ${this.segment(t(language, 'mapSize'), 'mapSize', [
            ['small', t(language, 'small')],
            ['medium', t(language, 'medium')],
            ['large', t(language, 'large')],
            ['huge', t(language, 'huge')]
          ], state.mapSize)}
          ${this.segment(t(language, 'matchMode'), 'matchMode', [
            [MatchMode.Timed, t(language, 'timedMatch')],
            [MatchMode.LastHoleStanding, t(language, 'lastHoleStanding')]
          ], state.matchMode)}
          ${this.segment(t(language, 'duration'), 'durationSeconds', [
            ['120', t(language, 'twoMinutes')],
            ['180', t(language, 'threeMinutes')],
            ['300', t(language, 'fiveMinutes')],
            ['600', t(language, 'tenMinutes')]
          ], String(state.durationSeconds))}
          ${this.segment(t(language, 'chat'), 'enableChat', [
            ['true', t(language, 'on')],
            ['false', t(language, 'off')]
          ], String(state.enableChat))}
          ${this.segment(t(language, 'inWorldAds'), 'enableAds', [
            ['true', t(language, 'on')],
            ['false', t(language, 'off')]
          ], String(state.enableAds))}
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
            ['0.82', t(language, 'close')],
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
        </div>
        <div class="button-grid">
          <button class="primary host">${t(language, 'hostMultiplayerMatch')}</button>
          <button class="back">${t(language, 'back')}</button>
        </div>
      </section>
    `;

    this.bindSegments(element, state);
    const roomInput = element.querySelector<HTMLInputElement>('.room-name-input');
    element.querySelector('.host')?.addEventListener('click', () => {
      state.roomName = roomInput?.value.trim() || `${playerName}'s Arena`;
      state.botCount = state.fillBots ? Math.max(0, (state.maxPlayers ?? 16) - 1) : 0;
      callbacks.onHost({ ...state });
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

  private bindSegments(element: HTMLElement, state: MatchConfig): void {
    element.querySelectorAll<HTMLButtonElement>('.segmented button').forEach((button) => {
      button.addEventListener('click', () => {
        const field = button.dataset.field;
        const value = button.dataset.value;
        if (!field || value === undefined) return;

        switch (field) {
          case 'maxPlayers':
            state.maxPlayers = Number(value);
            break;
          case 'fillBots':
            state.fillBots = value === 'true';
            break;
          case 'botDifficultyMix':
            state.botDifficultyMix = value as BotDifficultyMix;
            break;
          case 'mapSize':
            state.mapSize = value as MapSize;
            break;
          case 'matchMode':
            state.matchMode = value as MatchMode;
            break;
          case 'durationSeconds':
            state.durationSeconds = Number(value);
            break;
          case 'enableChat':
            state.enableChat = value === 'true';
            break;
          case 'enableAds':
            state.enableAds = value === 'true';
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
        }

        const group = button.closest('.segmented');
        group?.querySelectorAll('button').forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
      });
    });
  }
}
