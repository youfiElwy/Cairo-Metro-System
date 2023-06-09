const { isEmpty } = require('lodash');
const db = require('../../../connectors/db');
const bodyParser = require('body-parser');
const getUser = require('../../../routes/public/get_user');
// Package for sending emails
// const sgMail = require('@sendgrid/mail');
// const SENDGRID_API_KEY = process.env.SEND_GRID_KEY;
// sgMail.setApiKey(SENDGRID_API_KEY);

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.put('/api/v1/requests/senior/:requestId', async function (req, res) {
		const userInfo = await getUser(req);
		const adminId = userInfo.user_id;

		if (userInfo.isSuperAdmin == false && userInfo.isAdmin == false) {
			return res.status(400).send('Error you are not an admin');
		}

		const { requestId } = req.params;

		if (!req.body.request_state) {
			return res.status(400).send('Error please enter request state');
		}

		const requestExists = await db
			.select('*')
			.from('senior_request')
			.where('request_id', requestId);

		if (isEmpty(requestExists)) {
			return res.status(400).send('Error : request does not exist');
		}

		const requestManaged = await db
			.select('*')
			.from('senior_request')
			.where('request_id', requestId)
			.andWhere('request_state', 'processing');

		if (isEmpty(requestManaged)) {
			return res.status(400).send('Error : request already managed');
		}
		const getUser = await db.select('*').from('senior_request').where('request_id', requestId);
		const email = getUser[0].email;
		// const commonStyles = `
		// 	<style>
		// 		/* Add your custom CSS styles here */
		// 		body {
		// 			font-family: Arial, sans-serif;
		// 		}
		// 		.container {
		// 			max-width: 600px;
		// 			margin: 0 auto;
		// 			padding: 20px;
		// 			border: 1px solid #ccc;
		// 			border-radius: 5px;
		// 		}
		// 		h1 {
		// 			color: #333;
		// 		}
		// 		p {
		// 			margin-bottom: 20px;
		// 		}
		// 		.button {
		// 			display: inline-block;
		// 			padding: 10px 20px;
		// 			background-color: #007bff;
		// 			color: #fff;
		// 			text-decoration: none;
		// 			border-radius: 5px;
		// 		}
		// 	</style>
		// `;

		try {
			const updateSeniorRequest = await db('senior_request')
				.where('request_id', requestId)
				.update({
					request_state: req.body.request_state,
					admin_id: adminId,
				})
				.returning('*');
			if (req.body.request_state == 'accepted') {
				const updateUsertype = await db('users')
					.where('user_id', getUser[0].user_id)
					.update({
						usertype: 'senior',
					})
					.returning('*');
				updateUsertype;
				// ACCEPTED
				// const acceptedMsg = {
				// 	to: email,
				// 	from: 'metronoreplystation@gmail.com',
				// 	subject: 'Congratulations! Your Senior Status Request Has Been Approved',
				// 	text: "Welcome fellow citizen! It's great to have you here as part of our Metro Station team!",
				// 	html: `
				// 		<html>
				// 			<head>
				// 				${commonStyles}
				// 			</head>
				// 			<body>
				// 				<div class="container">
				// 					<h1>Hello, fellow citizen!</h1>
				// 					<p>We are pleased to inform you that your request to be recognized as a senior member<br>
				// 					of our metro system has been accepted.<br>
				// 					Congratulations on achieving this status,<br>
				// 					and thank you for choosing our services.</p>
				// 					<p>As a senior member,<br>
				// 					you are now eligible to enjoy exclusive discounts up to 40% on our ticket fares.<br>
				// 					This is our way of showing appreciation for your continued support and loyalty.</p>
				// 				</div>
				// 			</body>
				// 		</html>
				// 	`,
				// };

				// await sgMail.send(acceptedMsg);
			} else {
				// REJECTED
				// const rejectedMsg = {
				// 	to: email,
				// 	from: 'metronoreplystation@gmail.com',
				// 	subject: 'Update Regarding Your Senior Status Request',
				// 	text: "Welcome fellow citizen! It's great to have you here as part of our Metro Station team!",
				// 	html: `
				// 		<html>
				// 			<head>
				// 				${commonStyles}
				// 			</head>
				// 			<body>
				// 				<div class="container">
				// 					<h1>Hello, fellow citizen!</h1>
				// 					<p>After careful consideration,</p>
				// 					<p>we regret to inform you that your request to be recognized as a senior member<br>
				// 					has not been approved at this time.</p>
				// 					<p>Unfortunately, you do not meet the specified qualification criteria required<br>
				// 					to attain a seniority status.</p><br><br>
				// 					<p>Thank you for your understanding, and we appreciate your continued support.</p>
				// 				</div>
				// 			</body>
				// 		</html>
				// 	`,
				// };
				// await sgMail.send(rejectedMsg);
			}

			return res.status(200).json(updateSeniorRequest);
		} catch (err) {
			console.log(err.message);
			return res.status(400).send('Error: Could not accept or reject request');
		}
	});
};
