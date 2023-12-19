/* eslint-disable react/prop-types */
import { createContext, useReducer, useContext, useEffect, useRef } from 'react'

const notificationReducer = (state, { type, payload }) => {
  switch (type) {
    case 'SET':
      return payload
    case 'CLEAR':
      return ''
    default:
      return state
  }
}


const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, 0)
  const timeout = useRef()

  useEffect(() => {
    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = setTimeout(() => {
      notificationDispatch({ type: 'CLEAR' })
    }, 5000)
  }, [notification])

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const [notification, _dispatch] = useContext(NotificationContext)
  return notification
}

export const useNotificationDispatch = () => {
  const [_notification, dispatch] = useContext(NotificationContext)
  return dispatch
}

export default NotificationContext