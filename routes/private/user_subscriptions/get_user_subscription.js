const { isEmpty } = require('lodash');
const db = require('../../../connectors/db');
const bodyParser = require('body-parser');
const getUser = require('../../../routes/public/get_user');

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.get('/api/v1/users/subscription', async function (req, res) {
		try {
			const user = await getUser(req);

			const userId = user.user_id;
			const subscrib = await db
				.select('*')
				.from('subscriptions')
				.innerJoin('transactions', 'subscriptions.trans_id', 'transactions.trans_id')
				.innerJoin('zones', 'subscriptions.zone_id', 'zones.zone_id')
				.where('subscriptions.user_id', userId)
				.returning('*');

			if (isEmpty(subscrib)) {
				return res.status(400).json([
					{
						sub_id: '------',
						duration: '------',
						zone_id: '------',
						trans_id: '------',
						status: '-----',
						maxnumberofusages: '------',
						minimumstations: '------',
						maximumstations: '------',
						numberofusages: '------',
						user_id: '------',
						amount: '------',
						transaction_to: '------',
						trans_date: '------',
						card_type: '------',
						credit_card: '------',
						holder_name: '------',
					},
				]);
			}
			return res.status(200).json(subscrib);
		} catch (err) {
			console.log('error:', err.message);
			return res.status(400).send('Could not get user subscription');
		}
	});
};
