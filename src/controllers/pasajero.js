const db = require('../db')
const fs = require('fs')
const { v4: uuid } = require('uuid');
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
                telefono: req.body.telefono,
                rol: 'pasajero'
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

pasajero.edit = (req, res) => {
    db.ref('Pasajeros/' + req.body.rut).once('value', (snap) => {
        if (snap.val() !== null) {
            db.ref('Pasajeros/' + req.body.rut).set({
                ...snap.val(),
                rut: req.body.rut,
                nombre: req.body.nombre,
                pass: req.body.pass,
                correo: req.body.correo,
                telefono: req.body.telefono,
                rol: 'pasajero'
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
    db.ref('Pasajeros/' + req.body.rut).once('value', (snap) => {
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

pasajero.getEmpresas = (req, res) => {
    db.ref('Pasajeros/' + req.query.rut).once('value', (snap) => {
        if (snap.val().empresas) {
            res.json({
                ok: true,
                mensaje: 'Empresas guardadas por el pasajero',
                empresas: snap.val().empresas,
                favoritos: snap.val().favoritos,
            })
        } else {
            res.json({
                ok: false,
                mensaje: 'No existen empresas guardadas',
            })
        }
    })
}

pasajero.addFavorito = (req, res) => {
    db.ref('Pasajeros/' + req.body.rut + "/empresas/" + req.body.empresa).update(
        { rut: req.body.empresa, nombre: req.body.nombreEmpresa, }
    )
    db.ref('Pasajeros/' + req.body.rut + "/empresas/" + req.body.empresa + "/recorridos/" + req.body.recorrido).update(
        { id: req.body.recorrido }
    )
    db.ref('Pasajeros/' + req.body.rut + "/empresas/" + req.body.empresa + "/recorridos/" + req.body.recorrido + '/Horarios/' + req.body.id).once('value', (snap) => {
        if (snap.val() === null) {
            db.ref('Pasajeros/' + req.body.rut + "/empresas/" + req.body.empresa + "/recorridos/" + req.body.recorrido + '/Horarios/' + req.body.id).set({
                id: req.body.id,
                empresa: req.body.empresa,
                recorrido: req.body.recorrido
            })
        }
    })
    db.ref('Pasajeros/' + req.body.rut + "/favoritos/" + req.body.origen).update({
        id: uuid()
    })
    db.ref('Pasajeros/' + req.body.rut + "/favoritos/" + req.body.origen + "/" + req.body.destino).update({
        origen: req.body.origen,
        destino: req.body.destino,
        id: uuid()
    })
    db.ref('Pasajeros/' + req.body.rut + "/favoritos/" + req.body.origen + "/" + req.body.destino + '/Horarios/' + req.body.id).once('value', (snap) => {
        if (snap.val() === null) {
            db.ref('Pasajeros/' + req.body.rut + "/favoritos/" + req.body.origen + "/" + req.body.destino + '/Horarios/' + req.body.id).set({
                id: req.body.id,
                empresa: req.body.empresa,
                nombre: req.body.nombreEmpresa,
                recorrido: req.body.recorrido
            })
            res.json({
                ok: true,
                mensaje: 'Su Horario ha sido agregado con exito'
            })
        } else {
            res.json({
                ok: false,
                mensaje: 'el Horario ya existe'
            })
        }
    })
}

pasajero.removeFavorito = (req, res) => {
    db.ref('Pasajeros/' + req.body.rut + "/empresas/" + req.body.empresa + "/recorridos/" + req.body.recorrido + '/Horarios/' + req.body.id).once('value', (snap) => {
        if (snap.val() != null) {
            db.ref('Pasajeros/' + req.body.rut + "/empresas/" + req.body.empresa + "/recorridos/" + req.body.recorrido + '/Horarios/' + req.body.id).remove()
        }
    })

    db.ref('Pasajeros/' + req.body.rut + "/favoritos/" + req.body.origen + "/" + req.body.destino + '/Horarios/' + req.body.id).remove()
    db.ref('Pasajeros/' + req.body.rut + "/favoritos/" + req.body.origen + "/" + req.body.destino).once('value', snap => {
        if (snap.val().Horarios == null || snap.val().Horarios == undefined) {
            db.ref('Pasajeros/' + req.body.rut + "/favoritos/" + req.body.origen + "/" + req.body.destino).remove()
        }
    })
    res.json({
        ok: true,
        mensaje: 'Su Horario ha sido eliminado con exito'
    })
}


module.exports = pasajero