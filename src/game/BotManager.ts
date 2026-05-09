import type { PlayerManager } from './PlayerManager';
import type { World } from './World';
import { BotController } from './BotController';

export class BotManager {
  private readonly controllers: BotController[] = [];

  addBotController(controller: BotController): void {
    this.controllers.push(controller);
  }

  update(deltaSeconds: number, world: World, playerManager: PlayerManager): void {
    const objectTargetClaims = this.createObjectTargetClaims();
    for (const controller of this.controllers) {
      this.adjustClaim(objectTargetClaims, controller.getClaimedObjectTargetId(), -1);
      controller.update(deltaSeconds, world, playerManager, objectTargetClaims);
      this.adjustClaim(objectTargetClaims, controller.getClaimedObjectTargetId(), 1);
    }
  }

  clear(): void {
    this.controllers.length = 0;
  }

  private createObjectTargetClaims(): Map<string, number> {
    const claims = new Map<string, number>();
    for (const controller of this.controllers) {
      this.adjustClaim(claims, controller.getClaimedObjectTargetId(), 1);
    }
    return claims;
  }

  private adjustClaim(claims: Map<string, number>, targetId: string | null, delta: number): void {
    if (!targetId) {
      return;
    }

    const next = (claims.get(targetId) ?? 0) + delta;
    if (next <= 0) {
      claims.delete(targetId);
      return;
    }
    claims.set(targetId, next);
  }
}
