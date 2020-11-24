const db = require('../db')

const Empresas = {}

Empresas.getAll = (req, res) => {
    db.ref('Empresas/').on('value', (snap) => {
        if (snap.val() !== null) {
            res.json({
                ok: true,
                mensaje: 'todas las Empresas',
                payload: snap.val()
            })
        }
    })
}

Empresas.add = (req, res) => {
    db.ref('Empresas/' + req.body.rut).once('value', (snap) => {
        if (snap.val() === null) {
            db.ref('Empresas/' + req.body.rut).set({
                rut: req.body.rut,
                nombre: req.body.nombre,
                pass: req.body.pass,
                correo: req.body.correo,
                telefono: req.body.telefono,
                rol: 'empresa'
            })
            res.json({
                ok: true,
                mensaje: 'Empresa agregada con exito '
            })
        } else {
            res.json({
                ok: false,
                mensaje: 'La Empresa ya existe'
            })
        }
    })
}

Empresas.edit = (req, res) => {
    db.ref('Empresas/' + req.body.rut).once('value', (snap) => {
        if (snap.val() !== null) {
            db.ref('Empresas/' + req.body.rut).set({
                ...snap.val(),
                rut: req.body.rut,
                nombre: req.body.nombre,
                pass: req.body.pass,
                correo: req.body.correo,
                telefono: req.body.telefono,
                rol: 'empresa'
            })
            res.json({
                ok: true,
                mensaje: 'Datos de empresa modificados con éxito!'
            })
        } else {
            res.json({
                ok: false,
                mensaje: 'No se ha logrado completar la modificación'
            })
        }
    })
}

Empresas.getByID = (req, res) => {
    db.ref('Empresas/' + req.rut).once('value', (snap) => {
        if (snap.val() !== null) {
            res.json({
                ok: true,
                mensaje: 'Empresa encontrada',
                Empresas: snap.val()
            })
        }
    })
}

Empresas.remove = (req, res) => {
    db.ref('Empresas/' + req.rut).once('value', (snap) => {
        if (snap.val() !== null) {
            db.ref('Empresas/' + req.rut).remove((err) => {
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
                mensaje: 'No se ha encontrado la Empresa'
            })
        }
    })
}

Empresas.getRecorridos = (req, res) => {
    db.ref('Empresas/' + req.query.rut).once('value', (snap) => {
        if (snap.val().recorridos) {
            res.json({
                ok: true,
                mensaje: 'Recorridos guardadas por la empresa',
                recorridos: snap.val().recorridos
            })
        } else {
            res.json({
                ok: false,
                mensaje: 'No existen recorridos guardadas',
            })
        }
    })
}

Empresas.getRecorridoById = (req, res) => {
    db.ref('Empresas/' + req.query.empresa + '/recorridos/' + req.query.recorrido).once('value', (snap) => {
        if (snap.val() != null && snap.val() != undefined) {
            res.json({
                ok: true,
                mensaje: 'Recorrido encontrado',
                recorrido: snap.val()
            })
        } else {
            res.json({
                ok: false,
                mensaje: 'No existen el recorrido',
            })
        }
    })
}

module.exports = Empresas