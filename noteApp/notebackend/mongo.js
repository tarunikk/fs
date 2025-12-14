/*  Kun koodi suoritetaan komennolla node mongo.js salasana
    se lisää uuden dokumentin Mongoose tietokantaan */

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

//  Ohjelma odottaa parametrinä MongoDB:n salasanaa
const password = process.argv[2]

//  MongoDB cluster0 url
const url = `mongodb+srv://tarunikkanen:${password}@cluster0.2zjh6sj.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

/*  Yhteyden avaamisen jälkeen määritellään muistiinpanon skeema
    Skeema kertoo Mongooselle, miten muistiinpano-olio tulee tallettaa tietokantaan */
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

/*  Skeemaa vastaava model
    Ensimmäisenä parametrinä oleva merkkijono Note määrittelee,
    että Mongoose tallettaa muistiinpanoa vastaavat oliot kokoelmaan notes (Mongoosen konventio) */
const Note = mongoose.model('Note', noteSchema)

/*  !!! KOMMENTOIDAAN PIILOON UUSIA MUISTIINPANOJA GENEROIVA OSA!!!
    Luodaan muistiinpanoa vastaavan model:in avulla muistiinpano-olio
    modelit ovat ns. konstruktorifunktioita, jotka luovat
    parametrien perusteella Javascript-olioita
const note = new Note({
  content: 'Mongoose makes things easy',
  important: true,
})

    Tallettaminen tapahtuu metodilla save.
    Metodi palauttaa promisen, jolle voidaan rekisteröidä
    then-metodin avulla tapahtumankäsittelijä
note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
}) */

//  Haetaan muistiinpano.oliot tietokannasta
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})

//  Kun olio on tallennettu kantaan, kutsutaan tapahtumankäsittelijää, joka sulkee tietokantayhteyden