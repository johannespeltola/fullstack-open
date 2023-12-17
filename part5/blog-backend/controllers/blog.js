const router = require('express').Router()

const Blog = require('../models/blog')
const { authHandler } = require('../utils/middleware')
const AppError = require('../utils/error')

router.get('/', async (req, res, next) => {
  try {
    res.json(await Blog.find().populate('user', {
      username: 1,
      name: 1
    }))
  } catch (error) {
    next(error)
  }
})

router.post('/', authHandler, async (req, res, next) => {
  try {
    const { title, author, url, likes } = req.body
    const newBlog = new Blog({
      title,
      author,
      url,
      likes,
      user: req.user.id
    })
    await newBlog.save()
    req.user.blogs = req.user.blogs.concat(newBlog._id)
    await req.user.save()
    res.status(201).json(await newBlog.populate('user', {
      username: 1,
      name: 1
    }))
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', authHandler, async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) throw new AppError(404, 'Blog not found')
    if (blog.user.toString() !== req.user._id.toString()) {
      throw new AppError(403, 'Blog does not belong to user')
    }
    await Blog.findByIdAndDelete(req.params.id)
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', authHandler, async (req, res, next) => {
  try {
    const { title, author, url, likes, user } = req.body
    const blog = await Blog.findById(req.params.id)
    if (!blog) throw new AppError(404, 'Blog not found')
    const updated = await Blog.findByIdAndUpdate(req.params.id, {
      title,
      author,
      url,
      likes,
      // Instructions say nothing about this but probably stupid to let someone change the user value for a blog not belonging to them?
      user: (blog.user._id.toString() === req.user.id) ? (user?.id || user) : blog.user
    }, { new: true, runValidators: true, context: 'query' })

    res.json(await updated.populate('user', {
      username: 1,
      name: 1
    }))
  } catch (error) {
    next(error)
  }
})

module.exports = router
