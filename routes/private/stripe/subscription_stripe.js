//api key =pk_test_51NFilGFJ1nJmZISKhot1BWDEmfKT4cNvSYKHwMd3SMb9JktG0bysUzL7SbrYOAcJcXvpSwjPWWlsW5GjA6H2Qx9i00zmPdBKt3
const { isEmpty } = require('lodash');
const db = require('../../../connectors/db');
const bodyParser = require('body-parser');
const getUser = require('../../public/get_user');
const crypto = require('crypto');
const stripe = require("stripe")(process.env.STRIPE_API)

module.exports = function (app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.post("/create-checkout-session-subscription", async (req, res) => {
    const user = await getUser(req);
    const { user_id } = user;

    // check if user is already subscribed
    const subExists = await db
      .select('*')
      .from('subscriptions')
      .where('user_id', user_id)
      .andWhere('status', 'active');
    if (!isEmpty(subExists)) {
      return res.status(400).send([400, 'user is already subscribed to an active plan']);
    }
    let trans_amount = 0;
    let sub_maxnumberofusages = 0;
    let sub_numberofusages = 0;
    let name = "";
    let description = "";
    const { zone_id } = req.body;
    const { duration } = req.body;
    const payment_token = crypto.randomBytes(16).toString('hex');

    const payment = await db("users")
      .where("user_id", user_id)
      .update({
        payment_token: payment_token,
        payment_token_active: true
      })
      .returning("*");
    payment;
    if (duration === 'monthly') {
      trans_amount = 100;
      sub_maxnumberofusages = 15;
      sub_numberofusages = 15;
      name = "Monthly Subscription";
      description = "Max number of usages : 15"
    } else if (duration === 'quarterly') {
      trans_amount = 200;
      sub_maxnumberofusages = 150;
      sub_numberofusages = 150;
      name = "Quarterly Subscription";
      description = "Max number of usages : 150"
    } else {
      trans_amount = 400;
      sub_maxnumberofusages = 400;
      sub_numberofusages = 400;
      name = "Yearly Subscription";
      description = "Max number of usages : 400"
    }
    if (zone_id === "2") {
      trans_amount = trans_amount * 1.2;
    }
    else if (zone_id === "3") {
      trans_amount = trans_amount * 1.5;
    }
    const item = [{
      price_data: {
        currency: "egp",
        product_data: {
          name: name,
          description: description,
        },
        unit_amount: trans_amount * 100,
      },
      quantity: 1
    }];
    console.log(item);
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: item,
        success_url: `${process.env.FRONTEND}/SubscriptionStripe?status=accepted&duration=${duration}&zone_id=${zone_id}&payment_token=${payment_token}`,
        cancel_url: `${process.env.FRONTEND}/SubscriptionStripe?status=rejected`,
      })
      res.json([200, session.url])
    } catch (e) {
      res.status(500).json([500, e.message])
    }
  })

}