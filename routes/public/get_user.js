const db = require('../../connectors/db');
const getSessionToken = require('../../utils/session').getSessionToken;

module.exports = async function (req) {
	const sessionToken = getSessionToken(req);
	if (!sessionToken) {
		return res.status(301).redirect('/');
	}

	const user = await db
		.select('*')
		.from('sessions')
		.where('token', sessionToken)
		.innerJoin('users', 'sessions.user_id', 'users.user_id')
		.first();

	// ADD BOOLEANS ABOUT THE TYPE OF USER
	// check if he is a NORMAL or SENIOR user
	if (user.usertype === 'normal') {
		user.isNormal = true;
		user.isSenior = false;
	} else {
		user.isNormal = false;
		user.isSenior = true;
	}

	// check if he is an ADMIN or a SUPERADMIN or a USER
	if (user.userrole === 'admin') {
		user.isAdmin = true;
		user.isSuperAdmin = false;
	} else if (user.userrole === 'superadmin') {
		user.isAdmin = true;
		user.isSuperAdmin = true;
	} else {
		user.isAdmin = false;
		user.isSuperAdmin = false;
	}

	return user;
};
// EXAMPLE
// user.isNormal = true
// user.isSenior = false
// user.isAdmin = true
// user.isSuperAdmin = true
