const db = require('../db')

const Login = {}

Login.log = async(req, res) => {
    let ans
    return await db.ref('Empresas/').once('value', (snap) => {
        if (snap.val()) {
            Object.values(snap.val()).map(empresa => {
                if (empresa.correo == req.body.correo) {
                    if (empresa.pass == req.body.pass) {
                        res.json({
                            ok: true,
                            empresa,
                            mensaje: 'Inicio de sesión exitoso'
                        })
                    } else {
                        res.json({
                            ok: false,
                            mensaje: 'Contraseña incorrecta'
                        })
                    }
                }
            })
        }
    })
    return await db.ref('Pasajeros/').once('value', (snap) => {
        if (snap.val()) {
            Object.values(snap.val()).map(pasajero => {
                if (pasajero.pass == req.body.pass) {
                    res.json({
                        ok: true,
                        pasajero,
                        mensaje: 'Inicio de sesión exitoso'
                    })
                } else {
                    res.json({
                        ok: false,
                        mensaje: 'Contraseña incorrecta'
                    })
                }
            })
        }
    })
}

module.exports = Login