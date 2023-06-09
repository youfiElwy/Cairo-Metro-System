// IMPORTS
require('dotenv').config();
const express = require('express');
const app = express();
const knex = require('knex');
const db = require('./connectors/db');
const bodyParser = require('body-parser');

// IMPORT AUTHENTICATION MIDDLEWARE
const authMiddleware = require('./middleware/auth');

const cors = require('cors');
app.use(cors());

// ALL ROUTES

//new 3 apis

const station = require('./routes/private/system_stations/station');
const zones = require('./routes/private/system_stations/zones');
const route = require('./routes/private/system_stations/route');

const signup_route = require('./routes/public/user_sign_up');
const login_route = require('./routes/public/user_login');
const logout_route = require('./routes/private/user_logout');
const refund_request_route = require('./routes/private/user_tickets/user_refund_request');
const user_forgot_password_route = require('./routes/public/forgot_pass/user_forgot_password');
const user_forgot_password_verify_route = require('./routes/public/forgot_pass/user_forgot_password_verify');
const user_forgot_password_new_password_route = require('./routes/public/forgot_pass/user_forgot_password_new_password');
const get_user_subscription_route = require('./routes/private/user_subscriptions/get_user_subscription');
const pay_for_subscription_route = require('./routes/private/user_subscriptions/pay_for_subscription');
const cancel_subscription_route = require('./routes/private/user_subscriptions/cancel_subscription');
const get_user_tickets = require('./routes/private/user_tickets/get_user_tickets');
const pay_for_ticket_route = require('./routes/private/user_tickets/pay_for_ticket');
const pay_for_ticket_by_sub_route = require('./routes/private/user_tickets/pay_for_ticket_by_Sub');
const get_user_transactions = require('./routes/private/user-transactions/get_transactions');
const rideStarted = require('./routes/private/user_rides/simulate_ride_start');
const rideEnded = require('./routes/private/user_rides/simulate_ride_end');
const user_senior_requests = require('./routes/private/user_requests/user_senior_request');
const admin_manage_senior_requests = require('./routes/private/admin_manage_requests/admin_manage_senior_requests');
const admin_manage_refund_requests = require('./routes/private/admin_manage_requests/admin_manage_refund_requests');
const get_senior_requests = require('./routes/private/admin_manage_requests/get_senior_requests');
const get_refund_requests = require('./routes/private/admin_manage_requests/get_refund_requests');
const superadmin_register_admin = require('./routes/private/superAdmin/superAdmin_register_admin');
const reset_password = require('./routes/private/reset_password/reset_password');
const subscription_stripe = require('./routes/private/stripe/subscription_stripe');
const ticket_stripe = require('./routes/private/stripe/ticket_stripe');
const cancel_stripe = require('./routes/private/stripe/cancel_stripe');
const get_current_user = require('./routes/public/get_cur_user');
const get_all_stations = require('./routes/public/getStations');
const check_price = require('./routes/public/check_price');

// PUBLIC ROUTES
signup_route(app);
login_route(app);
user_forgot_password_route(app);
user_forgot_password_verify_route(app);
user_forgot_password_new_password_route(app);
get_current_user(app);
get_all_stations(app);
check_price(app);

app.use(authMiddleware);

// PRIVATE ROUTES
logout_route(app);
refund_request_route(app);
get_user_tickets(app);
get_user_subscription_route(app);
pay_for_subscription_route(app);
cancel_subscription_route(app);
pay_for_ticket_route(app);
pay_for_ticket_by_sub_route(app);
get_user_transactions(app);
rideStarted(app);
rideEnded(app);
user_senior_requests(app);
admin_manage_senior_requests(app);
admin_manage_refund_requests(app);
get_senior_requests(app);
get_refund_requests(app);
superadmin_register_admin(app);
rideStarted(app);
rideEnded(app);
station(app);
route(app);
zones(app);
reset_password(app);
subscription_stripe(app);
ticket_stripe(app);
cancel_stripe(app);

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
