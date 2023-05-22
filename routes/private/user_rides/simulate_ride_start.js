const { isEmpty } = require('lodash');
const db = require('../../../connectors/db');
const bodyParser = require('body-parser');

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.put('/api/v1/user/:userId/ride/simulate/start', async function (req, res) {
		const { ticket_id } = req.body;
		const { userId } = req.params;

		if (!ticket_id) {
			return res.status(400).send('Ticket ID is required');
		}
		const ticketExists = await db
			.select('*')
			.from('ticket')
			.where('ticket_id', ticket_id)
			.andWhere('user_id', userId);

		if (isEmpty(ticketExists)) {
			return res.status(400).send('Invalid Ticket');
		}
		const rideNotStartedYet = await db
			.select('*')
			.from('ticket')
			.innerJoin('ride', 'ticket.ticket_id', 'ride.ticket_id')
			.where('user_id', userId)
			.whereNotIn('ride.status', ['ended', 'in_progress']);

		if (isEmpty(rideNotStartedYet)) {
			return res.status(400).send('Ride already started/ended!');
		}

		const rideId = rideNotStartedYet[0].ride_id;

		const updateRideStatus = await db('ride')
			.where('ride_id', rideId)
			.andWhere('ticket_id', ticket_id)
			.update({
				status: 'in_progress',
			})
			.returning('*');
		if (isEmpty(updateRideStatus)) {
			return res.status(400).send('Could not find the Ride in the Database');
		}
		return res.status(200).send('Ride Started and Database updated!');
	});
};
