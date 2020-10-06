const { Router } = require('express')
const express = require('express')
const router = express.Router()
const login = require('../controllers/login')
const bodyparser = require('body-parser');

router.use(bodyparser.json())
router.use(bodyparser.urlencoded({ extended: true }))

router.post('/', login.log)

module.exports = router