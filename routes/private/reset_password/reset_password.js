const { isEmpty } = require('lodash');
const { v4 } = require('uuid');
const db = require('../../../connectors/db');
const bodyParser = require('body-parser');
const getUser = require('../../../routes/public/get_user');
const crypto = require('crypto');

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return [salt, hash];
}

function verifyPassword(password, hash, salt) {
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return verifyHash === hash;
}
 
module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.put('/api/v1/password/reset', async function (req, res) {
        const userInfo = await getUser(req);
        const user_id = userInfo.user_id;
        const { password, newpassword } = req.body;

        if (!password) {
            // If the password is not present, return an HTTP unauthorized code
            return res.status(400).send('Password is required');
        }
        if (!newpassword) {
            // If the password is not present, return an HTTP unauthorized code
            return res.status(400).send('New Password is required');
        }

        if (!verifyPassword(password, userInfo.password, userInfo.salt)) {
            return res.status(401).send('Password does not match');
        }

        const hash = hashPassword(req.body.newpassword);

        try {
            const updatePass = await db("users")
                .where("user_id", user_id)
                .update({
                    password: hash[1],
                    salt: hash[0]
                })
                .returning("*");
            return res.status(200).json(updatePass);
        } catch (err) {
            console.log(err.message);
            return res.status(400).send('Could not update your password');
        }
    });
};
