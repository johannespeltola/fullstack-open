const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

const { MONGODB_URI } = require('./utils/config')
const { errorHandler } = require('./utils/middleware')
const logger = require('./utils/logger')

const blogRouter = require('./controllers/blog')
const usersRouter = require('./controllers/users')

const app = express()
app.use(express.json())

mongoose.set('strictQuery', false)

mongoose.connect(MONGODB_URI)
  .then(() => logger.info('connected to MongoDB'))
  .catch((error) => logger.info('error connecting to MongoDB:', error.message))
mongoose.set('bufferTimeoutMS', 30000)

app.use(cors())
app.use(express.json())
app.use(morgan((tokens, req, res) => [
  tokens.method(req, res),
  tokens.url(req, res),
  tokens.status(req, res),
  tokens.res(req, res, 'content-length'), '-',
  tokens['response-time'](req, res), 'ms',
  // Log request body for POST requests, expect auth related
  (req.method === 'POST' && !tokens.url(req, res).includes('/api/users'))
    ? JSON.stringify(req.body)
    : ''
].join(' ')
))

app.use(express.static('dist'))

app.use('/api/blogs', blogRouter)
app.use('/api/users', usersRouter)

app.use(errorHandler)

module.exports = app
