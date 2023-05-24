const { isEmpty } = require('lodash');
const db = require('../../../connectors/db');
const bodyParser = require('body-parser');
const getUser = require('../../../routes/public/get_user');

module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.put('/api/v1/superadmin/registeradmin', async function (req, res) {
        const userInfo = await getUser(req);
        const adminId = userInfo.user_id;

        if (userInfo.isSuperAdmin == false) {
            return res.status(400).send('Error you are not a Super Admin');
        }

        if (!req.body.user_id) {
            return res.status(400).send('Error please enter user id');
        }

        const alreadyAdmin = await db
            .select("*")
            .from("users")
            .where("user_id", user_id)
            .andWhere("userrole", "admin");

        if (isEmpty(alreadyAdmin)) {
            return res.status(400).send('Error : user is already an admin');
        }

        try {
            const registerAdmin = await db("users")
                .where("user_id", user_id)
                .update({
                    userrole: "admin"
                })
                .returning("*");
            return res.status(200).json(registerAdmin);
        } catch (err) {
            console.log(err.message);
            return res.status(400).send('Error: Could not register admin');
        }
    });
};

