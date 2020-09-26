const { Router } = require('express')
const express = require('express')
const router = express.Router()
const empresas = require('../controllers/empresa')

router.get('/', empresas.getAll)

module.exports = router