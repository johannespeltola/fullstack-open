import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Login from './components/Login'
import Notification from './components/Notification'
import CreateBlog from './components/CreateBlog'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [severity, setSeverity] = useState('error')
  const [createVisible, setCreateVisible] = useState(false)

  const notification = (severity, message) => {
    setSeverity(severity)
    setErrorMessage(message)
    setTimeout(() => { setErrorMessage(null) }, 5000)
  }

  const fetchBlogs = async () => {
    try {
      setBlogs(await blogService.getAll())
    } catch (error) {
      notification('error', 'Failed to retrieve blogs')
    }
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setUser(user)
      blogService.setToken(user.token)
    }
    fetchBlogs()
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login(username, password)
      setUser(user)
      blogService.setToken(user.token)
      localStorage.setItem('user', JSON.stringify(user))
      notification('success', `Welcome back ${user.name}!`)
      return true
    } catch (error) {
      notification('error', error.response.data.error)
    }
    return false
  }

  const handleLogout = async () => {
    setUser(null)
    localStorage.removeItem('user')
    notification('success', 'Successfully logged out')
  }

  const handleBlogSubmit = async ({ title, author, url }) => {
    try {
      const blog = await blogService.create({ title, author, url })
      setBlogs([...blogs, blog])
      notification('success', `Added new blog ${title} by ${author}`)
      return true
    } catch (error) {
      notification('error', error.response.data.error)
    }
    return false
  }

  return (
    <div>
      <Notification message={errorMessage} severity={severity} />
      {!user ? <Login handleLogin={handleLogin} /> : (
        <>
          <h2>blogs</h2>
          <p>{user.name} logged in <button onClick={handleLogout}>Logout</button></p>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
          <h2>Create new</h2>
          <CreateBlog submit={handleBlogSubmit} />
        </>
      )}
    </div>
  )
}

export default App