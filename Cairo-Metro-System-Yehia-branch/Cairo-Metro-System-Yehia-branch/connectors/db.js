const config = {
	client: 'pg',
	connection: {
		host: 'localhost',
		port: 5432,
		user: 'postgres',
		password: '1234',
		database: 'Cairo_Metro_DB',
	},
};

module.exports = require('knex')(config);



// yehia Db name → Cairo_Metro_DB , pass → 1234 