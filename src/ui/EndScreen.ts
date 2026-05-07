import type { MatchHistoryEntry, MatchResult } from '../shared/types';

export interface EndScreenCallbacks {
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export class EndScreen {
  private element: HTMLDivElement | null = null;

  constructor(private readonly root: HTMLElement) {}

  show(result: MatchResult, callbacks: EndScreenCallbacks, history: MatchHistoryEntry[] = []): void {
    this.hide();
    const element = document.createElement('div');
    element.className = 'screen';
    const historyRows = history
      .slice(0, 6)
      .map((entry) => {
        const date = new Date(entry.playedAt).toLocaleString();
        return `
          <div class="history-row">
            <span>${this.escapeHtml(date)}</span>
            <strong>#${entry.placement}</strong>
            <span>${entry.finalScore} pts</span>
            <span>${entry.multiplayer ? 'Online' : 'Solo'}</span>
          </div>
        `;
      })
      .join('');
    element.innerHTML = `
      <section class="menu-panel narrow">
        <h2>Match Complete</h2>
        <p class="subtitle">Winner: <strong>${this.escapeHtml(result.winnerName)}</strong></p>
        <div class="form-grid">
          <div class="hud-row"><span>Your placement</span><strong>#${result.placement}</strong></div>
          <div class="hud-row"><span>Final score</span><strong>${result.finalScore}</strong></div>
          <div class="hud-row"><span>Final size</span><strong>${result.finalRadius.toFixed(2)}</strong></div>
          <div class="hud-row"><span>Objects swallowed</span><strong>${result.objectsSwallowed}</strong></div>
          <div class="hud-row"><span>Eliminations</span><strong>${result.eliminations}</strong></div>
        </div>
        ${historyRows ? `<h3>Match History</h3><div class="history-list">${historyRows}</div>` : ''}
        <div class="button-grid">
          <button class="primary play-again">Play Again</button>
          <button class="main-menu">Back to Main Menu</button>
        </div>
      </section>
    `;
    element.querySelector('.play-again')?.addEventListener('click', callbacks.onPlayAgain);
    element.querySelector('.main-menu')?.addEventListener('click', callbacks.onMainMenu);
    this.root.appendChild(element);
    this.element = element;
  }

  hide(): void {
    this.element?.remove();
    this.element = null;
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
