import * as THREE from 'three';

export interface InputCallbacks {
  onEscape: () => void;
  onEnter: () => void;
}

export class InputManager {
  private readonly pressed = new Set<string>();
  private readonly movement = new THREE.Vector3();

  constructor(private readonly callbacks: InputCallbacks) {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.clear);
  }

  getMovementVector(): THREE.Vector3 {
    this.movement.set(0, 0, 0);
    if (this.pressed.has('KeyW') || this.pressed.has('ArrowUp')) this.movement.z -= 1;
    if (this.pressed.has('KeyS') || this.pressed.has('ArrowDown')) this.movement.z += 1;
    if (this.pressed.has('KeyA') || this.pressed.has('ArrowLeft')) this.movement.x -= 1;
    if (this.pressed.has('KeyD') || this.pressed.has('ArrowRight')) this.movement.x += 1;

    if (this.movement.lengthSq() > 1) {
      this.movement.normalize();
    }

    return this.movement;
  }

  wantsBoost(): boolean {
    return this.pressed.has('ShiftLeft') || this.pressed.has('ShiftRight') || this.pressed.has('Space');
  }

  dispose(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.clear);
  }

  clear = (): void => {
    this.pressed.clear();
  };

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.callbacks.onEscape();
      return;
    }

    if (event.key === 'Enter') {
      this.callbacks.onEnter();
      return;
    }

    if (this.isTypingTarget(event.target)) {
      return;
    }

    this.pressed.add(event.code);
  };

  private readonly handleKeyUp = (event: KeyboardEvent): void => {
    this.pressed.delete(event.code);
  };

  private isTypingTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) {
      return false;
    }

    const tagName = target.tagName.toLowerCase();
    return tagName === 'input' || tagName === 'textarea' || target.isContentEditable;
  }
}
