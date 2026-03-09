import { createSlice, current } from "@reduxjs/toolkit"

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    vote(state, action) {
      const id = action.payload
      const anecdoteVoted = state.find(a => a.id === id)
      const changedVotes = {
        ...anecdoteVoted,
        votes: anecdoteVoted.votes +1
      }
      console.log(current(state))
      return state.map(a => (a.id !== id ? a : changedVotes))
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  },
})

export const { createAnecdote, vote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer

/**
export const vote = id => {
  console.log('vote', id)
  return {
    type: 'VOTE',
    payload: { id }
  }
}

export const createAnecdote = (content) => {
  return {
    type: 'NEW_ANECDOTE',
    payload: {
      content,
      id: getId(),
      votes: 0
    }
  }
}

const anecdoteReducer = (state = initialState, action) => {
  console.log('state now: ', state)
  console.log('action', action)
  switch (action.type) {
    case 'VOTE': {
      const id = action.payload.id
      const anecdoteVoted = state.find(a => a.id === id)
      console.log('adding a vote for: ', anecdoteVoted)
      const changedVotes = {
        ...anecdoteVoted,
        votes: anecdoteVoted.votes +1
      }
      return state.map(a => (a.id !== id ? a : changedVotes))
    }
    case 'NEW_ANECDOTE':
      return [...state, action.payload]
  default:
    return state
  }
} */
