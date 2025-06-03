const express = require('express')
const app = express()
const cors = require('cors')

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json()) 
// ottaa json parserin käyttöön, päästään käsiksi HTTP-pyynnön mukana lähetettyyn dataan
app.use(requestLogger)  
// middleware, joka tulostaa konsoliin palvelimelle tulevien pyyntöjen perustietoja
app.use(cors())
// cors middleware sallii kaikista origineista tulevat pyynnöt kaikkiin backendin express routeihin
app.use(express.static('dist'))
// static middleware saa expressin näyttämään staattista sisältöä eli sivun index.html ja sen lataaman JavaScriptin

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})  // näytetään kaikki notes

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})    // näytetään tietyn id:n note

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})   // poistetaan tietyn id:n note

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'  
    })   // varmistetaan että noten sisältö, body.content, ei puutu
  }

  const note = {
    content: body.content,
    important: body.important || false, // asetetaan noten importance falseksi oletuksena
    id: generateId(),
  }
  console.log(note)

  notes = notes.concat(note)
  response.json(note)
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}   // luodaan uudelle notelle id

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint) // ottaa käyttöön middlewaren, jolla saadaan routejen 
// käsittelemättömistä virhetilanteista JSON-muotoinen virheilmoitus

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})