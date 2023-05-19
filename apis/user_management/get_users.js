const db = require('../../db');

module.exports = function (app) {
	app.get('/', async function (req, res) {
		try {
			const users = await db.select('*').from('users');
			return res.status(200).send(users);
		} catch (err) {
			console.log('error message', err.message);
			return res.status(400).send('Could not get users');
		}
	});
};
