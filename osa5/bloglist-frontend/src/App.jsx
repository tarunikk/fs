import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

// Osa5
// 5.5-5.11 toimii oikein
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(initialBlogs => {
      initialBlogs.sort((a, b) => a.likes - b.likes)
      initialBlogs.reverse()
      setBlogs(initialBlogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (blogObject) => {
    console.log('creating a new blog')
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        console.log('new blog created')
        setErrorMessage(`a new blog '${returnedBlog.title}' by '${returnedBlog.author}' added`)
        setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      })
      .catch(() => {
        console.log('creating a new blog failed')
        setErrorMessage(`fill all boxes`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })     
  }

  const removeBlog = ( blog ) => {
    if (confirm(`Do you want to remove ${blog.title} by ${blog.author}?`)) {
      axios.delete(`/api/blogs/${blog.id}`)      
        .then(response => {  
          setBlogs(blogs.filter(b => b.id !== blog.id))
          console.log(`Blog ${blog.title} deleted`)
          setErrorMessage( `removed '${blog.title}' `)
          setTimeout(() => {
            setErrorMessage(null)
          }, 10000)
          console.log(response) })
        .catch(error => {
          console.log(error.response.data)
          setErrorMessage(`${error.response.data.error}`)
          setTimeout(() => {
          setErrorMessage(null)
        }, 10000)
        })
    } else {
      return
    }   
  }

  const addLikeTo = (id) => {
    const blog = blogs.find(b => b.id === id)
    const changedBlog = { ...blog, likes: blog.likes +1 }
    console.log("bbb", changedBlog.user)
    
    blogService
      .addLike(id, changedBlog)
      .then(returnedBlog => {
        console.log("eee", returnedBlog.user)
        returnedBlog.user = changedBlog.user
        console.log("fff", returnedBlog.user)
        setBlogs(blogs.map(blog => (blog.id !== id ? blog : returnedBlog)))
        console.log(`Added like to '${changedBlog.title}'. Total likes: '${changedBlog.likes}'`)
      })
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) // Kirjautuneen käyttäjän tiedot tallentuvat nyt local storageen ja niitä voidaan tarkastella konsolista (kirjoittamalla konsoliin window.localStorage)
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      console.log("error logging in")
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage} />
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  const handleLogout = (event) => {
    event.preventDefault()
    console.log('logging out')
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const logoutForm = () => (
    <form onSubmit={handleLogout}>
      <button type="submit">logout</button>
    </form>
  )

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} />
      
      {user && (
        <div>
          <p>{user.name} logged in</p>
          {logoutForm()}
          <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
        </div>
      )}

      { blogs.map(blog =>
        <Blog 
          key={blog.id} 
          blog={blog}
          user={user}
          addLike={() => addLikeTo(blog.id)}
          removeBlog = {() => removeBlog(blog)}
          />
        )
      }
    </div>
  )
}

export default App