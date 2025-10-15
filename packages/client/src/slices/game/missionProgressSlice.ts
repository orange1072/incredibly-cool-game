import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type GameStats from '../../types/game-stats.types'

const initialState: GameStats['missionProgress'] = {
  wave: 0,
  amountOfBosses: 0,
  amountOfEnemiesInWave: 0,
}

const missionProgressSlice = createSlice({
  name: 'missionProgress',
  initialState,
  reducers: {
    setWave(state, action: PayloadAction<number>) {
      state.wave = action.payload
    },
    setBossCount(state, action: PayloadAction<number>) {
      state.amountOfBosses = action.payload
    },
    setEnemyCount(state, action: PayloadAction<number>) {
      state.amountOfEnemiesInWave = action.payload
    },
    resetMissionProgress() {
      return initialState
    },
  },
})

export const { setWave, setBossCount, setEnemyCount, resetMissionProgress } =
  missionProgressSlice.actions

export default missionProgressSlice.reducer
