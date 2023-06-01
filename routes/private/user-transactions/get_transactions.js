const { isEmpty } = require('lodash');
const db = require('../../../connectors/db');
const bodyParser = require('body-parser');
const getUser = require('../../../routes/public/get_user');

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.get('/api/v1/users/transactions', async function (req, res) {
		const user = await getUser(req);

		const userId = user.user_id;
		try {
			const user_transactions = await db('transactions').where('transactions.user_id', userId);
			return res.status(200).json(user_transactions);
		} catch (err) {
			console.log(err.message);
			return res.status(400).send('Error: Could not get users transactions from the DB');
		}
	});
};
