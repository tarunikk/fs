import { configureStore } from '@reduxjs/toolkit'

import noteReducer from './reducer/noteReducer'
import filterReducer from './reducer/filterReducer'

const store = configureStore({
  reducer: {
    notes: noteReducer,
    filter: filterReducer
  }
})

export default store