// IMPORTS
require('dotenv').config();
const express = require('express');
const app = express();
const knex = require('knex');
const db = require('./connectors/db');
const bodyParser = require('body-parser');

// IMPORT AUTHENTICATION MIDDLEWARE
const authMiddleware = require('./middleware/auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ALL ROUTES
const signup_route = require('./routes/public/user_sign_up');
const login_route = require('./routes/public/user_login');
const refund_request_route = require('./routes/private/user_tickets/user_refund_request');
const get_users_route = require('./routes/public/get_users');
const delete_users_route = require('./routes/public/delete_user');
const user_forgot_password_route = require('./routes/public/forgot_pass/user_forgot_password');
const user_forgot_password_verify_route = require('./routes/public/forgot_pass/user_forgot_password_verify');
const user_forgot_password_new_password_route = require('./routes/public/forgot_pass/user_forgot_password_new_password');
const get_user_subscription_route = require('./routes/private/user_subscriptions/get_user_subscription');
const pay_for_subscription_route = require('./routes/private/user_subscriptions/pay_for_subscription');
const pay_for_ticket_route = require('./routes/private/user_tickets/pay_for_ticket');
const rideStarted = require('./routes/private/user_rides/simulate_ride_start');
const rideEnded = require('./routes/private/user_rides/simulate_ride_end');
const auth = require('./middleware/auth');

// PUBLIC ROUTES
signup_route(app);
login_route(app);
user_forgot_password_route(app);
user_forgot_password_verify_route(app);
user_forgot_password_new_password_route(app);
get_users_route(app);
delete_users_route(app);

// CALL AUTHENTICATION MIDDLEWARE
app.use(authMiddleware);

// PRIVATE ROUTES
refund_request_route(app);
get_user_subscription_route(app);
pay_for_subscription_route(app);
pay_for_ticket_route(app);
rideStarted(app);
rideEnded(app);

// HANDLE IF WE DID NOT FIND THE ROUTE WE WERE LOOKING FOR
app.use(function (req, res, next) {
	return res
		.status(404)
		.send('----------  ERROR COULD NOT FIND YOUR SPECIFIED ROUTE/PAGE  -----------');
});

// START SERVER
app.listen(3000, () => {
	console.log('Server is now listening at port 3000 on http://localhost:3000/');
});
