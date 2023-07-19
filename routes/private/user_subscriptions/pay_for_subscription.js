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

	app.post('/api/v1/payment/subscriptions/', async function (req, res) {
		const user = await getUser(req);
		const { user_id, email } = user;
		const { payment_token } = req.body;
		// check if user is already subscribed
		const subExists = await db
			.select('*')
			.from('subscriptions')
			.where('user_id', user_id)
			.andWhere('status', 'active');

		if (!isEmpty(subExists)) {
			return res.status(400).send([400, 'user is already subscribed to an active plan']);
		}

		const checkToken = await db('users')
			.where('user_id', user_id)
			.andWhere('payment_token_active', true)
			.andWhere('payment_token', payment_token)
			.returning('*');

		if (isEmpty(checkToken)) {
			return res.status(400).send([400, 'You didnot pay for the subscription']);
		}

		const updateToken = await db('users')
			.where('user_id', user_id)
			.andWhere('payment_token', payment_token)
			.update({
				payment_token_active: false,
			})
			.returning('*');
		updateToken;
		try {
			let trans_amount = 0;
			let sub_maxnumberofusages = 0;
			let sub_numberofusages = 0;

			if (req.body.duration === 'monthly') {
				trans_amount = 100;
				sub_maxnumberofusages = 15;
				sub_numberofusages = 15;
			} else if (req.body.duration === 'quarterly') {
				trans_amount = 200;
				sub_maxnumberofusages = 150;
				sub_numberofusages = 150;
			} else {
				trans_amount = 400;
				sub_maxnumberofusages = 400;
				sub_numberofusages = 400;
			}
			if (req.body.zone_id === '2') {
				trans_amount = trans_amount * 1.2;
			} else if (req.body.zone_id === '3') {
				trans_amount = trans_amount * 1.5;
			}

			const newTransaction = {
				amount: trans_amount,
				trans_date: new Date(Date.now()),
				card_type: req.body.card_type,
				credit_card: req.body.credit_card, // credit card number
				holder_name: req.body.holder_name,
				user_id: user_id,
				transaction_to: 'Metro',
			};

			const newTransactionEntry = await db('transactions').insert(newTransaction).returning('*');

			const newSubscripEntry = {
				duration: req.body.duration,
				zone_id: req.body.zone_id,
				trans_id: newTransactionEntry[0].trans_id,
				status: 'active',
				maxnumberofusages: sub_maxnumberofusages,
				numberofusages: sub_numberofusages,
				user_id: user_id,
			};

			const newSub = await db('subscriptions').insert(newSubscripEntry).returning('*');

			const msg = {
				to: email,
				from: 'RetroMetroCenter@gmail.com',
				subject: 'Congratulations on Your Subscription!',
				text: 'Dear valued subscriber, we want to extend our heartfelt congratulations on your purchase of a subscription with Metro Station!',
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
						  <h1>Congratulations, dear subscriber!</h1>
						  <p>Thank you for choosing Metro Station's subscription service. We are thrilled to have you on board!</p>
						  <h2>Here are your subscription details:</h2>
						  <p><strong>Transaction Amount:</strong> ${newTransaction.amount}</p>
						  <p><strong>Transaction Date:</strong> ${newTransaction.trans_date}</p>
						  <p><strong>Transaction ID:</strong> ${newTransactionEntry[0].trans_id}</p>
						  <p><strong>Subscription Duration:</strong> ${newSubscripEntry.duration}</p>
						  <p><strong>Subscription Zone ID:</strong> ${newSubscripEntry.zone_id}</p>
						  <p><strong>Subscription Status:</strong> ${newSubscripEntry.status}</p>
						  <p><strong>Maximum Number of Usages:</strong> ${newSubscripEntry.maxnumberofusages}</p>
						  <p><strong>Number of Usages:</strong> ${newSubscripEntry.numberofusages}</p>
						  <p><strong>User ID:</strong> ${newTransaction.user_id}</p>
						</div>
					 </body>
				  </html>
				`,
			};

			await sgMail.send(msg);

			return res.status(200).send([200, 'User successfully subscribed to a plan']);
		} catch (err) {
			console.log(err.message);
			return res
				.status(401)
				.send([401, 'Error: Could not enter transaction/subscription into database']);
		}
	});
};
