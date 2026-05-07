import type { MatchTimer } from '../game/MatchTimer';
import type { Player } from '../game/Player';
import type { LeaderboardEntry } from '../shared/types';

export class HUD {
  private element: HTMLDivElement | null = null;
  private playerStats: HTMLDivElement | null = null;
  private leaderboard: HTMLDivElement | null = null;
  private zoomValue: HTMLSpanElement | null = null;
  private callbacks: { onZoomIn: () => void; onZoomOut: () => void } | null = null;

  constructor(private readonly root: HTMLElement) {}

  show(callbacks?: { onZoomIn: () => void; onZoomOut: () => void }): void {
    this.hide();
    this.callbacks = callbacks ?? null;
    const element = document.createElement('div');
    element.className = 'hud';
    element.innerHTML = `
      <section class="hud-panel">
        <h3>Player</h3>
        <div class="player-stats"></div>
      </section>
      <section class="leaderboard">
        <h3>Leaderboard</h3>
        <div class="leaderboard-list"></div>
      </section>
      <section class="zoom-controls" aria-label="Camera zoom">
        <button class="zoom-out" type="button" aria-label="Zoom out">-</button>
        <span class="zoom-value">100%</span>
        <button class="zoom-in" type="button" aria-label="Zoom in">+</button>
      </section>
      <div class="help">WASD / Arrows to move - Shift/Space boost - ESC menu - Enter chat - +/- zoom</div>
    `;
    this.root.appendChild(element);
    this.element = element;
    this.playerStats = element.querySelector('.player-stats');
    this.leaderboard = element.querySelector('.leaderboard-list');
    this.zoomValue = element.querySelector('.zoom-value');
    element.querySelector<HTMLButtonElement>('.zoom-in')?.addEventListener('click', () => this.callbacks?.onZoomIn());
    element.querySelector<HTMLButtonElement>('.zoom-out')?.addEventListener('click', () => this.callbacks?.onZoomOut());
  }

  update(
    player: Player | undefined,
    leaderboardEntries: LeaderboardEntry[],
    timer: MatchTimer | null,
    remainingPlayers: number,
    zoom = 1
  ): void {
    if (!this.element) {
      this.show(this.callbacks ?? undefined);
    }

    if (this.playerStats) {
      if (!player) {
        this.playerStats.textContent = 'Waiting for player...';
      } else {
        this.playerStats.innerHTML = `
          <div class="hud-row"><span>Name</span><strong>${player.name}</strong></div>
          <div class="hud-row"><span>Score</span><strong>${player.score}</strong></div>
          <div class="hud-row"><span>Size</span><strong>${player.radius.toFixed(2)}</strong></div>
          <div class="hud-row stamina-row">
            <span>Stamina</span>
            <div class="stamina-bar" aria-label="Stamina">
              <div class="stamina-fill" style="width: ${Math.max(0, Math.min(100, player.stamina))}%"></div>
            </div>
          </div>
          <div class="hud-row"><span>Powerups</span><strong>${player.activePowerUps.size || '-'}</strong></div>
          <div class="hud-row"><span>Objects</span><strong>${player.swallowedObjects}</strong></div>
          <div class="hud-row"><span>Eliminations</span><strong>${player.eliminations}</strong></div>
          <div class="hud-row"><span>${timer ? 'Timer' : 'Alive'}</span><strong>${timer ? timer.format() : remainingPlayers}</strong></div>
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
            <span>${entry.alive ? '' : 'KO '} ${entry.name}</span>
            <strong>${entry.score}</strong>
          </div>`
        )
        .join('');
    }

    if (this.zoomValue) {
      this.zoomValue.textContent = `${Math.round(100 / zoom)}%`;
    }
  }

  hide(): void {
    this.element?.remove();
    this.element = null;
    this.playerStats = null;
    this.leaderboard = null;
    this.zoomValue = null;
  }
}
