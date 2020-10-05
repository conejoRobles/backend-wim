const { Router } = require('express')
const express = require('express')
const router = express.Router()
const pasajero = require('../controllers/pasajero')
const bodyparser = require('body-parser');

router.use(bodyparser.json())
router.use(bodyparser.urlencoded({ extended: true }))

router.get('/', pasajero.getAll)
router.get('/getPasajero', pasajero.getByID)
router.post('/addPasajero', pasajero.add)
router.delete('/removePasajero', pasajero.remove)

module.exports = router