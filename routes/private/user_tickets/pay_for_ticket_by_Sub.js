const { isEmpty } = require('lodash');
const db = require('../../../connectors/db');
const bodyParser = require('body-parser');
const getUser = require('../../../routes/public/get_user');

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	// app.post('/api/v1/payment/ticket/', async function (req, res) {
	// 	const { originName, destinationName } = req.body;

	// 	const originEntry = await db('station').where('lokation', originName).returning('*');
	// 	const origin = originEntry[0].station_id;
	// 	console.log('ORIGIN ID');
	// 	console.log(origin);

	// 	const destinationEntry = await db('station')
	// 		.where('lokation', destinationName)
	// 		.returning('*');
	// 	const destination = destinationEntry[0].station_id;
	// 	console.log('DESTINATION ID');
	// 	console.log(destination);

	// 	const user = await getUser(req);
	// 	const userId = user.user_id;

	// 	console.log('USER ID');
	// 	console.log(userId);

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

	// app.post('/tickets/purchase', (req, res) => {
	// 	const { userId, origin, destination } = req.body;

	// 	// Step 1: Check if the operation is valid

	// 	// Check subscription status
	// 	pool.query('SELECT status FROM subscriptions WHERE user_id = $1', [userId], (err, result) => {
	// 		if (err) {
	// 			console.error('Error executing query', err);
	// 			return res.status(500).json({ error: 'Internal server error' });
	// 		}

	// 		const subscriptionStatus = result.rows[0]?.status;
	// 		if (subscriptionStatus !== 'active') {
	// 			return res.status(400).json({ error: 'Your subscription has expired' });
	// 		}

	// 		// Check the number of usages
	// 		pool.query(
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
	// 				pool.query(
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
	// 						const newNumberOfUsages = numberOfUsages + 1;
	// 						const ticketStatus =
	// 							newNumberOfUsages >= maxNumberOfUsages ? 'expired' : 'active';

	// 						// Update the subscription with the new number of usages and status
	// 						pool.query(
	// 							'UPDATE subscriptions SET numberOfUsages = $1, status = $2 WHERE user_id = $3',
	// 							[newNumberOfUsages, ticketStatus, userId],
	// 							(err) => {
	// 								if (err) {
	// 									console.error('Error executing query', err);
	// 									return res.status(500).json({ error: 'Internal server error' });
	// 								}

	// 								// Create a ticket
	// 								pool.query(
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
	// 										pool.query(
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

	// app.post('/api/v1/payment/ticket/', async function (req, res) {
	// 	const { originName, destinationName } = req.body;

	// 	try {
	// 		const originEntry = await db('station').where('lokation', originName).returning('*');
	// 		const origin = parseInt(originEntry[0].station_id);
	// 		console.log('ORIGIN ID');
	// 		console.log(origin);

	// 		const destinationEntry = await db('station')
	// 			.where('lokation', destinationName)
	// 			.returning('*');
	// 		const destination = parseInt(destinationEntry[0].station_id);
	// 		console.log('DESTINATION ID');
	// 		console.log(destination);

	// 		const user = await getUser(req);
	// 		const userId = user.user_id;

	// 		console.log('USER ID');
	// 		console.log(userId);

	// 		// Step 1: Check if the operation is valid

	// 		// Check subscription status
	// 		const subscriptionStatusResult = await db('subscriptions')
	// 			.where('user_id', userId)
	// 			.select('status');
	// 		const subscriptionStatus = subscriptionStatusResult[0]?.status;

	// 		if (subscriptionStatus !== 'active') {
	// 			return res.status(400).json({ error: 'Your subscription has expired' });
	// 		}

	// 		// Check the number of usages
	// 		const usagesResult = await db('subscriptions')
	// 			.where('user_id', userId)
	// 			.select('numberofusages', 'maxnumberofusages');
	// 		const { numberOfUsages, maxNumberOfUsages } = usagesResult[0];

	// 		if (numberOfUsages === 0) {
	// 			return res.status(400).json({
	// 				error: 'You have reached the maximum number of usages for your subscription',
	// 			});
	// 		}

	// 		// Check the zone of the target session
	// 		const zoneResult = await db('zones as z')
	// 			.join('possible_routes as pr', function () {
	// 				this.on('pr.origin', '=', origin).andOn('pr.destination', '=', destination);
	// 			})
	// 			.where('z.zone_id', function () {
	// 				this.select('zone_id').from('subscriptions').where('user_id', userId);
	// 			})
	// 			.select('z.minimumStations', 'z.maximumStations', 'pr.number_of_stations');
	// 		const { minimumStations, maximumStations, number_of_stations } = zoneResult[0];

	// 		if (maximumStations < minimumStations) {
	// 			return res.status(400).json({ error: 'Invalid zone configuration' });
	// 		}

	// 		if (number_of_stations > maximumStations) {
	// 			return res.status(400).json({
	// 				error: 'The zone of the target session is not within your subscription',
	// 			});
	// 		}

	// 		// Step 2: Proceed with purchasing the ticket and assigning a ride

	// 		// Decrease the number of usages and check if it reaches the maximum
	// 		const newNumberOfUsages = numberOfUsages - 1;
	// 		const ticketStatus = newNumberOfUsages === 0 ? 'expired' : 'active';

	// 		// Update the subscription with the new number of usages and status
	// 		await db('subscriptions')
	// 			.where('user_id', userId)
	// 			.update({ numberofusages: newNumberOfUsages, status: ticketStatus });

	// 		// Create a ticket
	// 		const ticketIdResult = await db('ticket')
	// 			.insert({
	// 				trans_ID: transactionId,
	// 				status: ticketStatus,
	// 				user_ID: userId,
	// 				possible_routes_id: function () {
	// 					this.select('possible_routes_id').from('possible_routes').where({
	// 						origin: origin,
	// 						destination: destination,
	// 					});
	// 				},
	// 				zone_id: function () {
	// 					this.select('zone_id').from('subscriptions').where('user_id', userId);
	// 				},
	// 			})
	// 			.returning('ticket_ID');
	// 		const ticketId = ticketIdResult[0];

	// 		// Create a ride
	// 		await db('ride').insert({
	// 			status: 'upcoming',
	// 			start_time: null,
	// 			end_time: null,
	// 			ticket_ID: ticketId,
	// 		});

	// 		// Return the successful response
	// 		return res.json({ message: 'Ticket purchased successfully' });
	// 	} catch (error) {
	// 		console.error('Error executing query', error);
	// 		return res.status(500).json({ error: 'Internal server error' });
	// 	}
	// });

	app.post('/api/v1/payment/ticket/', async function (req, res) {
		const { originName, destinationName } = req.body;

		try {
			const originEntry = await db('station').where('lokation', originName).returning('*');
			const origin = parseInt(originEntry[0].station_id);
			console.log('ORIGIN ID');
			console.log(origin);

			const destinationEntry = await db('station')
				.where('lokation', destinationName)
				.returning('*');
			const destination = parseInt(destinationEntry[0].station_id);
			console.log('DESTINATION ID');
			console.log(destination);

			const user = await getUser(req);
			const userId = user.user_id;

			console.log('USER ID');
			console.log(userId);

			// Step 1: Check if the operation is valid

			// Check subscription status
			const subscriptionStatusResult = await db('subscriptions')
				.where('user_id', userId)
				.select('status');
			const subscriptionStatus = subscriptionStatusResult[0]?.status;

			if (subscriptionStatus !== 'active') {
				return res.status(400).json({ error: 'Your subscription has expired' });
			}

			// Check the number of usages
			const usagesResult = await db('subscriptions')
				.where('user_id', userId)
				.select('numberofusages', 'maxnumberofusages');
			const { numberOfUsages, maxNumberOfUsages } = usagesResult[0];

			if (numberOfUsages === 0) {
				return res.status(400).json({
					error: 'You have reached the maximum number of usages for your subscription',
				});
			}

			// Check the zone of the target session
			const zoneResult = await db('zones as z')
				.join('possible_routes as pr', function () {
					this.on('pr.origin', '=', db.raw('?', origin)).andOn(
						'pr.destination',
						'=',
						db.raw('?', destination)
					);
				})
				.where('z.zone_id', function () {
					this.select('zone_id').from('subscriptions').where('user_id', userId);
				})
				.select('z.minimumstations', 'z.maximumstations', 'pr.number_of_stations');

			console.log(zoneResult);
			const { minimumstations, maximumstations, number_of_stations } = zoneResult[0];

			if (maximumstations < minimumstations) {
				return res.status(400).json({ error: 'Invalid zone configuration' });
			}

			if (number_of_stations > maximumstations) {
				return res.status(400).json({
					error: 'The zone of the target session is not within your subscription',
				});
			}

			// Step 2: Proceed with purchasing the ticket and assigning a ride

			// Decrease the number of usages and check if it reaches the maximum
			const newNumberOfUsages = numberOfUsages - 1;
			const ticketStatus = newNumberOfUsages === 0 ? 'expired' : 'active';

			// Update the subscription with the new number of usages and status
			await db('subscriptions')
				.where('user_id', userId)
				.update({ numberofusages: newNumberOfUsages, status: ticketStatus });

			// Create a ticket
			const ticketIdResult = await db('ticket')
				.insert({
					trans_ID: transactionId,
					status: ticketStatus,
					user_ID: userId,
					possible_routes_id: function () {
						this.select('possible_routes_id').from('possible_routes').where({
							origin: origin,
							destination: destination,
						});
					},
					zone_id: function () {
						this.select('zone_id').from('subscriptions').where('user_id', userId);
					},
				})
				.returning('ticket_ID');
			const ticketId = ticketIdResult[0];

			// Create a ride
			await db('ride').insert({
				status: 'upcoming',
				start_time: null,
				end_time: null,
				ticket_ID: ticketId,
			});

			// Return the successful response
			return res.json({ message: 'Ticket purchased successfully' });
		} catch (error) {
			console.error('Error executing query', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	});
};
