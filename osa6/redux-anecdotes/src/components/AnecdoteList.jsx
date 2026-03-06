import { useDispatch, useSelector } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'

const Anecdote =({ anecdote, handleClick }) => {
  return (
    <li>
      {anecdote.content}
      has {anecdote.votes}
      <button onClick={handleClick}> vote </button>
    </li>
  )
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    console.log('filter: ', filter)
    console.log('anecdotes: ', anecdotes)
  
    if (filter === 'NONE'){
      const unfilteredAnecdotes = anecdotes.map(a => a)
      return unfilteredAnecdotes
    } 
    
    const filteredAnecdotes = anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
    console.log('Filtered: ', filteredAnecdotes)
    return filteredAnecdotes
  })

  
  const byVotes = (a, b) => b.votes - a.votes
  
  return (
    <ul>
      {anecdotes.sort(byVotes).map(anecdote => 
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => dispatch(vote(anecdote.id))}
        />
      )}
    </ul>
  )
}

export default AnecdoteList