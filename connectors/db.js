// const config = {
// 	client: 'pg',
// 	connection: {
// 		host: 'localhost',
// 		port: 5432,
// 		user: 'postgres',
// 		password: 'Stecki10',
// 		database: 'Metro_System_Semester_4_Projekt',
// 	},
// };

// module.exports = require('knex')(config);
// console.log('HEREE');
// console.log(process.env.POSTGRES_HOST);
// console.log(process.env.PORT);
// console.log(process.env.POSTGRES_USER);
// console.log(process.env.POSTGRES_PASSWORD);
// console.log(process.env.POSTGRES_DATABASE);

const config = {
	client: 'pg',
	connection: {
		host: process.env.POSTGRES_HOST,
		port: 5432,
		user: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD.toString(),
		database: process.env.POSTGRES_DATABASE,
		ssl: true,
	},
};

module.exports = require('knex')(config);
