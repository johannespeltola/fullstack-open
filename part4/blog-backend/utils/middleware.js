const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('./config')
const AppError = require('../utils/error')

const User = require('../models/user')

/* eslint-disable indent */
// Error handler with support for status based errors
const errorHandler = ((err, _req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  switch (err.name) {
    case 'CastError':
      return res.status(400).send({ error: 'malformatted id' })
    case 'ValidationError':
      return res.status(400).json({ error: err.message })
    case 'JsonWebTokenError':
      return res.status(401).json({ error: 'invalid token' })
    case 'TokenExpiredError':
      return res.status(401).json({ error: 'token expired' })
  }

  res.status(err.status || 500).json({ error: err.message })
})

const getTokenFrom = (req) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

// Validate JWT from request and add authenticated user to request context
const authHandler = async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(getTokenFrom(req), JWT_SECRET)
    if (!decodedToken.id) {
      throw new AppError(401, 'Token invalid')
    }
    const user = await User.findById(decodedToken.id)
    req.user = user.toJSON()
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = { errorHandler, authHandler }
