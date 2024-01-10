const db = require('../database/models')
const controller = {
	index: async (req, res) => {
		/* 		let user = (await db.User.findAll({
					include: [
						{
							model: db.Country,
							as: 'country', // Alias definido en la asociación en el modelo User
						},
					],
				}))
				console.log(user[0].country); */
		return res.render('index');
	}
}

module.exports = controller;