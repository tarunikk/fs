import { useState } from 'react'

const Statistics = (prop1, prop2, prop3) => {

  const all = prop1 + prop2 + prop3

  if (all < 1) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    )
  }
  
  return(
    <div>
      <StatisticLine text="Good" value ={prop1} />
      <StatisticLine text="Neutral" value ={prop2} />
      <StatisticLine text="Bad" value ={prop3} />
      <StatisticLine text="All" value ={all} />
      <StatisticLine text="Average" value ={(prop1-prop3)/all} />
      <StatisticLine text="Positive" value = {prop1/all*100} percent = {'%'}/> 
    </div>
  )
}

const StatisticLine = (parts) => {
  return (
    <div>
      <p>{parts.text} {parts.value} {parts.percent}</p>
    </div>
  )
}

const Button = (props) => (
  <button onClick={props.handleClick} > {props.text} </button>
)

const App = () => {

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGood = () => setGood(good+1)
  const increaseNeutral = () => setNeutral(neutral+1)
  const increaseBad = () => setBad(bad+1)

  return (
    <div>
      <h1>Give feedback</h1>
      <Button handleClick= {increaseGood} text = "Good"/>
      <Button handleClick= {increaseNeutral} text = "Neutral"/>
      <Button handleClick= {increaseBad} text = "Bad"/>

      <h1>Statistics</h1>
      {Statistics(good, neutral, bad)}
    </div>
  )
}

export default App