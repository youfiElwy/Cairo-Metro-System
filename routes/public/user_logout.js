const { isEmpty } = require('lodash');
const { v4 } = require('uuid');
const db = require('../../connectors/db');
const bodyParser = require('body-parser');

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.post('/api/v1/users/logout', async function (req, res) {
		// LOGOUT
	});
};
