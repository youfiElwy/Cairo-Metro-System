DROP TABLE IF EXISTS     all_possible_pathes,
                   refund_request,
                   ride,
                   route,
                   senior_request,
                   sessions,
                   station,
                   subscriptions,
                   ticket,
                   transactions,
                   users,
                   zones;

Create Table users (
	user_ID serial,
	username character varying(30),
	email character varying(30),
	password character varying(128),
	salt character varying(32),
	birthdate Date,
	age integer,
	gender character varying(1),
	phone character varying(11),
	ssn character varying(20),
	usertype character varying(10),--senior/normal
	userRole character varying(10),--admin/user/superadmin
	reset_token character varying(100),
	reset_token_expiration Timestamp,
	
	Primary Key (user_ID)
);

Create Table transactions (
	trans_ID serial,
	amount double precision,
	transaction_to character varying(20),--user/metro
	trans_date date,
	card_type character varying(20),
	credit_card integer,
	holder_name character varying(20),
	user_ID integer,
		
	Primary Key (trans_ID),
	Foreign Key (user_ID) References users (user_ID)
);

Create Table station (

	lokation character varying(30),
	description character varying(200),
	admin_ID integer,
	Primary Key (description),
	Foreign Key (admin_ID) References users (user_ID)
);


Create Table route (
	origin character varying(30),
	destination character varying(30),
    name character varying(200),
	
	admin_ID integer,
	
	Primary Key (origin,destination),
	Foreign Key (admin_ID) References users (user_ID)
);

Create Table all_possible_pathes(
	origin character varying(30),
	destination character varying(30),
	number_of_stations integer,
	path text[],
	
	Primary Key (origin,destination)
);

CREATE TABLE zones(
    	zone_id SERIAL,
	minimumStations integer,
	maximumStations integer,
  	--  zoneType text NOT NULL, -- 9 stations/ 10-16/16
    	price INTEGER NOT NULL,

    	Primary Key (zone_id)
);

Create Table subscriptions (
	sub_ID serial,
	duration character varying(15), --annual --month -- quarterly
	zone_id integer,
	trans_ID integer,
	status character varying(20),--active/expired
	maxNumberOfUsages integer,
	numberOfUsages integer,
	user_ID integer,

	Primary Key (sub_ID),
	Foreign Key (trans_ID) References transactions (trans_ID),
	Foreign Key (user_ID) References users (user_ID),
	Foreign Key (zone_id) References zones (zone_id)
);


Create Table ticket (
	ticket_ID serial,
	trans_ID integer,
	status character varying(20), --{active/expired}
	user_ID integer, 
	
	sub_ID integer,
	zone_id integer,
origin character varying(30),
	destination character varying(30),
	Primary Key (ticket_ID),
	Foreign Key (trans_ID) References transactions (trans_ID),
	Foreign Key (zone_id) References zones (zone_id),
	Foreign Key (user_ID) References users (user_ID),
	Foreign Key (sub_ID) References subscriptions (sub_ID),
	Foreign Key (origin,destination) References all_possible_pathes (origin,destination)

);

Create Table ride (
	ride_ID serial,
	status character varying(20),--{upcoming/ in progress/ ended}
	start_time timestamp,
	end_time timestamp,
	ticket_ID integer,

	Primary Key (ride_ID),
	Foreign Key (ticket_ID) References ticket (ticket_ID)
);

Create Table senior_request (
	request_ID serial,
	request_state character varying(20),
	ID_picture_age integer,
	
	admin_ID integer,
	user_ID integer,
		
	Primary Key (request_ID),
	Foreign Key (admin_ID) References users (user_ID),
	Foreign Key (user_ID) References users (user_ID)

);

Create Table refund_request (
	request_ID serial,
	request_state character varying(20),
	description character varying(200),

	ticket_ID integer,
	
	admin_ID integer,
	user_ID integer,
		
	Primary Key (request_ID),
	Foreign Key (ticket_ID) References ticket(ticket_ID),
	Foreign Key (admin_ID) References users (user_ID),
	Foreign Key (user_ID) References users (user_ID)
);


Create Table sessions (
	sessionId SERIAL,
	user_id integer,
	token character varying(50),
	expiresAt Date,

	Primary Key (sessionId),
	Foreign Key (user_id) References users(user_id)
);
-- Reset the serial column in the "users" table
ALTER SEQUENCE users_user_id_seq RESTART WITH 1;

-- Reset the serial column in the "transactions" table
ALTER SEQUENCE transactions_trans_id_seq RESTART WITH 1;


-- Reset the serial column in the "zones" table
ALTER SEQUENCE zones_zone_id_seq RESTART WITH 1;

-- Reset the serial column in the "subscriptions" table
ALTER SEQUENCE subscriptions_sub_id_seq RESTART WITH 1;

-- Reset the serial column in the "ticket" table
ALTER SEQUENCE ticket_ticket_id_seq RESTART WITH 1;

-- Reset the serial column in the "ride" table
ALTER SEQUENCE ride_ride_id_seq RESTART WITH 1;

-- Reset the serial column in the "senior_request" table
ALTER SEQUENCE senior_request_request_id_seq RESTART WITH 1;

-- Reset the serial column in the "refund_request" table
ALTER SEQUENCE refund_request_request_id_seq RESTART WITH 1;

-- Reset the serial column in the "sessions" table
ALTER SEQUENCE sessions_sessionid_seq RESTART WITH 1;








Insert Into users Values(DEFAULT, 'username1', 'user1', '893e3c3e629a5e5cdd70fb69333ecba742128d9e2861eae5c12a57e1aa1d5b05a375dde9a69fd7045700ecca5495c05e9767d26574c8fe3f84077203f2898d34','4a49a720f0fd7f1dd18b80fa8e77724b', '12/31/1999', 27, 'M', 'phone1', 'ssn1', 'normal', 'user');
Insert Into users Values(DEFAULT, 'username2', 'user2', 'ac820ab401a308f973a4ae7d2498f2f81ed2b10c8cf156ad5f8e5f3631b32a5bcb34c8f869de5ce55c4c48f295e926e9df9d14c877a7d066186b30b7294aadb1','9076eb3f5fac109a69eae9fd191fb417', '12/31/1999', 30, 'F', 'phone2', 'ssn2', 'normal', 'user');
Insert Into users Values(DEFAULT, 'username3', 'user3', '60cd9e4906c2e8bad574eb692ebf1badb18c6e4a46a3f7a7833e7a05b208335f54bd1d9803d8be6f824c695df8ce91538e7effd39d2485dd628d9cae34d9910b','7d1756b8adbb36ec1d59e7f78ad3681b', '12/31/1999', 87, 'F', 'phone3', 'ssn3', 'normal', 'user');
Insert Into users Values(DEFAULT, 'username4', 'user4', 'b0f62a4273d25716813af4132cb659173bf2c53164d1b5c7e4c8cffc21745e0a874fd9af30196010c1f779f4e824e13d8145cfd18c2f2649a54694d82f3c254d','e4a4c55c0fa939235d34122295bf170a','12/31/1999', 28, 'M', 'phone4', 'ssn4', 'normal', 'user');
Insert Into users Values(DEFAULT, 'username5', 'user5', 'b1436ae5b660286d92f386f2f28b19f79ea558683d8120520bba918b2e649f217d54ea579f01d3732b8736a5f40808485d39412e460bd8edbd994889d08d1deb','154d3384b510a3e7a4e3e49554eca2ae', '12/31/1999', 27, 'M', 'phone5', 'ssn5', 'normal', 'user');

Insert Into users Values(DEFAULT, 'Joe',    'Joe', '784a8a9f0845600d49f9e10c922e1d8cec1fd487c20dc75ef2e589efbe08b16677abfb822e7ed14db5ecc98358578f03d2ef02fbae095c25f7c6ad595bdbf3c4','718086d6ecf60858a10ac9d9159fa045','12/31/1999', 20, 'M', 'phone6', 'ssn6', 'normal', 'superadmin');
Insert Into users Values(DEFAULT, 'Bahy',   'Bahy', 'd278de30babd793d96569f83754b478946c6611e7a79c8517ccb1f68e7e195fd7b9435362f4676e6f10b27629bf6aa8a7a447b8ebeeb265fab58a3301974a2d6','dafde46963be8d282ccdbf1c0a6f0500','12/31/1999', 20, 'M', 'phone7', 'ssn7', 'normal', 'superadmin');
Insert Into users Values(DEFAULT, 'Ahmed',  'Ahmed', 'bc664da92fee855d538756aa3ded5fc805ca2f5823d8fc36f649d31d6a8476c0f0d3456e3eb5f3a75e452454f65b442fe1720bc7cf9ada455ca94f1338ac8195','1d002039f2d4e9a6bd55fc0333b03a66','12/31/1999', 20, 'M', 'phone8', 'ssn8', 'normal', 'superadmin');
Insert Into users Values(DEFAULT, 'Ossama', 'Ossama', '845c69bb69bc7534197a659bc1715ccbad6f386c5a45de93075320238c8e150d453628a4a24c4d841ed8a46725c9070edd44fde3e75c87c5f67215fe3465b5cd','8cb15a7ae8cc5973eb436647227b8394','12/31/1999', 20, 'M', 'phone9', 'ssn9', 'normal', 'superadmin');



Insert Into transactions Values(DEFAULT, 140000,'payment', '12/31/1999', 'Visa', 1, 'holder1', 1);
Insert Into transactions Values(DEFAULT, 140000, 'payment','12/31/1999', 'Visa', 1, 'holder1', 1);
Insert Into transactions Values(DEFAULT, 140000, 'payment','12/31/1999', 'Visa', 1, 'holder1', 1);
Insert Into transactions Values(DEFAULT, 140000, 'payment','12/31/1999', 'Visa', 2, 'holder1', 1);
Insert Into transactions Values(DEFAULT, 140000, 'payment','12/31/1999', 'Visa', 2, 'holder1', 1);



-- Insert Into station Values(DEFAULT, 'maadi',     'description1', 6);
-- Insert Into station Values(DEFAULT, 'tagamo3',   'description2', 6);
-- Insert Into station Values(DEFAULT, 'rehaab',    'description3', 6);
-- Insert Into station Values(DEFAULT, '6 Octobar', 'description4', 6);
-- Insert Into station Values(DEFAULT, 'zahraa',    'description5', 6);



-- Insert Into route Values(DEFAULT, 'origin1', 'destination1', 6);
-- Insert Into route Values(DEFAULT, 'origin2', 'destination2', 6);
-- Insert Into route Values(DEFAULT, 'origin3', 'destination3', 6);
-- Insert Into route Values(DEFAULT, 'origin4', 'destination4', 6);
-- Insert Into route Values(DEFAULT, 'origin5', 'destination5', 6);


-- INSERT INTO possible_routes (origin, destination, number_of_stations, path)
-- VALUES ('final_origin1', 'final_destination1', 6, array_append('{}', 'path'));

-- INSERT INTO possible_routes (origin, destination, number_of_stations, path)
-- VALUES ('final_origin2', 'final_destination2', 6, array_append('{}', 'path'));



Insert Into zones Values(DEFAULT, 1, 10, 16);



Insert Into subscriptions Values(DEFAULT, 'monthly',   1, 1, 'active', 15, 15,   1);
Insert Into subscriptions Values(DEFAULT, 'quarterly', 1, 1, 'active', 150, 150, 2);
Insert Into subscriptions Values(DEFAULT, 'yearly',    1, 1, 'active', 400, 400, 3);




Insert Into ticket Values(DEFAULT, 1, 'active', 1, 1, 1, 1);
Insert Into ticket Values(DEFAULT, 1, 'expired', 1, 1, 1, 1);



Insert Into ride Values(DEFAULT, 'upcoming','1999-01-08 04:05:06', '1999-01-08 04:05:06', 1);
Insert Into ride Values(DEFAULT, 'in_progress','1999-01-08 04:05:06', '1999-01-08 04:05:06', 2);



Insert Into senior_request Values(DEFAULT, 'processing', 49, 1);
Insert Into senior_request Values(DEFAULT, 'processing', 40, 2);



Insert Into refund_request Values(DEFAULT, 'processing', 'description', 1, null, 1);
Insert Into refund_request Values(DEFAULT, 'processing', 'description', 2, null, 2);
