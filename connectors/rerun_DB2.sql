

Insert Into subscriptions Values(DEFAULT, 'monthly',   1, 1, 'active', 15, 15,   1);
Insert Into subscriptions Values(DEFAULT, 'quarterly', 1, 1, 'active', 150, 150, 2);
Insert Into subscriptions Values(DEFAULT, 'yearly',    1, 1, 'active', 400, 400, 3);
Insert Into subscriptions Values(DEFAULT, 'monthly',   1, 1, 'canceled', 15, 15,   1);
Insert Into subscriptions Values(DEFAULT, 'monthly',   1, 1, 'canceled', 15, 15,   1);




Insert Into ticket Values(DEFAULT, 1, 'active', 1, 1, 1, 'Helwan','Tora El-Asmant');
Insert Into ticket Values(DEFAULT, 2, 'active', 1, 1, 1, 'Dokki','Bab El Shaaria');
Insert Into ticket Values(DEFAULT, 3, 'active', 1, 1, 1, 'Dokki','Hesham Barakat');
Insert Into ticket Values(DEFAULT, 4, 'active', 1, 1, 1, 'Dokki','Koleyet El-Banat');
Insert Into ticket Values(DEFAULT, 5, 'active', 2, 1, 1, 'Dokki','Maspero');
Insert Into ticket Values(DEFAULT, 6, 'active', 2, 1, 1, 'Dokki','Qobaa');
Insert Into ticket Values(DEFAULT, 7, 'expired', 1, 1, 1, 'Dokki','Stadium');
Insert Into ticket Values(DEFAULT, 8, 'expired', 2, 1, 1, 'El-Demerdash','El-Marg');
Insert Into ticket Values(DEFAULT, 9, 'expired', 2, 1, 1, 'El-Demerdash','El Bohoos');




Insert Into ride Values(DEFAULT, 'upcoming','1999-01-08 04:05:06', '1999-01-08 04:05:06', 1);
Insert Into ride Values(DEFAULT, 'in_progress','1999-01-08 04:05:06', '1999-01-08 04:05:06', 2);



Insert Into senior_request Values(DEFAULT, 'processing', 49, 1);
Insert Into senior_request Values(DEFAULT, 'processing', 40, 2);



Insert Into refund_request Values(DEFAULT, 'processing', 'description', 1, null, 1);
Insert Into refund_request Values(DEFAULT, 'processing', 'description', 2, null, 2);
