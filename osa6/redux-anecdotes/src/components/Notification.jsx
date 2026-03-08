import store from "../store"

const Notification = ( ) => {

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  return <div style={style}>{store.getState().notification}</div>
}

export default Notification
