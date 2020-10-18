const db = require('../db')
const noticia = {}

noticia.getAll = (req, res) => {
    db.ref('noticias/').on('value', (snap) => {
        if (snap.val() !== null) {
            res.json({
                ok: true,
                mensaje: 'Todos las noticias',
                payload: snap.val()
            })
        }
    })
}

noticia.add = (req, res) => {

    db.ref('noticias/' + req.body.id).once('value', (snap) => {
        if (snap.val() === null) {
            db.ref('noticias/' + req.body.id).set({
                id: req.body.id,
                titulo: req.body.titulo,
                descripción: req.body.descripción,
            })
            res.json({
                ok: true,
                mensaje: 'noticia agregada con exito '
            })
        } else {
            res.json({
                ok: false,
                mensaje: 'La noticia ya esta registrada'
            })
        }
    })
}

noticia.getByID = (req, res) => {
    db.ref('noticias/' + req.id).once('value', (snap) => {
        if (snap.val() !== null) {
            res.json({
                ok: true,
                mensaje: 'noticia encontrada',
                noticia: snap.val()
            })
        }
    })
}

noticia.remove = (req, res) => {
    db.ref('noticias/' + req.id).once('value', (snap) => {
        if (snap.val() !== null) {
            db.ref('noticias/' + req.id).remove((err) => {
                if (err) {
                    res.send(err)
                } else {
                    res.json({
                        ok: true,
                        mensaje: 'noticia Eliminada'
                    })
                }
            })
        } else {
            res.json({
                ok: false,
                mensaje: 'No se ha encontrado la noticia'
            })
        }
    })
}

module.exports = noticia