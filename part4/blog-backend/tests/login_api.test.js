const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', password: passwordHash })

  await user.save()
}, 30000)

describe('when there is initially one user in db', () => {
  test('login should succeed with correct credentials', async () => {
    const res = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body.username).toBe('root')
  })

  test('login fails with proper statuscode and message if username is invalid', async () => {
    const res = await api
      .post('/api/login')
      .send({ username: 'admin', password: 'sekret' })
      .expect(401)
      .expect('Content-Type', /application\/json/)
    expect(res.body.error).toContain('Invalid username or password')
  })

  test('login fails with proper statuscode and message if password is invalid', async () => {
    const res = await api
      .post('/api/login')
      .send({ username: 'root', password: 'wrongpassword' })
      .expect(401)
      .expect('Content-Type', /application\/json/)
    expect(res.body.error).toContain('Invalid username or password')
  })

  test('login fails with proper statuscode and message if username is not provided', async () => {
    const res = await api
      .post('/api/login')
      .send({ username: '', password: 'wrongpassword' })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(res.body.error).toContain('Missing username or password')
  })

  test('login fails with proper statuscode and message if password is not provided', async () => {
    const res = await api
      .post('/api/login')
      .send({ username: '', password: 'wrongpassword' })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(res.body.error).toContain('Missing username or password')
  })

})

afterAll(async () => {
  await mongoose.connection.close()
})