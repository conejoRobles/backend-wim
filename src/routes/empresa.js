const { Router } = require('express')
const express = require('express')
const router = express.Router()
const empresas = require('../controllers/empresa')
const bodyparser = require('body-parser');

router.use(bodyparser.json())
router.use(bodyparser.urlencoded({ extended: true }))

router.get('/empresas', empresas.getAll)
router.get('/getRecorridos', empresas.getRecorridos)
router.get('/getRecorridoById', empresas.getRecorridoById)
router.post('/addEmpresa', empresas.add)
router.post('/editEmpresa', empresas.edit)

module.exports = router