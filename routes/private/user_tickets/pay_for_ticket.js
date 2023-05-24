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

		// check if User is subscribed or not
		// if no then --> yes transaction. --> normally pay for transaction
		// if yes then --> no transaction. --> only decrement his number of usages
		const subscribtionExists = await db
			.select('*')
			.from('subscriptions')
			.where('user_id', userId)
			.andWhere('status', 'active');

		// if he does not have a subscription
		if (isEmpty(subscribtionExists)) {
			try {
				const newTransaction = {
					amount: 10, // YEHIA --> Update--> get price from zones table n stuff
					trans_date: new Date(Date.now()),
					transaction_to: "metro",
					card_type: req.body.card_type,
					credit_card: req.body.credit_card, // credit card number
					holder_name: req.body.holder_name,
					user_id: userId,
				};

				const newTransactionEntry = await db('transactions')
					.insert(newTransaction)
					.returning('*');

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
		} else {
			// does have a subsription
			// if his subscription will work on his chosen origin and destination / zone
			// --> but ticket using subscription
			if (1) {
				// update subscription --> decrement numberofusages
				const updatedSub = await db('subscription')
					.where('user_id', userId)
					.update({
						numberofusages: numberofusages - 1,
					})
					.returning('*');

				if (updatedSub[0].numberofusages === 0) {
					const updateState = await db('subscription')
						.where('user_id', userId)
						.update({
							status: 'inactive',
						})
						.returning('*');
				}

				const subId = updatedSub[0].sub_id;

				const newTicket = {
					trans_id: null,
					status: 'active',
					user_id: userId,
					possible_routes_id: routeId,
					sub_id: subId,
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
					.send('Ticket successfully purchased using subscription ticket, Ride added to DB');
			} else {
				// else	--> buy normal ticket
				try {
					const newTransaction = {
						amount: 10, // YEHIA --> Update--> get price from zones table n stuff
						trans_date: new Date(Date.now()),
						card_type: req.body.card_type,
						credit_card: req.body.credit_card, // credit card number
						holder_name: req.body.holder_name,
						user_id: userId,
					};

					const newTransactionEntry = await db('transactions')
						.insert(newTransaction)
						.returning('*');

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
			}
		}
	});

	// -------------------------------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------------------

	// app.post('/api/v1/payment/ticket/', async function (req, res) {
	// 	const { origin, destination } = req.body;

	// 	const user = await getUser(req);
	// 	const userId = user.user_id;

	// 	// Step 1: Check if the operation is valid

	// 	// Check subscription status
	// 	db.query('SELECT status FROM subscriptions WHERE user_id = $1', [userId], (err, result) => {
	// 		if (err) {
	// 			console.error('Error executing query', err);
	// 			return res.status(500).json({ error: 'Internal server error' });
	// 		}

	// 		const subscriptionStatus = result.rows[0]?.status;
	// 		if (subscriptionStatus !== 'active') {
	// 			return res.status(400).json({ error: 'Your subscription has expired' });
	// 		}

	// 		// Check the number of usages
	// 		db.query(
	// 			'SELECT numberOfUsages, maxNumberOfUsages FROM subscriptions WHERE user_id = $1',
	// 			[userId],
	// 			(err, result) => {
	// 				if (err) {
	// 					console.error('Error executing query', err);
	// 					return res.status(500).json({ error: 'Internal server error' });
	// 				}

	// 				const { numberOfUsages, maxNumberOfUsages } = result.rows[0];

	// 				if (numberOfUsages >= maxNumberOfUsages) {
	// 					return res.status(400).json({
	// 						error: 'You have reached the maximum number of usages for your subscription',
	// 					});
	// 				}

	// 				// Check the zone of the target session
	// 				db.query(
	// 					`SELECT z.minimumStations, z.maximumStations, pr.number_of_stations
	// 			 FROM zones z
	// 			 JOIN possible_routes pr ON pr.origin = $1 AND pr.destination = $2
	// 			 WHERE z.zone_id = (SELECT zone_id FROM subscriptions WHERE user_id = $3)`,
	// 					[origin, destination, userId],
	// 					(err, result) => {
	// 						if (err) {
	// 							console.error('Error executing query', err);
	// 							return res.status(500).json({ error: 'Internal server error' });
	// 						}

	// 						const { minimumStations, maximumStations, number_of_stations } =
	// 							result.rows[0];
	// 						if (maximumStations < minimumStations) {
	// 							return res.status(400).json({ error: 'Invalid zone configuration' });
	// 						}

	// 						if (number_of_stations > maximumStations) {
	// 							return res.status(400).json({
	// 								error: 'The zone of the target session is not within your subscription',
	// 							});
	// 						}

	// 						// Step 2: Proceed with purchasing the ticket and assigning a ride

	// 						// Increase the number of usages and check if it reaches the maximum
	// 						const newNumberOfUsages = numberOfUsages - 1;
	// 						const ticketStatus = (newNumberOfUsages = maxNumberOfUsages
	// 							? 'expired'
	// 							: 'active');

	// 						// Update the subscription with the new number of usages and status
	// 						db.query(
	// 							'UPDATE subscriptions SET numberOfUsages = $1, status = $2 WHERE user_id = $3',
	// 							[newNumberOfUsages, ticketStatus, userId],
	// 							(err) => {
	// 								if (err) {
	// 									console.error('Error executing query', err);
	// 									return res.status(500).json({ error: 'Internal server error' });
	// 								}

	// 								// Create a ticket
	// 								db.query(
	// 									`INSERT INTO ticket (trans_ID, status, user_ID, possible_routes_id, zone_id)
	// 						VALUES ($1, $2, $3, (SELECT possible_routes_id FROM possible_routes WHERE origin = $4 AND destination = $5), (SELECT zone_id FROM subscriptions WHERE user_id = $6))
	// 						RETURNING ticket_ID`,
	// 									[transactionId, ticketStatus, userId, origin, destination, userId],
	// 									(err, result) => {
	// 										if (err) {
	// 											console.error('Error executing query', err);
	// 											return res.status(500).json({ error: 'Internal server error' });
	// 										}

	// 										const ticketId = result.rows[0]?.ticket_ID;

	// 										// Create a ride
	// 										db.query(
	// 											'INSERT INTO ride (status, start_time, end_time, ticket_ID) VALUES ($1, $2, $3, $4)',
	// 											['upcoming', null, null, ticketId],
	// 											(err) => {
	// 												if (err) {
	// 													console.error('Error executing query', err);
	// 													return res
	// 														.status(500)
	// 														.json({ error: 'Internal server error' });
	// 												}

	// 												// Return the successful response
	// 												return res.json({
	// 													message: 'Ticket purchased successfully',
	// 												});
	// 											}
	// 										);
	// 									}
	// 								);
	// 							}
	// 						);
	// 					}
	// 				);
	// 			}
	// 		);
	// 	});
	// });
};
