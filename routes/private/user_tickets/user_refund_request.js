const { isEmpty } = require('lodash');
const db = require('../../../connectors/db');
const bodyParser = require('body-parser');
const getUser = require('../../../routes/public/get_user');

// Package for sending emails
// const sgMail = require('@sendgrid/mail');
// const SENDGRID_API_KEY = process.env.SEND_GRID_KEY;
// sgMail.setApiKey(SENDGRID_API_KEY);

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.post('/api/v1/users/refund_request', async function (req, res) {
		const user = await getUser(req);

		const userId = user.user_id;
		const userEmail = user.email;
		// i shouldnt check if user id exists cuz ill get it from the session or smth
		// which means he definietly exists keda keda

		if (!req.body.description) {
			return res.status(400).send('description is required');
		}

		if (!req.body.ticket_id) {
			return res.status(400).send('ticket ID is required');
		}

		const ticketExists = await db
			.select('*')
			.from('ticket')
			.where('ticket_id', req.body.ticket_id)
			.andWhere('user_id', userId);

		if (isEmpty(ticketExists)) {
			return res.status(400).send('Invalid Ticket');
		}

		if (ticketExists[0].status === 'expired') {
			return res.status(400).send('Refund rejected! Ticket already expired/used');
		}

		const requestExists = await db
			.select('*')
			.from('refund_request')
			.where('ticket_id', req.body.ticket_id)
			.andWhere('user_id', userId);

		if (!isEmpty(requestExists)) {
			return res
				.status(400)
				.send('Refund was already requested and is being processed at the moment...');
		}

		const new_request = {
			request_state: 'processing',
			description: req.body.description,
			ticket_id: req.body.ticket_id,
			user_id: userId,
		};
		try {
			const refund_request = await db('refund_request').insert(new_request).returning('*');

			// const msg = {
			// 	to: userEmail,
			// 	from: 'metronoreplystation@gmail.com',
			// 	subject: 'Request for Metro Ticket Refund - Acknowledgement and Processing Update',
			// 	text: "Welcome fellow citizen! It's great to have you here as part of our Metro Station team!",
			// 	html: `
			// 	  <html>
			// 		 <head>
			// 			<style>
			// 			  /* Add your custom CSS styles here */
			// 			  body {
			// 				 font-family: Arial, sans-serif;
			// 			  }
			// 			  .container {
			// 				 max-width: 600px;
			// 				 margin: 0 auto;
			// 				 padding: 20px;
			// 				 border: 1px solid #ccc;
			// 				 border-radius: 5px;
			// 			  }
			// 			  h1 {
			// 				 color: #333;
			// 			  }
			// 			  p {
			// 				 margin-bottom: 20px;
			// 			  }
			// 			  .button {
			// 				 display: inline-block;
			// 				 padding: 10px 20px;
			// 				 background-color: #007bff;
			// 				 color: #fff;
			// 				 text-decoration: none;
			// 				 border-radius: 5px;
			// 			  }
			// 			</style>
			// 		 </head>
			// 		 <body>
			// 			<div class="container">
			// 			  <h1>Hello, fellow citizen!</h1>
			// 			  <p>We would like to inform you that we have received your request for a refund regarding your Metro ticket purchase.<br>
			// 				We sincerely apologize for any inconvenience caused and assure you that your refund request <br>
			// 				is being processed at the moment.</p>
			// 			  <p>Our team is currently reviewing your request,<br>
			// 			  and it will be carefully evaluated within the next 2-4 business days</p>
			// 			  <p>Thank you for choosing our Metro services,<br><br>
			// 			  and we appreciate your patience throughout this process.</p>
			// 			</div>
			// 		 </body>
			// 	  </html>
			// 	`,
			// };

			// await sgMail.send(msg);

			return res.status(200).send('Refund request successfully placed');
		} catch (err) {
			console.log(err.message);
			return res.status(400).send('Error: Could not send refund request');
		}
	});
};
