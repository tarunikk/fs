import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogView from './components/BlogView'

// Osa5
// 5.5-5.11 toimii oikein
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState({ message: null })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(initialBlogs => {
      sortByLikes(initialBlogs)
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

  const notifyWith = (message, isError = false) => {
    setNotification({ message, isError })
    setTimeout(() => {
      setNotification({ message: null })
    }, 5000)
  }

  const addBlog = (blogObject) => {
    console.log('creating a new blog')
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        returnedBlog.user = user
        setBlogs(blogs.concat(returnedBlog))
        console.log('new blog created')
        notifyWith(`a new blog '${returnedBlog.title}' by '${returnedBlog.author}' added`)
      })
      .catch(error => {
        console.log('creating a new blog failed')
        notifyWith(error.response.data.error, true)
      })
  }

  const removeBlog = blog => {
    if (confirm(`Do you want to remove ${blog.title} by ${blog.author}?`)) {
      blogService
        .remove(blog.id)
        .then(response => {
          setBlogs(blogs.filter(b => b.id !== blog.id))
          console.log(`Blog ${blog.title} deleted`)
          notifyWith( `removed blog: '${blog.title}' `)
          console.log(response) })
        .catch(error => {
          console.log(error.response.data)
          notifyWith(error.response.data.error, true)
        })
    } else {
      return
    }
  }

  const addLikeTo = (id) => {
    const blog = blogs.find(b => b.id === id)
    const changedBlog = { ...blog, likes: blog.likes +1 }

    blogService
      .addLike(id, changedBlog)
      .then(returnedBlog => {
        returnedBlog.user = changedBlog.user
        setBlogs(sortByLikes(blogs.map(blog => (blog.id !== id ? blog : returnedBlog))))
        console.log(`Added like to '${changedBlog.title}'. Total likes: '${changedBlog.likes}'`)
      })
  }

  const sortByLikes = (blogs) => {
    blogs.sort((a, b) => a.likes - b.likes)
    blogs.reverse()
    return blogs
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
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      console.log('error logging in')
      notifyWith('wrong credentials', true)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification} />
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
      <Notification notification={notification} />

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
        <div key={blog.id}>
          <BlogView preview={blog.title + ' ' + blog.author}>
            <Blog
              blog={blog}
              user={user}
              addLike={() => addLikeTo(blog.id)}
              removeBlog={() => removeBlog(blog)}
            />
          </BlogView>
        </div>
      )}
    </div>
  )
}

export default App