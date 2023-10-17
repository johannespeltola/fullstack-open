const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const { listWithManyBlogs } = require('./data')
const { blogsInDb, generateAuthTokenForUser } = require('./test_helper')

const api = supertest(app)

const userData = {
  id: '652e3f12dcd19b289f78a0bd',
  username: 'root'
}

beforeAll(async () => {
  await User.deleteMany()
  const user = new User({ ...userData, _id: userData.id, password: 'hash' })
  await user.save()
}, 30000)

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

test('blog creation fails if user is unauthenticated', async () => {
  const newBlog = {
    title: 'Interesting Blog Title',
    author: 'John Doe',
    url: 'google.com'
  }
  const blogsBefore = await blogsInDb()
  const res = await api.post('/api/blogs').send(newBlog)
  expect(res.status).toBe(401)
  const blogsAfter = await blogsInDb()
  expect(blogsAfter).toHaveLength(blogsBefore.length)
  const blogIds = blogsAfter.map((e) => e.id)
  expect(blogIds).not.toContain(res.body.id)
})

test('blog is successfully created', async () => {
  const newBlog = {
    title: 'Interesting Blog Title',
    author: 'John Doe',
    url: 'google.com'
  }
  const token = generateAuthTokenForUser(userData)
  const blogsBefore = await blogsInDb()
  const res = await api.post('/api/blogs').set('authorization', `Bearer ${token}`).send(newBlog)
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
  const token = generateAuthTokenForUser(userData)

  const withoutLikes = await api.post('/api/blogs').set('authorization', `Bearer ${token}`).send(newBlogWithoutLikes)
  expect(withoutLikes.status).toBe(201)
  expect(withoutLikes.body.likes).toBe(0)

  const withLikes = await api.post('/api/blogs').set('authorization', `Bearer ${token}`).send(newBlogWithLikes)
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
  const token = generateAuthTokenForUser(userData)

  await api.post('/api/blogs').set('authorization', `Bearer ${token}`).send(newBlogWithoutTitle).expect(400)
  await api.post('/api/blogs').set('authorization', `Bearer ${token}`).send(newBlogWithoutUrl).expect(400)
  await api.post('/api/blogs').set('authorization', `Bearer ${token}`).send(newBlogWithoutBoth).expect(400)
  await api.post('/api/blogs').set('authorization', `Bearer ${token}`).send(newBlogWithBoth).expect(201)
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

describe('updating of a blog', () => {
  const toBeUpdated = listWithManyBlogs[0]
  test('should delete existing blog', async () => {
    const res = await api.put(`/api/blogs/${toBeUpdated._id}`).send({ likes: 12 }).expect(200)
    expect(res.body.likes).toBe(12)
  })
  test('should return 400 for malformatted id', async () => {
    await api.delete(`/api/blogs/${toBeUpdated._id}123`).expect(400)
  })
  test('should return 404 if blog not found', async () => {
    await api.delete(`/api/blogs/00${toBeUpdated._id.substring(2)}`)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})