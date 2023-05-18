const { isEmpty } = require('lodash');
const db = require('../../db');
const bodyParser = require('body-parser');

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.post('/api/v1/payment/ticket/:userId', async function (req, res) {
		const { userId } = req.params;
		const newTicket = {
			date_of_purchase: new Date(Date.now()),
			user_id: userId,
			ride_id: req.body.ride_id,
		};
		const ticketExists = await db
			.select('*')
			.from('ticket')
			.where('user_id', userId)
			.andWhere('ride_id', newTicket.ride_id);
		if (!isEmpty(ticketExists)) {
			return res.status(400).send('user already purchased a ticket to this ride');
		}
		// We will use this when sending an email
		const creditCardNumber = req.body.creditCardNumber;
		const holderName = req.body.holderName;
		const price = req.body.price;
		const origin = req.body.origin;
		const destination = req.body.destination;
		const trip_date = req.body.trip_date;

		try {
			const newRow = await db('ticket').insert(newTicket).returning('*');
			return res.status(200).json(newRow);
		} catch (err) {
			console.log(err.message);
			return res.status(400).send('Error: Could not enter data into database');
		}
	});
};
