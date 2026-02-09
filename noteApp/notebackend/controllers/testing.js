/*  osa5d Tietokannan tilan kontrollointi
E2E-testauksessa lisähaasteen tuo se, että testeistä ei ole mahdollista
päästä suoraan käsiksi tietokantaan.
Ratkaistaan ongelma luomalla backendiin testejä varten API-endpoint,
jonka avulla testit voivat tarvittaessa nollata kannan.
Tehdään testejä varten oma router
 */

const router = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
  await Note.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router