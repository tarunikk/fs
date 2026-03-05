import { useDispatch, useSelector } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    console.log('filter: ', filter)
    console.log('anecdotes: ', anecdotes)
    if (filter === 'NONE') {
      return anecdotes
    }
    else {
      const filteredAnecdotes = anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
      console.log('Filtered: ', filteredAnecdotes)
      return filteredAnecdotes
    }
  })

  const byVotes = (a, b) => b.votes - a.votes

  return (
    <ul>
      {anecdotes.sort(byVotes).map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => dispatch(vote(anecdote.id))}>vote</button>
          </div>
        </div>
      ))}
    </ul>
  )
}

export default AnecdoteList