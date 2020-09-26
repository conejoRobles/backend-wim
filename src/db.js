const firebase = require('firebase')

firebase.initializeApp({
    databaseURL: 'https://smapp-560ec.firebaseio.com/',
})

const db = firebase.database()

module.exports = db