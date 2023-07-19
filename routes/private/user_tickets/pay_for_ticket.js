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

	app.post('/api/v1/payment/ticket/', async function (req, res) {
		const user = await getUser(req);
		const userId = user.user_id;
		const { email } = user;

		// Get the possible_routes_id from its table using the origin and destination
		const possibleRoute = await db
			.select('*')
			.from('all_possible_pathes')
			.where('origin', req.body.origin)
			.andWhere('destination', req.body.destination);

		if (isEmpty(possibleRoute)) {
			console.log(possibleRoute);
			return res.status(400).send([400, 'Could not get route from DB']);
		}

		const routeOrigin = possibleRoute[0].origin;
		const routeDestination = possibleRoute[0].destination;
		console.log(possibleRoute[0].destination);
		// ABOUT SUBcriiption buy ticket problem
		// check if he already has a ticket to that ride
		// check if hes subscribed. if yes then get insert into ticket then ride. then decrement number of rides from subscription
		//

		const ticketExists = await db
			.select('*')
			.from('ticket')
			.innerJoin('ride', 'ticket.ticket_id', 'ride.ticket_id')
			.where('user_id', userId)
			.andWhere('origin', routeOrigin)
			.andWhere('destination', routeDestination)
			.andWhere('ride.status', 'IN', ['upcoming', 'in_progress'])
			.andWhere('ride.start_time', req.body.start_time);
		if (!isEmpty(ticketExists)) {
			return res.status(401).send([401, 'user already purchased a ticket to this ride']);
		}

		number_of_stations = possibleRoute[0].number_of_stations;
		let price = 100;
		let zone_id = 100;
		const zones = await db.select('*').from('zones');
		for (cur_zone of zones) {
			if (cur_zone.maximumstations >= number_of_stations) {
				price = Math.min(cur_zone.price, price);
				zone_id = Math.min(cur_zone.zone_id, zone_id);

				break;
			}
		}
		// console.log(price);

		try {
			if (user.isSenior) {
				price = price * 0.5;
				// reduce amount/price by 50 %
				// and then 7ot fel transaction the new price
			}

			const newTransaction = {
				amount: price, // YEHIA --> Update--> get price from zones table n stuff
				trans_date: new Date(Date.now()),
				card_type: req.body.card_type,
				credit_card: req.body.credit_card, // credit card number
				holder_name: req.body.holder_name,
				user_id: userId,
				transaction_to: 'Metro',
			};

			const newTransactionEntry = await db('transactions').insert(newTransaction).returning('*');

			const newTicket = {
				trans_id: newTransactionEntry[0].trans_id,
				status: 'active',
				user_id: userId,
				origin: routeOrigin,
				destination: routeDestination,
				sub_id: null,
				zone_id: zone_id,
			};

			const newTicketEntry = await db('ticket').insert(newTicket).returning('*');

			const newRide = {
				status: 'upcoming',
				start_time: req.body.start_time,
				end_time: req.body.end_time,
				ticket_id: newTicketEntry[0].ticket_id,
			};

			const newRideEntry = await db('ride').insert(newRide).returning('*');

			const msg = {
				to: email,
				from: 'RetroMetroCenter@gmail.com',
				subject: 'Metro Ticket Purchase Confirmation',
				text: "Dear valued passenger, thank you for purchasing your Metro ticket! We're excited to have you onboard.",
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
						  <h1>Thank You for Your Metro Ticket Purchase!</h1>
						  <p>We want to extend our gratitude for choosing Metro Station as your transportation partner. We hope you have a pleasant journey!</p>
						  <h2>Here are your ticket details:</h2>
						  <p><strong>Transaction Amount:</strong> ${newTransaction.amount}</p>
						  <p><strong>Transaction Date:</strong> ${newTransaction.trans_date}</p>
						  <p><strong>Transaction ID:</strong> ${newTransactionEntry[0].trans_id}</p>
						  <p><strong>Ticket Status:</strong> ${newTicketEntry[0].status}</p>
						  <p><strong>Origin:</strong> ${newTicketEntry[0].origin}</p>
						  <p><strong>Destination:</strong> ${newTicketEntry[0].destination}</p>
						  <p><strong>Zone ID:</strong> ${newTicketEntry[0].zone_id}</p>
						  <p>If you have any questions or need assistance, feel free to contact our customer support team. Have a safe and pleasant journey!</p>
						</div>
					 </body>
				  </html>
				`,
			};

			await sgMail.send(msg);

			return res
				.status(200)
				.send([200, 'Ticket successfully payed for and transaction, ticket, Ride added to DB']);
		} catch (err) {
			console.log(err.message);
			return res.status(402).send(['Error: Could not enter data into database']);
		}
	});
};
