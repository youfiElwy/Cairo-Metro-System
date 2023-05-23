const { isEmpty } = require('lodash');
const db = require('../../../connectors/db');
const bodyParser = require('body-parser');

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.post('/api/v1/users/:userId/refund_request', async function (req, res) {
		const { userId } = req.params;
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
			return res.status(200).json(refund_request);
		} catch (err) {
			console.log(err.message);
			return res.status(400).send('Error: Could not send refund request');
		}
	});
};
