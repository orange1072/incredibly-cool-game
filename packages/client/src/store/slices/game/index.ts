import { combineReducers } from '@reduxjs/toolkit';
import worldStatsReducer from './worldStatsSlice';
import missionProgressReducer from './missionProgressSlice';
import modifiersReducer from './modifiersSlice';
import playerReducer from './playerSlice';
import levelRewardsReducer from './levelRewardsSlice';

export const gameReducer = combineReducers({
  worldStats: worldStatsReducer,
  missionProgress: missionProgressReducer,
  modifiers: modifiersReducer,
  player: playerReducer,
  levelRewards: levelRewardsReducer,
});

export default gameReducer;

export {
  countFrag,
  countBossFrag,
  worldLevelUp,
  resetWorldStats,
} from './worldStatsSlice';
export {
  setWave,
  setBossCount,
  setEnemyCount,
  resetMissionProgress,
} from './missionProgressSlice';
export {
  setDamageModifier,
  setAttackSpeedModifier,
  setMovementSpeedModifier,
  setHealthModifier,
  setXpModifier,
  resetModifiers,
} from './modifiersSlice';
export {
  levelUp,
  setPlayerHealth,
  setPlayerXp,
  addMoney,
  spendMoney,
  addInventoryItem,
  removeInventoryItem,
  setAmmo,
  adjustAmmo,
  resetPlayer,
} from './playerSlice';
export {
  openLevelRewards,
  updateLevelRewardsPending,
  setLevelRewardsOptions,
  closeLevelRewards,
} from './levelRewardsSlice';

import type { RootState } from '../../store';

export const getWorldStats = (state: RootState) => state.game.worldStats;
export const getMissionProgress = (state: RootState) =>
  state.game.missionProgress;
export const getModifiers = (state: RootState) => state.game.modifiers;
export const getPlayerState = (state: RootState) => state.game.player;
export const getExperience = (state: RootState) => state.game.player.xp;
export const getInventory = (state: RootState) => state.game.player.inventory;
export const getLevelRewards = (state: RootState) => state.game.levelRewards;
