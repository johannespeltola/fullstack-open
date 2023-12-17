import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Login from './components/Login'
import Notification from './components/Notification'
import CreateBlog from './components/CreateBlog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [severity, setSeverity] = useState('error')
  const loginFormRef = useRef()
  const createBlogRef = useRef()

  const notification = (severity, message) => {
    setSeverity(severity)
    setErrorMessage(message)
    setTimeout(() => { setErrorMessage(null) }, 5000)
  }

  const fetchBlogs = async () => {
    try {
      setBlogs((await blogService.getAll()).sort((a, b) => a.likes < b.likes))
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
      loginFormRef.current.clearForm()
    } catch (error) {
      notification('error', error.response.data.error)
    }
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
      createBlogRef.current.clearForm()
    } catch (error) {
      notification('error', error.response.data.error)
    }
  }

  const likeBlog = async (blog) => {
    try {
      const res = await blogService.update(blog.id, { ...blog, likes: blog.likes + 1 })
      const updatedBlogs = [...blogs]
      updatedBlogs[blogs.findIndex((e) => e.id === blog.id)] = res
      setBlogs(updatedBlogs.sort((a, b) => a.likes < b.likes))
    } catch (error) {
      notification('error', error.response.data.error)
    }
  }

  return (
    <div>
      <Notification message={errorMessage} severity={severity} />
      {!user ? <Login handleLogin={handleLogin} ref={loginFormRef} /> : (
        <>
          <h2>blogs</h2>
          <p>{user.name} logged in <button onClick={handleLogout}>Logout</button></p>
          <CreateBlog submit={handleBlogSubmit} ref={createBlogRef} />
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} like={() => likeBlog(blog)} />
          )}
        </>
      )}
    </div>
  )
}

export default App