import type { AudioManager } from '../audio/AudioManager';
import type { HudDisplayKey, HudDisplaySettings } from './HUD';

export interface PauseCallbacks {
  onResume: () => void;
  onBackToMenu: () => void;
  onChatToggle: (enabled: boolean) => void;
  onDeathCameraToggle?: (enabled: boolean) => void;
  onHudDisplayToggle?: (key: HudDisplayKey, visible: boolean) => void;
  onNextMusic?: () => void;
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
    }
  ): void {
    this.hide();
    const element = document.createElement('div');
    element.className = 'pause-screen';
    const hudSettings = options.hudDisplaySettings;
    element.innerHTML = `
      <section class="menu-panel narrow">
        <h2>${options.inMatch ? 'Paused' : 'Settings'}</h2>
        <div class="form-grid">
          <label class="field">Sound Effects
            <div class="range-row"><input class="sfx" type="range" min="0" max="100" value="${Math.round(this.audioManager.getSfxVolume() * 100)}" /><span class="sfx-value"></span></div>
          </label>
          <label class="field">Music
            <div class="range-row"><input class="music" type="range" min="0" max="100" value="${Math.round(this.audioManager.getMusicVolume() * 100)}" /><span class="music-value"></span></div>
          </label>
          <div class="field">
            <label>Music track</label>
            <button class="next-music" type="button">Next Track</button>
          </div>
          <div class="field">
            <label>Chat</label>
            <button class="toggle chat-toggle ${options.chatEnabled ? 'active' : ''}">${options.chatEnabled ? 'Enabled' : 'Disabled'}</button>
          </div>
          <div class="field">
            <label>Death camera</label>
            <button class="toggle death-camera-toggle ${options.deathCameraEnabled !== false ? 'active' : ''}">${options.deathCameraEnabled !== false ? 'Enabled' : 'Disabled'}</button>
          </div>
          ${hudSettings ? `
            <div class="field hud-options-field">
              <label>HUD display</label>
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
          <button class="primary resume">${options.inMatch ? 'Resume' : 'Back'}</button>
          ${options.inMatch ? '<button class="danger back-menu">Back to Main Menu</button>' : ''}
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
      chatToggle.textContent = chatEnabled ? 'Enabled' : 'Disabled';
      callbacks.onChatToggle(chatEnabled);
    });
    let deathCameraEnabled = options.deathCameraEnabled !== false;
    const deathCameraToggle = element.querySelector<HTMLButtonElement>('.death-camera-toggle');
    deathCameraToggle?.addEventListener('click', () => {
      deathCameraEnabled = !deathCameraEnabled;
      deathCameraToggle.classList.toggle('active', deathCameraEnabled);
      deathCameraToggle.textContent = deathCameraEnabled ? 'Enabled' : 'Disabled';
      callbacks.onDeathCameraToggle?.(deathCameraEnabled);
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
