const Course = ({course}) => {
  
    console.log(course.name)
    
    const Header = ({name}) => {
      console.log(name)  
      return <h1> {name} </h1>
    }
  
    const Content = ({course}) => {
      console.log(course)
  
      const Part = (props) => {
        return (
          <p>{props.name} {props.exercises}</p>
        )
      }
  
      return (
        <div>
          <ul>
            {course.map(part => 
              <Part key={part.id} name = {part.name} exercises = {part.exercises}/>
            )}
          </ul>
        </div>
      )
    }
  
    const Total = ({course}) => {
  
      console.log(course)
  
      const exercises = course.map(part => part.exercises)
  
      const total = exercises.reduce( (s, p) => s + p);
  
      return ( <div> Number of exercises: {total} </div> )
    } 
  
    return (
      <div>
          <Header name= {course.name} />
          <Content course ={course.parts}/>
          <Total course = {course.parts} />
      </div>
    )
  }

export default Course