export interface GameStats {
  zombiesKilled: number;
  timeAlive: string;
  wave: number;
  accuracy: string;
  headshots: number;
}

export const DEFAULT_STATS: GameStats = {
  zombiesKilled: 0,
  timeAlive: '00:00',
  wave: 1,
  accuracy: '0%',
  headshots: 0,
} as const;
