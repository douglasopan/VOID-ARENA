import { GAME_VERSION } from '../shared/constants';
import { LANGUAGE_OPTIONS } from '../shared/constants';
import { getEngineConfig } from '../admin/EngineConfig';
import { t } from '../i18n/I18n';
import type { LanguageCode, PlayerProfile } from '../shared/types';
import { languageFlagButtonMarkup } from './LanguageFlags';

export interface MainMenuCallbacks {
  onStartSolo: (playerName: string) => void;
  onFindGames: (playerName: string) => void;
  onHostMatch: (playerName: string) => void;
  onSettings: () => void;
  onProfile: () => void;
  onRanking: () => void;
  onLogout: () => void;
  onLogin: (identifier: string, password: string) => Promise<void>;
  onRegister: (username: string, email: string, password: string) => Promise<void>;
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
    const engineBranding = getEngineConfig().branding;
    const bestScore = profile?.stats.bestScore ?? Math.max(0, ...((profile?.matchHistory ?? []).map((entry) => entry.finalScore)));
    const accountSummary = profile
      ? `
        <div class="account-summary account-summary-rich">
          ${profile.avatarDataUrl ? `<img src="${this.escape(profile.avatarDataUrl)}" alt="" />` : `<div class="avatar-placeholder">${this.escape(profile.username.slice(0, 2).toUpperCase())}</div>`}
          <div>
            <span>${t(language, 'signedInAs')}</span>
            <strong>${this.escape(profile.username)}</strong>
          </div>
          <strong>${profile.stats.matchesPlayed} ${t(language, 'matches')}</strong>
          <strong>${bestScore} ${t(language, 'best')}</strong>
        </div>
      `
      : `<div class="account-summary"><span>${t(language, 'createAccount')}</span></div>`;
    const authPanel = profile
      ? ''
      : `
        <div class="auth-panel auth-panel-split">
          <div class="auth-card">
            <h3>${t(language, 'login')}</h3>
            <label class="field">
              ${t(language, 'username')} / ${t(language, 'email')}
              <input class="login-identifier" maxlength="80" autocomplete="username" value="${this.escape(initialName)}" />
            </label>
            <label class="field">
              ${t(language, 'password')}
              <input class="login-password" maxlength="72" type="password" autocomplete="current-password" />
            </label>
            <button class="primary login-account" type="button">${t(language, 'login')}</button>
          </div>
          <div class="auth-card">
            <h3>${t(language, 'register')}</h3>
            <label class="field">
              ${t(language, 'username')}
              <input class="register-username" maxlength="18" autocomplete="username" value="${this.escape(initialName)}" />
            </label>
            <label class="field">
              ${t(language, 'email')}
              <input class="register-email" maxlength="80" type="email" autocomplete="email" />
            </label>
            <label class="field">
              ${t(language, 'password')}
              <input class="register-password" maxlength="72" type="password" autocomplete="new-password" />
            </label>
            <button class="register-account" type="button">${t(language, 'register')}</button>
          </div>
          <div class="account-message" role="status"></div>
        </div>
      `;
    element.innerHTML = `
      <section class="menu-panel narrow main-menu-panel">
        <h1 class="title neon-title">${this.escape(engineBranding.title)}</h1>
        <p class="subtitle">${t(language, 'tagline')}</p>
        <div class="field language-field">
          <span class="field-label">${t(language, 'language')}</span>
          <div class="language-flags" role="group" aria-label="${t(language, 'language')}">
            ${LANGUAGE_OPTIONS.map((option) => languageFlagButtonMarkup(option, language)).join('')}
          </div>
        </div>
        ${accountSummary}
        ${authPanel}
        ${profile ? `
          <div class="button-grid">
            <button class="primary start-solo">${t(language, 'startSolo')}</button>
            <button class="find-games">${t(language, 'findGames')}</button>
            <button class="host-match">${t(language, 'hostMatch')}</button>
            <button class="profile-page">${t(language, 'profile')}</button>
            <button class="ranking-page">${t(language, 'ranking')}</button>
            <button class="settings">${t(language, 'settings')}</button>
            <button class="logout-account">${t(language, 'logout')}</button>
          </div>
        ` : ''}
        <div class="version">Version ${GAME_VERSION}</div>
      </section>
    `;

    const loginIdentifier = element.querySelector<HTMLInputElement>('.login-identifier');
    const loginPassword = element.querySelector<HTMLInputElement>('.login-password');
    const registerUsername = element.querySelector<HTMLInputElement>('.register-username');
    const registerEmail = element.querySelector<HTMLInputElement>('.register-email');
    const registerPassword = element.querySelector<HTMLInputElement>('.register-password');
    const accountMessage = element.querySelector<HTMLElement>('.account-message');
    const setMessage = (message: string, error = false): void => {
      if (!accountMessage) return;
      accountMessage.textContent = message;
      accountMessage.classList.toggle('error', error);
    };
    const runAuth = (task: Promise<void>): void => {
      setMessage('');
      void task.catch((error: unknown) => setMessage(error instanceof Error ? error.message : String(error), true));
    };

    element.querySelector('.start-solo')?.addEventListener('click', () => callbacks.onStartSolo(profile?.playerName ?? initialName));
    element.querySelector('.find-games')?.addEventListener('click', () => callbacks.onFindGames(profile?.playerName ?? initialName));
    element.querySelector('.host-match')?.addEventListener('click', () => callbacks.onHostMatch(profile?.playerName ?? initialName));
    element.querySelector('.settings')?.addEventListener('click', () => callbacks.onSettings());
    element.querySelector('.profile-page')?.addEventListener('click', callbacks.onProfile);
    element.querySelector('.ranking-page')?.addEventListener('click', callbacks.onRanking);
    element.querySelector('.logout-account')?.addEventListener('click', callbacks.onLogout);
    element.querySelector('.register-account')?.addEventListener('click', () => {
      runAuth(callbacks.onRegister(registerUsername?.value ?? '', registerEmail?.value ?? '', registerPassword?.value ?? ''));
    });
    element.querySelector('.login-account')?.addEventListener('click', () => {
      runAuth(callbacks.onLogin(loginIdentifier?.value.trim() ?? '', loginPassword?.value ?? ''));
    });
    element.querySelectorAll<HTMLButtonElement>('.language-flag').forEach((button) => {
      button.addEventListener('click', () => {
        const value = button.dataset.language as LanguageCode | undefined;
        if (!value) return;
        callbacks.onLanguageChange(value, profile?.playerName ?? registerUsername?.value.trim() ?? loginIdentifier?.value.trim());
      });
    });
    this.root.appendChild(element);
    this.element = element;
    loginIdentifier?.focus();
  }

  hide(): void {
    this.element?.remove();
    this.element = null;
  }

  private escape(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
