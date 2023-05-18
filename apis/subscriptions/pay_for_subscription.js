const { isEmpty } = require('lodash');
const db = require('../../db');
const bodyParser = require('body-parser');

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.post('/api/v1/payment/subscriptions/:userId', async function (req, res) {
		// check if user is already subscribed
		const { userId } = req.params;
		const subExists = await db.select('*').from('subscriptions').where('user_id', userId);
		if (!isEmpty(subExists)) {
			return res.status(400).send('user is already subscribed to a plan');
		}
		const newSubscrip = {
			duration: req.body.duration,
			zone: req.body.zone,
			price: req.body.price,
			status: 'active',
			date_of_purchase: new Date(Date.now()),
			expiery_date: req.body.expiery_date,
			user_id: userId,
		};
		// We will use this when sending an email
		const creditCardNumber = req.body.creditCardNumber;
		const holderName = req.body.holderName;

		try {
			const newRow = await db('subscriptions').insert(newSubscrip).returning('*');
			return res.status(200).json(newRow);
		} catch (err) {
			console.log(err.message);
			return res.status(400).send('Error: Could not enter data into database');
		}
	});
};
