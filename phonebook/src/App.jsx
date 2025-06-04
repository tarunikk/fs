import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const Person = ({ name, number, removePerson}) => {
  const label = 'Delete'

  return (
    <li>
        {name} {number}
        <button onClick={removePerson}> {label}</button>
    </li>
  )
}

const Persons = ({ personsToShow, removePerson}) => {
  return (
    <ul>
      {personsToShow.map(person => 
        <Person 
          key={person.id} 
          name={person.name} 
          number={person.number}
          removePerson = {() => removePerson(person.name, person.id)}/>
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
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])

  const personsToShow = newFilter 
    ? persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()) === true)
    : persons

  const addPerson = (event) => {
    event.preventDefault ()
    const names = persons.map(person => person.name)

    const personObject = {
      name: newName,
      number: newNumber,
      id: newName
    }

    if (names.includes(newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    personService    
      .create(personObject)    
      .then(response => {  
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
        setErrorMessage( `added '${personObject.name}' `)
        setTimeout(() => {
          setErrorMessage(null)
        }, 10000)
        console.log(persons)    
      })
  }

  const removePerson = ( name, id ) => {
    console.log(`information of ${name} needs to be deleted`)
    if (confirm(`Do you want to remove all information of ${name}?`)) {
      axios.delete(`/api/persons/${id}`)      
        .then(response => {  
          setPersons(persons.filter(p => p.id !== id))
          setErrorMessage( `removed '${name}' `)
          setTimeout(() => {
            setErrorMessage(null)
          }, 10000)
          console.log(response) })
        .catch(error => {
          console.error(error)
        })
    } else {
      return
    }   
  }

  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className="error">
        {message}
      </div>
    )
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
      <Notification message={errorMessage} />
      <div>
        <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      </div>
      <h2>Add a new</h2>
        <PersonForm addPerson={addPerson} newName={newName} handleAddName={handleAddName} newNumber={newNumber} handleAddNumber={handleAddNumber} />
      <h2>Numbers</h2>
        <Persons personsToShow={personsToShow} removePerson={removePerson} />
    </div>
  )
}

export default App
