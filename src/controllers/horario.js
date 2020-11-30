const db = require('../db')

const Horarios = {}

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
		if (snap.val() != null && snap.val() != undefined) {
			res.json({
				ok: true,
				mensaje: 'horario encontrado',
				horario: snap.val()
			})
		} else {
			res.json({
				ok: falseconso,
				mensaje: 'el horario no existe',
			})
		}
	})
}

Horarios.removeHorario = (req, res) => {
	db.ref('Empresas/' + req.body.rut + "/recorridos/" + req.body.recorrido + '/Horarios/' + req.body.id).once('value', (snap) => {
		if (snap.val() !== null) {
			db.ref('Empresas/' + req.body.rut + "/recorridos/" + req.body.recorrido + '/Horarios/' + req.body.id).remove()
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