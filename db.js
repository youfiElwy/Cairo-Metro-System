const config = {
	client: 'pg',
	connection: {
		host: 'localhost',
		port: 5432,
		user: 'postgres',
		password: '1q2w3e4r',
		database: 'postgres',
	},
};

module.exports = require('knex')(config);
  
//test