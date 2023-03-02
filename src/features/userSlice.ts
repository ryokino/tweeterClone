import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../app/store'

// userSlice を createSlice で作成
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {
      uid: '',
      photoUrl: '',
      displayName: '',
    },
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload
    },
    logout: state => {
      state.user = {
        uid: '',
        photoUrl: '',
        displayName: '',
      }
    },
  },
})

// export login, logout
export const { login, logout } = userSlice.actions

// export selectUser
export const selectUser = (state: RootState) => state.user.user

export default userSlice.reducer
