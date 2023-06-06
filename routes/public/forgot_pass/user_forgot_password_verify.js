const { isEmpty } = require('lodash');
const db = require('../../../connectors/db');

// Package for sending emails
const sgMail = require('@sendgrid/mail');
const SENDGRID_API_KEY = process.env.SEND_GRID_KEY;
sgMail.setApiKey(SENDGRID_API_KEY);

module.exports = function (app) {
	// The page that will be opened throgh the link with the token:
	// In this page we verify that the user has the correct reset token
	// and thatthe token has not expired
	// if everything is in check
	// then we inform the user that he is valid aw auhenticated.
	// then he sends an update request with his new password
	app.post('/api/v1/users/forgot_password/verify', async function (req, res) {
		const { token } = req.query;
		const { email } = req.body;
		console.log('HERE ARE THE QUERY PARAMS');
		console.log(token);
		console.log(email);
		try {
			const user = await db('users').where('reset_token', token).first();
			if (isEmpty(user) || user.reset_token_expiration < Date.now()) {
				return res.status(400).send([400, 'Invalid or expired password reset link.']);
			}
		} catch (err) {
			return res.status(400).send('Failed to get user from database');
		}

		// this link will have the actual token and will have a req body that takes the new password
		// const newPasswordPage = `http://localhost:3000/api/v1/users/forgot_password/new_password/${token}`;
		const newPasswordPage = `http://localhost:5000/user/forgot-password/new-password/`;

		const msg = {
			to: email,
			from: 'metronoreplystation@gmail.com',
			subject: 'User Verification for your Password Reset',
			text: `Click the link so we can verify it's you!: ${newPasswordPage}`,
			html: `
			  <html>
				 <head>
					<style>
					  /* Add your custom CSS styles here */
					  body {
						 font-family: Arial, sans-serif;
					  }
					  .container {
						 max-width: 600px;
						 margin: 0 auto;
						 padding: 20px;
						 border: 1px solid #ccc;
						 border-radius: 5px;
					  }
					  h1 {
						 color: #333;
					  }
					  p {
						 margin-bottom: 20px;
					  }
					  .button {
						 display: inline-block;
						 padding: 10px 20px;
						 background-color: #007bff;
						 color: #fff;
						 text-decoration: none;
						 border-radius: 5px;
					  }
					</style>
				 </head>
				 <body>
					<div class="container">
					  <h1>Hello again</h1>
					  <p>Click the following link to reset your password:</p>
					  <p><a class="button" href="${newPasswordPage}">${newPasswordPage}</a></p>
					</div>
				 </body>
			  </html>
			`,
		};

		await sgMail.send(msg);

		return res.status(200).send([200, newPasswordPage]);
	});
};
