const { isEmpty } = require('lodash');
const db = require('../../../connectors/db');
const bodyParser = require('body-parser');
const getUser = require('../../../routes/public/get_user');

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.get('/api/v1/requests/getsenior', async function (req, res) {
		const userInfo = await getUser(req);

		if (userInfo.isSuperAdmin == false && userInfo.isAdmin == false) {
			return res.status(400).send([400,'Error you are not an admin']);
		}
		const seniorRequests = await db
			.select('*')
			.from('senior_request')

		try {
            return res.status(200).json([200,seniorRequests]);
			}
	    catch (err) {
			console.log(err.message);
			return res.status(400).send([400,'Error: Could not get senior requests']);
		}
	});
};
