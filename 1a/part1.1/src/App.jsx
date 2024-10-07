const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course} />
      <Content part = {[part1, part2, part3]} exercises = {[exercises1, exercises2, exercises3]}/>
      <Total allexercises = {exercises1 +  exercises2 +  exercises3}/>
    </div>
  )
}

const Header = (props) => {
  return (
    <div>
      <h1>{props.course}</h1>
    </div>
  )
}

const Content = (props) => {
  return (
    <div>
        <Part name={props.part[0]} exercises= {props.exercises[0]} /> <Part/>
        <Part name={props.part[1]} exercises= {props.exercises[1]} /> <Part/>
        <Part name={props.part[2]} exercises= {props.exercises[2]} /> <Part/>
    </div>   
  )
}

const Part = (props) => {
  return (
    <div>
      <p> {props.name} {props.exercises}</p>
    </div>
  )
}

const Total = (props) => {
  return (
    <div>
        <p>Number of exercises {props.allexercises}</p>
    </div>   
  )
}

export default App