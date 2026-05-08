export enum MatchMode {
  Timed = 'timed',
  LastHoleStanding = 'last-hole-standing',
  TimeTrial = 'time-trial',
  Career = 'career',
  Creative = 'creative'
}

export function getMatchModeLabel(mode: MatchMode): string {
  switch (mode) {
    case MatchMode.LastHoleStanding:
      return 'Last Hole Standing';
    case MatchMode.TimeTrial:
      return 'Time Trial';
    case MatchMode.Career:
      return 'Career Challenge';
    case MatchMode.Creative:
      return 'Creative Freeroam';
    case MatchMode.Timed:
    default:
      return 'Timed Match';
  }
}
