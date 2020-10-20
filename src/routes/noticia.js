const { Router } = require('express')
const express = require('express')
const router = express.Router()
const noticia = require('../controllers/noticia')
const bodyparser = require('body-parser');

router.use(bodyparser.json())
router.use(bodyparser.urlencoded({ extended: true }))

router.get('/Noticias', noticia.getAll)
router.post('/addNoticia', noticia.add)
router.post('/editNoticia', noticia.edit)
router.post('/removeNoticia', noticia.remove)

module.exports = router