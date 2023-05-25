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
	password character varying(20),
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








Insert Into users Values(DEFAULT, 'username1', 'email1', 'passwort1', '12/31/1999', 27, 'M', 'phone1', 'ssn1', 'normal', 'user');
Insert Into users Values(DEFAULT, 'username2', 'email2', 'passwort2', '12/31/1999', 30, 'F', 'phone2', 'ssn2', 'normal', 'user');
Insert Into users Values(DEFAULT, 'username3', 'email3', 'passwort3', '12/31/1999', 87, 'F', 'phone3', 'ssn3', 'normal', 'user');
Insert Into users Values(DEFAULT, 'username4', 'email4', 'passwort4', '12/31/1999', 28, 'M', 'phone4', 'ssn4', 'normal', 'user');
Insert Into users Values(DEFAULT, 'username5', 'email5', 'passwort5', '12/31/1999', 27, 'M', 'phone5', 'ssn5', 'normal', 'user');

Insert Into users Values(DEFAULT, 'Joe',    'email6', 'passwort6', '12/31/1999', 20, 'M', 'phone6', 'ssn6', 'normal', 'superadmin');
Insert Into users Values(DEFAULT, 'Bahy',   'email7', 'passwort7', '12/31/1999', 20, 'M', 'phone7', 'ssn7', 'normal', 'superadmin');
Insert Into users Values(DEFAULT, 'Ahmed',  'email8', 'passwort8', '12/31/1999', 20, 'M', 'phone8', 'ssn8', 'normal', 'superadmin');
Insert Into users Values(DEFAULT, 'Ossama', 'email9', 'passwort9', '12/31/1999', 20, 'M', 'phone9', 'ssn9', 'normal', 'superadmin');



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
