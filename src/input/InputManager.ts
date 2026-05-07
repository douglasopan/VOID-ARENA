import * as THREE from 'three';

export interface InputCallbacks {
  onEscape: () => void;
  onEnter: () => void;
}

export class InputManager {
  private readonly pressed = new Set<string>();
  private readonly movement = new THREE.Vector3();
  private readonly touchMovement = new THREE.Vector3();
  private touchBoost = false;
  private touchControls: HTMLDivElement | null = null;
  private touchStick: HTMLDivElement | null = null;
  private activeMovePointerId: number | null = null;
  private joystickOrigin = { x: 0, y: 0 };
  private readonly joystickRadius = 54;

  constructor(
    private readonly callbacks: InputCallbacks,
    touchRoot?: HTMLElement
  ) {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.clear);
    if (touchRoot) {
      this.createTouchControls(touchRoot);
    }
  }

  getMovementVector(): THREE.Vector3 {
    this.movement.copy(this.touchMovement);
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
    return this.touchBoost || this.pressed.has('ShiftLeft') || this.pressed.has('ShiftRight') || this.pressed.has('Space');
  }

  setTouchControlsVisible(visible: boolean): void {
    this.touchControls?.classList.toggle('active', visible);
    if (!visible) {
      this.resetTouchMovement();
      this.touchBoost = false;
    }
  }

  dispose(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.clear);
    this.touchControls?.remove();
  }

  clear = (): void => {
    this.pressed.clear();
    this.resetTouchMovement();
    this.touchBoost = false;
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

  private createTouchControls(root: HTMLElement): void {
    const controls = document.createElement('div');
    controls.className = 'touch-controls';
    controls.innerHTML = `
      <div class="touch-stick-base" aria-label="Move">
        <div class="touch-stick"></div>
      </div>
      <button class="touch-boost" type="button">BOOST</button>
    `;

    const base = controls.querySelector<HTMLDivElement>('.touch-stick-base');
    const stick = controls.querySelector<HTMLDivElement>('.touch-stick');
    const boost = controls.querySelector<HTMLButtonElement>('.touch-boost');
    this.touchControls = controls;
    this.touchStick = stick;

    base?.addEventListener('pointerdown', (event) => {
      this.activeMovePointerId = event.pointerId;
      base.setPointerCapture(event.pointerId);
      const rect = base.getBoundingClientRect();
      this.joystickOrigin = {
        x: rect.left + rect.width * 0.5,
        y: rect.top + rect.height * 0.5
      };
      this.updateTouchMovement(event.clientX, event.clientY);
    });

    base?.addEventListener('pointermove', (event) => {
      if (this.activeMovePointerId !== event.pointerId) {
        return;
      }
      this.updateTouchMovement(event.clientX, event.clientY);
    });

    const endMove = (event: PointerEvent): void => {
      if (this.activeMovePointerId !== event.pointerId) {
        return;
      }
      this.activeMovePointerId = null;
      this.resetTouchMovement();
    };
    base?.addEventListener('pointerup', endMove);
    base?.addEventListener('pointercancel', endMove);

    boost?.addEventListener('pointerdown', (event) => {
      boost.setPointerCapture(event.pointerId);
      this.touchBoost = true;
      boost.classList.add('active');
    });
    const endBoost = (): void => {
      this.touchBoost = false;
      boost?.classList.remove('active');
    };
    boost?.addEventListener('pointerup', endBoost);
    boost?.addEventListener('pointercancel', endBoost);
    root.appendChild(controls);
  }

  private updateTouchMovement(clientX: number, clientY: number): void {
    const dx = clientX - this.joystickOrigin.x;
    const dy = clientY - this.joystickOrigin.y;
    const length = Math.min(this.joystickRadius, Math.hypot(dx, dy));
    const angle = Math.atan2(dy, dx);
    const x = Math.cos(angle) * length;
    const y = Math.sin(angle) * length;
    this.touchMovement.set(x / this.joystickRadius, 0, y / this.joystickRadius);
    this.touchStick?.style.setProperty('--stick-x', `${x}px`);
    this.touchStick?.style.setProperty('--stick-y', `${y}px`);
  }

  private resetTouchMovement(): void {
    this.touchMovement.set(0, 0, 0);
    this.touchStick?.style.setProperty('--stick-x', '0px');
    this.touchStick?.style.setProperty('--stick-y', '0px');
  }
}
