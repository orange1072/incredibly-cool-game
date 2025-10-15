import { createSlice } from '@reduxjs/toolkit'
import type GameStats from '../../types/game-stats.types'

const initialState: GameStats['worldStats'] = {
  level: 1,
  enemiesKilled: 0,
  bossesKilled: 0,
}

const worldStatsSlice = createSlice({
  name: 'worldStats',
  initialState,
  reducers: {
    countFrag(state) {
      state.enemiesKilled += 1
    },
    countBossFrag(state) {
      state.bossesKilled += 1
    },
    worldLevelUp(state) {
      state.level += 1
    },
    resetWorldStats() {
      return initialState
    },
  },
})

export const { countFrag, countBossFrag, worldLevelUp, resetWorldStats } =
  worldStatsSlice.actions

export default worldStatsSlice.reducer
