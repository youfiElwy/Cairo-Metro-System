const { isEmpty } = require('lodash');
const db = require('../db');

module.exports = function (app) {
	// The page that will be opened throgh the link with the token:
	// In this page we verify that the user has the correct reset token
	// and thatthe token has not expired
	// if everything is in check
	// then we inform the user that he is valid aw auhenticated.
	// then he sends an update request with his new password
	app.get('/api/v1/users/forgot_password/verify', async function (req, res) {
		const { token } = req.query;
		let user_id = undefined;
		try {
			const user = await db('users').where('reset_token', token).first();
			if (isEmpty(user) || user.reset_token_expiration < Date.now()) {
				return res.status(400).send('Invalid or expired password reset link.');
			}
			user_id = user.user_id;
		} catch (err) {
			return res.status(400).send('Failed to get user from database');
		}

		// this link will have the actual user id and will have a req body that takes the new password
		const newPasswordPage = `http://localhost:3000/api/v1/users/forgot_password/new_password/${user_id}`;
		return res.status(200).send(newPasswordPage);
	});
};
