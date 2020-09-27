const db = require('../db')

const empresa = {}

empresa.getAll = (req, res) => {
    db.ref('Empresas/').on('value', (snap) => {
        if (snap.val() !== null) {
            res.json({
                ok: true,
                mensaje: 'todas las empresas',
                payload: snap.val()
            })
        }
    })
}

empresa.add = (req, res) => {
    db.ref('Empresa/' + req.id).once('value', (snap) => {
        if (snap.val() === null) {
            db.ref('Empresas/' + req.rut).set({
                rut: req.rut,
                nombre: req.nombre,
                pass: req.pass,
                correo: req.correo,
                telefono: req.telefono
            })
        } else {
            res.json({
                ok: false,
                mensaje: 'La empresa ya existe'
            })
        }
    })
}

empresa.getByID = (req, res) => {
    db.ref('Empresa/' + req.rut).once('value', (snap) => {
        if (snap.val() !== null) {
            res.json({
                ok: true,
                mensaje: 'Empresa encontrada',
                empresa: snap.val()
            })
        }
    })
}

empresa.remove = (req, res) => {
    db.ref('Empresa/' + req.rut).once('value', (snap) => {
        if (snap.val() !== null) {
            db.ref('Empresa/' + req.rut).remove((err) => {
                if (err) {
                    res.send(err)
                } else {
                    res.json({
                        ok: true,
                        mensaje: 'Empresa eliminada'
                    })
                }
            })
        } else {
            res.json({
                ok: false,
                mensaje: 'No se ha encontrado la empresa'
            })
        }
    })
}

module.exports = empresa