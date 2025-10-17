import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { SERVER_HOST } from '../constants'

interface User {
  name: string
  secondName: string
  avatar?: string
}

export interface UserState {
  data: User | null
  isLoading: boolean
  avatarUploading: boolean
}

const initialState: UserState = {
  data: null,
  isLoading: false,
  avatarUploading: false,
}

export const fetchUserThunk = createAsyncThunk(
  'user/fetchUserThunk',
  async (_: void) => {
    const url = `${SERVER_HOST}/user`
    return fetch(url).then((res) => res.json())
  }
)

export const updateUserAvatarThunk = createAsyncThunk(
  'user/updateUserAvatarThunk',
  async (avatar: File) => {
    const url = `${SERVER_HOST}/user/profile/avatar`
    const formData = new FormData()
    formData.append('avatar', avatar)
    return fetch(url, {
      method: 'PUT',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then((res) => res.json())
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
      .addCase(updateUserAvatarThunk.pending.type, (state) => {
        state.avatarUploading = true
      })
      .addCase(
        updateUserAvatarThunk.fulfilled.type,
        (state, { payload }: PayloadAction<{ avatar: string }>) => {
          if (state.data) {
            state.data.avatar = payload.avatar
          }
          state.avatarUploading = false
        }
      )
      .addCase(updateUserAvatarThunk.rejected.type, (state) => {
        state.avatarUploading = false
      })
  },
})

export const selectUser = (state: RootState) => state.user.data

export default userSlice.reducer
