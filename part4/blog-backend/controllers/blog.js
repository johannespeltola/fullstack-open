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

router.delete('/:id', async (req, res, next) => {
  try {
    const found = await Blog.findByIdAndDelete(req.params.id)
    if (!found) return res.sendStatus(404)
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const { title, author, url, likes } = req.body
    const found = await Blog.findByIdAndUpdate(req.params.id, {
      title,
      author,
      url,
      likes
    }, { new: true, runValidators: true, context: 'query' })
    if (!found) res.sendStatus(404)
    res.json(found)
  } catch (error) {
    next(error)
  }
})

module.exports = router
