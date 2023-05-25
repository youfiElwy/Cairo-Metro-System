const { isEmpty } = require('lodash');
const db = require('../../connectors/db');

module.exports = function (app) {
	app.delete('/api/v1/users/:userId', async (req, res) => {
		try {
			const { userId } = req.params;
			const deletedUser = await db('users').where('user_id', userId).del().returning('*');
			if (isEmpty(deletedUser)) {
				return res.status(400).send('User does not exist');
			}
			return res.status(200).json(deletedUser);
		} catch (err) {
			return res.status(400).send('failed to delete user');
		}
	});
};
