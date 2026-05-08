import * as THREE from 'three';
import { getEngineConfig, type ControlAction, type EngineControlsConfig } from '../admin/EngineConfig';

export interface InputCallbacks {
  onEscape: () => void;
  onEnter: () => void;
  onPause?: () => void;
}

export class InputManager {
  private readonly pressed = new Set<string>();
  private readonly movement = new THREE.Vector3();
  private readonly touchMovement = new THREE.Vector3();
  private readonly virtualActions = new Set<ControlAction>();
  private readonly actionPressLatches = new Set<ControlAction>();
  private touchControls: HTMLDivElement | null = null;
  private touchStick: HTMLDivElement | null = null;
  private touchDashButton: HTMLButtonElement | null = null;
  private touchPowerButton: HTMLButtonElement | null = null;
  private activeMovePointerId: number | null = null;
  private joystickOrigin = { x: 0, y: 0 };
  private readonly joystickRadius = 54;
  private pointerMoveRoot: HTMLElement | null = null;
  private pointerTarget: { x: number; y: number } | null = null;
  private mouseBoost = false;
  private activeMouseBoostPointerId: number | null = null;
  private controlsConfig: EngineControlsConfig = getEngineConfig().controls;

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
    if (this.isActionDown('moveUp')) this.movement.z -= 1;
    if (this.isActionDown('moveDown')) this.movement.z += 1;
    if (this.isActionDown('moveLeft')) this.movement.x -= 1;
    if (this.isActionDown('moveRight')) this.movement.x += 1;

    if (this.movement.lengthSq() > 1) {
      this.movement.normalize();
    }

    return this.movement;
  }

  wantsBoost(): boolean {
    return this.isActionDown('boost') || this.mouseBoost;
  }

  consumeDashPress(): boolean {
    return this.consumeActionPress('dash');
  }

  consumePowerPress(): boolean {
    return this.consumeActionPress('power');
  }

  setControlsConfig(config: EngineControlsConfig): void {
    this.controlsConfig = config;
    if (!this.controlsConfig.mouseControlEnabled) {
      this.clearPointerTarget();
    }
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
    if (!this.controlsConfig.mouseControlEnabled) {
      return null;
    }
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
      this.clearVirtualActions();
      this.mouseBoost = false;
    }
  }

  setTouchActionAvailability(options: { dash: boolean; power: boolean }): void {
    this.touchDashButton?.classList.toggle('hidden', !options.dash);
    this.touchPowerButton?.classList.toggle('hidden', !options.power);
    if (!options.dash) {
      this.virtualActions.delete('dash');
      this.actionPressLatches.delete('dash');
      this.touchDashButton?.classList.remove('active');
    }
    if (!options.power) {
      this.virtualActions.delete('power');
      this.actionPressLatches.delete('power');
      this.touchPowerButton?.classList.remove('active');
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
    this.clearVirtualActions();
    this.mouseBoost = false;
    this.clearPointerTarget();
  };

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (this.matchesAction(event.code, 'pause')) {
      event.preventDefault();
      this.callbacks.onEscape();
      return;
    }

    if (this.matchesAction(event.code, 'chat')) {
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
        <div class="touch-secondary-row">
          <button class="touch-dash hidden" type="button">DASH</button>
          <button class="touch-power hidden" type="button">POWER</button>
        </div>
        <button class="touch-boost" type="button">BOOST</button>
      </div>
    `;

    const base = controls.querySelector<HTMLDivElement>('.touch-stick-base');
    const stick = controls.querySelector<HTMLDivElement>('.touch-stick');
    const boost = controls.querySelector<HTMLButtonElement>('.touch-boost');
    const dash = controls.querySelector<HTMLButtonElement>('.touch-dash');
    const power = controls.querySelector<HTMLButtonElement>('.touch-power');
    const menu = controls.querySelector<HTMLButtonElement>('.touch-menu');
    this.touchControls = controls;
    this.touchStick = stick;
    this.touchDashButton = dash;
    this.touchPowerButton = power;

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

    this.bindTouchActionButton(boost, 'boost');
    this.bindTouchActionButton(dash, 'dash');
    this.bindTouchActionButton(power, 'power');
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
    if (!this.controlsConfig.mouseControlEnabled || !event.isPrimary || event.pointerType === 'touch' || this.isTypingTarget(event.target)) {
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
    if (!this.controlsConfig.mouseControlEnabled || !event.isPrimary || event.pointerType === 'touch' || this.isTypingTarget(event.target)) {
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

  private isActionDown(action: ControlAction): boolean {
    return this.virtualActions.has(action) || this.bindingsFor(action).some((code) => this.pressed.has(code));
  }

  private consumeActionPress(action: ControlAction): boolean {
    const pressed = this.isActionDown(action);
    if (!pressed) {
      this.actionPressLatches.delete(action);
      return false;
    }
    if (this.actionPressLatches.has(action)) {
      return false;
    }
    this.actionPressLatches.add(action);
    return true;
  }

  private matchesAction(code: string, action: ControlAction): boolean {
    return this.bindingsFor(action).includes(code);
  }

  private bindingsFor(action: ControlAction): string[] {
    return this.controlsConfig.bindings[action] ?? [];
  }

  private bindTouchActionButton(button: HTMLButtonElement | null, action: ControlAction): void {
    if (!button) {
      return;
    }

    button.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      event.stopPropagation();
      button.setPointerCapture(event.pointerId);
      this.virtualActions.add(action);
      button.classList.add('active');
    });
    const endAction = (event: PointerEvent): void => {
      if (button.hasPointerCapture(event.pointerId)) {
        button.releasePointerCapture(event.pointerId);
      }
      this.virtualActions.delete(action);
      button.classList.remove('active');
    };
    button.addEventListener('pointerup', endAction);
    button.addEventListener('pointercancel', endAction);
    button.addEventListener('pointerleave', endAction);
  }

  private clearVirtualActions(): void {
    this.virtualActions.clear();
    this.actionPressLatches.clear();
    this.touchControls?.querySelectorAll('.touch-boost, .touch-dash, .touch-power').forEach((button) => {
      button.classList.remove('active');
    });
  }
}
