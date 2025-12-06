var express = require('express');
var router = express.Router();
const encrypt = require('bcryptjs');
let pool = require('../db');

router.get('/', (req, res) => {
	res.render('signup', { title: 'Registrarse' });
});

router.post('/', async (req, res) => {
	const { username, password, confirmation } = req.body;

	if (!username) {
		return res.render('signup', { error: "Debe ingresar un nombre de usuario" });

	}
	if (!password || !confirmation) {
		return res.render('signup', { error: 'Campos vacíos' });
	}
	if (password !== confirmation) {
		return res.render('signup', { error: 'Las constraseñas no coinciden' });
	}
	try {
		let hash = await encrypt.hash(password, 10);
		let [user] = await pool.query("INSERT INTO users(username, hash) VALUES (?, ?)", [username, hash]);
		req.session.user_id = user.insertId;
		req.session.nuevo_user = true;
		res.redirect('home');
	}
	catch (err) {
		console.log(err);
		res.render('signup', { error: "Este usuario ya existe" });
	}
});

module.exports = router;