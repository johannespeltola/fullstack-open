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
    const newPerson = new Blog(req.body)
    await newPerson.save()
    res.status(201).json(newPerson)
  } catch (error) {
    next(error)
  }
})

module.exports = router
