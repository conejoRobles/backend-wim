const db = require('../db')
const nodemailer = require("nodemailer");
const moment = require('moment');
const Horarios = {}

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



Horarios.addHorario = (req, res) => {

	db.ref('Empresas/' + req.body.rut + "/recorridos/" + req.body.recorrido + '/Horarios/' + req.body.id).once('value', (snap) => {
		if (snap.val() === null) {
			db.ref('Empresas/' + req.body.rut + "/recorridos/" + req.body.recorrido + '/Horarios/' + req.body.id).set({
				id: req.body.id,
				horaInicio: req.body.horaInicio,
				horaTermino: req.body.horaTermino,
				conductor: req.body.conductor,
				patente: req.body.patente,
				dias: req.body.dias,
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

Horarios.editHorario = (req, res) => {

	db.ref('Empresas/' + req.body.rut + "/recorridos/" + req.body.recorrido + '/Horarios/' + req.body.id).once('value', (snap) => {
		if (snap.val() !== null) {
			db.ref('Empresas/' + req.body.rut + "/recorridos/" + req.body.recorrido + '/Horarios/' + req.body.id).set({
				id: req.body.id,
				horaInicio: req.body.horaInicio,
				horaTermino: req.body.horaTermino,
				conductor: req.body.conductor,
				patente: req.body.patente,
				dias: req.body.dias,
			})
			res.json({
				ok: true,
				mensaje: 'Su Horario ha sido modificado con exito'
			})
		} else {
			res.json({
				ok: false,
				mensaje: 'El Horario no existe'
			})
		}
	})

}

Horarios.searchHorario = (req, res) => {
	db.ref('Empresas/' + req.body.empresa + "/recorridos/" + req.body.recorrido + '/Horarios/' + req.body.horario).once('value', (snap) => {
		let precios = []
		db.ref('Empresas/' + req.body.empresa + "/recorridos/" + req.body.recorrido).once('value', (sp) => {
			if (sp.val().precios != null && sp.val().precios != undefined) {
				precios = sp.val().precios
			}
			if (snap.val() != null && snap.val() != undefined) {
				res.json({
					ok: true,
					mensaje: 'horario encontrado',
					horario: snap.val(),
					precios
				})
			} else {
				res.json({
					ok: false,
					mensaje: 'el horario no existe',
				})
			}
		})
	})
}

Horarios.removeHorario = (req, res) => {
	let asunto = 'Atención! uno de tus horarios ha sido eliminado por su empresa!'
	let descripcion = ''
	db.ref('Empresas/' + req.body.rut + "/recorridos/" + req.body.recorrido + '/Horarios/' + req.body.id).once('value', (snap) => {
		if (snap.val() !== null) {
			let horarioABorrar = snap.val()
			db.ref('Empresas/' + req.body.rut + "/recorridos/" + req.body.recorrido + '/Horarios/' + req.body.id).remove()
			db.ref('Pasajeros/').once('value', (sp) => {
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
												if (h.id == req.body.id) {
													db.ref('Empresas/' + req.body.rut).once('value', (snap) => {
														if (snap.val() != null && snap.val() != undefined) {
															descripcion = 'La empresa ' + snap.val().nombre + ' ha eliminado el horario: \nOrigen : ' + origen.origen + '\nDestino : ' + destino.destino + '\nHora de salida : ' + moment(new Date(horarioABorrar.horaInicio)).format('HH:mm') + '\nHora de llegada : ' + moment(new Date(horarioABorrar.horaTermino)).format('HH:mm') + '\nAsí que hemos actualizado tu listado de horarios favoritos!'
															contacto(asunto, descripcion, pasajero.correo)
														}
													})
													db.ref('Pasajeros/' + pasajero.rut + "/favoritos/" + origen.origen + '/' + destino.destino + '/Horarios/' + req.body.id).remove()
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
				mensaje: 'Su Horario ha sido eliminado con exito'
			})
		} else {
			res.json({
				ok: false,
				mensaje: 'El Horario no existe'
			})
		}
	})

}



module.exports = Horarios