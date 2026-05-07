import type { MatchTimer } from '../game/MatchTimer';
import type { Player } from '../game/Player';
import { POWERUP_SETTINGS } from '../shared/constants';
import type { LeaderboardEntry, PowerUpType } from '../shared/types';

export type HudDisplayKey = 'stats' | 'leaderboard' | 'chat' | 'powerups' | 'help' | 'zoom';

export interface HudDisplaySettings {
  stats: boolean;
  leaderboard: boolean;
  chat: boolean;
  powerups: boolean;
  help: boolean;
  zoom: boolean;
}

interface HudCallbacks {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onChatVisibilityChange?: (visible: boolean) => void;
}

const DISPLAY_STORAGE_KEY = 'void-arena-hud-display-v1';
const DEFAULT_DISPLAY_SETTINGS: HudDisplaySettings = {
  stats: true,
  leaderboard: true,
  chat: true,
  powerups: true,
  help: false,
  zoom: true
};

const POWERUP_META: Record<PowerUpType, { label: string; icon: string; color: string }> = {
  magnet: { label: 'Magnet', icon: 'M', color: '#5eead4' },
  shrink: { label: 'Shrink', icon: 'S', color: '#fb7185' },
  haste: { label: 'Haste', icon: 'H', color: '#f6c453' },
  shield: { label: 'Shield', icon: 'D', color: '#93c5fd' },
  stamina: { label: 'Stamina', icon: 'E', color: '#91e88c' },
  mass: { label: 'Mass', icon: 'G', color: '#c084fc' }
};

export class HUD {
  private element: HTMLDivElement | null = null;
  private playerStats: HTMLDivElement | null = null;
  private leaderboard: HTMLDivElement | null = null;
  private powerUpTray: HTMLDivElement | null = null;
  private settingsPanel: HTMLDivElement | null = null;
  private callbacks: HudCallbacks | null = null;
  private displaySettings = this.loadDisplaySettings();

  constructor(private readonly root: HTMLElement) {}

  show(callbacks?: HudCallbacks): void {
    this.hide();
    this.callbacks = callbacks ?? null;
    const element = document.createElement('div');
    element.className = 'hud';
    element.innerHTML = `
      <section class="hud-panel hud-stats" data-display="stats">
        <div class="panel-title">
          <h3>Status</h3>
        </div>
        <div class="player-stats"></div>
      </section>
      <section class="leaderboard" data-display="leaderboard">
        <div class="panel-title">
          <h3>Leaderboard</h3>
          <button class="panel-close" type="button" data-display-toggle="leaderboard" aria-label="Close leaderboard">X</button>
        </div>
        <div class="leaderboard-list"></div>
      </section>
      <section class="powerup-tray" data-display="powerups" aria-label="Active powerups"></section>
      <section class="zoom-controls" data-display="zoom" aria-label="Camera zoom">
        <button class="zoom-out" type="button" aria-label="Zoom out">-</button>
        <button class="zoom-in" type="button" aria-label="Zoom in">+</button>
      </section>
      <button class="hud-settings-toggle" type="button" aria-label="HUD settings">HUD</button>
      <section class="hud-settings hidden" aria-label="HUD display settings">
        <div class="panel-title">
          <h3>HUD</h3>
          <button class="panel-close settings-close" type="button" aria-label="Close HUD settings">X</button>
        </div>
        <div class="hud-toggle-list">
          ${this.toggleMarkup('stats', 'Status')}
          ${this.toggleMarkup('leaderboard', 'Leaderboard')}
          ${this.toggleMarkup('chat', 'Chat')}
          ${this.toggleMarkup('powerups', 'Powerups')}
          ${this.toggleMarkup('zoom', 'Zoom buttons')}
          ${this.toggleMarkup('help', 'Controls hint')}
        </div>
      </section>
      <div class="help" data-display="help">WASD / Arrows move - Shift boost - ESC menu - Enter chat - Wheel zoom</div>
    `;
    this.root.appendChild(element);
    this.element = element;
    this.playerStats = element.querySelector('.player-stats');
    this.leaderboard = element.querySelector('.leaderboard-list');
    this.powerUpTray = element.querySelector('.powerup-tray');
    this.settingsPanel = element.querySelector('.hud-settings');
    element.querySelector<HTMLButtonElement>('.zoom-in')?.addEventListener('click', () => this.callbacks?.onZoomIn());
    element.querySelector<HTMLButtonElement>('.zoom-out')?.addEventListener('click', () => this.callbacks?.onZoomOut());
    element.querySelector<HTMLButtonElement>('.hud-settings-toggle')?.addEventListener('click', () => {
      this.settingsPanel?.classList.toggle('hidden');
    });
    element.querySelector<HTMLButtonElement>('.settings-close')?.addEventListener('click', () => {
      this.settingsPanel?.classList.add('hidden');
    });
    element.addEventListener('pointerup', (event) => this.handleHudPointer(event));
    element.querySelectorAll<HTMLButtonElement>('[data-display-toggle]').forEach((button) => {
      button.addEventListener('click', () => {
        const key = button.dataset.displayToggle as HudDisplayKey | undefined;
        if (key) {
          this.setDisplaySetting(key, false);
        }
      });
    });
    element.querySelectorAll<HTMLButtonElement>('.hud-toggle-row').forEach((button) => {
      button.addEventListener('click', () => {
        const key = button.dataset.displayKey as HudDisplayKey | undefined;
        if (key) {
          this.setDisplaySetting(key, !this.displaySettings[key]);
        }
      });
    });
    this.applyDisplaySettings();
  }

  update(
    player: Player | undefined,
    leaderboardEntries: LeaderboardEntry[],
    timer: MatchTimer | null,
    remainingPlayers: number
  ): void {
    if (!this.element) {
      this.show(this.callbacks ?? undefined);
    }

    if (this.playerStats) {
      if (!player) {
        this.playerStats.textContent = 'Waiting for player...';
      } else {
        this.playerStats.innerHTML = `
          <div class="hud-row stamina-row">
            <span>Stamina</span>
            <div class="stamina-bar" aria-label="Stamina">
              <div class="stamina-fill" style="width: ${Math.max(0, Math.min(100, player.stamina))}%"></div>
            </div>
          </div>
          <div class="hud-row"><span>${timer ? 'Time' : 'Alive'}</span><strong>${timer ? timer.format() : remainingPlayers}</strong></div>
        `;
      }
    }

    if (this.leaderboard) {
      this.leaderboard.innerHTML = leaderboardEntries
        .slice(0, 10)
        .map(
          (entry, index) => `
          <div class="leader-row ${entry.isLocal ? 'local' : ''}">
            <span>${index + 1}</span>
            <span>${entry.alive ? '' : 'KO '} ${this.escapeHtml(entry.name)}</span>
            <strong>${entry.score}</strong>
          </div>`
        )
        .join('');
    }

    this.updatePowerUpTray(player);
  }

  hide(): void {
    this.element?.remove();
    this.element = null;
    this.playerStats = null;
    this.leaderboard = null;
    this.powerUpTray = null;
    this.settingsPanel = null;
  }

  getDisplaySetting(key: HudDisplayKey): boolean {
    return this.displaySettings[key];
  }

  setDisplaySetting(key: HudDisplayKey, visible: boolean): void {
    this.displaySettings = {
      ...this.displaySettings,
      [key]: visible
    };
    this.saveDisplaySettings();
    this.applyDisplaySettings();

    if (key === 'chat') {
      this.callbacks?.onChatVisibilityChange?.(visible);
    }
  }

  private updatePowerUpTray(player: Player | undefined): void {
    if (!this.powerUpTray) {
      return;
    }

    const now = performance.now() / 1000;
    const active = player ? [...player.activePowerUps.entries()] : [];
    this.powerUpTray.innerHTML = active
      .sort((a, b) => a[1] - b[1])
      .map(([type, expiresAt]) => {
        const meta = POWERUP_META[type];
        const remaining = Math.max(0, expiresAt - now);
        const duration = Math.max(1, POWERUP_SETTINGS[type].durationSeconds);
        const percent = Math.max(0, Math.min(100, (remaining / duration) * 100));
        return `
          <div class="powerup-card" style="--powerup-color: ${meta.color}; --powerup-progress: ${percent}%">
            <div class="powerup-icon">${meta.icon}</div>
            <div class="powerup-text">
              <strong>${meta.label}</strong>
              <span>${remaining.toFixed(1)}s</span>
            </div>
            <div class="powerup-meter"><span></span></div>
          </div>
        `;
      })
      .join('');
    this.powerUpTray.classList.toggle('empty', active.length === 0);
    this.applyDisplaySettings();
  }

  private toggleMarkup(key: HudDisplayKey, label: string): string {
    return `
      <button class="hud-toggle-row" type="button" data-display-key="${key}" aria-pressed="${this.displaySettings[key]}">
        <span>${label}</span>
        <strong>${this.displaySettings[key] ? 'Hide' : 'Show'}</strong>
      </button>
    `;
  }

  private applyDisplaySettings(): void {
    if (!this.element) {
      return;
    }

    this.element.querySelectorAll<HTMLElement>('[data-display]').forEach((item) => {
      const key = item.dataset.display as HudDisplayKey | undefined;
      const visible = key ? this.displaySettings[key] : true;
      const isEmptyPowerUpTray = key === 'powerups' && item.classList.contains('empty');
      item.classList.toggle('hidden', !visible || isEmptyPowerUpTray);
    });
    this.element.querySelectorAll<HTMLButtonElement>('.hud-toggle-row').forEach((button) => {
      const key = button.dataset.displayKey as HudDisplayKey | undefined;
      if (key) {
        button.classList.toggle('active', this.displaySettings[key]);
        button.setAttribute('aria-pressed', String(this.displaySettings[key]));
        const value = button.querySelector('strong');
        if (value) {
          value.textContent = this.displaySettings[key] ? 'Hide' : 'Show';
        }
      }
    });
  }

  private handleHudPointer(event: PointerEvent): void {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const closeButton = target.closest<HTMLElement>('[data-display-toggle]');
    if (closeButton && this.element?.contains(closeButton)) {
      const key = closeButton.dataset.displayToggle as HudDisplayKey | undefined;
      if (key) {
        event.preventDefault();
        event.stopPropagation();
        this.setDisplaySetting(key, false);
      }
    }
  }

  private loadDisplaySettings(): HudDisplaySettings {
    try {
      const raw = window.localStorage.getItem(DISPLAY_STORAGE_KEY);
      if (!raw) {
        return DEFAULT_DISPLAY_SETTINGS;
      }

      return {
        ...DEFAULT_DISPLAY_SETTINGS,
        ...(JSON.parse(raw) as Partial<HudDisplaySettings>)
      };
    } catch {
      return DEFAULT_DISPLAY_SETTINGS;
    }
  }

  private saveDisplaySettings(): void {
    window.localStorage.setItem(DISPLAY_STORAGE_KEY, JSON.stringify(this.displaySettings));
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
