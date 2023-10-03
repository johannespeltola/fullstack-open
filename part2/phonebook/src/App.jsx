import { useEffect, useState } from 'react'
import Search from './components/Search'
import Phonebook from './components/Phonebook'
import ContactForm from './components/ContactForm'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1234567' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const clearInput = () => {
    setNewName('')
    setNewNumber('')
  }

  const createPerson = async (person) => {
    try {
      const inserted = await personService.create(person)
      setPersons([...persons, inserted])
    } catch (error) {
      console.error('Failed to create person', error.toString())
    }
  }

  const fetchPersons = async () => {
    try {
      setPersons(await personService.getAll())
    } catch (error) {
      console.error('Failed to fetch persons', error.toString())
    }
  }

  const updatePerson = async (person) => {
    try {
      const updated = await personService.update(person.id, person)
      setPersons(persons.map((e) => e.id !== person.id ? e : updated))
    } catch (error) {
      console.error('Failed to update person', error.toString())
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const existing = persons.find((p) => p.name === newName)
    if (existing) {
      if (!window.confirm(`${existing.name} is already added to phonebook, replace the old number with a new one?`)) return
      updatePerson({ ...existing, number: newNumber })
    } else {
      const id = persons.at(-1).id + 1
      const newPerson = { id, name: newName, number: newNumber }
      createPerson(newPerson)
      clearInput()
    }
  }

  const onDelete = async (person) => {
    try {
      if (window.confirm(`Delete ${person.name} ?`)) {
        await personService.destroy(person.id);
        setPersons(persons.filter((e) => e.id !== person.id))
      }
    } catch (error) {
      console.error('Failed to delete person', error.toString())
    }
  }

  useEffect(() => {
    fetchPersons();
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Search value={filter} onChange={(e) => setFilter(e.target.value)} />
      <h2>Add new</h2>
      <ContactForm
        onSubmit={onSubmit}
        name={newName}
        number={newNumber}
        onNameChange={(e) => setNewName(e.target.value)}
        onNumberChange={(e) => setNewNumber(e.target.value)}
      />
      <h2>Numbers</h2>
      <Phonebook persons={persons} filter={filter} onDelete={onDelete} />
    </div>
  )
}

export default App