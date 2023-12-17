const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = require('express').Router()
const User = require('../models/user')
const AppError = require('../utils/error')
const { JWT_SECRET } = require('../utils/config')

router.post('/', async (req, res, next) => {
  try {
    const { username, password } = req.body

    if (!username || !password) throw new AppError(400, 'Missing username or password')

    const user = await User.findOne({ username })
    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(password, user.password)

    if (!user || !passwordCorrect) {
      throw new AppError(401, 'Invalid username or password')
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    const token = jwt.sign(userForToken, JWT_SECRET, { expiresIn: 60 * 60 })

    res.json({ token, username: user.username, name: user.name })
  } catch (error) {
    next(error)
  }
})

module.exports = router
