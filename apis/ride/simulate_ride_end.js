const { isEmpty } = require('lodash');
const db = require('../../db');
const bodyParser = require('body-parser');

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.put('/api/v1/user/:userId/ride/simulate/end', async function (req, res) {
		const { rideId } = req.body;
		const { userId } = req.params;

		if (!rideId) {
			return res.status(400).send('Ride ID is required');
		}
		const rideExists = await db
			.select('*')
			.from('ride')
			.where('ride_id', rideId)
			.andWhere('user_id', userId);

		if (isEmpty(rideExists)) {
			return res.status(400).send('Invalid Ride');
		}
		const rideNotStartedYet = await db
			.select('*')
			.from('ride')
			.where('ride_id', rideId)
			.andWhere('user_id', userId)
			.whereNotIn('status', ['not_started_yet', 'ended']);

		if (isEmpty(rideNotStartedYet)) {
			return res.status(400).send('Ride has not started yet or has already ended!');
		}
		const updateRideStatus = await db('ride')
			.where('ride_id', rideId)
			.andWhere('user_id', userId)
			.update({
				status: 'ended',
			})
			.returning('*');
		if (isEmpty(updateRideStatus)) {
			return res.status(400).send('Could not find the Ride in the Database');
		}
		return res.status(200).send('Ride Ended and Database updated!');
	});
};
