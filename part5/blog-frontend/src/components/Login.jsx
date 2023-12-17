import { forwardRef, useImperativeHandle, useState } from 'react'

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
          <input type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          Password:
          <input type="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
})

export default Login
