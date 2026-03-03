import ReactDOM from 'react-dom/client'
import { legacy_createStore as createStore } from 'redux'

// reducerissa tapana käyttää if sijaan switch
const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    case 'ZERO':
      return 0
    default:
      return state
  }
}

const store = createStore(counterReducer)


const App = () => {
  return (
    <div>
      <div>{store.getState()}</div>
      <button onClick={() => store.dispatch({ type: 'INCREMENT' })}>
        plus
      </button>
      <button onClick={() => store.dispatch({ type: 'DECREMENT' })}>
        minus
      </button>
      <button onClick={() => store.dispatch({ type: 'ZERO' })}>
        zero
      </button>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App />)
}

// storen tilan saa selville metodilla getState -> tulostetaan konsoliin 0 3 -1:

console.log(store.getState())
// storen tila on ensin 0

store.dispatch({type: 'INCREMENT'})
store.dispatch({type: 'INCREMENT'})
store.dispatch({type: 'INCREMENT'})
console.log(store.getState())
// kolmen INCREMENT-actionin jälkeen tila on 3

store.dispatch({type: 'ZERO'})
store.dispatch({type: 'DECREMENT'})
console.log(store.getState())
//  lopulta actionien ZERO ja DECREMENT jälkeen -1

store.dispatch({type: 'ZERO'})

// tulostetaan jokainen storen muutos konsoliin:
store.subscribe(() => {
  const storeNow = store.getState()
  console.log(storeNow)
})

store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'ZERO' })
store.dispatch({ type: 'DECREMENT' })
// tulostuu 1 2 3 0 -1

renderApp()
store.subscribe(renderApp)