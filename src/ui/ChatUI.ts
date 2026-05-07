import type { ChatMessage } from '../shared/types';

export interface ChatCallbacks {
  onSend: (text: string) => void;
  onVisibilityChange?: (visible: boolean) => void;
}

export class ChatUI {
  private element: HTMLDivElement | null = null;
  private log: HTMLDivElement | null = null;
  private input: HTMLInputElement | null = null;
  private enabled = true;
  private visible = true;
  private callbacks: ChatCallbacks | null = null;

  constructor(private readonly root: HTMLElement) {}

  show(callbacks: ChatCallbacks): void {
    this.callbacks = callbacks;
    if (this.element) {
      this.setEnabled(this.enabled);
      return;
    }

    const element = document.createElement('div');
    element.className = 'chat';
    element.innerHTML = `
      <div class="panel-title">
        <h3>Chat</h3>
        <button class="panel-close close-chat" type="button" aria-label="Close chat">X</button>
      </div>
      <div class="chat-log"></div>
      <input class="chat-input" maxlength="120" placeholder="Press Enter to chat" />
    `;
    this.root.appendChild(element);
    this.element = element;
    this.log = element.querySelector('.chat-log');
    this.input = element.querySelector('.chat-input');
    this.input?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        event.stopPropagation();
        this.sendCurrentMessage();
      }
    });
    const closeChat = (): void => {
      this.setVisible(false);
      this.callbacks?.onVisibilityChange?.(false);
    };
    element.querySelector<HTMLButtonElement>('.close-chat')?.addEventListener('click', closeChat);
    element.querySelector<HTMLButtonElement>('.close-chat')?.addEventListener('pointerup', (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeChat();
    });
    this.applyVisibility();
  }

  clear(): void {
    if (this.log) {
      this.log.innerHTML = '';
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.applyVisibility();
  }

  setVisible(visible: boolean): void {
    this.visible = visible;
    this.applyVisibility();
  }

  isVisible(): boolean {
    return this.visible;
  }

  isInputFocused(): boolean {
    return document.activeElement === this.input;
  }

  handleEnter(): void {
    if (!this.enabled || !this.input) {
      return;
    }

    if (!this.visible) {
      this.setVisible(true);
      this.callbacks?.onVisibilityChange?.(true);
    }

    if (this.isInputFocused()) {
      this.sendCurrentMessage();
      return;
    }

    this.input.focus();
  }

  handleEscape(): boolean {
    if (this.isInputFocused()) {
      this.input?.blur();
      return true;
    }

    return false;
  }

  addMessage(message: ChatMessage): void {
    if (!this.log) {
      return;
    }

    const row = document.createElement('div');
    row.className = `chat-message${message.system ? ' system' : ''}`;
    row.textContent = message.system ? message.text : `${message.sender}: ${message.text}`;
    this.log.appendChild(row);
    this.log.scrollTop = this.log.scrollHeight;
  }

  hide(): void {
    this.element?.remove();
    this.element = null;
    this.log = null;
    this.input = null;
  }

  private applyVisibility(): void {
    this.element?.classList.toggle('disabled', !this.enabled);
    this.element?.classList.toggle('hidden', this.enabled && !this.visible);
  }

  private sendCurrentMessage(): void {
    const text = this.input?.value.trim() ?? '';
    if (!text) {
      this.input?.blur();
      return;
    }

    this.input!.value = '';
    this.callbacks?.onSend(text);
  }
}
