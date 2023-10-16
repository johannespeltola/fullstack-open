const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const { listWithManyBlogs } = require('./data')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Promise.all(listWithManyBlogs.map((e) => {
    const newBlog = new Blog(e)
    return newBlog.save()
  }))
}, 30000)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blogs are have id property defined', async () => {
  const res = await api.get('/api/blogs')
  res.body.forEach((e) => expect(e.id).toBeDefined())
})

afterAll(async () => {
  await mongoose.connection.close()
})