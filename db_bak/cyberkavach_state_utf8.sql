--
-- PostgreSQL database dump
--

\restrict G2L07WfE28QlfkMhvvLyj7JQIj2tMKvfKzH467A2PPQ4DF5hyOErT0A6DsKqViN

-- Dumped from database version 15.17
-- Dumped by pg_dump version 15.17

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

ALTER TABLE ONLY public.users DROP CONSTRAINT users_role_id_fkey;
ALTER TABLE ONLY public.events DROP CONSTRAINT events_created_by_fkey;
ALTER TABLE ONLY public.event_registrations DROP CONSTRAINT event_registrations_user_id_fkey;
ALTER TABLE ONLY public.event_registrations DROP CONSTRAINT event_registrations_event_id_fkey;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_student_id_key;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
ALTER TABLE ONLY public.event_registrations DROP CONSTRAINT unique_event_user_registration;
ALTER TABLE ONLY public.roles DROP CONSTRAINT roles_role_name_key;
ALTER TABLE ONLY public.roles DROP CONSTRAINT roles_pkey;
ALTER TABLE ONLY public.roles DROP CONSTRAINT roles_clearance_level_key;
ALTER TABLE ONLY public.events DROP CONSTRAINT events_pkey;
ALTER TABLE ONLY public.event_registrations DROP CONSTRAINT event_registrations_pkey;
DROP TABLE public.users;
DROP TABLE public.roles;
DROP TABLE public.events;
DROP TABLE public.event_registrations;
DROP EXTENSION "uuid-ossp";
--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: event_registrations; Type: TABLE; Schema: public; Owner: cyber_admin
--

CREATE TABLE public.event_registrations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    event_id uuid,
    user_id uuid,
    registration_status character varying(20) DEFAULT 'CONFIRMED'::character varying,
    registered_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.event_registrations OWNER TO cyber_admin;

--
-- Name: events; Type: TABLE; Schema: public; Owner: cyber_admin
--

CREATE TABLE public.events (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(150) NOT NULL,
    description text,
    event_date timestamp with time zone NOT NULL,
    venue character varying(100) NOT NULL,
    max_capacity integer NOT NULL,
    current_occupancy integer DEFAULT 0,
    ticket_price numeric(10,2) DEFAULT 0.00,
    created_by uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT events_check CHECK ((current_occupancy <= max_capacity)),
    CONSTRAINT events_max_capacity_check CHECK ((max_capacity > 0)),
    CONSTRAINT events_ticket_price_check CHECK ((ticket_price >= 0.00))
);


ALTER TABLE public.events OWNER TO cyber_admin;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: cyber_admin
--

CREATE TABLE public.roles (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    role_name character varying(50) NOT NULL,
    clearance_level integer NOT NULL
);


ALTER TABLE public.roles OWNER TO cyber_admin;

--
-- Name: users; Type: TABLE; Schema: public; Owner: cyber_admin
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    student_id character varying(20),
    full_name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role_id uuid,
    account_status character varying(20) DEFAULT 'PENDING'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_account_status_check CHECK (((account_status)::text = ANY ((ARRAY['PENDING'::character varying, 'ACTIVE'::character varying, 'SUSPENDED'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO cyber_admin;

--
-- Data for Name: event_registrations; Type: TABLE DATA; Schema: public; Owner: cyber_admin
--

COPY public.event_registrations (id, event_id, user_id, registration_status, registered_at) FROM stdin;
f003422d-09d9-486c-8ef7-0eecd3fc7eb3	7b6d6e7a-31bc-4461-9b98-0d8a32ed6a7f	2690965e-c8f9-496a-ac07-690f86ad9937	CONFIRMED	2026-06-03 15:19:07.168795+00
a3ebe424-4009-4b1b-87f0-60a35f4410e2	7b6d6e7a-31bc-4461-9b98-0d8a32ed6a7f	bb053cd6-f7c1-4e4c-a4d3-178dbe84acd2	CONFIRMED	2026-06-03 15:27:53.497408+00
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: cyber_admin
--

COPY public.events (id, title, description, event_date, venue, max_capacity, current_occupancy, ticket_price, created_by, created_at) FROM stdin;
7b6d6e7a-31bc-4461-9b98-0d8a32ed6a7f	Cyber Security CTF - Node 1	Live offensive security competition and vulnerability hunting.	2026-10-15 09:00:00+00	Main Auditorium	2	2	0.00	2690965e-c8f9-496a-ac07-690f86ad9937	2026-06-03 10:24:09.888104+00
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: cyber_admin
--

COPY public.roles (id, role_name, clearance_level) FROM stdin;
ca253769-a40f-4b30-89aa-2f876c4557d2	Super Admin	7
25a38d60-1f19-4684-8ca4-c6b4f61f2b66	Club Coordinator	6
f9266122-db52-4c54-8090-ca0da57952cb	Faculty Coordinator	5
7affc746-b5e0-497b-acea-39773d2cd362	Technical Lead	4
d3c9e0b1-8816-46df-8346-a339b63d0178	Core Committee Member	3
5d89403d-4212-4f0e-b8b1-2f31f992516a	Club Member	2
6a37941a-53f1-4259-b26d-20c00722410a	Public Attendee	1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: cyber_admin
--

COPY public.users (id, student_id, full_name, email, password_hash, role_id, account_status, created_at) FROM stdin;
2690965e-c8f9-496a-ac07-690f86ad9937	D25DCE167	Maharshi Trivedi	maharshi@cyberkavach.local	$2b$10$QYXUzhOGyfAAYeJEyRhtKOc1bM76AgyJkXpa9pO5ENlpeiyA9sHtO	ca253769-a40f-4b30-89aa-2f876c4557d2	ACTIVE	2026-06-02 20:49:29.65367+00
bb053cd6-f7c1-4e4c-a4d3-178dbe84acd2	ALPHA-777	Alice Security	alice@cyberkavach.local	$2b$10$sOCKAPmu5oTEjORKXXqYNOPOQGwgPZG0C8t1ce4EUNY/RXoXyYX0C	5d89403d-4212-4f0e-b8b1-2f31f992516a	ACTIVE	2026-06-03 15:26:12.503634+00
5a19b28f-818a-4633-bf77-13f37dd65445	BETA-888	Bob Vulnerability	bob@cyberkavach.local	$2b$10$BZmakDQo7WBBAeMkN9Yz7uL1UBaCX03ifTp.EP1p1eaLqP4B4CSt2	5d89403d-4212-4f0e-b8b1-2f31f992516a	ACTIVE	2026-06-03 15:26:12.580112+00
\.


--
-- Name: event_registrations event_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: cyber_admin
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT event_registrations_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: cyber_admin
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: roles roles_clearance_level_key; Type: CONSTRAINT; Schema: public; Owner: cyber_admin
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_clearance_level_key UNIQUE (clearance_level);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: cyber_admin
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: roles roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: cyber_admin
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_name_key UNIQUE (role_name);


--
-- Name: event_registrations unique_event_user_registration; Type: CONSTRAINT; Schema: public; Owner: cyber_admin
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT unique_event_user_registration UNIQUE (event_id, user_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: cyber_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: cyber_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_student_id_key; Type: CONSTRAINT; Schema: public; Owner: cyber_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_student_id_key UNIQUE (student_id);


--
-- Name: event_registrations event_registrations_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cyber_admin
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT event_registrations_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: event_registrations event_registrations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cyber_admin
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT event_registrations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: events events_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cyber_admin
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cyber_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict G2L07WfE28QlfkMhvvLyj7JQIj2tMKvfKzH467A2PPQ4DF5hyOErT0A6DsKqViN

