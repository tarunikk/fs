import { useState, useEffect } from 'react'

import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

// frontend here (backend at osa3/part3.9)
// 3.9-3.19 & 3.21-3.22
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

  const personsToShow = persons.filter((person) => 
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  )

  const clearForm = () =>{
    setNewName('')
    setNewNumber('')
  }

  const addPerson = (event) => {
    event.preventDefault ()
    const names = persons.map(person => person.name)
    const numbers = persons.map(person => person.number)

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

    if (numbers.includes(newNumber)) {
      alert(`${newNumber} already exists phonebook`)
      console.log(`adding new person failed`)
      return
    }

    personService    
      .create(personObject)    
      .then(response => {  
        setPersons(persons.concat(response.data))
        clearForm()
        setNotifMessage( `added ${personObject.name}`)
        console.log(`${personObject.name} added`)
        setTimeout(() => {
          setNotifMessage(null)
        }, 10000)
        console.log(persons)    
      })
      .catch(error => {
        console.log(error.response.data)
        setErrorMessage(`${error.response.data.error}`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 10000)
      })
  }

  const removePerson = ( person ) => {
    console.log(`information of ${person.name} needs to be deleted`)
    if (confirm(`Do you want to remove all information of ${person.name}?`)) {
      personService
        .remove(person.id)    
        .then(response => {  
          setPersons(persons.filter(p => p.id !== person.id))
          console.log(`${person.name} deleted`)
          setNotifMessage(`removed '${person.name}' `)
          setTimeout(() => {
            setNotifMessage(null)
          }, 10000)
          console.log(response) })
        .catch(error => {
          console.log(error.response.data)
          setErrorMessage(`${error.response.data.error}`)
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
    const changedPerson = { ...person, number: newNumber }

    if (confirm(`${newName} is already added to phonebook, replace the old number with new one?`)) {
      personService
        .update(person.id, changedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person => (person.name !== newName ? person : returnedPerson)))
          console.log('Updated info succesfully')
          clearForm()
          setNotifMessage(`updated phone number for ${newName}`)
          setTimeout(() => {
            setNotifMessage(null)
          }, 10000)
        })
        .catch(error => {
          console.log(error.response.data)
          setErrorMessage(`${error.response.data.error}`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 10000)
        })
    } else {
        clearForm()
        return
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} className="error"/>
      <Notification message={notifMessage} className="notif" />
      <div>
        <Filter newFilter={newFilter} setNewFilter={setNewFilter} />
      </div>
      <h2>Add a new</h2>
        <PersonForm addPerson={addPerson} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} />
      <h2>Numbers</h2>
        <Persons personsToShow={personsToShow} removePerson={removePerson} />
    </div>
  )
}

export default App
