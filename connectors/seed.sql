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








Insert Into users Values(DEFAULT, 'username1', 'user1', '67e62d0d123cbcf886bbda5dfdb14fc52c2a720b8708030a27c8a93f5b5f3a9284a44249ad353c5b931960e074810ddb24b29856fda16108fb539da1a85d65f6','5f7e9fc841e1bee05792c132f03284bb', '12/31/1999', 27, 'M', 'phone1', 'ssn1', 'normal', 'user');
Insert Into users Values(DEFAULT, 'username2', 'user2', 'ab9a8cdb370c481af33817a925b4eb147c5de900b827b54e00c2d4faf95f679104bb7d4cadc07a982a24e528436d2898e08ffef5429e3d90fbbed20c98a83f54','d76abe12c82d66bb90dcd9c51a5a4ee9', '12/31/1999', 30, 'F', 'phone2', 'ssn2', 'normal', 'user');
Insert Into users Values(DEFAULT, 'username3', 'user3', 'bf6e69211ca545f0f904e24cef254b52cbc29447d6947cec142038f64127bb58c762ed1e545318dffb9b14749c26ce563584321bb9d8a392b6cc30517d6efc2e','62832e173636f8cd468d8d34d4946249', '12/31/1999', 87, 'F', 'phone3', 'ssn3', 'normal', 'user');
Insert Into users Values(DEFAULT, 'username4', 'user4', 'f34f776429b802a0c036bada415520d36abd2a0ca75dbb7f570dbeaf4b850b45ddce866ab5cf23bb438de1c08a526982aa9dbcd31497daf6037a4aa01ebdb858','497afb6792c41bbb28398b3ff1f6a281','12/31/1999', 28, 'M', 'phone4', 'ssn4', 'normal', 'user');
Insert Into users Values(DEFAULT, 'username5', 'user5', '19fd98842a2f97aa2215091b0ea28191c6d29a25d93164cc1b5e98e2391c6c713a5b48a9e6b3b40cbaf1aafc6f75a37c5e7a479d868d60ac0e7350976940b6b3','7cf2b4e5cf3aa6ec883c442074b81013', '12/31/1999', 27, 'M', 'phone5', 'ssn5', 'normal', 'user');

Insert Into users Values(DEFAULT, 'joe',    'joe', 'aff68965e1cbc9417749f2f280552256d60920974e190f331d8eaef49fbf86ec53d07c17f566a538fbbcfd75ab26c359617672b64c884ed75087cf0da989d903','5adbbb0b8dc913e14cbca1d8ad35bc97','12/31/1999', 20, 'M', 'phone6', 'ssn6', 'normal', 'superadmin');
Insert Into users Values(DEFAULT, 'bahy',   'bahy', 'e10867ce0600de5a8a6f3654b57da3ab64d02f782d5d28a9e8b557db43035a4e4d3007945b91f5d0acdc3452586c15e37eab8e15826ce06aa51acf3357230c3d','8abf9ffbc0cb7420a52a193486739892','12/31/1999', 20, 'M', 'phone7', 'ssn7', 'normal', 'superadmin');
Insert Into users Values(DEFAULT, 'ahmed',  'ahmed', '7ab4e807b19a8a49878d1530f225e195e435db81b87272631bf5ed68b6baa654deeaa774944c10297ceed637d6add7d69236d7e3ede3ddac9c33397f62f7d4af','b990a497e25fa99b998639e6d9befabd','12/31/1999', 20, 'M', 'phone8', 'ssn8', 'normal', 'superadmin');
Insert Into users Values(DEFAULT, 'ossama', 'ossama', '658d1c0474c633f7417c16f43326b56f88249c256d0c755b3f644efeb1dfb0875a76a95938ed491467b512c4b7827f39b8027f82bd81afa3e07d523df0a4ed08','9999ad0e09583eeeada3e878024fa8de','12/31/1999', 20, 'M', 'phone9', 'ssn9', 'normal', 'superadmin');



Insert Into transactions Values(DEFAULT, 140000,'payment', '12/31/1999', 'Visa', 1, 'holder1', 1);
Insert Into transactions Values(DEFAULT, 140000, 'payment','12/31/1999', 'Visa', 1, 'holder1', 1);
Insert Into transactions Values(DEFAULT, 140000, 'payment','12/31/1999', 'Visa', 1, 'holder1', 1);
Insert Into transactions Values(DEFAULT, 140000, 'payment','12/31/1999', 'Visa', 2, 'holder1', 1);
Insert Into transactions Values(DEFAULT, 140000, 'payment','12/31/1999', 'Visa', 2, 'holder1', 1);


Insert Into zones Values(DEFAULT, 1, 9, 5);
Insert Into zones Values(DEFAULT, 10, 16, 7);
Insert Into zones Values(DEFAULT, 17, 1000, 10);



Insert Into senior_request Values(DEFAULT, 'processing', 49, 1);
Insert Into senior_request Values(DEFAULT, 'processing', 40, 2);


Insert Into subscriptions Values(DEFAULT, 'monthly',   1, 1, 'active', 15, 15,   1);
Insert Into subscriptions Values(DEFAULT, 'quarterly', 1, 1, 'active', 150, 150, 2);
Insert Into subscriptions Values(DEFAULT, 'yearly',    1, 1, 'active', 400, 400, 3);


