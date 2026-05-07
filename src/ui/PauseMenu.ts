import type { AudioManager } from '../audio/AudioManager';

export interface PauseCallbacks {
  onResume: () => void;
  onBackToMenu: () => void;
  onChatToggle: (enabled: boolean) => void;
  onDeathCameraToggle?: (enabled: boolean) => void;
}

export class PauseMenu {
  private element: HTMLDivElement | null = null;

  constructor(
    private readonly root: HTMLElement,
    private readonly audioManager: AudioManager
  ) {}

  show(callbacks: PauseCallbacks, options: { chatEnabled: boolean; inMatch: boolean; deathCameraEnabled?: boolean }): void {
    this.hide();
    const element = document.createElement('div');
    element.className = 'pause-screen';
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
            <label>Chat</label>
            <button class="toggle chat-toggle ${options.chatEnabled ? 'active' : ''}">${options.chatEnabled ? 'Enabled' : 'Disabled'}</button>
          </div>
          <div class="field">
            <label>Death camera</label>
            <button class="toggle death-camera-toggle ${options.deathCameraEnabled !== false ? 'active' : ''}">${options.deathCameraEnabled !== false ? 'Enabled' : 'Disabled'}</button>
          </div>
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
    element.querySelector('.resume')?.addEventListener('click', callbacks.onResume);
    element.querySelector('.back-menu')?.addEventListener('click', callbacks.onBackToMenu);
    this.root.appendChild(element);
    this.element = element;
  }

  hide(): void {
    this.element?.remove();
    this.element = null;
  }
}
