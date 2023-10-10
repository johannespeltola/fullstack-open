const express = require('express')
const { getRandomInt } = require('./utils')

const app = express()
app.use(express.json())

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/info', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.send(`
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}</p>
  `)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const person = persons.find((e) => e.id === Number(req.params.id))
  if (!person) return res.sendStatus(404)
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const personId = Number(req.params.id)
  const person = persons.find((e) => e.id === personId)
  if (!person) return res.sendStatus(404)
  persons = persons.filter((e) => e.id !== personId)
  res.sendStatus(200)
})

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;
  const id = getRandomInt(persons.length, Number.MAX_SAFE_INTEGER - 1)
  const newPerson = {
    id,
    name,
    number
  }
  persons.push(newPerson)
  res.json(newPerson)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
