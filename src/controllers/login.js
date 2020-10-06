const db = require('../db')

const Login = {}

Login.log = async(req, res) => {
    await db.ref('Empresas/').once('value', (snap) => {
        if (snap.val()) {
            Object.values(snap.val()).map(empresa => {
                if (empresa.correo == req.body.correo) {
                    if (empresa.pass == req.body.pass) {
                        return res.send({
                            ok: true,
                            empresa,
                            mensaje: 'Inicio de sesión exitoso'
                        })
                    } else {
                        return res.send({
                            ok: false,
                            mensaje: 'Contraseña incorrecta'
                        })
                    }
                }
            })
        }
    })
    await db.ref('Pasajeros/').once('value', (snap) => {
        if (snap.val()) {
            Object.values(snap.val()).map(pasajero => {
                if (pasajero.correo == req.body.correo) {
                    if (pasajero.pass == req.body.pass) {
                        return res.send({
                            ok: true,
                            pasajero,
                            mensaje: 'Inicio de sesión exitoso'
                        })
                    } else {
                        return res.send({
                            ok: false,
                            mensaje: 'Contraseña incorrecta'
                        })
                    }
                }
            })
        }
    })
}

module.exports = Login