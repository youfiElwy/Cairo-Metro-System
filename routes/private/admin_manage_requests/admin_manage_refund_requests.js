const { isEmpty } = require('lodash');
const db = require('../../../connectors/db');
const bodyParser = require('body-parser');
const getUser = require('../../../routes/public/get_user');

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.put('/api/v1/requests/refunds/:requestId', async function (req, res) {
		const userInfo = await getUser(req);
		const adminId = userInfo.user_id;

		if (userInfo.isSuperAdmin == false && userInfo.isAdmin == false) {
			return res.status(400).send([400,'Error you are not an admin']);
		}

		const { requestId } = req.params;

		if (!req.body.request_state) {
			return res.status(400).send([400,'Error please enter request state']);
		}

		const requestExists = await db
			.select('*')
			.from('refund_request')
			.where('request_id', requestId);

		if (isEmpty(requestExists)) {
			return res.status(400).send([400,'Error : request doesnot exist']);
		}

		const requestManaged = await db
			.select('*')
			.from('refund_request')
			.where('request_id', requestId)
			.andWhere('request_state', 'processing');

		if (isEmpty(requestManaged)) {
			return res.status(400).send([400,'Error : request already managed']);
		}

		const user = await db
		.select('*')
		.from('refund_request')
		.innerJoin('users','refund_request.user_id','users.user_id')
		.where('refund_request.request_id',requestId);

		const email =user[0].email;

		try {
			const updateRefundRequest = await db("refund_request")
				.where("request_id", requestId)
				.update({
					request_state: req.body.request_state,
					admin_id: adminId
				})
				.returning("*");
			if (req.body.request_state == "accepted") {
				const refundTransaction = await db
					.select("*")
					.from("refund_request")
					.innerJoin('ticket', 'ticket.ticket_id', 'refund_request.ticket_id')
					.innerJoin('transactions', 'ticket.trans_id', 'transactions.trans_id')
					.where('refund_request.request_id',requestId);

				const newTransaction = {
					"amount": refundTransaction[0].amount,
					"transaction_to": "user",
					"trans_date": new Date(Date.now()),
					"user_id": refundTransaction[0].user_id
				};
				const transaction = await db('transactions').insert(newTransaction).returning('*');
				transaction;
			}
			return res.status(200).json([200,"Request State Updated"]);
		} catch (err) {
			console.log(err.message);
			return res.status(400).send([400,'Error: Could not accept or reject request']);
		}
	});
};

