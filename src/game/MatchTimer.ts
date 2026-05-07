export class MatchTimer {
  remainingSeconds: number;
  active = true;

  constructor(readonly durationSeconds: number) {
    this.remainingSeconds = durationSeconds;
  }

  update(deltaSeconds: number): void {
    if (!this.active) {
      return;
    }

    this.remainingSeconds = Math.max(0, this.remainingSeconds - deltaSeconds);
  }

  get complete(): boolean {
    return this.remainingSeconds <= 0;
  }

  format(): string {
    const seconds = Math.ceil(this.remainingSeconds);
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;
    return `${minutes}:${remainder.toString().padStart(2, '0')}`;
  }
}
