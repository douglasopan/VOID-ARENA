import { t } from '../i18n/I18n';
import type { MatchHistoryEntry, MatchResult } from '../shared/types';
import type { LanguageCode } from '../shared/types';

export interface EndScreenCallbacks {
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export class EndScreen {
  private element: HTMLDivElement | null = null;

  constructor(private readonly root: HTMLElement) {}

  show(result: MatchResult, callbacks: EndScreenCallbacks, history: MatchHistoryEntry[] = [], language: LanguageCode = 'en'): void {
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
            <span>${entry.finalScore} ${t(language, 'pts')}</span>
            <span>${entry.multiplayer ? t(language, 'online') : t(language, 'solo')}</span>
          </div>
        `;
      })
      .join('');
    const challengeRows = result.objectiveTitle
      ? `
          <div class="hud-row">
            <span>${t(language, 'challenge')}</span>
            <strong>${result.challengeCompleted ? t(language, 'objectiveComplete') : t(language, 'objectiveFailed')}</strong>
          </div>
          <div class="hud-row">
            <span>${this.escapeHtml(result.objectiveTitle)}</span>
            <strong>${Math.min(result.objectiveProgress ?? 0, result.objectiveTarget ?? 0)}/${result.objectiveTarget ?? 0}</strong>
          </div>
        `
      : '';
    element.innerHTML = `
      <section class="menu-panel narrow">
        <h2>${t(language, 'matchComplete')}</h2>
        <p class="subtitle">${t(language, 'winner')}: <strong>${this.escapeHtml(result.winnerName)}</strong></p>
        <div class="form-grid">
          ${challengeRows}
          <div class="hud-row"><span>${t(language, 'yourPlacement')}</span><strong>#${result.placement}</strong></div>
          <div class="hud-row"><span>${t(language, 'finalScore')}</span><strong>${result.finalScore}</strong></div>
          <div class="hud-row"><span>${t(language, 'finalSize')}</span><strong>${result.finalRadius.toFixed(2)}</strong></div>
          <div class="hud-row"><span>${t(language, 'objectsSwallowed')}</span><strong>${result.objectsSwallowed}</strong></div>
          <div class="hud-row"><span>${t(language, 'eliminations')}</span><strong>${result.eliminations}</strong></div>
        </div>
        ${historyRows ? `<h3>${t(language, 'matchHistory')}</h3><div class="history-list">${historyRows}</div>` : ''}
        <div class="button-grid">
          <button class="primary play-again">${t(language, 'playAgain')}</button>
          <button class="main-menu">${t(language, 'backToMenu')}</button>
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
