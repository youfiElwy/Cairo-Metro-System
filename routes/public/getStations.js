const { isEmpty } = require('lodash');
const db = require('../../connectors/db');
const bodyParser = require('body-parser');

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.get('/getAll/Stations', async function (req, res) {
		const stations= await db.select('description')
        .from('station');

		return res.status(200).json(stations);
	})
    ;
};