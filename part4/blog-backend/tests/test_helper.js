const Blog = require('../models/blog')

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

module.exports = {
  nonExistingId, blogsInDb
}