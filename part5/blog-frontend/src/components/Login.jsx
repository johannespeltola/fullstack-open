import { forwardRef, useImperativeHandle, useState } from 'react'
import PropTypes from 'prop-types'

const Login = forwardRef(({ handleLogin }, refs) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = async (event) => {
    event.preventDefault()
    handleLogin(username, password)
  }

  const clearForm = () => {
    setUsername('')
    setPassword('')
  }

  useImperativeHandle(refs, () => ({ clearForm }))

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={login}>
        <div>
          Username:
          <input id='username' type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          Password:
          <input id='password' type="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button id='login-button' type="submit">Login</button>
      </form>
    </div>
  )
})

Login.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

Login.displayName = 'Login'

export default Login
