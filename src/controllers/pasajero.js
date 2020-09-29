const db = require('../db')
const pasajero = {}

pasajero.getAll = (req, res) => {
    db.ref('Pasajero/').on('value', (snap) => {
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
    db.ref('Pasajero/' + req.rut).once('value', (snap) => {
        if (snap.val() === null) {
            db.ref('Pasajero/' + req.rut).set({
                rut: req.rut,
                nombre: req.nombre,
                pass: req.pass,
                correo: req.correo,
                telefono: req.telefono
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
    db.ref('Pasajero/' + req.rut).once('value', (snap) => {
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
    db.ref('Pasajero/' + req.rut).once('value', (snap) => {
        if (snap.val() !== null) {
            db.ref('Pasajero/' + req.rut).remove((err) => {
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