const { isEmpty } = require('lodash');
const db = require('../../../connectors/db');
const bodyParser = require('body-parser');
const getUser = require('../../../routes/public/get_user');

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.post('/api/v1/payment/subscriptions/', async function (req, res) {
		const user = await getUser(req);
		const userId = user.user_id;

		// check if user is already subscribed
		const subExists = await db
			.select('*')
			.from('subscriptions')
			.where('user_id', userId)
			.andWhere('status', 'active');
		if (!isEmpty(subExists)) {
			return res.status(400).send('user is already subscribed to an active plan');
		}

		try {
			let trans_amount = 0;
			let sub_maxnumberofusages = 0;
			let sub_numberofusages = 0;

			if (req.body.duration === 'monthly') {
				trans_amount = 100;
				sub_maxnumberofusages = 15;
				sub_numberofusages = 15;
			} else if (req.body.duration === 'quarterly') {
				trans_amount = 150;
				sub_maxnumberofusages = 150;
				sub_numberofusages = 150;
			} else {
				trans_amount = 250;
				sub_maxnumberofusages = 400;
				sub_numberofusages = 400;
			}

			const newTransaction = {
				amount: trans_amount,
				trans_date: new Date(Date.now()),
				card_type: req.body.card_type,
				credit_card: req.body.credit_card, // credit card number
				holder_name: req.body.holder_name,
				user_id: userId,
			};

			const newTransactionEntry = await db('transactions').insert(newTransaction).returning('*');

			const newSubscripEntry = {
				duration: req.body.duration,
				zone_id: req.body.zone_id,
				trans_id: newTransactionEntry[0].trans_id,
				status: 'active',
				maxnumberofusages: sub_maxnumberofusages,
				numberofusages: sub_numberofusages,
				user_id: userId,
			};

			const newSub = await db('subscriptions').insert(newSubscripEntry).returning('*');

			return res.status(200).send('User successfully subscribed to a plan');
		} catch (err) {
			console.log(err.message);
			return res
				.status(400)
				.send('Error: Could not enter transaction/subscription into database');
		}
	});
};
