import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setMessage(state, action) {
      return action.payload
    },
    clearNotification() {
      return ''
    }
  }
})

export const setNotification = (message, timeout = 5) => {
  return async (dispatch) => {
    dispatch(setMessage(message))
    setTimeout(() => {
      dispatch(clearNotification())
    }, timeout * 1000)
  }
}


export const { setMessage, clearNotification, } = notificationSlice.actions
export default notificationSlice.reducer
