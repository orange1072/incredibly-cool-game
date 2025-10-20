import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type GameStats from '../../types/game-stats.types'

const initialState: GameStats['missionProgress'] = {
  wave: 0,
  waveSize: 0,
  amountOfBosses: 0,
  amountOfEnemiesInWave: 0,
}

const missionProgressSlice = createSlice({
  name: 'missionProgress',
  initialState,
  reducers: {
    setWave(state, action: PayloadAction<{ wave: number; size: number }>) {
      state.wave = action.payload.wave
      state.waveSize = action.payload.size
      state.amountOfEnemiesInWave = action.payload.size
    },
    setBossCount(state, action: PayloadAction<number>) {
      state.amountOfBosses = action.payload
    },
    setEnemyCount(
      state,
      action: PayloadAction<{ total: number; remaining: number }>
    ) {
      state.waveSize = action.payload.total
      state.amountOfEnemiesInWave = action.payload.remaining
    },
    resetMissionProgress() {
      return initialState
    },
  },
})

export const { setWave, setBossCount, setEnemyCount, resetMissionProgress } =
  missionProgressSlice.actions

export default missionProgressSlice.reducer
