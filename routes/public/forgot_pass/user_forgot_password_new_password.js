const { isEmpty } = require('lodash');
const db = require('../../../db');
const bodyParser = require('body-parser');

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.put('/api/v1/users/forgot_password/new_password/:token', async function (req, res) {
		try {
			const { password } = req.body;
			console.log(password);
			const { token } = req.params;
			console.log(token);
			const updatedUser = await db('users')
				.where('reset_token', token)
				.update({
					password,
				})
				.returning('*');
			if (isEmpty(updatedUser)) {
				return res
					.status(400)
					.send('Could not find user in the database to update their password!');
			}
			return res.status(200).json(updatedUser);
		} catch (err) {
			console.log('error message', err.message);
			return res.status(400).send('Could not create new user password');
		}
	});
};
