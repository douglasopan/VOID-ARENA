import type { PlayerExperience, PlayerLifetimeStats } from '../shared/types';

export function calculateProfileExperience(stats: PlayerLifetimeStats): PlayerExperience {
  const totalXp =
    stats.matchesPlayed * 100 +
    stats.wins * 360 +
    stats.totalEliminations * 120 +
    stats.totalObjectsSwallowed * 8 +
    Math.floor(stats.totalScore / 12) +
    stats.timeTrialWins * 160 +
    stats.careerWins * 220 +
    stats.eliminationRushWins * 180;

  let level = 1;
  let spentXp = 0;
  let nextLevelXp = xpRequiredForNextLevel(level);

  while (totalXp - spentXp >= nextLevelXp) {
    spentXp += nextLevelXp;
    level += 1;
    nextLevelXp = xpRequiredForNextLevel(level);
  }

  const currentLevelXp = Math.max(0, totalXp - spentXp);
  return {
    totalXp,
    level,
    currentLevelXp,
    nextLevelXp,
    progress: nextLevelXp > 0 ? Math.min(1, currentLevelXp / nextLevelXp) : 1
  };
}

function xpRequiredForNextLevel(level: number): number {
  const safeLevel = Math.max(1, Math.floor(level));
  return Math.floor(500 + (safeLevel - 1) * 185 + Math.pow(safeLevel - 1, 1.68) * 62);
}
