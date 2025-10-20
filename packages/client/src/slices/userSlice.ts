import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { SERVER_HOST } from '../constants'
import { userApi } from '../api'

interface User {
  name: string
  secondName: string
  avatar?: string
}

export interface UserState {
  data: User | null
  isLoading: boolean
}

const initialState: UserState = {
  data: null,
  isLoading: false,
}

export const fetchUserThunk = createAsyncThunk(
  'user/fetchUserThunk',
  async (_: void) => {
    const url = `${SERVER_HOST}/user`
    return fetch(url).then((res) => res.json())
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserThunk.pending.type, (state) => {
        state.data = null
        state.isLoading = true
      })
      .addCase(
        fetchUserThunk.fulfilled.type,
        (state, { payload }: PayloadAction<User>) => {
          state.data = payload
          state.isLoading = false
        }
      )
      .addCase(fetchUserThunk.rejected.type, (state) => {
        state.isLoading = false
      })
      .addMatcher(
        userApi.endpoints.updateUserAvatar.matchFulfilled,
        (state, { payload }) => {
          if (state.data) {
            state.data.avatar = payload.avatar
          }
        }
      )
  },
})

export const selectUser = (state: RootState) => state.user.data

export default userSlice.reducer
