const config = {
	client: 'pg',
	connection: {
		host: 'localhost',
		port: 5432,
		user: 'postgres',
		password: 'Stecki10',
		database: 'Metro_System_Semester_4_Projekt',
	},
};

module.exports = require('knex')(config);
