const express = require('express');
const db = require('../database/config');
const router = express.Router();

/* GET users listing. */
router.get('/users', function (req, res, next) {
	res.render('users/index', {
		title: '',
		message: '',
	});
});

router.post('/user/login', function (req, res) {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({
			message: 'Username dan password harus diisi!',
		});
	}

	const query = `SELECT * FROM users WHERE username = "${username}"`;

	db.query(query, [username], (err, results) => {
		if (err) {
			return res.status(500).render('users/index', {
				title: '',
				message:
					'Terjadi kesalahan dalam mengambil data pengguna.',
			});
		}

		if (results.length === 0) {
			return res.status(401).render('users/index', {
				title: '',
				message: 'Username atau password salah',
			});
		}

		const user = results[0];

		if (password === user.password_hash) {
			res.status(200).render('index', {
				title: 'Warehouse | Homepage',
			});
		} else {
			res.status(401).render('users/index', {
				title: '',
				message: 'Username atau password salah',
			});
		}
	});
});

module.exports = router;
