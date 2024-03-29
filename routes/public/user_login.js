const { isEmpty } = require('lodash');
const { v4 } = require('uuid');
const db = require('../../connectors/db');
const bodyParser = require('body-parser');
const crypto = require('crypto');

function verifyPassword(password, hash, salt) {
	const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
	return verifyHash === hash;
}

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	// Register HTTP endpoint to create new user
	app.post('/api/v1/users/login', async function (req, res) {
		// get users credentials from the JSON body
		const { email, password } = req.body;
		if (!email) {
			// If the email is not present, return an HTTP unauthorized code
			return res.status(400).send([400,'email is required']);
		}
		if (!password) {
			// If the password is not present, return an HTTP unauthorized code
			return res.status(401).send([401,'Password is required']);
		}

		// validate the provided password against the password in the database
		// if invalid, send an unauthorized code
		const user = await db.select('*').from('users').where('email', email).first();
		if (isEmpty(user)) {
			return res.status(402).send([402,'user does not exist']);
		}

		if (!verifyPassword(password, user.password, user.salt)) {
			return res.status(403).send([403,'Wrong Password']);
		}
		//return res.status(200).send('login successful');

		// SESSION STUFF
		// set the expiry time as 15 minutes after the current time
		const token = v4();
		const currentDateTime = new Date();
		const expiresat = new Date(+currentDateTime + 180000); // expire in 3 minutes

		// create a session containing information about the user and expiry time
		const session = {
			user_id: user.user_id,
			token,
			expiresat,
		};

		try {
			await db('sessions').insert(session);
			// In the response, set a cookie on the client with the name "session_cookie"
			// and the value as the UUID we generated. We also set the expiration time.
			return res
				.cookie('session_token', token, { expires: expiresat })
				.status(200)
				.json([200, token]);
		} catch (err) {
			console.log(err.message);
			return res.status(404).send([404,'Could not login user////--> could not enter session into DB']);
		}
	});
};
