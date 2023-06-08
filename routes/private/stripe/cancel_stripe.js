const { isEmpty } = require('lodash');
const db = require('../../../connectors/db');
const bodyParser = require('body-parser');
const getUser = require('../../public/get_user');

module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.post('/stripe/cancel', async function (req, res) {
        const user = await getUser(req);
        const { user_id } = user;
        try {
            const updateToken = await db("users")
                .where("user_id", user_id)
                .update({
                    payment_token_active: false
                })
                .returning("*");
            updateToken;
            return res.status(200).send([200, 'payment canceled']);
        }
        catch (err) {
            return res
                .status(400)
                .send([400, 'payment canceled']);
        }
    })
}