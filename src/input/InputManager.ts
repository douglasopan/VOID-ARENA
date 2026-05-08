import * as THREE from 'three';

export interface InputCallbacks {
  onEscape: () => void;
  onEnter: () => void;
  onPause?: () => void;
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
  private pointerMoveRoot: HTMLElement | null = null;
  private pointerTarget: { x: number; y: number } | null = null;
  private mouseBoost = false;
  private activeMouseBoostPointerId: number | null = null;

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
    return this.mouseBoost || this.touchBoost || this.pressed.has('ShiftLeft') || this.pressed.has('ShiftRight') || this.pressed.has('Space');
  }

  bindPointerMoveRoot(root: HTMLElement): void {
    if (this.pointerMoveRoot === root) {
      return;
    }

    this.unbindPointerMoveRoot();
    this.pointerMoveRoot = root;
    root.addEventListener('pointerdown', this.handlePointerTargetDown);
    root.addEventListener('pointermove', this.handlePointerTargetMove);
    root.addEventListener('pointerup', this.handlePointerTargetEnd);
    root.addEventListener('pointercancel', this.handlePointerTargetEnd);
    root.addEventListener('pointerleave', this.handlePointerTargetLeave);
  }

  getPointerTarget(): { x: number; y: number } | null {
    return this.pointerTarget;
  }

  clearPointerTarget(): void {
    this.pointerTarget = null;
    this.activeMouseBoostPointerId = null;
    this.mouseBoost = false;
  }

  setTouchControlsVisible(visible: boolean): void {
    this.touchControls?.classList.toggle('active', visible);
    if (!visible) {
      this.resetTouchMovement();
      this.touchBoost = false;
      this.mouseBoost = false;
    }
  }

  dispose(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.clear);
    this.unbindPointerMoveRoot();
    this.touchControls?.remove();
  }

  clear = (): void => {
    this.pressed.clear();
    this.resetTouchMovement();
    this.touchBoost = false;
    this.mouseBoost = false;
    this.clearPointerTarget();
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
      <div class="touch-action-stack">
        <button class="touch-menu" type="button">MENU</button>
        <button class="touch-boost" type="button">BOOST</button>
      </div>
    `;

    const base = controls.querySelector<HTMLDivElement>('.touch-stick-base');
    const stick = controls.querySelector<HTMLDivElement>('.touch-stick');
    const boost = controls.querySelector<HTMLButtonElement>('.touch-boost');
    const menu = controls.querySelector<HTMLButtonElement>('.touch-menu');
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
    let menuTriggeredAt = 0;
    const triggerMenu = (event: Event): void => {
      event.preventDefault();
      event.stopPropagation();
      const now = performance.now();
      if (now - menuTriggeredAt < 240) {
        return;
      }
      menuTriggeredAt = now;
      this.callbacks.onPause?.();
    };
    menu?.addEventListener('pointerdown', triggerMenu);
    menu?.addEventListener('click', triggerMenu);
    root.appendChild(controls);
  }

  private readonly handlePointerTargetDown = (event: PointerEvent): void => {
    if (!event.isPrimary || event.pointerType === 'touch' || this.isTypingTarget(event.target)) {
      return;
    }

    this.setPointerTarget(event);
    if (event.button === 0) {
      event.preventDefault();
      this.mouseBoost = true;
      this.activeMouseBoostPointerId = event.pointerId;
      this.pointerMoveRoot?.setPointerCapture(event.pointerId);
    }
  };

  private readonly handlePointerTargetMove = (event: PointerEvent): void => {
    if (!event.isPrimary || event.pointerType === 'touch' || this.isTypingTarget(event.target)) {
      return;
    }

    this.setPointerTarget(event);
  };

  private readonly handlePointerTargetEnd = (event: PointerEvent): void => {
    if (this.activeMouseBoostPointerId === event.pointerId || event.button === 0) {
      this.activeMouseBoostPointerId = null;
      this.mouseBoost = false;
    }
  };

  private readonly handlePointerTargetLeave = (event: PointerEvent): void => {
    if (event.pointerType === 'touch') {
      return;
    }

    this.pointerTarget = null;
  };

  private setPointerTarget(event: PointerEvent): void {
    this.pointerTarget = { x: event.clientX, y: event.clientY };
  }

  private unbindPointerMoveRoot(): void {
    if (!this.pointerMoveRoot) {
      return;
    }

    this.pointerMoveRoot.removeEventListener('pointerdown', this.handlePointerTargetDown);
    this.pointerMoveRoot.removeEventListener('pointermove', this.handlePointerTargetMove);
    this.pointerMoveRoot.removeEventListener('pointerup', this.handlePointerTargetEnd);
    this.pointerMoveRoot.removeEventListener('pointercancel', this.handlePointerTargetEnd);
    this.pointerMoveRoot.removeEventListener('pointerleave', this.handlePointerTargetLeave);
    this.pointerMoveRoot = null;
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
