const { isEmpty } = require('lodash');
const db = require('../../../connectors/db');
const bodyParser = require('body-parser');
const getUser = require('../../../routes/public/get_user');

module.exports = function (app) {
	console.log('WESELTTT');
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.post('/api/v1/superadmin/registeradmin', async function (req, res) {
		console.log(req.body);
		const userExists = await db.select('*').from('users').where('email', req.body.email);
		if (!isEmpty(userExists)) {
			return res.status(401).send('user exists');
		}
		const currentDate = new Date();
		const birthdate = new Date(req.body.birthdate);
		const ageInMilliseconds = currentDate - birthdate;
		const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25;
		const age = Math.floor(ageInMilliseconds / millisecondsPerYear);
		const hash = hashPassword(req.body.password);

		const newUser = {
			username: req.body.username,
			email: req.body.email,
			password: hash[1],
			salt: hash[0],
			birthdate: req.body.birthdate,
			age,
			gender: req.body.gender,
			phone: req.body.phone,
			ssn: req.body.ssn,
			usertype: req.body.usertype,
			userrole: req.body.userrole,
		};
		try {
			const user = await db('users').insert(newUser).returning('*');
			const email = req.body.email;
			const password = req.body.password;

			return res.status(200);
		} catch (err) {
			console.log(err.message);
			return res.status(400).send([400, 'Error: Could not register user']);
		}
	});
};
