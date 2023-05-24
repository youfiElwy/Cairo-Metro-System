const { isEmpty } = require('lodash');
const db = require('../../../connectors/db');
const bodyParser = require('body-parser');
const getUser = require('../../../routes/public/get_user');

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.post('/api/v1/senior/request', async function (req, res) {
		const userInfo = await getUser(req);
		const user_id = userInfo.user_id;
		const email = userInfo.email;

		if (!req.body.ID_picture_age) {
			return res.status(400).send('national id is required');
		}

		const requestExists = await db
			.select('*')
			.from('senior_request')
			.where('request_state', "processing")
			.andWhere('user_id', user_id);

		if (!isEmpty(requestExists)) {
			return res.status(400).send('Error : you already made a senior request');
		}

		const alreadySenior = await db
			.select('*')
			.from('users')
			.where('userrole', "senior")
			.andWhere('user_id', user_id);

		if (!isEmpty(alreadySenior)) {
			return res.status(400).send('Error : you already already a senior');
		}

		const senior_request = {
			request_state: "processing",
			id_picture_age: req.body.ID_picture_age,
			user_id: user_id,
		};
		console.log(senior_request);
		try {
			const senior = await db('senior_request').insert(senior_request).returning('*');
			return res.status(200).json(senior);
		} catch (err) {
			console.log(err.message);
			return res.status(400).send('Error: Could not send senior request');
		}
	});
};