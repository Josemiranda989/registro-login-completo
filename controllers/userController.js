const bcryptjs = require('bcryptjs');
const {
	validationResult
} = require('express-validator');

const db = require('../database/models')

// const User = require('../models/User');

const controller = {
	register: async (req, res) => {
		const countries = await db.Country.findAll()
		return res.render('userRegisterForm', { countries });
	},
	processRegister: async (req, res) => {
		const resultValidation = validationResult(req);
		let countries = await db.Country.findAll()

		if (resultValidation.errors.length > 0) {
			return res.render('userRegisterForm', {
				errors: resultValidation.mapped(),
				oldData: req.body,
				countries
			});
		}

		let userInDB = await db.User.findOne({ where: { email: req.body.email } })
		// let userInDB = User.findByField('email', req.body.email);

		if (userInDB) {
			return res.render('userRegisterForm', {
				errors: {
					email: {
						msg: 'Este email ya está registrado'
					}
				},
				oldData: req.body,
				countries
			});
		}
		console.log(req.body);
		let userToCreate = {
			...req.body,
			password: bcryptjs.hashSync(req.body.password, 10),
			avatar: req.file?.filename || 'default-profile.png'
		}

		await db.User.create(userToCreate);

		return res.redirect('/user/login');
	},
	login: (req, res) => {
		return res.render('userLoginForm');
	},
	loginProcess: async (req, res) => {
		let userToLogin = await db.User.findOne({
			where: { email: req.body.email },
			include: [
				{
					model: db.Country,
					as: 'country', // Alias definido en la asociación en el modelo User
				},
			],
			// raw: true
		})
		// let userToLogin = User.findByField('email', req.body.email);

		if (userToLogin) {
			let isOkThePassword = bcryptjs.compareSync(req.body.password, userToLogin.password);
			if (isOkThePassword) {
				delete userToLogin.password;
				req.session.userLogged = userToLogin;

				if (req.body.remember_user) {
					res.cookie('userEmail', req.body.email, { maxAge: (1000 * 60) * 60 })
				}

				return res.redirect('/user/profile');
			}
			return res.render('userLoginForm', {
				errors: {
					email: {
						msg: 'Las credenciales son inválidas'
					}
				}
			});
		}

		return res.render('userLoginForm', {
			errors: {
				email: {
					msg: 'No se encuentra este email en nuestra base de datos'
				}
			}
		});
	},
	profile: (req, res) => {
		return res.render('userProfile', {
			user: req.session.userLogged
		});
	},

	logout: (req, res) => {
		res.clearCookie('userEmail');
		req.session.destroy();
		return res.redirect('/');
	}
}

module.exports = controller;