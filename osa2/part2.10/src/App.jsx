import { useState, useEffect } from 'react'
import axios from 'axios'
import Notification from './components/Notification'
import personService from './services/persons'

// 2.10-2.17
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
  const [notifMessage, setNotifMessage] = useState(null)
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
    console.log(names)

    const personObject = {
      name: newName,
      number: newNumber,
      id: newName
    }

    if (names.includes(newName)) {
      console.log(`${newName} is already added to phonebook`)
      updateNumber(newName)
      return
    }

    personService    
      .create(personObject)    
      .then(response => {  
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
        setNotifMessage( `added '${personObject.name}' `)
        setTimeout(() => {
          setNotifMessage(null)
        }, 10000)
        console.log(persons)    
      })
  }

  const removePerson = ( name, id ) => {
    console.log(`information of ${id} needs to be deleted`)
    if (confirm("Do you want to remove all information of this person?")) {
      axios
        .delete(`http://localhost:3002/persons/${id}`)      
        .then(response => {  
          setPersons(persons.filter(p => p.id !== id))
          setNotifMessage( `removed '${id}' `)
          setTimeout(() => {
            setNotifMessage(null)
          }, 10000)
          console.log(response) })
        .catch(error => {
          console.error(error)
          setErrorMessage( `information of ${name} has already been removed from server `)
          setTimeout(() => {
            setErrorMessage(null)
          }, 10000)
        })
    } else {
      return
    }   
  }

  const updateNumber = ( newName ) => {
    const person = persons.find((p => p.name === newName))
    console.log(person)
    const changedPerson = { ...person, number: newNumber }
    console.log(changedPerson)
    if (confirm(`'${newName}' is already added to phonebook, replace the old number with new one?`)) {
      personService
        .update(person.id, changedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person => (person.name !== newName ? person : returnedPerson)))
          console.log('Updated info succesfully')
          setNewName('')
          setNewNumber('')
        })
    } else {
      setNewName('')
      setNewNumber('')
      return
    }
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
      <Notification message={errorMessage} className="error" />
      <Notification message={notifMessage} className="notif" />
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
