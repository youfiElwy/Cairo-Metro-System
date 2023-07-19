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

	app.put('/api/v1/users/subscription/cancel', async function (req, res) {
		const user = await getUser(req);
		const userId = user.user_id;
		const { email } = user;

		// check if user is subscribed
		const subExists = await db
			.select('*')
			.from('subscriptions')
			.where('user_id', userId)
			.andWhere('status', 'active');
		if (isEmpty(subExists)) {
			return res.status(401).json([401, 'user is not subscribed to an active plan']);
		}

		try {
			const deleteSub = await db('subscriptions').where('user_id', userId).update({
				status: 'canceled',
			});

			const msg = {
				to: email,
				from: 'RetroMetroCenter@gmail.com',
				subject: 'Sorry to See You Go!',
				text: "Dear valued subscriber, we're sorry to see you go! Thank you for being a part of Metro Station's subscription service.",
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
						  <h1>Sorry to See You Go!</h1>
						  <p>We would like to extend our thanks for being a part of Metro Station's subscription service. Your support has been valuable to us!</p>
						  <p><strong>Subscription Status:</strong> ${'Inactive'}</p>
						  <p>If you have any feedback or need assistance, feel free to reach out to our support team. We hope to see you back in the future!</p>
						</div>
					 </body>
				  </html>
				`,
			};

			await sgMail.send(msg);

			return res.status(200).send([200, 'Subscription successfully canceled']);
		} catch (err) {
			console.log(err.message);
			return res.status(402).send([402, 'Error: Could not cancel subscription']);
		}
	});
};
