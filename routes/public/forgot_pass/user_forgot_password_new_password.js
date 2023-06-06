const { isEmpty } = require('lodash');
const db = require('../../../connectors/db');
const bodyParser = require('body-parser');

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.put('/api/v1/users/forgot_password/new_password/', async function (req, res) {
		try {
			const { password, resetToken } = req.body;
			// const { token } = req.params;
			console.log(password);
			console.log(resetToken);

			// const tokenStillExists = await db('users').select('*').where('reset_token', resetToken);
			const tokenStillExists = await db('users').select('*').where('reset_token', resetToken);

			if (isEmpty(tokenStillExists)) {
				return res.status(400).json([400, 'Token invalid/ expired!']);
			}

			const updatedUser = await db('users')
				.where('reset_token', resetToken)
				.update({
					password,
					reset_token: null,
					reset_token_expiration: null,
				})
				.returning('*');

			if (isEmpty(updatedUser)) {
				return res
					.status(401)
					.json([401, 'Could not find user in the database to update their password!']);
			}
			console.log('1');
			return res.status(200).send([200, 'Successfully reset password']);
		} catch (err) {
			console.log('error message', err.message);
			return res.status(403).json([403, 'Could not create new user password']);
		}
	});
};
