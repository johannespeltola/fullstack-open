const router = require('express').Router()
const bcrypt = require('bcrypt')

const User = require('../models/user')
const AppError = require('../utils/error')

router.get('/', async (req, res, next) => {
  try {
    res.json(await User.find().populate('blogs', {
      title: 1,
      author: 1,
      url: 1,
      likes: 1
    }))
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body
    if (username?.length < 3) throw new AppError(400, 'Username needs to be at least 3 characters')
    if (password?.length < 3) throw new AppError(400, 'Password needs to be at least 3 characters')

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await user.save()

    res.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

module.exports = router
