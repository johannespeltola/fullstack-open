const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const { JWT_SECRET } = require('../utils/config')

const nonExistingId = async () => {
  const blog = new Blog({ author: Math.random().toString(16) })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const generateAuthTokenForUser = (user) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: 60 * 60 })
}

module.exports = {
  nonExistingId,
  blogsInDb,
  usersInDb,
  generateAuthTokenForUser
}