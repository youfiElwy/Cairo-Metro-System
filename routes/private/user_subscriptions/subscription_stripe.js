//api key =pk_test_51NFilGFJ1nJmZISKhot1BWDEmfKT4cNvSYKHwMd3SMb9JktG0bysUzL7SbrYOAcJcXvpSwjPWWlsW5GjA6H2Qx9i00zmPdBKt3
const { isEmpty } = require('lodash');
const db = require('../../../connectors/db');
const bodyParser = require('body-parser');
const getUser = require('../../public/get_user');
const stripe = require("stripe")("sk_test_51NFilGFJ1nJmZISKGcm36DxSEkCfPHgGbP44wZnP9hNTQzeHPoSOu7kOpagXhnquESo1SNrbIJI96deIxYyz2mUO00dj0rZfpY")

module.exports = function (app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.post("/create-checkout-session-subscription", async (req, res) => {
    const user = await getUser(req);
    const userId = user.user_id;

    // check if user is already subscribed
    const subExists = await db
      .select('*')
      .from('subscriptions')
      .where('user_id', userId)
      .andWhere('status', 'active');
    if (!isEmpty(subExists)) {
      return res.status(400).send([400, 'user is already subscribed to an active plan']);
    }
    let trans_amount = 0;
    let sub_maxnumberofusages = 0;
    let sub_numberofusages = 0;
    let name = "";
    let description = "";
    let zone_id=req.body.zone_id;
    let duration=req.body.duration;
    if (duration=== 'monthly') {
      trans_amount = 100;
      sub_maxnumberofusages = 15;
      sub_numberofusages = 15;
      name = "Monthly Subscription";
      description = "Max number of usages : 15"
    } else if (duration === 'quarterly') {
      trans_amount = 150;
      sub_maxnumberofusages = 150;
      sub_numberofusages = 150;
      name = "Quarterly Subscription";
      description = "Max number of usages : 150"
    } else {
      trans_amount = 250;
      sub_maxnumberofusages = 400;
      sub_numberofusages = 400;
      name = "Yearly Subscription";
      description = "Max number of usages : 400"
    }
    const test = [{
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
    console.log(test);
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: test,
        success_url: `http://localhost:5000/test?duration=${duration}&zone_id=${zone_id}`,
        cancel_url: `http://localhost:5000/${trans_amount}`,
      })
      res.json(session.url )
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

}