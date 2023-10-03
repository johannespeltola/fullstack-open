import { useState } from 'react'
import Search from './components/Search'
import Phonebook from './components/Phonebook'
import ContactForm from './components/ContactForm'

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

  const onSubmit = (e) => {
    e.preventDefault()
    if (persons.some((p) => p.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    setPersons([...persons, { name: newName, number: newNumber }])
    clearInput()
  }

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
      <Phonebook persons={persons} filter={filter} />
    </div>
  )
}

export default App