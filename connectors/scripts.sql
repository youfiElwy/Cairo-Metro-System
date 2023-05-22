
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
	station_ID serial,
	lokation character varying(30),
	description character varying(200),
	
	admin_ID integer,
		
	Primary Key (station_ID),
	Foreign Key (admin_ID) References users (user_ID)
);


Create Table route (
	route_ID serial,
	origin character varying(30),
	destination character varying(30),
	
	admin_ID integer,
	
	Primary Key (route_ID),
	Foreign Key (admin_ID) References users (user_ID)
);

Create Table possible_routes(
	possible_routes_id serial,
	origin character varying(30),
	destination character varying(30),
	number_of_stations integer,
	path text[],
	
	Primary Key (possible_routes_id)
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
	possible_routes_id integer,
	sub_ID integer,
	zone_id integer,

	Primary Key (ticket_ID),
	Foreign Key (trans_ID) References transactions (trans_ID),
	Foreign Key (zone_id) References zones (zone_id),
	Foreign Key (user_ID) References users (user_ID),
	Foreign Key (sub_ID) References subscriptions (sub_ID),
	Foreign Key (possible_routes_id) References possible_routes (possible_routes_id)

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
