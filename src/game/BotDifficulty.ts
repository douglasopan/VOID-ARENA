export type BotDifficulty = 'easy' | 'normal' | 'hard' | 'expert';
export type BotDifficultyMix = 'relaxed' | 'balanced' | 'competitive' | 'chaos';

export interface BotDifficultyProfile {
  difficulty: BotDifficulty;
  label: string;
  shortLabel: string;
  reactionMin: number;
  reactionJitter: number;
  mistakeChance: number;
  wanderChance: number;
  directionJitter: number;
  objectAwareness: number;
  preyAwareness: number;
  dangerAwareness: number;
  preyAggression: number;
  objectGreed: number;
  distanceDiscipline: number;
  boostWhenFleeing: number;
  boostWhenChasing: number;
}

export const BOT_DIFFICULTY_PROFILES: Record<BotDifficulty, BotDifficultyProfile> = {
  easy: {
    difficulty: 'easy',
    label: 'Easy',
    shortLabel: 'E',
    reactionMin: 0.46,
    reactionJitter: 0.42,
    mistakeChance: 0.22,
    wanderChance: 0.62,
    directionJitter: 0.58,
    objectAwareness: 0.72,
    preyAwareness: 0.62,
    dangerAwareness: 0.72,
    preyAggression: 0.64,
    objectGreed: 0.76,
    distanceDiscipline: 0.78,
    boostWhenFleeing: 0.54,
    boostWhenChasing: 0.2
  },
  normal: {
    difficulty: 'normal',
    label: 'Normal',
    shortLabel: 'N',
    reactionMin: 0.28,
    reactionJitter: 0.28,
    mistakeChance: 0.1,
    wanderChance: 0.46,
    directionJitter: 0.3,
    objectAwareness: 1,
    preyAwareness: 1,
    dangerAwareness: 1,
    preyAggression: 1,
    objectGreed: 1,
    distanceDiscipline: 1,
    boostWhenFleeing: 0.86,
    boostWhenChasing: 0.62
  },
  hard: {
    difficulty: 'hard',
    label: 'Hard',
    shortLabel: 'H',
    reactionMin: 0.16,
    reactionJitter: 0.16,
    mistakeChance: 0.035,
    wanderChance: 0.28,
    directionJitter: 0.16,
    objectAwareness: 1.22,
    preyAwareness: 1.26,
    dangerAwareness: 1.22,
    preyAggression: 1.28,
    objectGreed: 1.12,
    distanceDiscipline: 1.18,
    boostWhenFleeing: 0.96,
    boostWhenChasing: 0.82
  },
  expert: {
    difficulty: 'expert',
    label: 'Expert',
    shortLabel: 'X',
    reactionMin: 0.08,
    reactionJitter: 0.08,
    mistakeChance: 0.01,
    wanderChance: 0.18,
    directionJitter: 0.07,
    objectAwareness: 1.45,
    preyAwareness: 1.52,
    dangerAwareness: 1.42,
    preyAggression: 1.55,
    objectGreed: 1.25,
    distanceDiscipline: 1.36,
    boostWhenFleeing: 1,
    boostWhenChasing: 0.94
  }
};

const BOT_DIFFICULTY_MIXES: Record<BotDifficultyMix, BotDifficulty[]> = {
  relaxed: ['easy', 'easy', 'easy', 'normal', 'normal', 'hard'],
  balanced: ['easy', 'normal', 'normal', 'hard', 'normal', 'hard', 'expert'],
  competitive: ['normal', 'hard', 'hard', 'expert', 'hard', 'expert'],
  chaos: ['easy', 'expert', 'normal', 'hard', 'expert', 'easy', 'hard', 'normal']
};

export function getBotDifficultyForIndex(index: number, mix: BotDifficultyMix): BotDifficulty {
  const sequence = BOT_DIFFICULTY_MIXES[mix] ?? BOT_DIFFICULTY_MIXES.balanced;
  return sequence[index % sequence.length];
}

