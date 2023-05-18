const { isEmpty } = require('lodash');
const db = require('../db');
const bodyParser = require('body-parser');

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	// Register HTTP endpoint to create new user
	app.post('/api/v1/users/signup', async function (req, res) {
		// Check if user already exists in the system
		const userExists = await db.select('*').from('users').where('email', req.body.email);
		if (!isEmpty(userExists)) {
			return res.status(400).send('user exists');
		}

		// calculate age
		// STILL NEED TO TEST THIS OUT
		// ALSO TEST OUT req.body.birthdate.age IF THAT DOES IT AUTOMATICALLY?!
		const currentDate = new Date();
		const birthdate = new Date(req.body.birthdate);
		const ageInMilliseconds = currentDate - birthdate;
		const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25;
		const age = Math.floor(ageInMilliseconds / millisecondsPerYear);

		const newUser = {
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
			birthdate: req.body.birthdate,
			age,
			gender: req.body.gender,
			phone: req.body.phone,
			ssn: req.body.ssn,
			usertype: 'normal',
		};
		try {
			const user = await db('users').insert(newUser).returning('*');
			return res.status(200).json(user);
		} catch (err) {
			console.log(err.message);
			return res.status(400).send('Error: Could not register user');
		}
	});
};
