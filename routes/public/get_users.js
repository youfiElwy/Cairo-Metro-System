const db = require('../../connectors/db');
const { isEmpty } = require('lodash');

module.exports = function (app) {
	app.get('/', async function (req, res) {
		try {
			const users = await db.select('*').from('users');
			if (isEmpty(users)) {
				return res.status(400).send('Users do not exist');
			}
			return res.status(200).send(users);
		} catch (err) {
			console.log('error message', err.message);
			return res.status(400).send('Could not get users');
		}
	});
};
