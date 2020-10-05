const db = require('../db')
const pasajero = {}

pasajero.getAll = (req, res) => {
    db.ref('Pasajeros/').on('value', (snap) => {
        if (snap.val() !== null) {
            res.json({
                ok: true,
                mensaje: 'Todos los pasajeros',
                payload: snap.val()
            })
        }
    })
}

pasajero.add = (req, res) => {

    db.ref('Pasajeros/' + req.body.rut).once('value', (snap) => {
        if (snap.val() === null) {
            db.ref('Pasajeros/' + req.body.rut).set({
                rut: req.body.rut,
                nombre: req.body.nombre,
                pass: req.body.pass,
                correo: req.body.correo,
                telefono: req.body.telefono
            })
            res.json({
                ok: true,
                mensaje: 'Pasajero agregado con exito '
            })
        } else {
            res.json({
                ok: false,
                mensaje: 'El pasajero ya esta registrado'
            })
        }
    })
}

pasajero.getByID = (req, res) => {
    db.ref('Pasajeros/' + req.rut).once('value', (snap) => {
        if (snap.val() !== null) {
            res.json({
                ok: true,
                mensaje: 'Pasajero encontrado',
                pasajero: snap.val()
            })
        }
    })
}

pasajero.remove = (req, res) => {
    db.ref('Pasajeros/' + req.rut).once('value', (snap) => {
        if (snap.val() !== null) {
            db.ref('Pasajeros/' + req.rut).remove((err) => {
                if (err) {
                    res.send(err)
                } else {
                    res.json({
                        ok: true,
                        mensaje: 'Pasajero Eliminado'
                    })
                }
            })
        } else {
            res.json({
                ok: false,
                mensaje: 'No se ha encontrado el pasajero'
            })
        }
    })
}

module.exports = pasajero