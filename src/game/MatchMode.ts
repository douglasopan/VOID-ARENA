export enum MatchMode {
  Timed = 'timed',
  LastHoleStanding = 'last-hole-standing'
}

export function getMatchModeLabel(mode: MatchMode): string {
  return mode === MatchMode.Timed ? 'Timed Match' : 'Last Hole Standing';
}
