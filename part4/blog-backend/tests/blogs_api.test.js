const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const { listWithManyBlogs } = require('./data')
const { blogsInDb } = require('./test_helper')

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

test('blog is successfully created', async () => {
  const newBlog = {
    title: 'Interesting Blog Title',
    author: 'John Doe',
    url: 'google.com'
  }
  const blogsBefore = await blogsInDb()
  const res = await api.post('/api/blogs').send(newBlog)
  expect(res.status).toBe(201)
  const blogsAfter = await blogsInDb()
  expect(blogsAfter).toHaveLength(blogsBefore.length + 1)
  const blogIds = blogsAfter.map((e) => e.id)
  expect(blogIds).toContain(res.body.id)
})

test('blog has default value 0 for likes', async () => {
  const newBlogWithoutLikes = {
    title: 'Interesting Blog Title',
    author: 'John Doe',
    url: 'google.com'
  }
  const newBlogWithLikes = {
    title: 'Another Interesting Blog Title part 2',
    author: 'John Doe',
    url: 'bing.com',
    likes: 10
  }
  const withoutLikes = await api.post('/api/blogs').send(newBlogWithoutLikes)
  expect(withoutLikes.status).toBe(201)
  expect(withoutLikes.body.likes).toBe(0)

  const withLikes = await api.post('/api/blogs').send(newBlogWithLikes)
  expect(withLikes.status).toBe(201)
  expect(withLikes.body.likes).toBe(10)
})

test('new blog requires properties title and url', async () => {
  const newBlogWithoutTitle = {
    author: 'John Doe',
    url: 'google.com'
  }
  const newBlogWithoutUrl = {
    title: 'Interesting Blog Title',
    author: 'John Doe'
  }
  const newBlogWithoutBoth = {
    author: 'John Doe'
  }
  const newBlogWithBoth = {
    title: 'Interesting Blog Title',
    author: 'John Doe',
    url: 'google.com'
  }
  await api.post('/api/blogs').send(newBlogWithoutTitle).expect(400)
  await api.post('/api/blogs').send(newBlogWithoutUrl).expect(400)
  await api.post('/api/blogs').send(newBlogWithoutBoth).expect(400)
  await api.post('/api/blogs').send(newBlogWithBoth).expect(201)
})

describe('deletion of a blog', () => {
  const toBeDeleted = listWithManyBlogs[0]
  test('should delete existing blog', async () => {
    const blogsBefore = await blogsInDb()
    await api.delete(`/api/blogs/${toBeDeleted._id}`).expect(204)
    const blogsAfter = await blogsInDb()
    expect(blogsAfter).toHaveLength(blogsBefore.length - 1)
    const blogIds = blogsAfter.map((e) => e.id)
    expect(blogIds).not.toContain(toBeDeleted._id)
  })
  test('should return 400 for malformatted id', async () => {
    await api.delete(`/api/blogs/${toBeDeleted._id}123`).expect(400)
  })
  test('should return 404 if blog not found', async () => {
    await api.delete(`/api/blogs/00${toBeDeleted._id.substring(2)}`)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})