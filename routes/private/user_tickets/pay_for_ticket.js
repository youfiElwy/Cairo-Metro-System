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
			.from('possible_routes')
			.where('origin', req.body.origin)
			.andWhere('destination', req.body.destination);

		if (isEmpty(possibleRoute)) {
			return res.status(400).send('Coulnd not get route from DB');
		}

		const routeId = possibleRoute[0].possible_routes_id;
		// ABOUT SUBcriiption buy ticket problem
		// check if he already has a ticket to that ride
		// check if hes subscribed. if yes then get insert into ticket then ride. then decrement number of rides from subscription
		//

		const ticketExists = await db
			.select('*')
			.from('ticket')
			.innerJoin('ride', 'ticket.ticket_id', 'ride.ticket_id')
			.where('user_id', userId)
			.andWhere('possible_routes_id', routeId)
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
				possible_routes_id: routeId,
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

	// app.post('/api/v1/payment/ticket/', async function (req, res) {
	// 	const user = await getUser(req);

	// 	const userId = user.user_id;

	// 	// Get the possible_routes_id from its table using the origin and destination
	// 	const possibleRoute = await db
	// 		.select('*')
	// 		.from('possible_routes')
	// 		.where('origin', req.body.origin)
	// 		.andWhere('destination', req.body.destination);

	// 	const routeId = possibleRoute[0].possible_routes_id;
	// 	// ABOUT SUBcriiption buy ticket problem
	// 	// check if he already has a ticket to that ride
	// 	// check if hes subscribed. if yes then get insert into ticket then ride. then decrement number of rides from subscription
	// 	//

	// 	const ticketExists = await db
	// 		.select('*')
	// 		.from('ticket')
	// 		.innerJoin('ride', 'ticket.ticket_id', 'ride.ticket_id')
	// 		.where('user_id', userId)
	// 		.andWhere('possible_routes_id', routeId)
	// 		.andWhere('ride.status', 'IN', ['upcoming', 'in_progress']);
	// 	if (!isEmpty(ticketExists)) {
	// 		return res.status(400).send('user already purchased a ticket to this ride');
	// 	}

	// 	// check if User is subscribed or not
	// 	// if no then --> yes transaction. --> normally pay for transaction
	// 	// if yes then --> no transaction. --> only decrement his number of usages
	// 	const subscribtionExists = await db
	// 		.select('*')
	// 		.from('subscriptions')
	// 		.where('user_id', userId)
	// 		.andWhere('status', 'active');

	// 	// if he does not have a subscription
	// 	if (isEmpty(subscribtionExists)) {
	// 		try {
	// 			const newTransaction = {
	// 				amount: 10, // YEHIA --> Update--> get price from zones table n stuff
	// 				trans_date: new Date(Date.now()),
	// 				card_type: req.body.card_type,
	// 				credit_card: req.body.credit_card, // credit card number
	// 				holder_name: req.body.holder_name,
	// 				user_id: userId,
	// 			};

	// 			const newTransactionEntry = await db('transactions')
	// 				.insert(newTransaction)
	// 				.returning('*');

	// 			const newTicket = {
	// 				trans_id: newTransactionEntry[0].trans_id,
	// 				status: 'active',
	// 				user_id: userId,
	// 				possible_routes_id: routeId,
	// 				sub_id: req.body.sub_id,
	// 				zone_id: req.body.zone_id,
	// 			};

	// 			const newTicketEntry = await db('ticket').insert(newTicket).returning('*');

	// 			const newRide = {
	// 				status: 'upcoming',
	// 				start_time: req.body.start_time,
	// 				end_time: req.body.end_time,
	// 				ticket_id: newTicketEntry[0].ticket_id,
	// 			};

	// 			const newRideEntry = await db('ride').insert(newRide).returning('*');

	// 			return res
	// 				.status(200)
	// 				.send('Ticket successfully payed for and transaction, ticket, Ride added to DB');
	// 		} catch (err) {
	// 			console.log(err.message);
	// 			return res.status(400).send('Error: Could not enter data into database');
	// 		}
	// 	} else {
	// 		// does have a subsription
	// 		// if his subscription will work on his chosen origin and destination / zone
	// 		// --> but ticket using subscription
	// 		if (1) {
	// 			// update subscription --> decrement numberofusages
	// 			const updatedSub = await db('subscription')
	// 				.where('user_id', userId)
	// 				.update({
	// 					numberofusages: numberofusages - 1,
	// 				})
	// 				.returning('*');

	// 			if (updatedSub[0].numberofusages === 0) {
	// 				const updateState = await db('subscription')
	// 					.where('user_id', userId)
	// 					.update({
	// 						status: 'inactive',
	// 					})
	// 					.returning('*');
	// 			}

	// 			const subId = updatedSub[0].sub_id;

	// 			const newTicket = {
	// 				trans_id: null,
	// 				status: 'active',
	// 				user_id: userId,
	// 				possible_routes_id: routeId,
	// 				sub_id: subId,
	// 				zone_id: req.body.zone_id,
	// 			};

	// 			const newTicketEntry = await db('ticket').insert(newTicket).returning('*');

	// 			const newRide = {
	// 				status: 'upcoming',
	// 				start_time: req.body.start_time,
	// 				end_time: req.body.end_time,
	// 				ticket_id: newTicketEntry[0].ticket_id,
	// 			};

	// 			const newRideEntry = await db('ride').insert(newRide).returning('*');

	// 			return res
	// 				.status(200)
	// 				.send('Ticket successfully purchased using subscription ticket, Ride added to DB');
	// 		} else {
	// 			// else	--> buy normal ticket
	// 			try {
	// 				const newTransaction = {
	// 					amount: 10, // YEHIA --> Update--> get price from zones table n stuff
	// 					trans_date: new Date(Date.now()),
	// 					card_type: req.body.card_type,
	// 					credit_card: req.body.credit_card, // credit card number
	// 					holder_name: req.body.holder_name,
	// 					user_id: userId,
	// 				};

	// 				const newTransactionEntry = await db('transactions')
	// 					.insert(newTransaction)
	// 					.returning('*');

	// 				const newTicket = {
	// 					trans_id: newTransactionEntry[0].trans_id,
	// 					status: 'active',
	// 					user_id: userId,
	// 					possible_routes_id: routeId,
	// 					sub_id: req.body.sub_id,
	// 					zone_id: req.body.zone_id,
	// 				};

	// 				const newTicketEntry = await db('ticket').insert(newTicket).returning('*');

	// 				const newRide = {
	// 					status: 'upcoming',
	// 					start_time: req.body.start_time,
	// 					end_time: req.body.end_time,
	// 					ticket_id: newTicketEntry[0].ticket_id,
	// 				};

	// 				const newRideEntry = await db('ride').insert(newRide).returning('*');

	// 				return res
	// 					.status(200)
	// 					.send('Ticket successfully payed for and transaction, ticket, Ride added to DB');
	// 			} catch (err) {
	// 				console.log(err.message);
	// 				return res.status(400).send('Error: Could not enter data into database');
	// 			}
	// 		}
	// 	}
	// });
};
