const { isEmpty } = require('lodash');
const db = require('../../../connectors/db');
const bodyParser = require('body-parser');
const getUser = require('../../../routes/public/get_user');

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.post('/api/v1/payment/ticket/', async function (req, res) {
		const user = await getUser(req);
		const userId = user.user_id;

		// Get the possible_routes_id from its table using the origin and destination
		const possibleRoute = await db
			.select('*')
			.from('all_possible_pathes')
			.where('origin', req.body.origin)
			.andWhere('destination', req.body.destination);

		if (isEmpty(possibleRoute)) {
			return res.status(400).send('Coulnd not get route from DB');
		}

		const routeOrigin = possibleRoute[0].origin;
		const routeDestination = possibleRoute[0].destination;
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
			.andWhere('ride.status', 'IN', ['upcoming', 'in_progress']);
		if (!isEmpty(ticketExists)) {
			return res.status(400).send('user already purchased a ticket to this ride');
		}

		try {
			if (user.isSenior) {
				// reduce amount/price by 40 %
				// and then 7ot fel transaction the new price
			}

			const newTransaction = {
				amount: 10, // YEHIA --> Update--> get price from zones table n stuff
				trans_date: new Date(Date.now()),
				card_type: req.body.card_type,
				credit_card: req.body.credit_card, // credit card number
				holder_name: req.body.holder_name,
				user_id: userId,
			};

			const newTransactionEntry = await db('transactions').insert(newTransaction).returning('*');

			const newTicket = {
				trans_id: newTransactionEntry[0].trans_id,
				status: 'active',
				user_id: userId,
				origin: routeOrigin,
				destination: routeDestination,
				sub_id: req.body.sub_id,
				zone_id: req.body.zone_id,
			};

			const newTicketEntry = await db('ticket').insert(newTicket).returning('*');

			const newRide = {
				status: 'upcoming',
				start_time: req.body.start_time,
				end_time: req.body.end_time,
				ticket_id: newTicketEntry[0].ticket_id,
			};

			const newRideEntry = await db('ride').insert(newRide).returning('*');

			return res
				.status(200)
				.send('Ticket successfully payed for and transaction, ticket, Ride added to DB');
		} catch (err) {
			console.log(err.message);
			return res.status(400).send('Error: Could not enter data into database');
		}
	});
};
