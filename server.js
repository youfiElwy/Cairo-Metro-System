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
const get_users_route = require('./apis/get_users');
const delete_users_route = require('./apis/delete_user');
const user_forgot_password_route = require('./apis/user_forgot_password');
const user_forgot_password_verify_route = require('./apis/user_forgot_password_verify');
const user_forgot_password_new_password_route = require('./apis/user_forgot_password_new_password');
const get_user_subscription_route = require('./apis/subscriptions/get_user_subscription');
const pay_for_subscription_route = require('./apis/subscriptions/pay_for_subscription');
const pay_for_ticket_route = require('./apis/tickets/pay_for_ticket');

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

app.use(function (req, res, next) {
	return res
		.status(404)
		.send('----------  ERROR COULD NOT FIND YOUR SPECIFIED ROUTE  -----------');
});

app.listen(3000, () => {
	console.log('Server is now listening at port 3000 on http://localhost:3000/');
});
