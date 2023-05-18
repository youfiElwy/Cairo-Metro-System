const express = require('express');
const app = express();

const knex = require('knex');
const db = require('./db');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MY APIs
const signup_route = require('./apis/user_sign_up');
const login_route = require('./apis/user_login');
const refund_request_route = require('./apis/user_refund_request');

app.get('/', function (req, res) {
	return res.send('Welcome to localhost:3000');
});

app.get('/', async function (req, res) {
	try {
		const users = await db.select('*').from('users');
		return res.status(200).send(users);
	} catch (err) {
		console.log('error message', err.message);
		return res.status(400).send('Could not get users');
	}
});

// CREATE USER
// app.post('/api/v1/users/signup', async function (req, res) {
// 	try {
// 		const { user_id, username, email, password, birthdate, age, gender, phone, ssn, usertype } =
// 			req.body;
// 		let newUser = {
// 			user_id,
// 			username,
// 			email,
// 			password,
// 			birthdate,
// 			age,
// 			gender,
// 			phone,
// 			ssn,
// 			usertype,
// 		};
// 		const addedUser = await db('users').insert(newUser).returning('*');
// 		return res.status(201).json(addedUser);
// 	} catch (err) {
// 		console.log('error message', err.message);
// 		return res.status(400).send(err.message);
// 	}
// });

// DELETE USER
app.delete('/api/v1/users/:userId', async (req, res) => {
	try {
		const { userId } = req.params;
		const deletedUser = await db('users').where('user_id', userId).del().returning('*');
		console.log('deleted', deletedUser);
		return res.status(200).json(deletedUser);
	} catch (err) {
		console.log('error message', err.message);
		return res.status(400).send('failed to delete user');
	}
});

app.put('/api/v1/users/', async (req, res) => {
	try {
		const usertype = req.body.usertype;
		const updatedUser = await db('users')
			.update({
				usertype,
			})
			.returning('*');
		return res.status(200).json(updatedUser);
	} catch (err) {
		console.log('error message', err.message);
		return res.status(400).send('Could not update user');
	}
});

// all routes
signup_route(app);
login_route(app);
refund_request_route(app);

app.use(function (req, res, next) {
	return res.status(404).render('404');
});

app.listen(3000, () => {
	console.log('Server is now listening at port 3000 on http://localhost:3000/');
});
