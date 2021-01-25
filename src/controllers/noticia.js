const db = require('../db')
const noticia = {}
var cron = require('node-cron');
const nodemailer = require("nodemailer");
const moment = require('moment');
const contacto = (asunto, descripcion, correoPasajero) => {
    const email = correoPasajero

    const emisorPlataforma = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'wim.informaciones@gmail.com',
            pass: 'Carolina8967.'
        }
    })
    let payload = {
        from: 'wim.informaciones@gmail.com',
        to: email,
        subject: asunto,
        text: descripcion
    }
    emisorPlataforma.sendMail(payload, (error) => {
        if (error) {
            console.log('Error Email: ' + error)
        } else {
            console.log('Email enviado')
        }
    })
}


cron.schedule('* * * * *', () => {
    console.log('DOING SOMETHING')
    db.ref('Empresas/').once('value', sp => {
        if (sp.val() != undefined && sp.val() != null) {
            let empresas = Object.values(sp.val())
            empresas.map(empresa => {
                if (empresa.recorridos != undefined && empresa.recorridos != null) {
                    let recorridos = Object.values(empresa.recorridos)
                    recorridos.map(recorrido => {
                        if (recorrido.Horarios != null && recorrido.Horarios != undefined) {
                            let horarios = Object.values(recorrido.Horarios)
                            horarios.map(h => {
                                if (h.Noticias != null && h.Noticias != undefined) {
                                    let noticias = Object.values(h.Noticias)
                                    noticias.map(n => {
                                        if (moment(new Date(n.fechaTermino)).diff(moment(new Date())) < 0) {
                                            db.ref('Empresas/' + empresa.rut + '/recorridos/' + recorrido.id + '/Horarios/' + h.id + '/Noticias/' + n.id).remove()
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })

        }
    })
});

noticia.getAll = (req, res) => {
    console.log(req.recorrido)
    db.ref('Empresas/' + req.query.rut + '/recorridos/' + req.query.recorrido).once('value', (snap) => {
        if (snap.val() !== null) {
            db.ref('Empresas/' + req.query.rut + '/recorridos/' + req.query.recorrido + '/Noticias/').once('value', (snap) => {
                if (snap.val() !== null) {
                    res.json({
                        ok: true,
                        mensaje: 'Todas las noticias!',
                        noticias: snap.val()
                    })
                } else {
                    res.json({
                        ok: false,
                        mensaje: 'Aún no hay noticias!',
                    })
                }
            })
        } else {
            res.json({
                ok: false,
                mensaje: 'El recorrido no existe',
            })
        }
    })
}

noticia.add = (req, res) => {
    db.ref('Empresas/' + req.body.rut + '/recorridos/' + req.body.recorrido + '/Horarios/' + req.body.horario + '/Noticias/' + req.body.id).set({
        id: req.body.id,
        descripcion: req.body.descripcion,
        titulo: req.body.titulo,
        fechaTermino: req.body.fechaTermino,
        fechaPublicacion: req.body.fechaPublicacion,
        duracion: req.body.duracion
    })
    let asunto = 'Atención! tienes una nueva noticia!'
    let descripcion = ''
    db.ref('Pasajeros/').once('value', (sp) => {
        let horarioANotificar = ''
        db.ref('Empresas/' + req.body.rut + '/recorridos/' + req.body.recorrido + '/Horarios/' + req.body.horario).once('value', sp => {
            horarioANotificar = sp.val()
        })
        if (sp.val() != null && sp.val() != undefined) {
            let pasajeros = Object.values(sp.val())
            pasajeros.map(pasajero => {
                if (pasajero.favoritos != null && pasajero.favoritos != undefined) {
                    let origenes = Object.values(pasajero.favoritos)
                    origenes.map(origen => {
                        let destinos = Object.values(origen)
                        if (destinos.length > 0) {
                            destinos.map(destino => {
                                if (destino.Horarios != null && destino.Horarios != undefined) {
                                    let horarios = Object.values(destino.Horarios)
                                    horarios.map(h => {
                                        if (h.id == req.body.horario) {
                                            db.ref('Empresas/' + req.body.rut).once('value', (snap) => {
                                                if (snap.val() != null && snap.val() != undefined) {
                                                    descripcion = 'La empresa ' + snap.val().nombre + ' ha añadido una nueva noticia en el horario : \nOrigen : ' + origen.origen + '\nDestino : ' + destino.destino + '\nHora de salida : ' + moment(new Date(horarioANotificar.horaInicio)).format('HH:mm') + '\nHora de llegada : ' + moment(new Date(horarioANotificar.horaTermino)).format('HH:mm') + '\n\nTitulo : ' + req.body.titulo + '\nMensaje : ' + req.body.descripcion
                                                    contacto(asunto, descripcion, pasajero.correo)
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
    res.json({
        ok: true,
        mensaje: 'Noticia Agregada!'
    })
}

noticia.edit = (req, res) => {

    db.ref('Empresas/' + req.body.rut + '/recorridos/' + req.body.recorrido + '/Horarios/' + req.body.horario + '/Noticias/' + req.body.id).once('value', (snap) => {
        if (snap.val() !== null) {
            db.ref('Empresas/' + req.body.rut + '/recorridos/' + req.body.recorrido + '/Horarios/' + req.body.horario + '/Noticias/' + req.body.id).update({
                id: req.body.id,
                descripcion: req.body.descripcion,
                titulo: req.body.titulo,
                fechaTermino: req.body.fechaTermino,
                fechaPublicacion: req.body.fechaPublicacion,
                duracion: req.body.duracion
            })
            res.json({
                ok: true,
                mensaje: 'Noticia editada!'
            })
        } else {
            res.json({
                ok: false,
                mensaje: 'La noticia no existe!',
            })
        }
    })
}

noticia.remove = (req, res) => {
    db.ref('Empresas/' + req.body.rut + '/recorridos/' + req.body.recorrido + '/Horarios/' + req.body.horario + '/Noticias/' + req.body.id).remove()
    res.json({
        ok: true,
        mensaje: 'Noticia Eliminada!'
    })
}



module.exports = noticia