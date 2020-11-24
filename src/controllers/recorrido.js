
const db = require('../db')

const Recorridos = {}

const moment = require('moment');

Recorridos.addRecorrido = async (req, res) => {

	await db.ref('Empresas/' + req.body.rut + "/recorridos/" + req.body.id).once('value', (snap) => {
		if (snap.val() === null) {
			db.ref('Recorridos/' + req.body.origen + '/' + req.body.destino + '/' + req.body.rut).once('value', (snap) => {
				if (snap.val()) {
					res.json({
						ok: false,
						mensaje: 'el recorrido ya existe'
					})
				} else {
					db.ref('Empresas/' + req.body.rut + '/recorridos/' + req.body.id).set({
						id: req.body.id,
						origen: req.body.origen,
						destino: req.body.destino,
						precios: req.body.precios
					})
					db.ref('Recorridos/' + req.body.origen + '/' + req.body.destino + '/' + req.body.rut).set({
						origen: req.body.origen,
						destino: req.body.destino,
						empresa: req.body.rut,
						nombre: req.body.nombre,
						recorrido: req.body.id,
					})
					res.json({
						ok: true,
						mensaje: 'Su recorrido ha sido agregado con exito'
					})
				}
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
			if (req.body.origen != req.body.Oldorigen) {
				if (req.body.destino != req.body.Olddestino) {
					db.ref('Recorridos/' + req.body.Oldorigen + '/' + req.body.Olddestino + '/' + req.body.rut).remove()
				} else {
					db.ref('Recorridos/' + req.body.Oldorigen + '/' + req.body.destino + '/' + req.body.rut).remove()
				}
			} else {
				if (req.body.destino != req.body.Olddestino) {
					db.ref('Recorridos/' + req.body.Oldorigen + '/' + req.body.Olddestino + '/' + req.body.rut).remove()
				}
			}
			db.ref('Recorridos/' + req.body.origen + '/' + req.body.destino + '/' + req.body.rut).update({
				origen: req.body.origen,
				destino: req.body.destino,
				empresa: req.body.rut,
				nombre: req.body.nombre,
				recorrido: req.body.id,
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
			db.ref('Recorridos/' + req.body.origen + '/' + req.body.destino + '/' + req.body.rut).remove()
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

Recorridos.searchRecorrido = async (req, res) => {
	db.ref('Recorridos/' + req.body.origen + '/' + req.body.destino).once('value', async (snap) => {
		if (snap.val() != undefined && snap.val() != null) {
			let recorridos = Object.values(snap.val())
			res.json({
				ok: true,
				recorridos,
				mensaje: 'recorridos desde' + req.body.origen + ' - ' + req.body.destino
			})
		} else {
			res.json({
				ok: false,
				mensaje: 'recorridos desde' + req.body.origen + ' - ' + req.body.destino + ' No encontrados'
			})
		}
	})
}

module.exports = Recorridos