  const Notification = ({ message, className }) => {
    console.log(message)
    if (message === null) {
      return null
    }
  
    return (
      <div className={className}>
        {message}
      </div>
    )
  }

  export default Notification