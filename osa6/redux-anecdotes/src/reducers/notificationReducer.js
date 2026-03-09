import { createSlice } from '@reduxjs/toolkit'

const initialState = null
const notifSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      console.log(state, action)
      const newNotification = action.payload
      console.log(newNotification)
      return newNotification
    },
    setNull() {
      return null
    }
  }
})

export const { setNotification, setNull } = notifSlice.actions
export default notifSlice.reducer