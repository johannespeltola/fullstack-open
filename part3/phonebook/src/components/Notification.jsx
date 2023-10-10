const Notification = ({ message, severity }) => {
  if (!message) {
    return null
  }
  return (
    <div className={severity}>
      {message}
    </div>
  )
}
export default Notification