import type { AudioManager } from '../audio/AudioManager';
import {
  ALL_ENGINE_DISASTER_TYPES,
  ALL_POWER_UP_TYPES,
  ALL_WORLD_OBJECT_KINDS,
  getEngineConfig,
  resetEngineConfig,
  saveEngineConfig,
  splitAudioList,
  type EngineConfig,
  type EngineDisasterType
} from '../admin/EngineConfig';
import type { PowerUpType, WorldObjectKind } from '../shared/types';

const CLIENT_ADMIN_SESSION_KEY = 'void-arena-admin-master-session';
const CLIENT_ADMIN_KEY = (import.meta.env.VITE_ADMIN_MASTER_KEY as string | undefined) || 'VOIDMASTER';
const DEFAULT_ADMIN_SERVER_URL = (import.meta.env.VITE_MULTIPLAYER_SERVER_URL as string | undefined) || 'http://localhost:3001';

interface AdminPanelCallbacks {
  onClose: () => void;
  onApply: (config: EngineConfig) => void;
}

export class AdminEnginePanel {
  private element: HTMLDivElement | null = null;
  private draft: EngineConfig = getEngineConfig();
  private adminServerToken = '';
  private callbacks: AdminPanelCallbacks | null = null;

  constructor(
    private readonly root: HTMLElement,
    private readonly audioManager: AudioManager
  ) {}

  get visible(): boolean {
    return Boolean(this.element);
  }

  show(callbacks: AdminPanelCallbacks): void {
    this.hide();
    this.callbacks = callbacks;
    this.draft = structuredClone(getEngineConfig());
    const element = document.createElement('div');
    element.className = 'admin-engine-screen';
    this.element = element;
    this.root.appendChild(element);
    if (sessionStorage.getItem(CLIENT_ADMIN_SESSION_KEY) === '1') {
      this.renderPanel(callbacks);
    } else {
      this.renderLock(callbacks);
    }
  }

  hide(): void {
    this.element?.remove();
    this.element = null;
  }

  private renderLock(callbacks: AdminPanelCallbacks): void {
    if (!this.element) return;
    this.element.innerHTML = `
      <section class="admin-engine-panel admin-lock-panel">
        <header class="admin-engine-header">
          <div>
            <span class="admin-kicker">ENGINE ACCESS</span>
            <h2>Admin Master</h2>
          </div>
          <button class="panel-close admin-close" type="button">X</button>
        </header>
        <p class="subtitle">Painel escondido para dono/desenvolvedor. Atalho: Ctrl + Alt + E.</p>
        <label class="field">Master key
          <input class="admin-master-key" type="password" autocomplete="off" placeholder="Master access key" />
        </label>
        <div class="admin-status" aria-live="polite"></div>
        <div class="button-grid">
          <button class="primary unlock-admin" type="button">Unlock Engine</button>
          <button class="admin-close" type="button">Close</button>
        </div>
      </section>
    `;

    const input = this.element.querySelector<HTMLInputElement>('.admin-master-key');
    const status = this.element.querySelector<HTMLElement>('.admin-status');
    const unlock = (): void => {
      if ((input?.value ?? '') !== CLIENT_ADMIN_KEY) {
        if (status) status.textContent = 'Master key inválida.';
        return;
      }
      sessionStorage.setItem(CLIENT_ADMIN_SESSION_KEY, '1');
      this.renderPanel(callbacks);
    };
    input?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') unlock();
    });
    this.element.querySelector('.unlock-admin')?.addEventListener('click', unlock);
    this.element.querySelectorAll('.admin-close').forEach((button) => {
      button.addEventListener('click', callbacks.onClose);
    });
    input?.focus();
  }

  private renderPanel(callbacks: AdminPanelCallbacks): void {
    if (!this.element) return;
    this.element.innerHTML = `
      <section class="admin-engine-panel">
        <header class="admin-engine-header">
          <div>
            <span class="admin-kicker">VOID ARENA ENGINE</span>
            <h2>Painel Admin Master</h2>
          </div>
          <button class="panel-close admin-close" type="button">X</button>
        </header>
        <div class="admin-tabs" role="tablist">
          <button class="active" data-tab="mechanics" type="button">Mechanics</button>
          <button data-tab="powerups" type="button">Powerups</button>
          <button data-tab="disasters" type="button">Events</button>
          <button data-tab="generation" type="button">World Props</button>
          <button data-tab="audio" type="button">Audio OGG</button>
          <button data-tab="raw" type="button">Raw JSON</button>
        </div>
        <div class="admin-tab-body"></div>
        <footer class="admin-engine-footer">
          <div class="admin-status" aria-live="polite"></div>
          <div class="admin-actions">
            <button class="reset-admin" type="button">Reset Defaults</button>
            <button class="apply-admin primary" type="button">Apply Engine Config</button>
          </div>
        </footer>
      </section>
    `;

    const body = this.element.querySelector<HTMLElement>('.admin-tab-body');
    const status = this.element.querySelector<HTMLElement>('.admin-status');
    const renderTab = (tab: string): void => {
      if (!body) return;
      switch (tab) {
        case 'powerups':
          body.innerHTML = this.powerUpsMarkup();
          this.bindPowerUps(body);
          break;
        case 'disasters':
          body.innerHTML = this.disastersMarkup();
          this.bindDisasters(body);
          break;
        case 'generation':
          body.innerHTML = this.generationMarkup();
          this.bindGeneration(body);
          break;
        case 'audio':
          body.innerHTML = this.audioMarkup();
          this.bindAudio(body, status);
          break;
        case 'raw':
          body.innerHTML = this.rawMarkup();
          this.bindRaw(body, status);
          break;
        case 'mechanics':
        default:
          body.innerHTML = this.mechanicsMarkup();
          this.bindMechanics(body);
          break;
      }
    };

    this.element.querySelectorAll<HTMLButtonElement>('.admin-tabs button').forEach((button) => {
      button.addEventListener('click', () => {
        this.element?.querySelectorAll('.admin-tabs button').forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        renderTab(button.dataset.tab ?? 'mechanics');
      });
    });
    this.element.querySelector('.apply-admin')?.addEventListener('click', () => {
      this.syncDraftFromOpenTab();
      const saved = saveEngineConfig(this.draft);
      this.draft = structuredClone(saved);
      callbacks.onApply(saved);
      if (status) status.textContent = 'Configuração aplicada. Algumas mudanças de mapa entram na próxima partida.';
    });
    this.element.querySelector('.reset-admin')?.addEventListener('click', () => {
      this.draft = resetEngineConfig();
      callbacks.onApply(this.draft);
      renderTab('mechanics');
      if (status) status.textContent = 'Configuração resetada para defaults.';
    });
    this.element.querySelector('.admin-close')?.addEventListener('click', callbacks.onClose);
    renderTab('mechanics');
  }

  private mechanicsMarkup(): string {
    const g = this.draft.gameplay;
    const b = this.draft.branding;
    return `
      <div class="admin-grid">
        ${this.numberField('Start speed x', 'gameplay.startSpeedMultiplier', g.startSpeedMultiplier, 0.25, 4, 0.05)}
        ${this.numberField('Minimum speed x', 'gameplay.minSpeedMultiplier', g.minSpeedMultiplier, 0.25, 4, 0.05)}
        ${this.numberField('Boost multiplier', 'gameplay.boostMultiplier', g.boostMultiplier, 1, 3.6, 0.05)}
        ${this.numberField('Stamina drain x', 'gameplay.staminaDrainMultiplier', g.staminaDrainMultiplier, 0.1, 4, 0.05)}
        ${this.numberField('Stamina regen x', 'gameplay.staminaRegenMultiplier', g.staminaRegenMultiplier, 0.1, 5, 0.05)}
        ${this.numberField('Magnet strength x', 'gameplay.magnetStrengthMultiplier', g.magnetStrengthMultiplier, 0, 4, 0.05)}
        ${this.numberField('Void contact time x', 'gameplay.objectContactSecondsMultiplier', g.objectContactSecondsMultiplier, 0.15, 5, 0.05)}
        ${this.numberField('Rim suction x', 'gameplay.rimSuctionMultiplier', g.rimSuctionMultiplier, 0, 4, 0.05)}
        ${this.numberField('Falling gravity x', 'gameplay.swallowGravityMultiplier', g.swallowGravityMultiplier, 0.25, 4, 0.05)}
        ${this.numberField('Miss forgiveness x', 'gameplay.objectMissForgiveness', g.objectMissForgiveness, 0.35, 2.4, 0.05)}
        <label class="field">Game title<input data-path="branding.title" value="${escapeHtml(b.title)}" /></label>
        <label class="field">Menu font<input data-path="branding.menuFont" value="${escapeHtml(b.menuFont)}" /></label>
        <label class="field">Text font<input data-path="branding.textFont" value="${escapeHtml(b.textFont)}" /></label>
      </div>
    `;
  }

  private powerUpsMarkup(): string {
    return `<div class="admin-list">${ALL_POWER_UP_TYPES.map((type) => {
      const config = this.draft.powerUps[type];
      return `
        <div class="admin-row">
          <label><input type="checkbox" data-powerup-enabled="${type}" ${config.enabled ? 'checked' : ''} /> ${type}</label>
          <label>Duration <input type="number" min="0" max="120" step="1" data-powerup-duration="${type}" value="${config.durationSeconds}" /></label>
        </div>
      `;
    }).join('')}</div>`;
  }

  private disastersMarkup(): string {
    return `
      <div class="admin-grid compact">
        <label class="admin-check"><input type="checkbox" data-path="disasters.enabled" ${this.draft.disasters.enabled ? 'checked' : ''} /> Events enabled</label>
        ${this.numberField('First event delay x', 'disasters.firstDelayMultiplier', this.draft.disasters.firstDelayMultiplier, 0.2, 6, 0.05)}
        ${this.numberField('Next event delay x', 'disasters.nextDelayMultiplier', this.draft.disasters.nextDelayMultiplier, 0.2, 8, 0.05)}
      </div>
      <div class="admin-list">${ALL_ENGINE_DISASTER_TYPES.map((type) => {
        const config = this.draft.disasters.events[type];
        return `
          <div class="admin-row">
            <label><input type="checkbox" data-disaster-enabled="${type}" ${config.enabled ? 'checked' : ''} /> ${type}</label>
            <label>Weight <input type="number" min="0" max="100" step="1" data-disaster-weight="${type}" value="${config.weight}" /></label>
          </div>
        `;
      }).join('')}</div>
    `;
  }

  private generationMarkup(): string {
    return `
      <div class="admin-grid compact">
        ${this.numberField('Object density x', 'generation.objectDensityMultiplier', this.draft.generation.objectDensityMultiplier, 0.1, 2.5, 0.05)}
        <label class="admin-check"><input type="checkbox" data-path="generation.trafficEnabled" ${this.draft.generation.trafficEnabled ? 'checked' : ''} /> Traffic enabled</label>
        <label class="admin-check"><input type="checkbox" data-path="generation.pedestriansEnabled" ${this.draft.generation.pedestriansEnabled ? 'checked' : ''} /> Pedestrians enabled</label>
        <label class="admin-check"><input type="checkbox" data-path="generation.adsEnabled" ${this.draft.generation.adsEnabled ? 'checked' : ''} /> Ads enabled</label>
      </div>
      <div class="admin-kind-grid">${ALL_WORLD_OBJECT_KINDS.map((kind) => `
        <label class="admin-check"><input type="checkbox" data-kind-enabled="${kind}" ${this.draft.generation.enabledObjectKinds[kind] ? 'checked' : ''} /> ${kind}</label>
      `).join('')}</div>
      <h3>Spawn height offsets</h3>
      <div class="admin-grid compact">
        ${ALL_WORLD_OBJECT_KINDS.map((kind) => this.numberField(
          `${kind} height`,
          `generation.spawnHeightOffsets.${kind}`,
          this.draft.generation.spawnHeightOffsets[kind] ?? 0,
          -0.35,
          1.5,
          0.01
        )).join('')}
      </div>
    `;
  }

  private audioMarkup(): string {
    return `
      <div class="admin-audio-layout">
        <div class="admin-grid">
          <label class="field">Menu music .ogg<textarea data-audio-list="menuMusic" rows="4">${this.draft.audio.menuMusic.join('\n')}</textarea></label>
          <label class="field">Gameplay music .ogg<textarea data-audio-list="mapMusic" rows="4">${this.draft.audio.mapMusic.join('\n')}</textarea></label>
          <label class="field">Hover SFX .ogg<input data-path="audio.uiHover" value="${escapeHtml(this.draft.audio.uiHover)}" /></label>
          <label class="field">Click SFX .ogg<input data-path="audio.uiClick" value="${escapeHtml(this.draft.audio.uiClick)}" /></label>
          <label class="field">Player die SFX .ogg<input data-path="audio.playerDie" value="${escapeHtml(this.draft.audio.playerDie)}" /></label>
        </div>
        <div class="admin-upload-box">
          <h3>Upload/Convert Audio</h3>
          <p class="muted">Aceita .ogg direto. Se enviar .mp3, o servidor admin converte para .ogg com ffmpeg e não mantém o mp3.</p>
          <label class="field">Admin server URL<input class="admin-server-url" value="${DEFAULT_ADMIN_SERVER_URL}" /></label>
          <label class="field">Server master token<input class="admin-server-token" type="password" value="${escapeHtml(this.adminServerToken)}" /></label>
          <label class="field">Target folder
            <select class="admin-audio-folder">
              <option value="music">music</option>
              <option value="sfx">sfx</option>
              <option value="ui">ui</option>
            </select>
          </label>
          <label class="field">Attach to
            <select class="admin-audio-attach">
              <option value="mapMusic">Gameplay music</option>
              <option value="menuMusic">Menu music</option>
              <option value="uiHover">UI hover</option>
              <option value="uiClick">UI click</option>
              <option value="playerDie">Player die</option>
              ${ALL_WORLD_OBJECT_KINDS.map((kind) => `<option value="object:${kind}">Object ${kind}</option>`).join('')}
            </select>
          </label>
          <input class="admin-audio-file" type="file" accept=".ogg,.mp3,audio/ogg,audio/mpeg" />
          <button class="upload-audio primary" type="button">Upload as OGG</button>
          <button class="preview-music" type="button">Preview Next Track</button>
        </div>
      </div>
    `;
  }

  private rawMarkup(): string {
    return `
      <label class="field raw-config-field">Engine JSON
        <textarea class="raw-engine-config" spellcheck="false">${escapeHtml(JSON.stringify(this.draft, null, 2))}</textarea>
      </label>
      <div class="button-grid">
        <button class="import-raw-config" type="button">Import JSON To Draft</button>
        <button class="copy-raw-config" type="button">Copy JSON</button>
      </div>
    `;
  }

  private bindMechanics(root: HTMLElement): void {
    this.bindPathInputs(root);
  }

  private bindPowerUps(root: HTMLElement): void {
    root.querySelectorAll<HTMLInputElement>('[data-powerup-enabled]').forEach((input) => {
      input.addEventListener('change', () => {
        this.draft.powerUps[input.dataset.powerupEnabled as PowerUpType].enabled = input.checked;
      });
    });
    root.querySelectorAll<HTMLInputElement>('[data-powerup-duration]').forEach((input) => {
      input.addEventListener('input', () => {
        this.draft.powerUps[input.dataset.powerupDuration as PowerUpType].durationSeconds = Number(input.value);
      });
    });
  }

  private bindDisasters(root: HTMLElement): void {
    this.bindPathInputs(root);
    root.querySelectorAll<HTMLInputElement>('[data-disaster-enabled]').forEach((input) => {
      input.addEventListener('change', () => {
        this.draft.disasters.events[input.dataset.disasterEnabled as EngineDisasterType].enabled = input.checked;
      });
    });
    root.querySelectorAll<HTMLInputElement>('[data-disaster-weight]').forEach((input) => {
      input.addEventListener('input', () => {
        this.draft.disasters.events[input.dataset.disasterWeight as EngineDisasterType].weight = Number(input.value);
      });
    });
  }

  private bindGeneration(root: HTMLElement): void {
    this.bindPathInputs(root);
    root.querySelectorAll<HTMLInputElement>('[data-kind-enabled]').forEach((input) => {
      input.addEventListener('change', () => {
        this.draft.generation.enabledObjectKinds[input.dataset.kindEnabled as WorldObjectKind] = input.checked;
      });
    });
  }

  private bindAudio(root: HTMLElement, status: HTMLElement | null): void {
    this.bindPathInputs(root);
    root.querySelectorAll<HTMLTextAreaElement>('[data-audio-list]').forEach((textarea) => {
      textarea.addEventListener('input', () => {
        const field = textarea.dataset.audioList as 'menuMusic' | 'mapMusic';
        this.draft.audio[field] = splitAudioList(textarea.value);
      });
    });
    root.querySelector('.preview-music')?.addEventListener('click', () => this.audioManager.nextMusicTrack());
    root.querySelector('.upload-audio')?.addEventListener('click', () => void this.uploadAudio(root, status));
  }

  private bindRaw(root: HTMLElement, status: HTMLElement | null): void {
    const textarea = root.querySelector<HTMLTextAreaElement>('.raw-engine-config');
    root.querySelector('.import-raw-config')?.addEventListener('click', () => {
      try {
        this.draft = JSON.parse(textarea?.value ?? '{}') as EngineConfig;
        if (status) status.textContent = 'JSON importado para o draft. Clique Apply para salvar.';
      } catch {
        if (status) status.textContent = 'JSON inválido.';
      }
    });
    root.querySelector('.copy-raw-config')?.addEventListener('click', () => {
      void navigator.clipboard?.writeText(textarea?.value ?? JSON.stringify(this.draft, null, 2));
      if (status) status.textContent = 'JSON copiado.';
    });
  }

  private bindPathInputs(root: HTMLElement): void {
    root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('[data-path]').forEach((input) => {
      const write = (): void => {
        this.writePath(input.dataset.path ?? '', input instanceof HTMLInputElement && input.type === 'checkbox' ? input.checked : input.value);
      };
      input.addEventListener('input', write);
      input.addEventListener('change', write);
    });
  }

  private syncDraftFromOpenTab(): void {
    if (!this.element) return;
    this.element.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('[data-path]').forEach((input) => {
      this.writePath(input.dataset.path ?? '', input instanceof HTMLInputElement && input.type === 'checkbox' ? input.checked : input.value);
    });
    this.element.querySelectorAll<HTMLTextAreaElement>('[data-audio-list]').forEach((textarea) => {
      const field = textarea.dataset.audioList as 'menuMusic' | 'mapMusic';
      this.draft.audio[field] = splitAudioList(textarea.value);
    });
  }

  private async uploadAudio(root: HTMLElement, status: HTMLElement | null): Promise<void> {
    const file = root.querySelector<HTMLInputElement>('.admin-audio-file')?.files?.[0];
    const serverUrl = root.querySelector<HTMLInputElement>('.admin-server-url')?.value.trim() || DEFAULT_ADMIN_SERVER_URL;
    const token = root.querySelector<HTMLInputElement>('.admin-server-token')?.value ?? '';
    const folder = root.querySelector<HTMLSelectElement>('.admin-audio-folder')?.value ?? 'sfx';
    const attach = root.querySelector<HTMLSelectElement>('.admin-audio-attach')?.value ?? 'mapMusic';
    this.adminServerToken = token;
    if (!file) {
      if (status) status.textContent = 'Escolha um arquivo .ogg ou .mp3.';
      return;
    }
    if (!token) {
      if (status) status.textContent = 'Informe o server master token.';
      return;
    }

    try {
      if (status) status.textContent = 'Enviando/converterndo áudio...';
      const response = await fetch(`${serverUrl.replace(/\/$/, '')}/admin/audio`, {
        method: 'POST',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
          'X-Admin-Token': token,
          'X-Audio-Folder': folder,
          'X-File-Name': encodeURIComponent(file.name)
        },
        body: file
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const result = await response.json() as { path: string };
      this.attachAudioPath(attach, result.path);
      this.syncAudioFieldsAfterUpload(root, attach);
      const saved = saveEngineConfig(this.draft);
      this.draft = structuredClone(saved);
      this.callbacks?.onApply(saved);
      const fileInput = root.querySelector<HTMLInputElement>('.admin-audio-file');
      if (fileInput) {
        fileInput.value = '';
      }
      if (status) status.textContent = `Audio salvo e aplicado: ${result.path}`;
    } catch (error) {
      if (status) status.textContent = `Falha no upload: ${error instanceof Error ? error.message : 'erro desconhecido'}`;
    }
  }

  private attachAudioPath(target: string, path: string): void {
    if (target === 'menuMusic' || target === 'mapMusic') {
      this.draft.audio[target] = [...this.draft.audio[target], path];
      return;
    }
    if (target === 'uiHover' || target === 'uiClick' || target === 'playerDie') {
      this.draft.audio[target] = path;
      return;
    }
    if (target.startsWith('object:')) {
      const kind = target.slice('object:'.length) as WorldObjectKind;
      this.draft.audio.objectSfx[kind] = [...(this.draft.audio.objectSfx[kind] ?? []), path];
    }
  }

  private syncAudioFieldsAfterUpload(root: HTMLElement, target: string): void {
    if (target === 'menuMusic' || target === 'mapMusic') {
      const textarea = root.querySelector<HTMLTextAreaElement>(`[data-audio-list="${target}"]`);
      if (textarea) {
        textarea.value = this.draft.audio[target].join('\n');
      }
      return;
    }

    if (target === 'uiHover' || target === 'uiClick' || target === 'playerDie') {
      const input = root.querySelector<HTMLInputElement>(`[data-path="audio.${target}"]`);
      if (input) {
        input.value = this.draft.audio[target];
      }
    }
  }

  private writePath(path: string, value: string | boolean): void {
    const parts = path.split('.');
    let cursor: Record<string, unknown> = this.draft as unknown as Record<string, unknown>;
    for (const part of parts.slice(0, -1)) {
      cursor = cursor[part] as Record<string, unknown>;
    }
    const key = parts[parts.length - 1];
    const previous = cursor[key];
    cursor[key] = typeof previous === 'number' ? Number(value) : value;
  }

  private numberField(label: string, path: string, value: number, min: number, max: number, step: number): string {
    return `
      <label class="field">${label}
        <input data-path="${path}" type="number" min="${min}" max="${max}" step="${step}" value="${value}" />
      </label>
    `;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
