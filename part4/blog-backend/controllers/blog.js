const router = require('express').Router()

const Blog = require('../models/blog')

router.get('/', async (req, res, next) => {
  try {
    res.json(await Blog.find())
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { title, author, url, likes } = req.body
    if (!title || !url) return res.sendStatus(400)
    const newPerson = new Blog({
      title,
      author,
      url,
      likes
    })
    await newPerson.save()
    res.status(201).json(newPerson)
  } catch (error) {
    next(error)
  }
})

module.exports = router
