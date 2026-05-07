import type { PlayerManager } from './PlayerManager';
import type { World } from './World';
import { BotController } from './BotController';

export class BotManager {
  private readonly controllers: BotController[] = [];

  addBotController(controller: BotController): void {
    this.controllers.push(controller);
  }

  update(deltaSeconds: number, world: World, playerManager: PlayerManager): void {
    for (const controller of this.controllers) {
      controller.update(deltaSeconds, world, playerManager);
    }
  }

  clear(): void {
    this.controllers.length = 0;
  }
}
