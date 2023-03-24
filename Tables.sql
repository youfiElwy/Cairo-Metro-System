--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

-- Started on 2023-03-24 12:00:53

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 214 (class 1259 OID 16453)
-- Name: Admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Admin" (
    "Admin_ID" bigint NOT NULL,
    "Username" "char"[] NOT NULL,
    "Password" "char"[] NOT NULL,
    "Email" "char"[] NOT NULL
);


ALTER TABLE public."Admin" OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16474)
-- Name: Possible_Rides; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Possible_Rides" (
    "PR_ID" bigint NOT NULL,
    "Final_Origin" "char"[] NOT NULL,
    "Final_Destination" "char"[] NOT NULL,
    "Duration" "char"[] NOT NULL,
    "Zone" "char"[] NOT NULL,
    "Distance" bigint NOT NULL,
    "Transfer_Station" "char"[],
    "Price" double precision NOT NULL
);


ALTER TABLE public."Possible_Rides" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16514)
-- Name: Refund_Request; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Refund_Request" (
    "Request_ID" bigint NOT NULL,
    "Ticket_ID" bigint NOT NULL,
    "Description" text[] NOT NULL,
    "Request_State" "char"[] NOT NULL
);


ALTER TABLE public."Refund_Request" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16481)
-- Name: Ride; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Ride" (
    "Ride_ID" bigint NOT NULL,
    "Final_Origin" "char"[] NOT NULL,
    "Final_Destination" "char"[] NOT NULL,
    "Duration" "char"[] NOT NULL,
    "Start_Time" time with time zone NOT NULL,
    "End_Time" time with time zone NOT NULL,
    "Status" "char"[] NOT NULL,
    "Zone" "char"[] NOT NULL,
    "Distance" bigint[] NOT NULL,
    "Transfer_Station" "char"[],
    "Price" double precision NOT NULL
);


ALTER TABLE public."Ride" OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16467)
-- Name: Route; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Route" (
    "Route_ID" bigint NOT NULL,
    "Origin" "char"[] NOT NULL,
    "Destination" "char"[] NOT NULL
);


ALTER TABLE public."Route" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16507)
-- Name: Senior_Request; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Senior_Request" (
    "Reques_State" "char"[] NOT NULL,
    "ID_Picture" bytea NOT NULL,
    "Request_ID" bigint NOT NULL,
    "Details" text[] NOT NULL
);


ALTER TABLE public."Senior_Request" OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16460)
-- Name: Station; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Station" (
    "Station_ID" bigint NOT NULL,
    "Location" "char"[] NOT NULL,
    "Description" text[] NOT NULL
);


ALTER TABLE public."Station" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16521)
-- Name: Subscription; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Subscription" (
    "Duration" bigint NOT NULL,
    "Price" double precision NOT NULL,
    "Date_of_Purchase" date NOT NULL,
    "Subscription_ID" bigint NOT NULL,
    "Expirey_Date" date NOT NULL,
    "Status" "char"[] NOT NULL,
    "Zone" "char"[] NOT NULL
);


ALTER TABLE public."Subscription" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16488)
-- Name: Ticket; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Ticket" (
    "Ticket_ID" bigint NOT NULL,
    "Date_of_Purchase" date NOT NULL
);


ALTER TABLE public."Ticket" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16500)
-- Name: Transaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Transaction" (
    "Trans_ID" bigint NOT NULL,
    "Trans_Date" date NOT NULL,
    "Amount" bigint NOT NULL,
    "Card_Type" "char"[] NOT NULL
);


ALTER TABLE public."Transaction" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16493)
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    "Username" "char"[] NOT NULL,
    "Email" "char"[] NOT NULL,
    "Password" "char"[] NOT NULL,
    "User_ID" bigint NOT NULL,
    "Age" integer NOT NULL,
    "Gender" boolean NOT NULL,
    "UserType" "char"[] NOT NULL,
    "Phone_Number" "char"[] NOT NULL,
    "Birthdate" date NOT NULL,
    "SSN" "char"[] NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- TOC entry 3376 (class 0 OID 16453)
-- Dependencies: 214
-- Data for Name: Admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Admin" ("Admin_ID", "Username", "Password", "Email") FROM stdin;
\.


--
-- TOC entry 3379 (class 0 OID 16474)
-- Dependencies: 217
-- Data for Name: Possible_Rides; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Possible_Rides" ("PR_ID", "Final_Origin", "Final_Destination", "Duration", "Zone", "Distance", "Transfer_Station", "Price") FROM stdin;
\.


--
-- TOC entry 3385 (class 0 OID 16514)
-- Dependencies: 223
-- Data for Name: Refund_Request; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Refund_Request" ("Request_ID", "Ticket_ID", "Description", "Request_State") FROM stdin;
\.


--
-- TOC entry 3380 (class 0 OID 16481)
-- Dependencies: 218
-- Data for Name: Ride; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Ride" ("Ride_ID", "Final_Origin", "Final_Destination", "Duration", "Start_Time", "End_Time", "Status", "Zone", "Distance", "Transfer_Station", "Price") FROM stdin;
\.


--
-- TOC entry 3378 (class 0 OID 16467)
-- Dependencies: 216
-- Data for Name: Route; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Route" ("Route_ID", "Origin", "Destination") FROM stdin;
\.


--
-- TOC entry 3384 (class 0 OID 16507)
-- Dependencies: 222
-- Data for Name: Senior_Request; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Senior_Request" ("Reques_State", "ID_Picture", "Request_ID", "Details") FROM stdin;
\.


--
-- TOC entry 3377 (class 0 OID 16460)
-- Dependencies: 215
-- Data for Name: Station; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Station" ("Station_ID", "Location", "Description") FROM stdin;
\.


--
-- TOC entry 3386 (class 0 OID 16521)
-- Dependencies: 224
-- Data for Name: Subscription; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Subscription" ("Duration", "Price", "Date_of_Purchase", "Subscription_ID", "Expirey_Date", "Status", "Zone") FROM stdin;
\.


--
-- TOC entry 3381 (class 0 OID 16488)
-- Dependencies: 219
-- Data for Name: Ticket; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Ticket" ("Ticket_ID", "Date_of_Purchase") FROM stdin;
\.


--
-- TOC entry 3383 (class 0 OID 16500)
-- Dependencies: 221
-- Data for Name: Transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Transaction" ("Trans_ID", "Trans_Date", "Amount", "Card_Type") FROM stdin;
\.


--
-- TOC entry 3382 (class 0 OID 16493)
-- Dependencies: 220
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" ("Username", "Email", "Password", "User_ID", "Age", "Gender", "UserType", "Phone_Number", "Birthdate", "SSN") FROM stdin;
\.


--
-- TOC entry 3213 (class 2606 OID 16459)
-- Name: Admin Admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Admin"
    ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("Admin_ID");


--
-- TOC entry 3219 (class 2606 OID 16480)
-- Name: Possible_Rides Possible_Rides_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Possible_Rides"
    ADD CONSTRAINT "Possible_Rides_pkey" PRIMARY KEY ("PR_ID");


--
-- TOC entry 3231 (class 2606 OID 16520)
-- Name: Refund_Request Refund_Request_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Refund_Request"
    ADD CONSTRAINT "Refund_Request_pkey" PRIMARY KEY ("Request_ID");


--
-- TOC entry 3221 (class 2606 OID 16487)
-- Name: Ride Ride_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ride"
    ADD CONSTRAINT "Ride_pkey" PRIMARY KEY ("Ride_ID");


--
-- TOC entry 3217 (class 2606 OID 16473)
-- Name: Route Route_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Route"
    ADD CONSTRAINT "Route_pkey" PRIMARY KEY ("Route_ID");


--
-- TOC entry 3229 (class 2606 OID 16513)
-- Name: Senior_Request Senior_Request_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Senior_Request"
    ADD CONSTRAINT "Senior_Request_pkey" PRIMARY KEY ("Request_ID");


--
-- TOC entry 3215 (class 2606 OID 16466)
-- Name: Station Station_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Station"
    ADD CONSTRAINT "Station_pkey" PRIMARY KEY ("Station_ID");


--
-- TOC entry 3233 (class 2606 OID 16527)
-- Name: Subscription Subscription_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_pkey" PRIMARY KEY ("Subscription_ID");


--
-- TOC entry 3223 (class 2606 OID 16492)
-- Name: Ticket Ticket_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ticket"
    ADD CONSTRAINT "Ticket_pkey" PRIMARY KEY ("Ticket_ID");


--
-- TOC entry 3227 (class 2606 OID 16506)
-- Name: Transaction Transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY ("Trans_ID");


--
-- TOC entry 3225 (class 2606 OID 16499)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("User_ID");


-- Completed on 2023-03-24 12:00:53

--
-- PostgreSQL database dump complete
--

