import { createSlice, current } from '@reduxjs/toolkit'

const initialState = 'a notification message'
const notifSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    changeNotification(state, action) {
      console.log(current(state))
      console.log(action)
      return state
    }
  }
})

export const { changeNotification } = notifSlice.actions
export default notifSlice.reducer