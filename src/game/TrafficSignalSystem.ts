import type { TrafficSignalDefinition } from '../shared/types';

export type TrafficSignalState = 'green' | 'yellow' | 'red';

const CYCLE_SECONDS = 13.5;
const GREEN_SECONDS = 5.8;
const YELLOW_SECONDS = 1.25;

export function trafficSignalState(signal: TrafficSignalDefinition, elapsedSeconds: number): TrafficSignalState {
  const axisOffset = signal.axis === 'vertical' ? 0 : 0.5;
  const rawPhase = elapsedSeconds / CYCLE_SECONDS + axisOffset + signal.phaseOffset;
  const phase = ((rawPhase % 1) + 1) % 1;
  const seconds = phase * CYCLE_SECONDS;
  if (seconds < GREEN_SECONDS) {
    return 'green';
  }
  if (seconds < GREEN_SECONDS + YELLOW_SECONDS) {
    return 'yellow';
  }
  return 'red';
}

export function trafficSignalCycleSeconds(): number {
  return CYCLE_SECONDS;
}
