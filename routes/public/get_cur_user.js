const { isEmpty } = require('lodash');
const db = require('../../connectors/db');
const bodyParser = require('body-parser');
const getUser = require('../public/get_user');

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.get('/get_cur_user', async function (req, res) {
		const user = await getUser(req);

        return res.status(200).json(user);
	
	});
};
