const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

const { MONGODB_URI } = require('./utils/config')
const { errorHandler } = require('./utils/middleware')

const blogRouter = require('./controllers/blog')

const app = express()
app.use(express.json())

mongoose.set('strictQuery', false)

mongoose.connect(MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch((error) => console.log('error connecting to MongoDB:', error.message))

app.use(cors())
app.use(express.json())
app.use(morgan((tokens, req, res) => [
  tokens.method(req, res),
  tokens.url(req, res),
  tokens.status(req, res),
  tokens.res(req, res, 'content-length'), '-',
  tokens['response-time'](req, res), 'ms',
  req.method === 'POST' ? JSON.stringify(req.body) : ''
].join(' ')
))

app.use(express.static('dist'))

app.use('/api/blogs', blogRouter)
app.use(errorHandler)

module.exports = app
