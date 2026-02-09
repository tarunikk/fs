import { useState } from 'react'

const BlogView = ( props) => {
  const [view, setView] = useState(true)

  const blogStyle = {
    display: view ?  '' : 'none',
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const blogViewStyle = {
    display: view ? 'none' : '',
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleView = () => {
    setView(!view)
  }

  return (
    <div>
      <div style={blogStyle}>
        <span>{props.preview}</span>
        <button onClick={toggleView}>show</button>
      </div>
      <div style={blogViewStyle}>
        {props.children}
        <button onClick={toggleView}>hide</button>
      </div>
    </div>
  )
}

export default BlogView