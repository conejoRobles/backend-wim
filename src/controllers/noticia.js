const db = require('../db')
const noticia = {}

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