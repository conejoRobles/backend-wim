const db = require('../db')
const nodemailer = require("nodemailer");
const Empresas = {}


Empresas.contacto = (req, res) => {
    const nombre = req.body.nombre
    const rut = req.body.rut
    const email = req.body.email
    const asunto = req.body.asunto
    const descripcion = req.body.descripcion

    const emisorPlataforma = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'gestionsmapp@gmail.com',
            pass: 'smapp2020'
        }
    })
    let payload = {
        from: nombre,
        to: 'gestionsmapp@gmail.com',
        subject: asunto,
        text: `Se ha presentado un problema y ${nombre} con rut ${rut} y correo ${email}, quiere contactarse contigo, la razon es: ${asunto}.\n Ademas agregó esto:\n ${descripcion}`
    }

    emisorPlataforma.sendMail(payload, (error) => {
        if (error) {
            console.log('Error Email: ' + error)
            return res.status(500).json({
                ok: false,
                mensaje: error.message
            })
        } else {
            console.log('Email enviado')
            return res.status(200).json({
                ok: true,
                mensaje: 'Email enviado',
                payload: descripcion
            })
        }
    })
}

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
            db.ref('Empresas/').once('value', (snap) => {
                let ready = false
                Object.values(snap.val()).map(x => {
                    if (x.correo == req.body.correo) {
                        ready = true
                    }
                })
                if (!ready) {
                    db.ref('Pasajeros/').once('value', (snap) => {
                        Object.values(snap.val()).map(y => {
                            if (y.correo == req.body.correo) {
                                ready = true
                            }
                        })
                        if (!ready) {
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
                                mensaje: 'Ya se ha registrado un usuario con ese correo'
                            })
                        }
                    })
                } else {
                    res.json({
                        ok: false,
                        mensaje: 'Ya se ha registrado un usuario con ese correo'
                    })
                }
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
        if (snap.val().recorridos != null && snap.val().recorridos != undefined) {
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
            db.ref('Empresas/' + req.query.empresa).once('value', (sp) => {
                res.json({
                    ok: true,
                    mensaje: 'Recorrido encontrado',
                    recorrido: { ...snap.val(), telefono: sp.val().telefono }
                })
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