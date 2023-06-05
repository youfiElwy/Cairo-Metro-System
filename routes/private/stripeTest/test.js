//api key =pk_test_51NFilGFJ1nJmZISKhot1BWDEmfKT4cNvSYKHwMd3SMb9JktG0bysUzL7SbrYOAcJcXvpSwjPWWlsW5GjA6H2Qx9i00zmPdBKt3
const { isEmpty } = require('lodash');
const db = require('../../../connectors/db');
const bodyParser = require('body-parser');
const stripe = require("stripe")("sk_test_51NFilGFJ1nJmZISKGcm36DxSEkCfPHgGbP44wZnP9hNTQzeHPoSOu7kOpagXhnquESo1SNrbIJI96deIxYyz2mUO00dj0rZfpY")

const storeItems = new Map([
  [1, { priceInCents: 10000, name: "Learn React Today" }],
  [2, { priceInCents: 20000, name: "Learn CSS Today" }],
])

module.exports = function (app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.post("/create-checkout-session", async (req, res) => {
    try {
      let items = [
        { id: 1, quantity: 3 },
        { id: 2, quantity: 1 },
      ];
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: items.map(item => {
          const storeItem = storeItems.get(item.id)
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: storeItem.name,
              },
              unit_amount: storeItem.priceInCents,
            },
            quantity: item.quantity,
          }
        }),
        success_url: `https://dashboard.stripe.com/test/apikeys`,
        cancel_url: `https://dashboard.stripe.com/test/apikeys`,
      })
      res.json({ url: session.url })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

}