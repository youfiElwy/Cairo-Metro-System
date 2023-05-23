const { isEmpty } = require('lodash');
const db = require('../../../connectors/db');
const bodyParser = require('body-parser');
const getUser = require('../../../routes/public/get_user');

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.put('/api/v1/users/subscription/cancel', async function (req, res) {
		const user = await getUser(req);
		const userId = user.user_id;

		// check if user is subscribed
		const subExists = await db
			.select('*')
			.from('subscriptions')
			.where('user_id', userId)
			.andWhere('status', 'active');
		if (isEmpty(subExists)) {
			return res.status(400).send('user is not subscribed to an active plan');
		}

		try {
			const deleteSub = await db('subscriptions').where('user_id', userId).update({
				status: 'canceled',
			});
			return res.status(200).send('Subscription successfully canceled');
		} catch (err) {
			console.log(err.message);
			return res.status(400).send('Error: Could not cancel subscription');
		}
	});
};
