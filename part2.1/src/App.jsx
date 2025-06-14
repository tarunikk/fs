import Course from './component/Course'

const App = () => {
  const courses = [ 
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id:1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id:2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 16,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Midllewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      <ul>
        {courses.map(course => 
          <Course key={course.id} course = {course} />
        )}
      </ul>
    </div>
  )
}

export default App