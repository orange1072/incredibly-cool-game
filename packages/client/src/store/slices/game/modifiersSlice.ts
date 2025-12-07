import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type GameStats from '@/types/game-stats.types';

const initialState: GameStats['modifiers'] = {
  damage: 0,
  attackSpeed: 0,
  movementSpeed: 0,
  health: 0,
  xp: 0,
};

const modifiersSlice = createSlice({
  name: 'modifiers',
  initialState,
  reducers: {
    setDamageModifier(state, action: PayloadAction<number>) {
      state.damage = action.payload;
    },
    setAttackSpeedModifier(state, action: PayloadAction<number>) {
      state.attackSpeed = action.payload;
    },
    setMovementSpeedModifier(state, action: PayloadAction<number>) {
      state.movementSpeed = action.payload;
    },
    setHealthModifier(state, action: PayloadAction<number>) {
      state.health = action.payload;
    },
    setXpModifier(state, action: PayloadAction<number>) {
      state.xp = action.payload;
    },
    resetModifiers() {
      return initialState;
    },
  },
});

export const {
  setDamageModifier,
  setAttackSpeedModifier,
  setMovementSpeedModifier,
  setHealthModifier,
  setXpModifier,
  resetModifiers,
} = modifiersSlice.actions;

export default modifiersSlice.reducer;
