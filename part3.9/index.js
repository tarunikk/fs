require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const app = express()
var morgan = require('morgan')

app.use(express.json())

morgan.token('type', function (req, res) { 
    const body = req.body
    if (body == null) {
        return "-"
    } else {
    return JSON.stringify([body.name, body.number])}
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

app.use(express.static('dist'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })

    .catch(error => next(error))
})

/*
app.get('/info', (request, response) => {
    const date = new Date().toString()
    console.log(date)
    const howMany = persons.length

    response.send(`Phonebook has info for ${howMany} people. ${date}`)
}) */


app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })   // varmistetaan että henkilöllä on nimi
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })   // varmistetaan että henkilöllä on numero
    }

    /*
    const names = persons.map(person => person.name)
    const numbers = persons.map(person => person.number)

    if (names.includes(body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })        
    }
    if (numbers.includes(body.number)) {
        return response.status(400).json({
            error: 'number must be unique'
        })        
    } */

    const newName = JSON.stringify(body.name)
    const newNumber = JSON.stringify(body.number)

    const person = new Person ({
        name: body.name,
        number: body.number,
    })

    person.save()
      .then(savedPerson => {
        response.json(savedPerson)
      })
      .catch(error => next(error))
    console.log(`added ${newName} number ${newNumber} to phonebook`)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})