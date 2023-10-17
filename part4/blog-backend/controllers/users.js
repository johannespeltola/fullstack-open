const router = require('express').Router()
const bcrypt = require('bcrypt')

const User = require('../models/user')
const AppError = require('../utils/error')

router.get('/', async (req, res, next) => {
  try {
    res.json(await User.find())
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body
    if (!username) throw new AppError(400, 'Missing required value username')
    if (!name) throw new AppError(400, 'Missing required value name')
    if (!password) throw new AppError(400, 'Missing required value password')

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
