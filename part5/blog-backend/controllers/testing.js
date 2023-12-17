const testingRouter = require('express').Router()
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')

testingRouter.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const saltRounds = 10
  const passwordHash = await bcrypt.hash('testpass', saltRounds)

  const user = new User({
    username: 'test',
    name: 'Test User',
    password: passwordHash,
  })

  await user.save()

  response.status(204).end()
})

module.exports = testingRouter