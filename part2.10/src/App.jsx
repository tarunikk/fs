import { useState, useEffect } from 'react'
import axios from 'axios'

const Person = ({ name, number }) => {
  return (
    <li>{name} {number}</li>
  )
}

const Persons = ({ personsToShow }) => {
  return (
    <ul>
      {personsToShow.map(person => 
        <Person key={person.name} name={person.name} number={person.number}/>
      )}
    </ul> 
  )
}

const PersonForm = ({ addPerson, newName, handleAddName, newNumber, handleAddNumber }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input 
                  value = {newName}
                  onChange = {handleAddName}/>
      </div>
      <div>
        number: <input 
                  value = {newNumber}
                  onChange = {handleAddNumber}/>
        </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Filter = ({ newFilter, handleFilterChange }) => {
  return (
    <div>
      filter shown with 
        <input value={newFilter} onChange={handleFilterChange} />
    </div>
  )
} 

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3002/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const personsToShow = newFilter 
    ? persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()) === true)
    : persons

  const addPerson = (event) => {
    event.preventDefault ()
    const names = persons.map(person => person.name)

    const newPerson = {
      name: newName,
      number: newNumber,
      id: newName
    }

    if (names.includes(newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
    console.log(persons)
  }

  const handleAddName = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleAddNumber = (event) => {  
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      </div>
      <h2>Add a new</h2>
        <PersonForm addPerson={addPerson} newName={newName} handleAddName={handleAddName} newNumber={newNumber} handleAddNumber={handleAddNumber} />
      <h2>Numbers</h2>
        <Persons personsToShow={personsToShow} />
    </div>
  )
}

export default App
