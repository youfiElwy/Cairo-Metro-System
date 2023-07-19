const { isEmpty } = require('lodash');
const db = require('../../../connectors/db');
const bodyParser = require('body-parser');
const getUser = require('../../../routes/public/get_user');

// Package for sending emails
const sgMail = require('@sendgrid/mail');
const SENDGRID_API_KEY = process.env.SEND_GRID_KEY;
sgMail.setApiKey(SENDGRID_API_KEY);

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.post('/api/v1/senior/request', async function (req, res) {
		const userInfo = await getUser(req);
		const user_id = userInfo.user_id;
		const email = userInfo.email;

		if (!req.body.ID_picture_age) {
			return res.status(400).send([400, 'national id is required']);
		}

		const requestExists = await db
			.select('*')
			.from('senior_request')
			.where('request_state', 'processing')
			.andWhere('user_id', user_id);

		if (!isEmpty(requestExists)) {
			return res.status(401).send([401, 'Error : you already made a senior request']);
		}

		const alreadySenior = await db
			.select('*')
			.from('users')
			.where('userrole', 'senior')
			.andWhere('user_id', user_id);

		if (!isEmpty(alreadySenior)) {
			return res.status(402).send([402, 'Error : you already already a senior']);
		}

		const senior_request = {
			request_state: 'processing',
			id_picture_age: req.body.ID_picture_age,
			user_id: user_id,
		};
		console.log(senior_request);
		try {
			const senior = await db('senior_request').insert(senior_request).returning('*');

			const msg = {
				to: email,
				from: 'RetroMetroCenter@gmail.com',
				subject: 'Senior Ticket Request Confirmation',
				text: "Dear valued passenger, thank you for submitting your senior ticket request! We'll process your request and get back to you soon.",
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
						  <h1>Thank You for Your Senior Ticket Request!</h1>
						  <p>We want to express our gratitude for considering our senior ticket option. Our team will process your request and review the provided information.</p>
						  <p>If everything is in order, we'll proceed with issuing the senior ticket and send you further details via email.</p>
						  <p>If you have any questions or need assistance, feel free to contact our customer support team. We're here to help!</p>
						  <p>Thank you for choosing Metro Station for your travel needs!</p>
						</div>
					 </body>
				  </html>
				`,
			};

			await sgMail.send(msg);

			return res.status(200).json([200, senior]);
		} catch (err) {
			console.log(err.message);
			return res.status(404).send([404, 'Error: Could not send senior request']);
		}
	});
};
