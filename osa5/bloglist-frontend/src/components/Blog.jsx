import { useState } from 'react'

const Blog = ({ blog }) => {
  const [view, setView] = useState(true)

  const toggleView = () => {
    setView(!view)
  }

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

  return (
    <div>
      <div style={blogStyle}>
        {blog.title} {blog.author}
        <button onClick={toggleView}>view</button>
      </div>
      <div style={blogViewStyle}>
        {blog.title} <br />
        {blog.author}<br />
        {blog.url}
        <p> 
          Likes: {blog.likes}
          <button onClick={toggleView}>like</button>
        </p> 
        <button onClick={toggleView}>hide</button>
      </div>
    </div>
)}

export default Blog