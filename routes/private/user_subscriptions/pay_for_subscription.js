const { isEmpty } = require('lodash');
const db = require('../../../connectors/db');
const bodyParser = require('body-parser');
const getUser = require('../../../routes/public/get_user');

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.post('/api/v1/payment/subscriptions/', async function (req, res) {
		const user = await getUser(req);
		const { user_id } = user;
		const { payment_token } = req.body;
		// check if user is already subscribed
		const subExists = await db
			.select('*')
			.from('subscriptions')
			.where('user_id', user_id)
			.andWhere('status', 'active');

		if (!isEmpty(subExists)) {
			return res.status(400).send([400, 'user is already subscribed to an active plan']);
		}

		const checkToken = await db('users')
			.where('user_id', user_id)
			.andWhere('payment_token_active', true)
			.andWhere('payment_token', payment_token)
			.returning('*');

		if (isEmpty(checkToken)) {
			return res.status(400).send([400, 'You didnot pay for the subscription']);
		}

		const updateToken = await db('users')
			.where('user_id', user_id)
			.andWhere('payment_token', payment_token)
			.update({
				payment_token_active: false,
			})
			.returning('*');
		updateToken;
		try {
			let trans_amount = 0;
			let sub_maxnumberofusages = 0;
			let sub_numberofusages = 0;

			if (req.body.duration === 'monthly') {
				trans_amount = 100;
				sub_maxnumberofusages = 15;
				sub_numberofusages = 15;
			} else if (req.body.duration === 'quarterly') {
				trans_amount = 200;
				sub_maxnumberofusages = 150;
				sub_numberofusages = 150;
			} else {
				trans_amount = 400;
				sub_maxnumberofusages = 400;
				sub_numberofusages = 400;
			}
			if (req.body.zone_id === '2') {
				trans_amount = trans_amount * 1.2;
			} else if (req.body.zone_id === '3') {
				trans_amount = trans_amount * 1.5;
			}

			const newTransaction = {
				amount: trans_amount,
				trans_date: new Date(Date.now()),
				card_type: req.body.card_type,
				credit_card: req.body.credit_card, // credit card number
				holder_name: req.body.holder_name,
				user_id: user_id,
				transaction_to: 'Metro',
			};

			const newTransactionEntry = await db('transactions').insert(newTransaction).returning('*');

			const newSubscripEntry = {
				duration: req.body.duration,
				zone_id: req.body.zone_id,
				trans_id: newTransactionEntry[0].trans_id,
				status: 'active',
				maxnumberofusages: sub_maxnumberofusages,
				numberofusages: sub_numberofusages,
				user_id: user_id,
			};

			const newSub = await db('subscriptions').insert(newSubscripEntry).returning('*');
			return res.status(200).send([200, 'User successfully subscribed to a plan']);
		} catch (err) {
			console.log(err.message);
			return res
				.status(401)
				.send([401, 'Error: Could not enter transaction/subscription into database']);
		}
	});
};
