const { isEmpty } = require('lodash');
const db = require('../../../connectors/db');
const bodyParser = require('body-parser');
const getUser = require('../../../routes/public/get_user');

module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
    app.put('/api/v1/requests/senior/:requestId', async function (req, res) {
	  const userInfo =await getUser(req);
      const adminId = userInfo.user_id;

	  if(userInfo.isSuperAdmin==false && userInfo.isAdmin==false){
		return res.status(400).send('Error you are not an admin');
	  }
		
	  const { requestId } = req.params;

		if (!req.body.request_state) {
			return res.status(400).send('Error please enter request state');
		}

		const requestExists = await db
		.select('*')
		.from('senior_request')
		.where('request_id', requestId);

		if (isEmpty(requestExists)) {
		return res.status(400).send('Error : request doesnot exist');
		}

		const requestManaged = await db
		.select('*')
		.from('senior_request')
		.where('request_id', requestId)
		.andWhere('request_state','processing');

		if (isEmpty(requestManaged)) {
		return res.status(400).send('Error : request already managed');
		}
    
		try {
			const updateSeniorRequest = await db("senior_request")
			.where("request_id", requestId)
			.update({
			  request_state : req.body.request_state,
			  admin_id : adminId
			})
			.returning("*");
			if(req.body.request_state=="accepted"){
				
				const getUser  = await db
				.select("*")
				.from("senior_request") 
				.where("request_id", requestId)
				.returning("*");
				
				const updateUsertype  = await db("users")
				.where("user_id", getUser[0].user_id)
				.update({
			  	usertype :"senior"
			})
			.returning("*");
			updateUsertype;
			}
				
			return res.status(200).json(updateSeniorRequest);
		} catch (err) {
			console.log(err.message);
			return res.status(400).send('Error: Could not accept or reject request');
		} });
    };
      
