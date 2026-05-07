import type { MatchConfig } from '../game/MatchConfig';
import { createDefaultMatchConfig } from '../game/MatchConfig';
import { getMatchModeLabel, MatchMode } from '../game/MatchMode';
import type { BotDifficultyMix } from '../game/BotDifficulty';
import type { GraphicsQuality, MapSize } from '../shared/types';

export interface HostCallbacks {
  onHost: (config: MatchConfig) => void;
  onBack: () => void;
}

export class HostMenu {
  private element: HTMLDivElement | null = null;

  constructor(private readonly root: HTMLElement) {}

  show(playerName: string, callbacks: HostCallbacks, initial?: Partial<MatchConfig>): void {
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
        <h2>Host Match</h2>
        <p class="subtitle">Creates an online room when a public Socket.IO server is configured. On Vercel, the frontend must point to that realtime server URL.</p>
        <div class="form-grid">
          <label class="field">Room name<input class="room-name-input" maxlength="28" value="${state.roomName}" /></label>
          ${this.segment('Max players', 'maxPlayers', [
            ['8', '8'],
            ['16', '16'],
            ['32', '32'],
            ['64', '64'],
            ['100', '100']
          ], String(state.maxPlayers))}
          ${this.segment('Fill empty slots', 'fillBots', [
            ['true', 'On'],
            ['false', 'Off']
          ], String(state.fillBots))}
          ${this.segment('Bot skill', 'botDifficultyMix', [
            ['relaxed', 'Relaxed'],
            ['balanced', 'Balanced'],
            ['competitive', 'Competitive'],
            ['chaos', 'Chaos']
          ], state.botDifficultyMix)}
          ${this.segment('Map size', 'mapSize', [
            ['small', 'Small'],
            ['medium', 'Medium'],
            ['large', 'Large'],
            ['huge', 'Huge']
          ], state.mapSize)}
          ${this.segment('Match mode', 'matchMode', [
            [MatchMode.Timed, getMatchModeLabel(MatchMode.Timed)],
            [MatchMode.LastHoleStanding, 'Last Hole Standing']
          ], state.matchMode)}
          ${this.segment('Duration', 'durationSeconds', [
            ['120', '2 minutes'],
            ['180', '3 minutes'],
            ['300', '5 minutes'],
            ['600', '10 minutes']
          ], String(state.durationSeconds))}
          ${this.segment('Chat', 'enableChat', [
            ['true', 'On'],
            ['false', 'Off']
          ], String(state.enableChat))}
          ${this.segment('In-world ads', 'enableAds', [
            ['true', 'On'],
            ['false', 'Off']
          ], String(state.enableAds))}
          ${this.segment('Graphics', 'graphicsQuality', [
            ['performance', 'Fast'],
            ['balanced', 'Balanced'],
            ['quality', 'Quality']
          ], state.graphicsQuality)}
          ${this.segment('Camera', 'cameraZoom', [
            ['0.82', 'Close'],
            ['1', 'Normal'],
            ['1.18', 'Far']
          ], String(state.cameraZoom))}
          ${this.segment('Death camera', 'deathCameraEnabled', [
            ['true', 'On'],
            ['false', 'Off']
          ], String(state.deathCameraEnabled))}
          ${this.segment('Map elements', 'objectDensityMultiplier', [
            ['0.65', 'Light'],
            ['1', 'Normal'],
            ['1.35', 'Dense'],
            ['1.7', 'Packed']
          ], String(state.objectDensityMultiplier))}
          ${this.segment('Powerups', 'powerUpCount', [
            ['0', '0'],
            ['8', '8'],
            ['14', '14'],
            ['28', '28'],
            ['48', '48']
          ], String(state.powerUpCount))}
          ${this.segment('Respawn range', 'respawnSafeRadius', [
            ['8', '8m'],
            ['12', '12m'],
            ['18', '18m'],
            ['26', '26m']
          ], String(state.respawnSafeRadius))}
        </div>
        <div class="button-grid">
          <button class="primary host">Host Multiplayer Match</button>
          <button class="back">Back</button>
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
