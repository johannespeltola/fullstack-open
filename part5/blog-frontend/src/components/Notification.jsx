const Notification = ({ message, severity }) => {
  if (!message) {
    return null
  }
  return (
    <div className={severity || 'error'}>
      {message}
    </div>
  )
}
export default Notification