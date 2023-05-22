

Insert Into users Values(DEFAULT, 'username1', 'email1', 'passwort1', '12/31/1999', 27, 'M', 'phone1', 'ssn1', 'normal', 'user');
Insert Into users Values(DEFAULT, 'username2', 'email2', 'passwort2', '12/31/1999', 30, 'F', 'phone2', 'ssn2', 'normal', 'user');
Insert Into users Values(DEFAULT, 'username3', 'email3', 'passwort3', '12/31/1999', 87, 'F', 'phone3', 'ssn3', 'normal', 'user');
Insert Into users Values(DEFAULT, 'username4', 'email4', 'passwort4', '12/31/1999', 28, 'M', 'phone4', 'ssn4', 'normal', 'user');
Insert Into users Values(DEFAULT, 'username5', 'email5', 'passwort5', '12/31/1999', 27, 'M', 'phone5', 'ssn5', 'normal', 'user');

Insert Into users Values(DEFAULT, 'Joe',    'email6', 'passwort6', '12/31/1999', 20, 'M', 'phone6', 'ssn6', 'normal', 'superadmin');
Insert Into users Values(DEFAULT, 'Bahy',   'email7', 'passwort7', '12/31/1999', 20, 'M', 'phone7', 'ssn7', 'normal', 'superadmin');
Insert Into users Values(DEFAULT, 'Ahmed',  'email8', 'passwort8', '12/31/1999', 20, 'M', 'phone8', 'ssn8', 'normal', 'superadmin');
Insert Into users Values(DEFAULT, 'Ossama', 'email9', 'passwort9', '12/31/1999', 20, 'M', 'phone9', 'ssn9', 'normal', 'superadmin');



Insert Into transactions Values(DEFAULT, 140000, '12/31/1999', 'Visa', 1, 'holder1', 1);
Insert Into transactions Values(DEFAULT, 140000, '12/31/1999', 'Visa', 1, 'holder1', 1);
Insert Into transactions Values(DEFAULT, 140000, '12/31/1999', 'Visa', 1, 'holder1', 1);
Insert Into transactions Values(DEFAULT, 140000, '12/31/1999', 'Visa', 2, 'holder1', 1);
Insert Into transactions Values(DEFAULT, 140000, '12/31/1999', 'Visa', 2, 'holder1', 1);



Insert Into station Values(DEFAULT, 'maadi',     'description1', 6);
Insert Into station Values(DEFAULT, 'tagamo3',   'description2', 6);
Insert Into station Values(DEFAULT, 'rehaab',    'description3', 6);
Insert Into station Values(DEFAULT, '6 Octobar', 'description4', 6);
Insert Into station Values(DEFAULT, 'zahraa',    'description5', 6);



Insert Into route Values(DEFAULT, 'origin1', 'destination1', 6);
Insert Into route Values(DEFAULT, 'origin2', 'destination2', 6);
Insert Into route Values(DEFAULT, 'origin3', 'destination3', 6);
Insert Into route Values(DEFAULT, 'origin4', 'destination4', 6);
Insert Into route Values(DEFAULT, 'origin5', 'destination5', 6);



Insert Into possible_routes  Values(DEFAULT, 'final_origin1', 'final_destination1', 6, 'path');
Insert Into possible_routes  Values(DEFAULT, 'final_origin2', 'final_destination2', 6, 'path');



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



Insert Into refund_request Values(DEFAULT, 'processing', 'description', 1, 1);
Insert Into refund_request Values(DEFAULT, 'processing', 'description', 2, 2);
