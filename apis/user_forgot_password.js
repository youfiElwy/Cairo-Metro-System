const { isEmpty } = require('lodash');
const db = require('../db');
const bodyParser = require('body-parser');
// package for creating a unique password token
const crypto = require('crypto');
// Package for sending emails
const sgMail = require('@sendgrid/mail');
const SENDGRID_API_KEY = process.env.SEND_GRID_KEY;
sgMail.setApiKey(SENDGRID_API_KEY);

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.post('/api/v1/password/reset', async function (req, res) {
		const { ssn, email } = req.body;
		// Perform verification based on SSN and email IN DATABASE => LATER, use email!
		if (!ssn) {
			return res.status(400).send('SSN is required');
		}
		if (!email) {
			return res.status(400).send('Email is required');
		}
		const userExists = await db
			.select('*')
			.from('users')
			.where('ssn', ssn)
			.andWhere('email', email);

		if (isEmpty(userExists)) {
			return res.status(400).send('Incorrect user information. You are not the user!');
		}
		// If verification is successful, proceed with password reset
		try {
			const token = crypto.randomBytes(3).toString('hex'); // Generate a secure token
			// Associate/ store the token with the user row in the database
			const resetTokenExpiration = new Date(Date.now() + 3600000); // Calculate the expiration time as a Date object
			await db('users').where('ssn', ssn).andWhere('email', email).update({
				reset_token: token,
				reset_token_expiration: resetTokenExpiration, // Expiration time: 1 hour from now
			});
			// Send an email to the user containing THIS link with the token
			const resetLink = `http://localhost:3000/api/v1/password/reset/verify?token=${token}`;

			// Send email using SendGrid
			const msg = {
				to: 'youfielwy@gmail.com',
				from: 'metronoreplystation@gmail.com',
				subject: 'Password Reset',
				text: `Click the following link to reset your password: ${resetLink}`,
				html: `Click the following link to reset your password: <a href="${resetLink}">${resetLink}</a>`,
			};
			await sgMail.send(msg);

			return res.status(200).send(resetLink);
		} catch (err) {
			console.log(err.message);
			return res.status(400).send('Could not create your password reset token!');
		}
	});
};
