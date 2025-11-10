import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type GameStats from '@/types/game-stats.types';
import type { PassiveBonusOption } from '@/types/component.types';

type LevelRewardsState = GameStats['levelRewards'];

const initialState: LevelRewardsState = {
  entityId: null,
  pending: 0,
  options: [],
  visible: false,
};

const levelRewardsSlice = createSlice({
  name: 'levelRewards',
  initialState,
  reducers: {
    openLevelRewards(
      state,
      action: PayloadAction<{
        entityId: string;
        pending: number;
        options: PassiveBonusOption[];
      }>
    ) {
      state.entityId = action.payload.entityId;
      state.pending = action.payload.pending;
      state.options = action.payload.options;
      state.visible = true;
    },
    updateLevelRewardsPending(state, action: PayloadAction<number>) {
      state.pending = Math.max(0, action.payload);
    },
    closeLevelRewards() {
      return initialState;
    },
  },
});

export const {
  openLevelRewards,
  updateLevelRewardsPending,
  closeLevelRewards,
} = levelRewardsSlice.actions;

export default levelRewardsSlice.reducer;
