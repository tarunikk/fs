const express = require('express')
const app = express()
var morgan = require('morgan')

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

app.use(express.json())

morgan.token('type', function (req, res) { 
    const body = req.body
    if (body == null) {
        return "-"
    } else {
    return JSON.stringify([body.name, body.number])}
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

const cors = require('cors')

app.use(cors())

app.use(express.static('dist'))

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    const date = new Date().toString()
    console.log(date)
    const howMany = persons.length

    response.send(`Phonebook has info for ${howMany} people. ${date}`)
})

app.post('/api/persons', (request, response) => {
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
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    console.log(person)

    persons = persons.concat(person)

    response.json(person)
})

const generateId = () => {
    const newId = Math.floor(Math.random() * 1000)
    return String(newId)
}

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})