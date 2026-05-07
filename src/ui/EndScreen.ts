import type { MatchResult } from '../shared/types';

export interface EndScreenCallbacks {
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export class EndScreen {
  private element: HTMLDivElement | null = null;

  constructor(private readonly root: HTMLElement) {}

  show(result: MatchResult, callbacks: EndScreenCallbacks): void {
    this.hide();
    const element = document.createElement('div');
    element.className = 'screen';
    element.innerHTML = `
      <section class="menu-panel narrow">
        <h2>Match Complete</h2>
        <p class="subtitle">Winner: <strong>${result.winnerName}</strong></p>
        <div class="form-grid">
          <div class="hud-row"><span>Your placement</span><strong>#${result.placement}</strong></div>
          <div class="hud-row"><span>Final score</span><strong>${result.finalScore}</strong></div>
          <div class="hud-row"><span>Final size</span><strong>${result.finalRadius.toFixed(2)}</strong></div>
          <div class="hud-row"><span>Objects swallowed</span><strong>${result.objectsSwallowed}</strong></div>
          <div class="hud-row"><span>Eliminations</span><strong>${result.eliminations}</strong></div>
        </div>
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
}
