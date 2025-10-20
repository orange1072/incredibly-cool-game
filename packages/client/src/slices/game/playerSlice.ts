import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type GameStats from '../../types/game-stats.types';
import type { inventoryItem } from '../../types/game-stats.types';
import type { ProjectileKind } from '../../types/component.types';

type AmmoDeltaPayload = {
  kind: ProjectileKind;
  amount: number;
};

type PlayerXpPayload = {
  current: number;
  toNext: number;
};

const initialState: GameStats['player'] = {
  level: 0,
  hp: 0,
  xp: 0,
  xpToNext: 100,
  money: 0,
  inventory: ['knife'],
  ammo: {
    shotgun: 0,
    bullet: 0,
    rocket: 0,
    plasma: 0,
  },
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    levelUp(state) {
      state.level += 1;
    },
    setPlayerHealth(state, action: PayloadAction<number>) {
      state.hp = action.payload;
    },
    setPlayerXp(state, action: PayloadAction<PlayerXpPayload>) {
      state.xp = action.payload.current;
      state.xpToNext = action.payload.toNext;
    },
    addMoney(state, action: PayloadAction<number>) {
      state.money += action.payload;
    },
    spendMoney(state, action: PayloadAction<number>) {
      state.money = Math.max(0, state.money - action.payload);
    },
    addInventoryItem(state, action: PayloadAction<inventoryItem>) {
      if (!state.inventory.includes(action.payload)) {
        state.inventory.push(action.payload);
      }
    },
    removeInventoryItem(state, action: PayloadAction<inventoryItem>) {
      state.inventory = state.inventory.filter(
        (item) => item !== action.payload
      );
    },
    setAmmo(state, action: PayloadAction<Record<ProjectileKind, number>>) {
      state.ammo = { ...state.ammo, ...action.payload };
    },
    adjustAmmo(state, action: PayloadAction<AmmoDeltaPayload>) {
      const { kind, amount } = action.payload;
      state.ammo[kind] = Math.max(0, (state.ammo[kind] ?? 0) + amount);
    },
    resetPlayer() {
      return initialState;
    },
  },
});

export const {
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
} = playerSlice.actions;

export default playerSlice.reducer;
