import { GAME_VERSION } from '../shared/constants';
import { LANGUAGE_OPTIONS } from '../shared/constants';
import { generatePlayerName } from '../game/MatchConfig';
import { t } from '../i18n/I18n';
import type { LanguageCode, PlayerProfile } from '../shared/types';

export interface MainMenuCallbacks {
  onStartSolo: (playerName: string) => void;
  onFindGames: (playerName: string) => void;
  onHostMatch: (playerName: string) => void;
  onSettings: () => void;
  onLanguageChange: (language: LanguageCode, playerName?: string) => void;
}

export class MainMenu {
  private element: HTMLDivElement | null = null;

  constructor(private readonly root: HTMLElement) {}

  show(
    callbacks: MainMenuCallbacks,
    initialName = '',
    profile: PlayerProfile | null = null,
    language: LanguageCode = 'en'
  ): void {
    this.hide();
    const element = document.createElement('div');
    element.className = 'screen main-screen';
    const bestScore = Math.max(0, ...((profile?.matchHistory ?? []).map((entry) => entry.finalScore)));
    const accountSummary = profile
      ? `<div class="account-summary"><span>${t(language, 'accountSaved')}</span><strong>${profile.matchHistory.length} ${t(language, 'matches')}</strong><strong>${bestScore} ${t(language, 'best')}</strong></div>`
      : `<div class="account-summary"><span>${t(language, 'createAccount')}</span></div>`;
    element.innerHTML = `
      <section class="menu-panel narrow main-menu-panel">
        <h1 class="title neon-title">VOID ARENA</h1>
        <p class="subtitle">${t(language, 'tagline')}</p>
        <label class="field">
          ${t(language, 'accountName')}
          <input class="player-name" maxlength="18" autocomplete="off" placeholder="Player_1234" />
        </label>
        <label class="field">
          ${t(language, 'language')}
          <select class="language-select">
            ${LANGUAGE_OPTIONS.map((option) => `<option value="${option.value}" ${option.value === language ? 'selected' : ''}>${option.label}</option>`).join('')}
          </select>
        </label>
        ${accountSummary}
        <div class="button-grid">
          <button class="primary start-solo">${t(language, 'startSolo')}</button>
          <button class="find-games">${t(language, 'findGames')}</button>
          <button class="host-match">${t(language, 'hostMatch')}</button>
          <button class="settings">${t(language, 'settings')}</button>
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
    const languageSelect = element.querySelector<HTMLSelectElement>('.language-select');
    languageSelect?.addEventListener('change', () => {
      const value = languageSelect.value as LanguageCode;
      callbacks.onLanguageChange(value, input?.value.trim() || profile?.playerName);
    });
    this.root.appendChild(element);
    this.element = element;
    input?.focus();
  }

  hide(): void {
    this.element?.remove();
    this.element = null;
  }
}
