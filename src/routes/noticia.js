const { Router } = require('express')
const express = require('express')
const router = express.Router()
const noticia = require('../controllers/noticia')
const bodyparser = require('body-parser');

router.use(bodyparser.json())
router.use(bodyparser.urlencoded({ extended: true }))

router.get('/noticias', noticia.getAll)
router.get('/getnoticia', noticia.getByID)
router.post('/addnoticia', noticia.add)
router.delete('/removenoticia', noticia.remove)

module.exports = router