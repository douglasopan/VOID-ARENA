import type { AudioManager } from '../audio/AudioManager';
import { HOLE_RIM_STYLE_OPTIONS, LANGUAGE_OPTIONS, RIM_COLORS } from '../shared/constants';
import { t } from '../i18n/I18n';
import type { HoleRimStyle, LanguageCode } from '../shared/types';
import type { HudDisplayKey, HudDisplaySettings } from './HUD';

export interface PauseCallbacks {
  onResume: () => void;
  onBackToMenu: () => void;
  onChatToggle: (enabled: boolean) => void;
  onDeathCameraToggle?: (enabled: boolean) => void;
  onHudDisplayToggle?: (key: HudDisplayKey, visible: boolean) => void;
  onNextMusic?: () => void;
  onHoleAppearanceChange?: (rimColor: string, rimStyle: HoleRimStyle) => void;
  onLanguageChange?: (language: LanguageCode) => void;
}

export class PauseMenu {
  private element: HTMLDivElement | null = null;

  constructor(
    private readonly root: HTMLElement,
    private readonly audioManager: AudioManager
  ) {}

  show(
    callbacks: PauseCallbacks,
    options: {
      chatEnabled: boolean;
      inMatch: boolean;
      deathCameraEnabled?: boolean;
      hudDisplaySettings?: HudDisplaySettings;
      holeRimColor?: string;
      holeRimStyle?: HoleRimStyle;
      language?: LanguageCode;
    }
  ): void {
    this.hide();
    const element = document.createElement('div');
    element.className = 'pause-screen';
    const hudSettings = options.hudDisplaySettings;
    const language = options.language ?? 'en';
    const enabledText = t(language, 'enabled');
    const disabledText = t(language, 'disabled');
    element.innerHTML = `
      <section class="menu-panel narrow">
        <h2>${options.inMatch ? t(language, 'paused') : t(language, 'settings')}</h2>
        <div class="form-grid">
          <label class="field">${t(language, 'soundEffects')}
            <div class="range-row"><input class="sfx" type="range" min="0" max="100" value="${Math.round(this.audioManager.getSfxVolume() * 100)}" /><span class="sfx-value"></span></div>
          </label>
          <label class="field">${t(language, 'music')}
            <div class="range-row"><input class="music" type="range" min="0" max="100" value="${Math.round(this.audioManager.getMusicVolume() * 100)}" /><span class="music-value"></span></div>
          </label>
          <div class="field">
            <label>${t(language, 'musicTrack')}</label>
            <button class="next-music" type="button">${t(language, 'nextTrack')}</button>
          </div>
          <div class="field">
            <label>${t(language, 'chat')}</label>
            <button class="toggle chat-toggle ${options.chatEnabled ? 'active' : ''}">${options.chatEnabled ? enabledText : disabledText}</button>
          </div>
          <div class="field">
            <label>${t(language, 'deathCamera')}</label>
            <button class="toggle death-camera-toggle ${options.deathCameraEnabled !== false ? 'active' : ''}">${options.deathCameraEnabled !== false ? enabledText : disabledText}</button>
          </div>
          <label class="field">
            ${t(language, 'language')}
            <select class="language-select">
              ${LANGUAGE_OPTIONS.map((option) => `<option value="${option.value}" ${option.value === language ? 'selected' : ''}>${option.label}</option>`).join('')}
            </select>
          </label>
          <div class="field hole-appearance-field">
            <label>${t(language, 'holeBorder')}</label>
            <div class="rim-swatch-grid">
              ${RIM_COLORS.map((color) => `
                <button
                  class="rim-swatch ${color === (options.holeRimColor ?? RIM_COLORS[0]) ? 'active' : ''}"
                  type="button"
                  data-rim-color="${color}"
                  aria-label="Hole border color ${color}"
                  style="--rim-color: ${color}"
                ></button>
              `).join('')}
            </div>
            <div class="segmented rim-style-segment">
              ${HOLE_RIM_STYLE_OPTIONS.map((style) => `
                <button
                  class="${style.value === (options.holeRimStyle ?? 'neon') ? 'active' : ''}"
                  type="button"
                  data-rim-style="${style.value}"
                >${style.label}</button>
              `).join('')}
            </div>
          </div>
          ${hudSettings ? `
            <div class="field hud-options-field">
              <label>${t(language, 'hudDisplay')}</label>
              <div class="hud-toggle-list pause-hud-toggle-list">
                ${this.hudToggleMarkup('stats', 'Stats', hudSettings.stats)}
                ${this.hudToggleMarkup('leaderboard', 'Leaderboard', hudSettings.leaderboard)}
                ${this.hudToggleMarkup('chat', 'Chat window', hudSettings.chat)}
                ${this.hudToggleMarkup('powerups', 'Powerups', hudSettings.powerups)}
                ${this.hudToggleMarkup('zoom', 'Zoom buttons', hudSettings.zoom)}
                ${this.hudToggleMarkup('help', 'Controls hint', hudSettings.help)}
              </div>
            </div>
          ` : ''}
        </div>
        <div class="button-grid">
          <button class="primary resume">${options.inMatch ? t(language, 'resume') : t(language, 'back')}</button>
          ${options.inMatch ? `<button class="danger back-menu">${t(language, 'backToMenu')}</button>` : ''}
        </div>
      </section>
    `;

    const sfx = element.querySelector<HTMLInputElement>('.sfx');
    const music = element.querySelector<HTMLInputElement>('.music');
    const sfxValue = element.querySelector<HTMLElement>('.sfx-value');
    const musicValue = element.querySelector<HTMLElement>('.music-value');
    const syncValues = (): void => {
      if (sfxValue && sfx) sfxValue.textContent = `${sfx.value}%`;
      if (musicValue && music) musicValue.textContent = `${music.value}%`;
    };
    syncValues();
    sfx?.addEventListener('input', () => {
      this.audioManager.setSfxVolume(Number(sfx.value) / 100);
      syncValues();
    });
    music?.addEventListener('input', () => {
      this.audioManager.setMusicVolume(Number(music.value) / 100);
      syncValues();
    });
    element.querySelector<HTMLButtonElement>('.next-music')?.addEventListener('click', () => callbacks.onNextMusic?.());

    let chatEnabled = options.chatEnabled;
    const chatToggle = element.querySelector<HTMLButtonElement>('.chat-toggle');
    chatToggle?.addEventListener('click', () => {
      chatEnabled = !chatEnabled;
      chatToggle.classList.toggle('active', chatEnabled);
      chatToggle.textContent = chatEnabled ? enabledText : disabledText;
      callbacks.onChatToggle(chatEnabled);
    });
    let deathCameraEnabled = options.deathCameraEnabled !== false;
    const deathCameraToggle = element.querySelector<HTMLButtonElement>('.death-camera-toggle');
    deathCameraToggle?.addEventListener('click', () => {
      deathCameraEnabled = !deathCameraEnabled;
      deathCameraToggle.classList.toggle('active', deathCameraEnabled);
      deathCameraToggle.textContent = deathCameraEnabled ? enabledText : disabledText;
      callbacks.onDeathCameraToggle?.(deathCameraEnabled);
    });
    const languageSelect = element.querySelector<HTMLSelectElement>('.language-select');
    languageSelect?.addEventListener('change', () => {
      callbacks.onLanguageChange?.(languageSelect.value as LanguageCode);
    });
    let rimColor = options.holeRimColor ?? RIM_COLORS[0];
    let rimStyle: HoleRimStyle = options.holeRimStyle ?? 'neon';
    const emitHoleAppearance = (): void => callbacks.onHoleAppearanceChange?.(rimColor, rimStyle);
    element.querySelectorAll<HTMLButtonElement>('.rim-swatch').forEach((button) => {
      button.addEventListener('click', () => {
        rimColor = button.dataset.rimColor || RIM_COLORS[0];
        element.querySelectorAll('.rim-swatch').forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        emitHoleAppearance();
      });
    });
    element.querySelectorAll<HTMLButtonElement>('.rim-style-segment button').forEach((button) => {
      button.addEventListener('click', () => {
        rimStyle = (button.dataset.rimStyle as HoleRimStyle | undefined) ?? 'neon';
        element.querySelectorAll('.rim-style-segment button').forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        emitHoleAppearance();
      });
    });
    element.querySelectorAll<HTMLButtonElement>('.hud-toggle-row').forEach((button) => {
      button.addEventListener('click', () => {
        const key = button.dataset.displayKey as HudDisplayKey | undefined;
        if (!key) {
          return;
        }

        const visible = button.getAttribute('aria-pressed') !== 'true';
        button.classList.toggle('active', visible);
        button.setAttribute('aria-pressed', String(visible));
        const value = button.querySelector('strong');
        if (value) {
          value.textContent = visible ? 'Hide' : 'Show';
        }
        callbacks.onHudDisplayToggle?.(key, visible);
      });
    });
    element.querySelector('.resume')?.addEventListener('click', callbacks.onResume);
    element.querySelector('.back-menu')?.addEventListener('click', callbacks.onBackToMenu);
    this.root.appendChild(element);
    this.element = element;
  }

  hide(): void {
    this.element?.remove();
    this.element = null;
  }

  private hudToggleMarkup(key: HudDisplayKey, label: string, visible: boolean): string {
    return `
      <button class="hud-toggle-row ${visible ? 'active' : ''}" type="button" data-display-key="${key}" aria-pressed="${visible}">
        <span>${label}</span>
        <strong>${visible ? 'Hide' : 'Show'}</strong>
      </button>
    `;
  }
}
