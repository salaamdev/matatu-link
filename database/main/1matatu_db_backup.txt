--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Ubuntu 16.4-1build1)
-- Dumped by pg_dump version 16.4 (Ubuntu 16.4-1build1)

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

--
-- Name: contribution_type_enum; Type: TYPE; Schema: public; Owner: matatu_user
--

CREATE TYPE public.contribution_type_enum AS ENUM (
    'route',
    'stop',
    'matatu'
);


ALTER TYPE public.contribution_type_enum OWNER TO matatu_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: contributions; Type: TABLE; Schema: public; Owner: matatu_user
--

CREATE TABLE public.contributions (
    contribution_id integer NOT NULL,
    user_id integer,
    contribution_type public.contribution_type_enum,
    content text,
    date_submitted timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'pending'::character varying,
    route_id integer,
    stop_id integer,
    matatu_id integer,
    CONSTRAINT contributions_contribution_type_check CHECK (((contribution_type)::text = ANY (ARRAY[('route'::character varying)::text, ('stop'::character varying)::text, ('matatu'::character varying)::text]))),
    CONSTRAINT contributions_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[])))
);


ALTER TABLE public.contributions OWNER TO matatu_user;

--
-- Name: contributions_contribution_id_seq; Type: SEQUENCE; Schema: public; Owner: matatu_user
--

CREATE SEQUENCE public.contributions_contribution_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contributions_contribution_id_seq OWNER TO matatu_user;

--
-- Name: contributions_contribution_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: matatu_user
--

ALTER SEQUENCE public.contributions_contribution_id_seq OWNED BY public.contributions.contribution_id;


--
-- Name: fares; Type: TABLE; Schema: public; Owner: matatu_user
--

CREATE TABLE public.fares (
    fare_id integer NOT NULL,
    user_id integer,
    matatu_id integer,
    route_id integer,
    amount numeric(10,2),
    payment_method character varying(20),
    date_paid timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    transaction_reference character varying(100),
    payment_status character varying(20) DEFAULT 'pending'::character varying,
    payment_provider character varying(50),
    CONSTRAINT fares_payment_method_check CHECK (((payment_method)::text = ANY ((ARRAY['cash'::character varying, 'M-Pesa'::character varying, 'card'::character varying])::text[]))),
    CONSTRAINT fares_payment_status_check CHECK (((payment_status)::text = ANY ((ARRAY['pending'::character varying, 'completed'::character varying, 'failed'::character varying])::text[])))
);


ALTER TABLE public.fares OWNER TO matatu_user;

--
-- Name: fares_fare_id_seq; Type: SEQUENCE; Schema: public; Owner: matatu_user
--

CREATE SEQUENCE public.fares_fare_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fares_fare_id_seq OWNER TO matatu_user;

--
-- Name: fares_fare_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: matatu_user
--

ALTER SEQUENCE public.fares_fare_id_seq OWNED BY public.fares.fare_id;


--
-- Name: matatu_locations; Type: TABLE; Schema: public; Owner: matatu_user
--

CREATE TABLE public.matatu_locations (
    location_id bigint NOT NULL,
    matatu_id integer,
    latitude numeric(10,8),
    longitude numeric(11,8),
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.matatu_locations OWNER TO matatu_user;

--
-- Name: matatu_locations_location_id_seq; Type: SEQUENCE; Schema: public; Owner: matatu_user
--

CREATE SEQUENCE public.matatu_locations_location_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.matatu_locations_location_id_seq OWNER TO matatu_user;

--
-- Name: matatu_locations_location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: matatu_user
--

ALTER SEQUENCE public.matatu_locations_location_id_seq OWNED BY public.matatu_locations.location_id;


--
-- Name: matatus; Type: TABLE; Schema: public; Owner: matatu_user
--

CREATE TABLE public.matatus (
    matatu_id integer NOT NULL,
    operator_id integer,
    registration_number character varying(20) NOT NULL,
    capacity integer,
    route_id integer,
    current_status character varying(20) DEFAULT 'active'::character varying,
    model character varying(50),
    make character varying(50),
    year integer,
    CONSTRAINT chk_current_status CHECK (((current_status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying, 'maintenance'::character varying])::text[])))
);


ALTER TABLE public.matatus OWNER TO matatu_user;

--
-- Name: matatus_matatu_id_seq; Type: SEQUENCE; Schema: public; Owner: matatu_user
--

CREATE SEQUENCE public.matatus_matatu_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.matatus_matatu_id_seq OWNER TO matatu_user;

--
-- Name: matatus_matatu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: matatu_user
--

ALTER SEQUENCE public.matatus_matatu_id_seq OWNED BY public.matatus.matatu_id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: matatu_user
--

CREATE TABLE public.notifications (
    notification_id integer NOT NULL,
    user_id integer,
    notification_type character varying(50),
    content text,
    is_read boolean DEFAULT false,
    date_sent timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notifications OWNER TO matatu_user;

--
-- Name: notifications_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: matatu_user
--

CREATE SEQUENCE public.notifications_notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_notification_id_seq OWNER TO matatu_user;

--
-- Name: notifications_notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: matatu_user
--

ALTER SEQUENCE public.notifications_notification_id_seq OWNED BY public.notifications.notification_id;


--
-- Name: operators; Type: TABLE; Schema: public; Owner: matatu_user
--

CREATE TABLE public.operators (
    operator_id integer NOT NULL,
    name character varying(100) NOT NULL,
    contact_info character varying(255),
    address character varying(255),
    user_id integer
);


ALTER TABLE public.operators OWNER TO matatu_user;

--
-- Name: operators_operator_id_seq; Type: SEQUENCE; Schema: public; Owner: matatu_user
--

CREATE SEQUENCE public.operators_operator_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.operators_operator_id_seq OWNER TO matatu_user;

--
-- Name: operators_operator_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: matatu_user
--

ALTER SEQUENCE public.operators_operator_id_seq OWNED BY public.operators.operator_id;


--
-- Name: reports; Type: TABLE; Schema: public; Owner: matatu_user
--

CREATE TABLE public.reports (
    report_id integer NOT NULL,
    user_id integer,
    matatu_id integer,
    route_id integer,
    report_type character varying(20),
    description text,
    date_reported timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'pending'::character varying,
    CONSTRAINT reports_report_type_check CHECK (((report_type)::text = ANY ((ARRAY['safety'::character varying, 'security'::character varying, 'other'::character varying])::text[]))),
    CONSTRAINT reports_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'reviewed'::character varying, 'resolved'::character varying])::text[])))
);


ALTER TABLE public.reports OWNER TO matatu_user;

--
-- Name: reports_report_id_seq; Type: SEQUENCE; Schema: public; Owner: matatu_user
--

CREATE SEQUENCE public.reports_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reports_report_id_seq OWNER TO matatu_user;

--
-- Name: reports_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: matatu_user
--

ALTER SEQUENCE public.reports_report_id_seq OWNED BY public.reports.report_id;


--
-- Name: route_stops; Type: TABLE; Schema: public; Owner: matatu_user
--

CREATE TABLE public.route_stops (
    route_id integer NOT NULL,
    stop_id integer NOT NULL,
    stop_order integer
);


ALTER TABLE public.route_stops OWNER TO matatu_user;

--
-- Name: routes; Type: TABLE; Schema: public; Owner: matatu_user
--

CREATE TABLE public.routes (
    route_id integer NOT NULL,
    route_name character varying(100) NOT NULL,
    description text,
    fare numeric(10,2),
    is_active boolean DEFAULT true
);


ALTER TABLE public.routes OWNER TO matatu_user;

--
-- Name: routes_route_id_seq; Type: SEQUENCE; Schema: public; Owner: matatu_user
--

CREATE SEQUENCE public.routes_route_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.routes_route_id_seq OWNER TO matatu_user;

--
-- Name: routes_route_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: matatu_user
--

ALTER SEQUENCE public.routes_route_id_seq OWNED BY public.routes.route_id;


--
-- Name: stops; Type: TABLE; Schema: public; Owner: matatu_user
--

CREATE TABLE public.stops (
    stop_id integer NOT NULL,
    stop_name character varying(100) NOT NULL,
    latitude numeric(10,8),
    longitude numeric(11,8),
    description text
);


ALTER TABLE public.stops OWNER TO matatu_user;

--
-- Name: stops_stop_id_seq; Type: SEQUENCE; Schema: public; Owner: matatu_user
--

CREATE SEQUENCE public.stops_stop_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stops_stop_id_seq OWNER TO matatu_user;

--
-- Name: stops_stop_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: matatu_user
--

ALTER SEQUENCE public.stops_stop_id_seq OWNED BY public.stops.stop_id;


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: matatu_user
--

CREATE TABLE public.user_roles (
    role_id integer NOT NULL,
    role_name character varying(20) NOT NULL
);


ALTER TABLE public.user_roles OWNER TO matatu_user;

--
-- Name: user_roles_role_id_seq; Type: SEQUENCE; Schema: public; Owner: matatu_user
--

CREATE SEQUENCE public.user_roles_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_roles_role_id_seq OWNER TO matatu_user;

--
-- Name: user_roles_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: matatu_user
--

ALTER SEQUENCE public.user_roles_role_id_seq OWNED BY public.user_roles.role_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: matatu_user
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    phone_number character varying(20),
    date_joined timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    role_id integer,
    is_active boolean DEFAULT true,
    last_login timestamp with time zone,
    profile_picture character varying(255)
);


ALTER TABLE public.users OWNER TO matatu_user;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: matatu_user
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO matatu_user;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: matatu_user
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: votes; Type: TABLE; Schema: public; Owner: matatu_user
--

CREATE TABLE public.votes (
    vote_id integer NOT NULL,
    user_id integer,
    contribution_id integer,
    vote_type character varying(20),
    date_voted timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT votes_vote_type_check CHECK (((vote_type)::text = ANY ((ARRAY['upvote'::character varying, 'downvote'::character varying])::text[])))
);


ALTER TABLE public.votes OWNER TO matatu_user;

--
-- Name: votes_vote_id_seq; Type: SEQUENCE; Schema: public; Owner: matatu_user
--

CREATE SEQUENCE public.votes_vote_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.votes_vote_id_seq OWNER TO matatu_user;

--
-- Name: votes_vote_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: matatu_user
--

ALTER SEQUENCE public.votes_vote_id_seq OWNED BY public.votes.vote_id;


--
-- Name: contributions contribution_id; Type: DEFAULT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.contributions ALTER COLUMN contribution_id SET DEFAULT nextval('public.contributions_contribution_id_seq'::regclass);


--
-- Name: fares fare_id; Type: DEFAULT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.fares ALTER COLUMN fare_id SET DEFAULT nextval('public.fares_fare_id_seq'::regclass);


--
-- Name: matatu_locations location_id; Type: DEFAULT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.matatu_locations ALTER COLUMN location_id SET DEFAULT nextval('public.matatu_locations_location_id_seq'::regclass);


--
-- Name: matatus matatu_id; Type: DEFAULT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.matatus ALTER COLUMN matatu_id SET DEFAULT nextval('public.matatus_matatu_id_seq'::regclass);


--
-- Name: notifications notification_id; Type: DEFAULT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.notifications ALTER COLUMN notification_id SET DEFAULT nextval('public.notifications_notification_id_seq'::regclass);


--
-- Name: operators operator_id; Type: DEFAULT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.operators ALTER COLUMN operator_id SET DEFAULT nextval('public.operators_operator_id_seq'::regclass);


--
-- Name: reports report_id; Type: DEFAULT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.reports ALTER COLUMN report_id SET DEFAULT nextval('public.reports_report_id_seq'::regclass);


--
-- Name: routes route_id; Type: DEFAULT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.routes ALTER COLUMN route_id SET DEFAULT nextval('public.routes_route_id_seq'::regclass);


--
-- Name: stops stop_id; Type: DEFAULT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.stops ALTER COLUMN stop_id SET DEFAULT nextval('public.stops_stop_id_seq'::regclass);


--
-- Name: user_roles role_id; Type: DEFAULT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.user_roles ALTER COLUMN role_id SET DEFAULT nextval('public.user_roles_role_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Name: votes vote_id; Type: DEFAULT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.votes ALTER COLUMN vote_id SET DEFAULT nextval('public.votes_vote_id_seq'::regclass);


--
-- Data for Name: contributions; Type: TABLE DATA; Schema: public; Owner: matatu_user
--

COPY public.contributions (contribution_id, user_id, contribution_type, content, date_submitted, status, route_id, stop_id, matatu_id) FROM stdin;
\.


--
-- Data for Name: fares; Type: TABLE DATA; Schema: public; Owner: matatu_user
--

COPY public.fares (fare_id, user_id, matatu_id, route_id, amount, payment_method, date_paid, transaction_reference, payment_status, payment_provider) FROM stdin;
\.


--
-- Data for Name: matatu_locations; Type: TABLE DATA; Schema: public; Owner: matatu_user
--

COPY public.matatu_locations (location_id, matatu_id, latitude, longitude, "timestamp") FROM stdin;
\.


--
-- Data for Name: matatus; Type: TABLE DATA; Schema: public; Owner: matatu_user
--

COPY public.matatus (matatu_id, operator_id, registration_number, capacity, route_id, current_status, model, make, year) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: matatu_user
--

COPY public.notifications (notification_id, user_id, notification_type, content, is_read, date_sent) FROM stdin;
\.


--
-- Data for Name: operators; Type: TABLE DATA; Schema: public; Owner: matatu_user
--

COPY public.operators (operator_id, name, contact_info, address, user_id) FROM stdin;
\.


--
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: matatu_user
--

COPY public.reports (report_id, user_id, matatu_id, route_id, report_type, description, date_reported, status) FROM stdin;
\.


--
-- Data for Name: route_stops; Type: TABLE DATA; Schema: public; Owner: matatu_user
--

COPY public.route_stops (route_id, stop_id, stop_order) FROM stdin;
\.


--
-- Data for Name: routes; Type: TABLE DATA; Schema: public; Owner: matatu_user
--

COPY public.routes (route_id, route_name, description, fare, is_active) FROM stdin;
\.


--
-- Data for Name: stops; Type: TABLE DATA; Schema: public; Owner: matatu_user
--

COPY public.stops (stop_id, stop_name, latitude, longitude, description) FROM stdin;
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: matatu_user
--

COPY public.user_roles (role_id, role_name) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: matatu_user
--

COPY public.users (user_id, username, email, password_hash, phone_number, date_joined, role_id, is_active, last_login, profile_picture) FROM stdin;
\.


--
-- Data for Name: votes; Type: TABLE DATA; Schema: public; Owner: matatu_user
--

COPY public.votes (vote_id, user_id, contribution_id, vote_type, date_voted) FROM stdin;
\.


--
-- Name: contributions_contribution_id_seq; Type: SEQUENCE SET; Schema: public; Owner: matatu_user
--

SELECT pg_catalog.setval('public.contributions_contribution_id_seq', 1, false);


--
-- Name: fares_fare_id_seq; Type: SEQUENCE SET; Schema: public; Owner: matatu_user
--

SELECT pg_catalog.setval('public.fares_fare_id_seq', 1, false);


--
-- Name: matatu_locations_location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: matatu_user
--

SELECT pg_catalog.setval('public.matatu_locations_location_id_seq', 1, false);


--
-- Name: matatus_matatu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: matatu_user
--

SELECT pg_catalog.setval('public.matatus_matatu_id_seq', 1, false);


--
-- Name: notifications_notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: matatu_user
--

SELECT pg_catalog.setval('public.notifications_notification_id_seq', 1, false);


--
-- Name: operators_operator_id_seq; Type: SEQUENCE SET; Schema: public; Owner: matatu_user
--

SELECT pg_catalog.setval('public.operators_operator_id_seq', 1, false);


--
-- Name: reports_report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: matatu_user
--

SELECT pg_catalog.setval('public.reports_report_id_seq', 1, false);


--
-- Name: routes_route_id_seq; Type: SEQUENCE SET; Schema: public; Owner: matatu_user
--

SELECT pg_catalog.setval('public.routes_route_id_seq', 1, false);


--
-- Name: stops_stop_id_seq; Type: SEQUENCE SET; Schema: public; Owner: matatu_user
--

SELECT pg_catalog.setval('public.stops_stop_id_seq', 1, false);


--
-- Name: user_roles_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: matatu_user
--

SELECT pg_catalog.setval('public.user_roles_role_id_seq', 1, false);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: matatu_user
--

SELECT pg_catalog.setval('public.users_user_id_seq', 1, false);


--
-- Name: votes_vote_id_seq; Type: SEQUENCE SET; Schema: public; Owner: matatu_user
--

SELECT pg_catalog.setval('public.votes_vote_id_seq', 1, false);


--
-- Name: contributions contributions_pkey; Type: CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.contributions
    ADD CONSTRAINT contributions_pkey PRIMARY KEY (contribution_id);


--
-- Name: fares fares_pkey; Type: CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.fares
    ADD CONSTRAINT fares_pkey PRIMARY KEY (fare_id);


--
-- Name: matatu_locations matatu_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.matatu_locations
    ADD CONSTRAINT matatu_locations_pkey PRIMARY KEY (location_id);


--
-- Name: matatus matatus_pkey; Type: CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.matatus
    ADD CONSTRAINT matatus_pkey PRIMARY KEY (matatu_id);


--
-- Name: matatus matatus_registration_number_key; Type: CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.matatus
    ADD CONSTRAINT matatus_registration_number_key UNIQUE (registration_number);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (notification_id);


--
-- Name: operators operators_pkey; Type: CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.operators
    ADD CONSTRAINT operators_pkey PRIMARY KEY (operator_id);


--
-- Name: operators operators_user_id_key; Type: CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.operators
    ADD CONSTRAINT operators_user_id_key UNIQUE (user_id);


--
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (report_id);


--
-- Name: route_stops route_stops_pkey; Type: CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.route_stops
    ADD CONSTRAINT route_stops_pkey PRIMARY KEY (route_id, stop_id);


--
-- Name: routes routes_pkey; Type: CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.routes
    ADD CONSTRAINT routes_pkey PRIMARY KEY (route_id);


--
-- Name: routes routes_route_name_key; Type: CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.routes
    ADD CONSTRAINT routes_route_name_key UNIQUE (route_name);


--
-- Name: stops stops_pkey; Type: CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.stops
    ADD CONSTRAINT stops_pkey PRIMARY KEY (stop_id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (role_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: votes votes_pkey; Type: CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_pkey PRIMARY KEY (vote_id);


--
-- Name: votes votes_user_id_contribution_id_key; Type: CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_user_id_contribution_id_key UNIQUE (user_id, contribution_id);


--
-- Name: idx_matatu_locations_matatu_id_timestamp; Type: INDEX; Schema: public; Owner: matatu_user
--

CREATE INDEX idx_matatu_locations_matatu_id_timestamp ON public.matatu_locations USING btree (matatu_id, "timestamp" DESC);


--
-- Name: idx_stops_stop_name; Type: INDEX; Schema: public; Owner: matatu_user
--

CREATE INDEX idx_stops_stop_name ON public.stops USING btree (stop_name);


--
-- Name: contributions contributions_matatu_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.contributions
    ADD CONSTRAINT contributions_matatu_id_fkey FOREIGN KEY (matatu_id) REFERENCES public.matatus(matatu_id);


--
-- Name: contributions contributions_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.contributions
    ADD CONSTRAINT contributions_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.routes(route_id);


--
-- Name: contributions contributions_stop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.contributions
    ADD CONSTRAINT contributions_stop_id_fkey FOREIGN KEY (stop_id) REFERENCES public.stops(stop_id);


--
-- Name: contributions contributions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.contributions
    ADD CONSTRAINT contributions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: fares fares_matatu_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.fares
    ADD CONSTRAINT fares_matatu_id_fkey FOREIGN KEY (matatu_id) REFERENCES public.matatus(matatu_id);


--
-- Name: fares fares_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.fares
    ADD CONSTRAINT fares_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.routes(route_id);


--
-- Name: fares fares_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.fares
    ADD CONSTRAINT fares_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: matatu_locations matatu_locations_matatu_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.matatu_locations
    ADD CONSTRAINT matatu_locations_matatu_id_fkey FOREIGN KEY (matatu_id) REFERENCES public.matatus(matatu_id);


--
-- Name: matatus matatus_operator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.matatus
    ADD CONSTRAINT matatus_operator_id_fkey FOREIGN KEY (operator_id) REFERENCES public.operators(operator_id) ON DELETE SET NULL;


--
-- Name: matatus matatus_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.matatus
    ADD CONSTRAINT matatus_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.routes(route_id);


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: operators operators_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.operators
    ADD CONSTRAINT operators_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: reports reports_matatu_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_matatu_id_fkey FOREIGN KEY (matatu_id) REFERENCES public.matatus(matatu_id);


--
-- Name: reports reports_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.routes(route_id);


--
-- Name: reports reports_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: route_stops route_stops_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.route_stops
    ADD CONSTRAINT route_stops_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.routes(route_id);


--
-- Name: route_stops route_stops_stop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.route_stops
    ADD CONSTRAINT route_stops_stop_id_fkey FOREIGN KEY (stop_id) REFERENCES public.stops(stop_id);


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.user_roles(role_id);


--
-- Name: votes votes_contribution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_contribution_id_fkey FOREIGN KEY (contribution_id) REFERENCES public.contributions(contribution_id);


--
-- Name: votes votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: matatu_user
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- PostgreSQL database dump complete
--

