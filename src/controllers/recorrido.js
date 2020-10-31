const db = require('../db')

const Recorridos = {}

Recorridos.addRecorrido = (req, res) => {

	db.ref('Empresas/' + req.body.rut + "/recorridos/" + req.body.id).once('value', (snap) => {
		if (snap.val() === null) {
			db.ref('Empresas/' + req.body.rut + '/recorridos/' + req.body.id).set({
				id: req.body.id,
				origen: req.body.origen,
				destino: req.body.destino,
				precios: req.body.precios
			})
			res.json({
				ok: true,
				mensaje: 'Su recorrido ha sido agregado con exito'
			})
		} else {
			res.json({
				ok: false,
				mensaje: 'el recorrido ya existe'
			})
		}
	})

}

Recorridos.editRecorrido = (req, res) => {

	db.ref('Empresas/' + req.body.rut + "/recorridos/" + req.body.id).once('value', (snap) => {
		if (snap.val() != null) {
			db.ref('Empresas/' + req.body.rut + '/recorridos/' + req.body.id).update({
				id: req.body.id,
				origen: req.body.origen,
				destino: req.body.destino,
				precios: req.body.precios
			})
			res.json({
				ok: true,
				mensaje: 'Su recorrido ha sido modificado con exito'
			})
		} else {
			res.json({
				ok: false,
				mensaje: 'El recorrido no existe'
			})
		}
	})

}

Recorridos.removeRecorrido = (req, res) => {
	db.ref('Empresas/' + req.body.rut + "/recorridos/" + req.body.id).once('value', (snap) => {
		if (snap.val() != null) {
			db.ref('Empresas/' + req.body.rut + "/recorridos/" + req.body.id).remove()
			res.json({
				ok: true,
				mensaje: 'Recorrido eliminado con exito'
			})
		} else {
			res.json({
				ok: false,
				mensaje: 'El recorrido no existe'
			})
		}
	})
}

module.exports = Recorridos