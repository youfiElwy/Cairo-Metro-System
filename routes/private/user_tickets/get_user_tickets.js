const { isEmpty } = require('lodash');
const db = require('../../../connectors/db');
const bodyParser = require('body-parser');
const getUser = require('../../../routes/public/get_user');

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.get('/api/v1/users/tickets', async function (req, res) {
		const user = await getUser(req);

		const userId = user.user_id;
		// i shouldnt check if user id exists cuz ill get it from the session or smth
		// which means he definietly exists keda keda
		try {
			const user_tickets = await db('ticket').where('ticket.user_id', userId);
			return res.status(200).json(user_tickets);
		} catch (err) {
			console.log(err.message);
			return res.status(400).send('Error: Could not get users tickets from the DB');
		}
	});
};
