import type { MatchTimer } from '../game/MatchTimer';
import type { Player } from '../game/Player';
import { POWERUP_SETTINGS, SPAWN_PROTECTION_SECONDS } from '../shared/constants';
import { powerUpLabelKey, t } from '../i18n/I18n';
import type { LanguageCode, LeaderboardEntry, PowerUpType } from '../shared/types';

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

export interface HudDisasterWarning {
  title: string;
  message: string;
  secondsLabel: string;
}

export interface HudObjectiveStatus {
  title: string;
  description: string;
  progressLabel: string;
  complete: boolean;
}

export type HudScoreMode = 'score' | 'eliminations';

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
  mass: { label: 'Mass', icon: 'G', color: '#c084fc' },
  gust: { label: 'Gust', icon: 'W', color: '#a3e635' },
  overcharge: { label: 'Infinite Stamina', icon: 'I', color: '#22d3ee' },
  dash: { label: 'Dash', icon: 'D', color: '#f97316' }
};

export class HUD {
  private element: HTMLDivElement | null = null;
  private playerStats: HTMLDivElement | null = null;
  private leaderboard: HTMLDivElement | null = null;
  private powerUpTray: HTMLDivElement | null = null;
  private disasterWarning: HTMLDivElement | null = null;
  private disasterWarningLastText = '';
  private callbacks: HudCallbacks | null = null;
  private displaySettings = this.loadDisplaySettings();
  private language: LanguageCode = 'en';

  constructor(private readonly root: HTMLElement) {}

  show(callbacks?: HudCallbacks, language: LanguageCode = this.language): void {
    this.hide();
    this.language = language;
    this.callbacks = callbacks ?? null;
    const element = document.createElement('div');
    element.className = 'hud';
    element.innerHTML = `
      <section class="hud-panel hud-stats" data-display="stats">
        <div class="player-stats"></div>
      </section>
      <section class="leaderboard" data-display="leaderboard">
        <div class="panel-title">
          <h3>${t(this.language, 'leaderboard')}</h3>
          <button class="panel-close" type="button" data-display-toggle="leaderboard" aria-label="${t(this.language, 'closeLeaderboard')}">X</button>
        </div>
        <div class="leaderboard-list"></div>
      </section>
      <section class="powerup-tray" data-display="powerups" aria-label="${t(this.language, 'activePowerups')}"></section>
      <section class="disaster-warning hidden" role="status" aria-live="polite">
        <span class="disaster-warning-title"></span>
        <strong class="disaster-warning-message"></strong>
        <span class="disaster-warning-count"></span>
      </section>
      <section class="zoom-controls" data-display="zoom" aria-label="${t(this.language, 'cameraZoom')}">
        <button class="zoom-out" type="button" aria-label="${t(this.language, 'zoomOut')}">-</button>
        <button class="zoom-in" type="button" aria-label="${t(this.language, 'zoomIn')}">+</button>
      </section>
      <div class="help" data-display="help">${t(this.language, 'controlsHint')}</div>
    `;
    this.root.appendChild(element);
    this.element = element;
    this.playerStats = element.querySelector('.player-stats');
    this.leaderboard = element.querySelector('.leaderboard-list');
    this.powerUpTray = element.querySelector('.powerup-tray');
    this.disasterWarning = element.querySelector('.disaster-warning');
    element.querySelector<HTMLButtonElement>('.zoom-in')?.addEventListener('click', () => this.callbacks?.onZoomIn());
    element.querySelector<HTMLButtonElement>('.zoom-out')?.addEventListener('click', () => this.callbacks?.onZoomOut());
    element.addEventListener('pointerup', (event) => this.handleHudPointer(event));
    element.querySelectorAll<HTMLButtonElement>('[data-display-toggle]').forEach((button) => {
      button.addEventListener('click', () => {
        const key = button.dataset.displayToggle as HudDisplayKey | undefined;
        if (key) {
          this.setDisplaySetting(key, false);
        }
      });
    });
    this.applyDisplaySettings();
  }

  setLanguage(language: LanguageCode): void {
    this.language = language;
    if (this.element) {
      this.show(this.callbacks ?? undefined, language);
    }
  }

  update(
    player: Player | undefined,
    leaderboardEntries: LeaderboardEntry[],
    timer: MatchTimer | null,
    remainingPlayers: number,
    disasterWarning: HudDisasterWarning | null = null,
    objective: HudObjectiveStatus | null = null,
    scoreMode: HudScoreMode = 'score'
  ): void {
    if (!this.element) {
      this.show(this.callbacks ?? undefined);
    }

    if (this.playerStats) {
      if (!player) {
        this.playerStats.textContent = t(this.language, 'waitingForPlayer');
      } else {
        this.playerStats.innerHTML = `
          <div class="hud-row stamina-row">
            <span>${t(this.language, 'stamina')}</span>
            <div class="stamina-bar" aria-label="${t(this.language, 'stamina')}">
              <div class="stamina-fill" style="width: ${Math.max(0, Math.min(100, player.stamina))}%"></div>
            </div>
          </div>
          <div class="hud-row"><span>${scoreMode === 'eliminations' ? t(this.language, 'eliminations') : t(this.language, 'score')}</span><strong>${scoreMode === 'eliminations' ? player.eliminations : player.score}</strong></div>
          <div class="hud-row"><span>${timer ? t(this.language, 'time') : t(this.language, 'alive')}</span><strong>${timer ? timer.format() : remainingPlayers}</strong></div>
          ${objective ? `
            <div class="objective-box ${objective.complete ? 'complete' : ''}">
              <span>${this.escapeHtml(objective.title)}</span>
              <strong>${this.escapeHtml(objective.progressLabel)}</strong>
              <small>${this.escapeHtml(objective.description)}</small>
            </div>
          ` : ''}
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
            <strong>${scoreMode === 'eliminations' ? entry.eliminations : entry.score}</strong>
          </div>`
        )
        .join('');
    }

    this.updatePowerUpTray(player);
    this.updateDisasterWarning(disasterWarning);
  }

  hide(): void {
    this.element?.remove();
    this.element = null;
    this.playerStats = null;
    this.leaderboard = null;
    this.powerUpTray = null;
    this.disasterWarning = null;
    this.disasterWarningLastText = '';
  }

  getDisplaySetting(key: HudDisplayKey): boolean {
    return this.displaySettings[key];
  }

  getDisplaySettings(): HudDisplaySettings {
    return { ...this.displaySettings };
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
    const cards = active
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
              <strong>${t(this.language, powerUpLabelKey(type))}</strong>
              <span>${remaining.toFixed(1)}s</span>
            </div>
            <div class="powerup-meter"><span></span></div>
          </div>
        `;
      });
    const spawnProtectionRemaining = player?.spawnProtectionRemaining(now) ?? 0;
    if (spawnProtectionRemaining > 0) {
      const percent = Math.max(0, Math.min(100, (spawnProtectionRemaining / SPAWN_PROTECTION_SECONDS) * 100));
      cards.unshift(`
        <div class="powerup-card" style="--powerup-color: #5eead4; --powerup-progress: ${percent}%">
          <div class="powerup-icon">P</div>
          <div class="powerup-text">
            <strong>${t(this.language, 'spawnProtection')}</strong>
            <span>${spawnProtectionRemaining.toFixed(1)}s</span>
          </div>
          <div class="powerup-meter"><span></span></div>
        </div>
      `);
    }
    this.powerUpTray.innerHTML = cards.join('');
    this.powerUpTray.classList.toggle('empty', cards.length === 0);
    this.applyDisplaySettings();
  }

  private updateDisasterWarning(warning: HudDisasterWarning | null): void {
    if (!this.disasterWarning) {
      return;
    }

    const visible = Boolean(warning);
    this.disasterWarning.classList.toggle('hidden', !visible);
    if (!warning) {
      this.disasterWarningLastText = '';
      return;
    }

    const signature = `${warning.title}|${warning.message}|${warning.secondsLabel}`;
    if (signature === this.disasterWarningLastText) {
      return;
    }
    this.disasterWarningLastText = signature;

    const title = this.disasterWarning.querySelector('.disaster-warning-title');
    const message = this.disasterWarning.querySelector('.disaster-warning-message');
    const count = this.disasterWarning.querySelector('.disaster-warning-count');
    if (title) title.textContent = warning.title;
    if (message) message.textContent = warning.message;
    if (count) count.textContent = warning.secondsLabel;
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
