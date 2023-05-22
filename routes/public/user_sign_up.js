const { isEmpty } = require('lodash');
const db = require('../../connectors/db');
const bodyParser = require('body-parser');

// Package for sending emails
// const sgMail = require('@sendgrid/mail');
// const SENDGRID_API_KEY = process.env.SEND_GRID_KEY;
// sgMail.setApiKey(SENDGRID_API_KEY);

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
			userrole: req.body.userrole,
		};
		try {
			const user = await db('users').insert(newUser).returning('*');
			const email = req.body.email;
			const password = req.body.password;

			// const msg = {
			// 	to: email,
			// 	from: 'metronoreplystation@gmail.com',
			// 	subject: 'Welcome to Metro Station',
			// 	text: "Welcome fellow citizen! It's great to have you here as part of our Metro Station team!",
			// 	html: `
			// 	  <html>
			// 		 <head>
			// 			<style>
			// 			  /* Add your custom CSS styles here */
			// 			  body {
			// 				 font-family: Arial, sans-serif;
			// 			  }
			// 			  .container {
			// 				 max-width: 600px;
			// 				 margin: 0 auto;
			// 				 padding: 20px;
			// 				 border: 1px solid #ccc;
			// 				 border-radius: 5px;
			// 			  }
			// 			  h1 {
			// 				 color: #333;
			// 			  }
			// 			  p {
			// 				 margin-bottom: 20px;
			// 			  }
			// 			  .button {
			// 				 display: inline-block;
			// 				 padding: 10px 20px;
			// 				 background-color: #007bff;
			// 				 color: #fff;
			// 				 text-decoration: none;
			// 				 border-radius: 5px;
			// 			  }
			// 			</style>
			// 		 </head>
			// 		 <body>
			// 			<div class="container">
			// 			  <h1>Welcome, fellow citizen!</h1>
			// 			  <p>It's great to have you here as part of our Metro Station team!</p>
			// 			  <p>Log In at any time using the following credentials!!!</p>
			// 			  <p>Email: ${email}</p>
			//  			  <p>Password: ${password}</p>
			// 			</div>
			// 		 </body>
			// 	  </html>
			// 	`,
			// };

			// await sgMail.send(msg);

			return res.status(200).json(user);
		} catch (err) {
			console.log(err.message);
			return res.status(400).send('Error: Could not register user');
		}
	});
};
