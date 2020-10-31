const { Router } = require('express')
const express = require('express')
const router = express.Router()
const recorridos = require('../controllers/recorrido')
const bodyparser = require('body-parser');

router.use(bodyparser.json())
router.use(bodyparser.urlencoded({ extended: true }))

router.post('/addRecorrido', recorridos.addRecorrido)
router.post('/editRecorrido', recorridos.editRecorrido)
router.post('/removeRecorrido', recorridos.removeRecorrido)

module.exports = router