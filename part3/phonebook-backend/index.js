require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const AppError = require('./error')
const Person = require('./models/person')

const app = express()

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

app.get('/info', async (req, res, next) => {
  try {
    const persons = await Person.find()
    res.setHeader('Content-Type', 'text/html')
    res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `)
  } catch (error) {
    next(error)
  }
})

app.get('/api/persons', async (req, res, next) => {
  try {
    res.json(await Person.find())
  } catch (error) {
    next(error)
  }
})

app.get('/api/persons/:id', async (req, res, next) => {
  try {
    const person = await Person
      .findById(req.params.id)
      .catch((e) => {
        throw new AppError(400, 'malformatted id')
      })
    if (!person) return res.sendStatus(404)
    res.json(person)
  } catch (error) {
    next(error)
  }
})

app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    const found = await Person
      .findByIdAndDelete(req.params.id)
      .catch((e) => {
        throw new AppError(400, 'malformatted id')
      })
    if (!found) return res.sendStatus(404)
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

app.post('/api/persons', async (req, res, next) => {
  try {
    const { name, number } = req.body;
    if (!name) throw new AppError(400, 'Missing required value name')
    if (!number) throw new AppError(400, 'Missing required value number')
    // if (persons.find((e) => e.name === name)) throw new AppError(409, `Name ${name} already exists`)

    const newPerson = new Person({
      name,
      number
    })
    await newPerson.save()
    res.status(201).json(newPerson)
  } catch (error) {
    next(error)
  }
})

// Error handler with support for status based errors
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  res.status(err.status || 500)
  res.json({ error: err.message })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
