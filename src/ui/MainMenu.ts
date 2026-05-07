import { GAME_VERSION } from '../shared/constants';
import { generatePlayerName } from '../game/MatchConfig';

export interface MainMenuCallbacks {
  onStartSolo: (playerName: string) => void;
  onFindGames: (playerName: string) => void;
  onHostMatch: (playerName: string) => void;
  onSettings: () => void;
}

export class MainMenu {
  private element: HTMLDivElement | null = null;

  constructor(private readonly root: HTMLElement) {}

  show(callbacks: MainMenuCallbacks, initialName = ''): void {
    this.hide();
    const element = document.createElement('div');
    element.className = 'screen main-screen';
    element.innerHTML = `
      <section class="menu-panel narrow main-menu-panel">
        <h1 class="title neon-title">VOID ARENA</h1>
        <p class="subtitle">Swallow the city, grow the void, and outlast every rival hole in the arena.</p>
        <label class="field">
          Player name
          <input class="player-name" maxlength="18" autocomplete="off" placeholder="Player_1234" />
        </label>
        <div class="button-grid">
          <button class="primary start-solo">Start Solo Match</button>
          <button class="find-games">Find Games</button>
          <button class="host-match">Host Match</button>
          <button class="settings">Settings</button>
        </div>
        <div class="version">Version ${GAME_VERSION}</div>
      </section>
    `;

    const input = element.querySelector<HTMLInputElement>('.player-name');
    if (input) {
      input.value = initialName;
    }

    const readName = (): string => {
      const value = input?.value.trim() ?? '';
      const name = value || generatePlayerName();
      if (input) {
        input.value = name;
      }
      return name;
    };

    element.querySelector('.start-solo')?.addEventListener('click', () => callbacks.onStartSolo(readName()));
    element.querySelector('.find-games')?.addEventListener('click', () => callbacks.onFindGames(readName()));
    element.querySelector('.host-match')?.addEventListener('click', () => callbacks.onHostMatch(readName()));
    element.querySelector('.settings')?.addEventListener('click', () => callbacks.onSettings());
    this.root.appendChild(element);
    this.element = element;
    input?.focus();
  }

  hide(): void {
    this.element?.remove();
    this.element = null;
  }
}
