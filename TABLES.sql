--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

-- Started on 2023-03-17 17:19:35
///

-- Database: Cairo Metro System

-- DROP DATABASE IF EXISTS "Cairo Metro System";

--THIS PART FOR CREATING THE DATABASE
CREATE DATABASE "Cairo Metro System"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

COMMENT ON DATABASE "Cairo Metro System"
    IS 'This is the DataBase for the Entire Project';
///

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
-- TOC entry 220 (class 1259 OID 16438)
-- Name: Admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Admin" (
    "Username" "char"[] NOT NULL,
    "Email" character varying(15) NOT NULL,
    "Password" "char"[] NOT NULL
);


ALTER TABLE public."Admin" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16428)
-- Name: Refund_Request; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Refund_Request" (
    "Request_State" "char",
    "Description" "char"[],
    "Ticket_ID" bigint
);


ALTER TABLE public."Refund_Request" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16445)
-- Name: Route; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Route" (
    "Origin" "char"[] NOT NULL,
    "Destination" "char"[] NOT NULL,
    "Price" double precision NOT NULL,
    "Duration" time with time zone NOT NULL,
    "Distance" double precision NOT NULL,
    "Transfer_Stations" "char"[]
);


ALTER TABLE public."Route" OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16423)
-- Name: SeniorRequest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SeniorRequest" (
    "Details" "char"[],
    "ID_Picture" bigint,
    "Request_State" "char"
);


ALTER TABLE public."SeniorRequest" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16433)
-- Name: Station; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Station" (
    "Location" "char" NOT NULL,
    "Description" "char"[]
);


ALTER TABLE public."Station" OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16413)
-- Name: Subscription; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Subscription" (
    "Status" "char"[],
    "ExpiryDate" date,
    "DateOfPurchase" date,
    "Price" double precision,
    "Duration" date
);


ALTER TABLE public."Subscription" OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16418)
-- Name: Ticket; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Ticket" (
    "Status" "char"[],
    "ExpiryDate" date,
    "DateOfPurchase" date,
    "Ticket_ID" bigint NOT NULL,
    "User_ID" bigint NOT NULL
);


ALTER TABLE public."Ticket" OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 16406)
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    "SSN" "char"[] NOT NULL,
    "BirthDate" date,
    "PhoneNumber" character varying(11)[],
    "UserType" "char"[],
    "Gender" "char"[],
    "Age" bigint,
    "Password" "char"[] NOT NULL,
    "Email" "char"[] NOT NULL,
    "UserName" "char"[] NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- TOC entry 3352 (class 0 OID 16438)
-- Dependencies: 220
-- Data for Name: Admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Admin" ("Username", "Email", "Password") FROM stdin;
\.


--
-- TOC entry 3350 (class 0 OID 16428)
-- Dependencies: 218
-- Data for Name: Refund_Request; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Refund_Request" ("Request_State", "Description", "Ticket_ID") FROM stdin;
\.


--
-- TOC entry 3353 (class 0 OID 16445)
-- Dependencies: 221
-- Data for Name: Route; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Route" ("Origin", "Destination", "Price", "Duration", "Distance", "Transfer_Stations") FROM stdin;
\.


--
-- TOC entry 3349 (class 0 OID 16423)
-- Dependencies: 217
-- Data for Name: SeniorRequest; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SeniorRequest" ("Details", "ID_Picture", "Request_State") FROM stdin;
\.


--
-- TOC entry 3351 (class 0 OID 16433)
-- Dependencies: 219
-- Data for Name: Station; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Station" ("Location", "Description") FROM stdin;
\.


--
-- TOC entry 3347 (class 0 OID 16413)
-- Dependencies: 215
-- Data for Name: Subscription; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Subscription" ("Status", "ExpiryDate", "DateOfPurchase", "Price", "Duration") FROM stdin;
\.


--
-- TOC entry 3348 (class 0 OID 16418)
-- Dependencies: 216
-- Data for Name: Ticket; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Ticket" ("Status", "ExpiryDate", "DateOfPurchase", "Ticket_ID", "User_ID") FROM stdin;
\.


--
-- TOC entry 3346 (class 0 OID 16406)
-- Dependencies: 214
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" ("SSN", "BirthDate", "PhoneNumber", "UserType", "Gender", "Age", "Password", "Email", "UserName") FROM stdin;
\.


--
-- TOC entry 3203 (class 2606 OID 16444)
-- Name: Admin Admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Admin"
    ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("Email");


--
-- TOC entry 3201 (class 2606 OID 16412)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("SSN");


-- Completed on 2023-03-17 17:19:36

--
-- PostgreSQL database dump complete
--

