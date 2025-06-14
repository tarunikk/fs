const App = () => {
  const course = {
   name: 'Half Stack application development',
   parts: [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
   ]
  }

  return (
    <div>
      <Header course= {course.name} />
      <Content parts = {course.parts} />
      <Total parts = {course.parts}/>
    </div>
  )
}

const Header = (props) => {
  console.log(props)  
  return <h1> {props.course} </h1>
}

const Content = (props) => {
  console.log(props) 
  return (
      <div>
        <Part name = {props.parts[0].name} exercises = {props.parts[0].exercises} ></Part>
        <Part name = {props.parts[1].name} exercises = {props.parts[1].exercises} ></Part>
        <Part name = {props.parts[2].name} exercises ={props.parts[2].exercises} ></Part>
      </div>
  )
}

const Part = (props) => {
  return (
      <p> {props.name} {props.exercises} </p>
  )
}

const Total = (props) => {
var sum = 0
  props.parts.forEach(value =>
    {sum += value.exercises}
  )

  console.log(sum) 
  return ( <p> Number of exercises: {sum} </p> )
}

export default App