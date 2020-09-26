const db = require('../db')

const empresa = {}

empresa.getAll = (req, res) => {
    db.ref('/').on('value', (snap) => {
        let todo = snap.val()
        console.log(todo)
    })
}

module.exports = empresa