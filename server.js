require('dotenv').config();

const express = require('express');
const app = express();

const knex = require('knex');
const db = require('./db');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MY APIs
const signup_route = require('./apis/user_management/user_sign_up');
const login_route = require('./apis/user_management/user_login');
const refund_request_route = require('./apis/user_tickets/user_refund_request');
const get_users_route = require('./apis/user_management/get_users');
const delete_users_route = require('./apis/user_management/delete_user');
const user_forgot_password_route = require('./apis/user_management/forgot_pass/user_forgot_password');
const user_forgot_password_verify_route = require('./apis/user_management/forgot_pass/user_forgot_password_verify');
const user_forgot_password_new_password_route = require('./apis/user_management/forgot_pass/user_forgot_password_new_password');
const get_user_subscription_route = require('./apis/user_subscriptions/get_user_subscription');
const pay_for_subscription_route = require('./apis/user_subscriptions/pay_for_subscription');
const pay_for_ticket_route = require('./apis/user_tickets/pay_for_ticket');
const rideStarted = require('./apis/user_rides/simulate_ride_start');
const rideEnded = require('./apis/user_rides/simulate_ride_end');

// all routes
signup_route(app);
login_route(app);
refund_request_route(app);
get_users_route(app);
delete_users_route(app);
user_forgot_password_route(app);
user_forgot_password_verify_route(app);
user_forgot_password_new_password_route(app);
get_user_subscription_route(app);
pay_for_subscription_route(app);
pay_for_ticket_route(app);
rideStarted(app);
rideEnded(app);

app.use(function (req, res, next) {
	return res
		.status(404)
		.send('----------  ERROR COULD NOT FIND YOUR SPECIFIED ROUTE  -----------');
});

app.listen(3000, () => {
	console.log('Server is now listening at port 3000 on http://localhost:3000/');
});
