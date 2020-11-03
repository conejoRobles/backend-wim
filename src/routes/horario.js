const { Router } = require('express')
const express = require('express')
const router = express.Router()
const Horarios = require('../controllers/horario')
const bodyparser = require('body-parser');

router.use(bodyparser.json())
router.use(bodyparser.urlencoded({ extended: true }))

router.post('/addHorario', Horarios.addHorario)
router.post('/editHorario', Horarios.editHorario)
router.post('/removeHorario', Horarios.removeHorario)

module.exports = router