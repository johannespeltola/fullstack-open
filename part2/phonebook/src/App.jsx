import { useEffect, useState } from 'react'
import Search from './components/Search'
import Phonebook from './components/Phonebook'
import ContactForm from './components/ContactForm'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState('')

  const clearInput = () => {
    setNewName('')
    setNewNumber('')
  }

  const showNotification = (_severity, _message) => {
    setMessage(_message)
    setSeverity(_severity)
    const timer = setTimeout(() => {
      setMessage('')
      setSeverity('')
    }, 5000);
    return () => clearTimeout(timer);
  }

  const createPerson = async (person) => {
    try {
      const inserted = await personService.create(person)
      setPersons([...persons, inserted])
      showNotification('success', `Added ${inserted.name}`)
    } catch (error) {
      showNotification('error', `Failed to add ${person.name}`)
    }
  }

  const fetchPersons = async () => {
    try {
      setPersons(await personService.getAll())
    } catch (error) {
      showNotification('error', 'Failed to fetch persons')
    }
  }

  const updatePerson = async (person) => {
    try {
      const updated = await personService.update(person.id, person)
      setPersons(persons.map((e) => e.id !== person.id ? e : updated))
      showNotification('success', `Updated ${updated.name}`)
    } catch (error) {
      showNotification('error', `Information of ${person.name} has already been removed from server`)
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const existing = persons.find((p) => p.name === newName)
    if (existing) {
      if (!window.confirm(`${existing.name} is already added to phonebook, replace the old number with a new one?`)) return
      updatePerson({ ...existing, number: newNumber })
    } else {
      const newPerson = { name: newName, number: newNumber }
      createPerson(newPerson)
      clearInput()
    }
  }

  const onDelete = async (person) => {
    try {
      if (window.confirm(`Delete ${person.name} ?`)) {
        await personService.destroy(person.id);
        setPersons(persons.filter((e) => e.id !== person.id))
        showNotification('success', `Deleted ${person.name}`)
      }
    } catch (error) {
      showNotification('error', `Information of ${person.name} has already been removed from server`)
    }
  }

  useEffect(() => {
    fetchPersons();
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification severity={severity} message={message} />
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