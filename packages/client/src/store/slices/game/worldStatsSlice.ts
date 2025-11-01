import { createSlice } from '@reduxjs/toolkit';
import type GameStats from '@/types/game-stats.types';

const BASE_THRESHOLD = 500;

const computeThreshold = (level: number) =>
  Math.round(BASE_THRESHOLD * Math.pow(1.1, Math.max(level - 1, 0)));

const initialState: GameStats['worldStats'] = {
  level: 1,
  enemiesKilled: 0,
  bossesKilled: 0,
  killProgress: 0,
  nextLevelThreshold: computeThreshold(1),
};

const worldStatsSlice = createSlice({
  name: 'worldStats',
  initialState,
  reducers: {
    countFrag(state) {
      state.enemiesKilled += 1;
      state.killProgress += 1;

      while (state.killProgress >= state.nextLevelThreshold) {
        state.killProgress -= state.nextLevelThreshold;
        state.level += 1;
        state.nextLevelThreshold = computeThreshold(state.level);
      }
    },
    countBossFrag(state) {
      state.bossesKilled += 1;
    },
    worldLevelUp(state) {
      state.level += 1;
      state.nextLevelThreshold = computeThreshold(state.level);
      state.killProgress = Math.min(
        state.killProgress,
        state.nextLevelThreshold
      );
    },
    resetWorldStats() {
      return initialState;
    },
  },
});

export const { countFrag, countBossFrag, worldLevelUp, resetWorldStats } =
  worldStatsSlice.actions;

export default worldStatsSlice.reducer;
