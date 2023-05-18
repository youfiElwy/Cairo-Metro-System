const { isEmpty } = require('lodash');
const db = require('../db');

module.exports = function (app) {
	// The page that will be opened throgh the link with the token:
	// In this page we verify that the user has the correct reset token
	// and thatthe token has not expired
	// if everything is in check
	// then we inform the user that he is valid aw auhenticated.
	// then he sends an update request with his new password
	app.get('/api/v1/password/reset/verify', async function (req, res) {
		const { token } = req.query;
		try {
			const user = await db('users').where('reset_token', token).first();
			if (isEmpty(user) || user.reset_token_expiration < Date.now()) {
				return res.status(400).send('Invalid or expired password reset link.');
			}
		} catch (err) {
			return res.status(400).send('Failed to get user from database');
		}

		// this link will have the actual token and will have a req body that takes the new password
		const newPasswordPage = `http://localhost:3000/api/v1/password/reset/new_password/${token}`;
		return res.status(200).send(newPasswordPage);
	});
};
