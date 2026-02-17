import { useState } from 'react'

// 1.12-1.14
const Button = (props) => (
  <button onClick={props.handleClick} > {props.text} </button>
)

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getMostLiked(votes) { 
  var maxVotes = votes[0]
  var maxIndex = 0
  for(let i = 1; i< votes.length; i++) {
    if (votes[i]> maxVotes) {
      maxIndex = i
      maxVotes = votes[i]
    }
  }
  console.log('index of most liked: ', maxIndex)
  return maxIndex
}

const votes = [
  0, 0, 0, 0, 0, 0, 0, 0
]

const copy = [...votes]


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]


  const [selected, setSelected] = useState(0)
  const [vote, setVote] = useState(0)
  const [mostVoted, setMostVoted] = useState(0)


  const randomAnecdote = () => setSelected(getRandomInt(anecdotes.length))
  const addVote = () => {
    copy[selected] += 1
    setVote(copy[selected])
    mostVotedAnecdote()
    console.log('copy: ', copy)
    console.log('selected: ',selected)
  }

  const mostVotedAnecdote = () => setMostVoted(getMostLiked(copy))

  votes[selected] = vote


  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <p>Has {copy[selected]} votes </p>

      <Button handleClick= {addVote} text = "Vote"/>
      <Button handleClick= {randomAnecdote} text = "Give anecdote"/>

      <h1>Anecdote with most votes</h1>
      {anecdotes[mostVoted]}
      <p>Has {copy[mostVoted]} votes </p>
    </div>
  )

}

export default App
