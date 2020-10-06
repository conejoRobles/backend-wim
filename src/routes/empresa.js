const { Router } = require('express')
const express = require('express')
const router = express.Router()
const empresas = require('../controllers/empresa')
const bodyparser = require('body-parser');

router.use(bodyparser.json())
router.use(bodyparser.urlencoded({ extended: true }))

router.get('/empresas', empresas.getAll)
router.post('/addEmpresa', empresas.add)

module.exports = router