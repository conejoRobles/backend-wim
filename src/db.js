const firebase = require('firebase')

firebase.initializeApp({
    databaseURL: 'https://whereismy-22983.firebaseio.com/',
})

const db = firebase.database()

module.exports = db