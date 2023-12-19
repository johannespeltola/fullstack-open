import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearNotification } from '../reducers/notificationReducer'

const Notification = () => {
  const dispatch = useDispatch()
  const notification = useSelector((state) => state.notification)
  const timeout = useRef()

  useEffect(() => {
    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }, [notification])


  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  if (notification) return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification