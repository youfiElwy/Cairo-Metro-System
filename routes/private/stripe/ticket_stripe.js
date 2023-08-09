const { isEmpty } = require('lodash');
const db = require('../../../connectors/db');
const bodyParser = require('body-parser');
const getUser = require('../../../routes/public/get_user');
const crypto = require('crypto');
const stripe = require("stripe")(process.env.STRIPE_API)

module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.post('/create-checkout-session-ticket', async function (req, res) {
        const user = await getUser(req);
        const { user_id } = user;
        const { start_time } = req.body;
        const { origin } = req.body;
        const { destination } = req.body;
        // Get the possible_routes_id from its table using the origin and destination
        const possibleRoute = await db
            .select('*')
            .from('all_possible_pathes')
            .where('origin', origin)
            .andWhere('destination', destination);

        if (isEmpty(possibleRoute)) {
            console.log(possibleRoute);
            return res.status(400).send([400, 'Could not get route from DB']);
        }

        const routeOrigin = possibleRoute[0].origin;
        const routeDestination = possibleRoute[0].destination;
        console.log(possibleRoute[0].destination);
        // ABOUT SUBcriiption buy ticket problem
        // check if he already has a ticket to that ride
        // check if hes subscribed. if yes then get insert into ticket then ride. then decrement number of rides from subscription

        const ticketExists = await db
            .select('*')
            .from('ticket')
            .innerJoin('ride', 'ticket.ticket_id', 'ride.ticket_id')
            .where('user_id', user_id)
            .andWhere('origin', routeOrigin)
            .andWhere('destination', routeDestination)
            .andWhere('ride.status', 'IN', ['upcoming', 'in_progress'])
            .andWhere('ride.start_time', start_time);
        if (!isEmpty(ticketExists)) {
            return res.status(401).send([401, 'user already purchased a ticket to this ride']);
        }
        const payment_token = crypto.randomBytes(16).toString('hex');

        const payment = await db("users")
            .where("user_id", user_id)
            .update({
                payment_token: payment_token,
                payment_token_active: true
            })
            .returning("*");
        payment;

        let number_of_stations = possibleRoute[0].number_of_stations;
        let price = 100;
        let zone_id = 100;
        const zones = await db.select('*').from('zones');
        for (cur_zone of zones) {
            if (cur_zone.maximumstations >= number_of_stations) {
                price = Math.min(cur_zone.price, price);
                zone_id = Math.min(cur_zone.zone_id, zone_id);

                break;
            }
        }
        let description = `Starting station is ${routeOrigin} And Destination is ${routeDestination} And Ride Start Time is ${start_time} And Number of Stations is ${number_of_stations}`;
        const item = [{
            price_data: {
                currency: "gbp",
                product_data: {
                    name: "One way Ticket",
                    description: description,
                },
                unit_amount: price * 100,
            },
            quantity: 1
        }];

        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "payment",
                line_items: item,
                success_url: `${process.env.FRONTEND}/TicketStripe?status=accepted&routeOrigin=${routeOrigin}&start_time=${start_time}&routeDestination=${routeDestination}&payment_token=${payment_token}`,
                cancel_url: `${process.env.FRONTEND}/TicketStripe?status=rejected`,
            })
            res.json([200, session.url])
        } catch (e) {
            res.status(500).json([500, e.message]);
        }
    });
};
