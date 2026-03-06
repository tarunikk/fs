import { createSlice } from '@reduxjs/toolkit'

/** 
const filterReducer = (state = 'NONE', action) => {
  switch (action.type) {
  case 'SET_FILTER':
    return action.payload
  default:
    return state
  }
}

export const filterChange = (filter) => {
  console.log('filter: ', filter)
  return {
    type: 'SET_FILTER',
    payload: filter
  }
}*/

const initialState = 'NONE'

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    filterChange(state, action) {
      console.log('filter: ', action.payload)
      const newFilter = action.payload
      return state = newFilter
    }
  }
})

export const { filterChange } = filterSlice.actions
export default filterSlice.reducer