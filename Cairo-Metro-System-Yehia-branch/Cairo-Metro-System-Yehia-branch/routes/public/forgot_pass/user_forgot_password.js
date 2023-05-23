const { isEmpty } = require('lodash');
const db = require('../../../connectors/db');
const bodyParser = require('body-parser');
// package for creating a unique password token
const crypto = require('crypto');
// Package for sending emails
// const sgMail = require('@sendgrid/mail');
// const SENDGRID_API_KEY = process.env.SEND_GRID_KEY;
// sgMail.setApiKey(SENDGRID_API_KEY);

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.post('/api/v1/users/forgot_password', async function (req, res) {
		const { email } = req.body;
		// Perform verification based on SSN and email IN DATABASE => LATER, use email!
		if (!email) {
			return res.status(400).send('Email is required');
		}
		const userExists = await db.select('*').from('users').where('email', email);

		if (isEmpty(userExists)) {
			return res.status(400).send('Incorrect user information. You are not the user!');
		}
		// If verification is successful, proceed with password reset
		try {
			const token = crypto.randomBytes(3).toString('hex'); // Generate a secure token
			// Associate/ store the token with the user row in the database
			const resetTokenExpiration = new Date(Date.now() + 3600000); // Calculate the expiration time as a Date object
			await db('users').where('email', email).update({
				reset_token: token,
				reset_token_expiration: resetTokenExpiration, // Expiration time: 1 hour from now
			});
			// Send an email to the user containing THIS link with the token
			const resetLink = `http://localhost:3000/api/v1/users/forgot_password/verify?token=${token}`;

// 			const msg = {
// 				to: 'youfielwy@gmail.com',
// 				from: 'metronoreplystation@gmail.com',
// 				subject: 'Password Reset',
// 				text: `Click the following link to reset your password: ${resetLink}`,
// 				html: `
// 				  <html>
// 					 <head>
// 						<style>
// 						  /* Add your custom CSS styles here */
// 						  body {
// 							 font-family: Arial, sans-serif;
// 						  }
// 						  .container {
// 							 max-width: 600px;
// 							 margin: 0 auto;
// 							 padding: 20px;
// 							 border: 1px solid #ccc;
// 							 border-radius: 5px;
// 						  }
// 						  h1 {
// 							 color: #333;
// 						  }
// 						  p {
// 							 margin-bottom: 20px;
// 						  }
// 						  .button {
// 							 display: inline-block;
// 							 padding: 10px 20px;
// 							 background-color: #007bff;
// 							 color: #fff;
// 							 text-decoration: none;
// 							 border-radius: 5px;
// 						  }
// 						</style>
// 					 </head>
// 					 <body>
// 						<div class="container">
// 						  <h1>Hello, citizen!</h1>
// 						  <p>Click the link so we can verify it's you!</p>
// 						  <p><a class="button" href="${resetLink}">${resetLink}</a></p>
// 						</div>
// 					 </body>
// 				  </html>
// 				`,
// 			};

// 			await sgMail.send(msg);

			return res.status(200).send(resetLink);
		} catch (err) {
			console.log(err.message);
			return res.status(400).send('Could not create your password reset token!');
		}
	});
};
