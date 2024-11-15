PGDMP          	    	    
    |         	   matatu_db    16.4 (Ubuntu 16.4-1build1)    16.4 (Ubuntu 16.4-1build1) x               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16389 	   matatu_db    DATABASE     u   CREATE DATABASE matatu_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';
    DROP DATABASE matatu_db;
                matatu_user    false            �           1247    16724    contribution_type_enum    TYPE     ]   CREATE TYPE public.contribution_type_enum AS ENUM (
    'route',
    'stop',
    'matatu'
);
 )   DROP TYPE public.contribution_type_enum;
       public          matatu_user    false            �            1259    16576    contributions    TABLE       CREATE TABLE public.contributions (
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
 !   DROP TABLE public.contributions;
       public         heap    matatu_user    false    903            �            1259    16575 !   contributions_contribution_id_seq    SEQUENCE     �   CREATE SEQUENCE public.contributions_contribution_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE public.contributions_contribution_id_seq;
       public          matatu_user    false    231                       0    0 !   contributions_contribution_id_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE public.contributions_contribution_id_seq OWNED BY public.contributions.contribution_id;
          public          matatu_user    false    230            �            1259    16658    fares    TABLE     *  CREATE TABLE public.fares (
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
    DROP TABLE public.fares;
       public         heap    matatu_user    false            �            1259    16657    fares_fare_id_seq    SEQUENCE     �   CREATE SEQUENCE public.fares_fare_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.fares_fare_id_seq;
       public          matatu_user    false    237                       0    0    fares_fare_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.fares_fare_id_seq OWNED BY public.fares.fare_id;
          public          matatu_user    false    236            �            1259    16563    matatu_locations    TABLE     �   CREATE TABLE public.matatu_locations (
    location_id bigint NOT NULL,
    matatu_id integer,
    latitude numeric(10,8),
    longitude numeric(11,8),
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 $   DROP TABLE public.matatu_locations;
       public         heap    matatu_user    false            �            1259    16562     matatu_locations_location_id_seq    SEQUENCE     �   CREATE SEQUENCE public.matatu_locations_location_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE public.matatu_locations_location_id_seq;
       public          matatu_user    false    229                       0    0     matatu_locations_location_id_seq    SEQUENCE OWNED BY     e   ALTER SEQUENCE public.matatu_locations_location_id_seq OWNED BY public.matatu_locations.location_id;
          public          matatu_user    false    228            �            1259    16542    matatus    TABLE       CREATE TABLE public.matatus (
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
    DROP TABLE public.matatus;
       public         heap    matatu_user    false            �            1259    16541    matatus_matatu_id_seq    SEQUENCE     �   CREATE SEQUENCE public.matatus_matatu_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.matatus_matatu_id_seq;
       public          matatu_user    false    227                        0    0    matatus_matatu_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.matatus_matatu_id_seq OWNED BY public.matatus.matatu_id;
          public          matatu_user    false    226            �            1259    16682    notifications    TABLE       CREATE TABLE public.notifications (
    notification_id integer NOT NULL,
    user_id integer,
    notification_type character varying(50),
    content text,
    is_read boolean DEFAULT false,
    date_sent timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 !   DROP TABLE public.notifications;
       public         heap    matatu_user    false            �            1259    16681 !   notifications_notification_id_seq    SEQUENCE     �   CREATE SEQUENCE public.notifications_notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE public.notifications_notification_id_seq;
       public          matatu_user    false    239            !           0    0 !   notifications_notification_id_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE public.notifications_notification_id_seq OWNED BY public.notifications.notification_id;
          public          matatu_user    false    238            �            1259    16398 	   operators    TABLE     �   CREATE TABLE public.operators (
    operator_id integer NOT NULL,
    name character varying(100) NOT NULL,
    contact_info character varying(255),
    address character varying(255),
    user_id integer
);
    DROP TABLE public.operators;
       public         heap    matatu_user    false            �            1259    16397    operators_operator_id_seq    SEQUENCE     �   CREATE SEQUENCE public.operators_operator_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.operators_operator_id_seq;
       public          matatu_user    false    218            "           0    0    operators_operator_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.operators_operator_id_seq OWNED BY public.operators.operator_id;
          public          matatu_user    false    217            �            1259    16630    reports    TABLE     �  CREATE TABLE public.reports (
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
    DROP TABLE public.reports;
       public         heap    matatu_user    false            �            1259    16629    reports_report_id_seq    SEQUENCE     �   CREATE SEQUENCE public.reports_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.reports_report_id_seq;
       public          matatu_user    false    235            #           0    0    reports_report_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.reports_report_id_seq OWNED BY public.reports.report_id;
          public          matatu_user    false    234            �            1259    16441    route_stops    TABLE     y   CREATE TABLE public.route_stops (
    route_id integer NOT NULL,
    stop_id integer NOT NULL,
    stop_order integer
);
    DROP TABLE public.route_stops;
       public         heap    matatu_user    false            �            1259    16421    routes    TABLE     �   CREATE TABLE public.routes (
    route_id integer NOT NULL,
    route_name character varying(100) NOT NULL,
    description text,
    fare numeric(10,2),
    is_active boolean DEFAULT true
);
    DROP TABLE public.routes;
       public         heap    matatu_user    false            �            1259    16420    routes_route_id_seq    SEQUENCE     �   CREATE SEQUENCE public.routes_route_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.routes_route_id_seq;
       public          matatu_user    false    220            $           0    0    routes_route_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.routes_route_id_seq OWNED BY public.routes.route_id;
          public          matatu_user    false    219            �            1259    16433    stops    TABLE     �   CREATE TABLE public.stops (
    stop_id integer NOT NULL,
    stop_name character varying(100) NOT NULL,
    latitude numeric(10,8),
    longitude numeric(11,8),
    description text
);
    DROP TABLE public.stops;
       public         heap    matatu_user    false            �            1259    16432    stops_stop_id_seq    SEQUENCE     �   CREATE SEQUENCE public.stops_stop_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.stops_stop_id_seq;
       public          matatu_user    false    222            %           0    0    stops_stop_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.stops_stop_id_seq OWNED BY public.stops.stop_id;
          public          matatu_user    false    221            �            1259    16391 
   user_roles    TABLE     o   CREATE TABLE public.user_roles (
    role_id integer NOT NULL,
    role_name character varying(20) NOT NULL
);
    DROP TABLE public.user_roles;
       public         heap    matatu_user    false            �            1259    16390    user_roles_role_id_seq    SEQUENCE     �   CREATE SEQUENCE public.user_roles_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.user_roles_role_id_seq;
       public          matatu_user    false    216            &           0    0    user_roles_role_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.user_roles_role_id_seq OWNED BY public.user_roles.role_id;
          public          matatu_user    false    215            �            1259    16522    users    TABLE     �  CREATE TABLE public.users (
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
    DROP TABLE public.users;
       public         heap    matatu_user    false            �            1259    16521    users_user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.users_user_id_seq;
       public          matatu_user    false    225            '           0    0    users_user_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;
          public          matatu_user    false    224            �            1259    16609    votes    TABLE     o  CREATE TABLE public.votes (
    vote_id integer NOT NULL,
    user_id integer,
    contribution_id integer,
    vote_type character varying(20),
    date_voted timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT votes_vote_type_check CHECK (((vote_type)::text = ANY ((ARRAY['upvote'::character varying, 'downvote'::character varying])::text[])))
);
    DROP TABLE public.votes;
       public         heap    matatu_user    false            �            1259    16608    votes_vote_id_seq    SEQUENCE     �   CREATE SEQUENCE public.votes_vote_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.votes_vote_id_seq;
       public          matatu_user    false    233            (           0    0    votes_vote_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.votes_vote_id_seq OWNED BY public.votes.vote_id;
          public          matatu_user    false    232                       2604    16579    contributions contribution_id    DEFAULT     �   ALTER TABLE ONLY public.contributions ALTER COLUMN contribution_id SET DEFAULT nextval('public.contributions_contribution_id_seq'::regclass);
 L   ALTER TABLE public.contributions ALTER COLUMN contribution_id DROP DEFAULT;
       public          matatu_user    false    230    231    231            %           2604    16661    fares fare_id    DEFAULT     n   ALTER TABLE ONLY public.fares ALTER COLUMN fare_id SET DEFAULT nextval('public.fares_fare_id_seq'::regclass);
 <   ALTER TABLE public.fares ALTER COLUMN fare_id DROP DEFAULT;
       public          matatu_user    false    236    237    237                       2604    16566    matatu_locations location_id    DEFAULT     �   ALTER TABLE ONLY public.matatu_locations ALTER COLUMN location_id SET DEFAULT nextval('public.matatu_locations_location_id_seq'::regclass);
 K   ALTER TABLE public.matatu_locations ALTER COLUMN location_id DROP DEFAULT;
       public          matatu_user    false    228    229    229                       2604    16545    matatus matatu_id    DEFAULT     v   ALTER TABLE ONLY public.matatus ALTER COLUMN matatu_id SET DEFAULT nextval('public.matatus_matatu_id_seq'::regclass);
 @   ALTER TABLE public.matatus ALTER COLUMN matatu_id DROP DEFAULT;
       public          matatu_user    false    226    227    227            (           2604    16685    notifications notification_id    DEFAULT     �   ALTER TABLE ONLY public.notifications ALTER COLUMN notification_id SET DEFAULT nextval('public.notifications_notification_id_seq'::regclass);
 L   ALTER TABLE public.notifications ALTER COLUMN notification_id DROP DEFAULT;
       public          matatu_user    false    238    239    239                       2604    16401    operators operator_id    DEFAULT     ~   ALTER TABLE ONLY public.operators ALTER COLUMN operator_id SET DEFAULT nextval('public.operators_operator_id_seq'::regclass);
 D   ALTER TABLE public.operators ALTER COLUMN operator_id DROP DEFAULT;
       public          matatu_user    false    218    217    218            "           2604    16633    reports report_id    DEFAULT     v   ALTER TABLE ONLY public.reports ALTER COLUMN report_id SET DEFAULT nextval('public.reports_report_id_seq'::regclass);
 @   ALTER TABLE public.reports ALTER COLUMN report_id DROP DEFAULT;
       public          matatu_user    false    235    234    235                       2604    16424    routes route_id    DEFAULT     r   ALTER TABLE ONLY public.routes ALTER COLUMN route_id SET DEFAULT nextval('public.routes_route_id_seq'::regclass);
 >   ALTER TABLE public.routes ALTER COLUMN route_id DROP DEFAULT;
       public          matatu_user    false    219    220    220                       2604    16436    stops stop_id    DEFAULT     n   ALTER TABLE ONLY public.stops ALTER COLUMN stop_id SET DEFAULT nextval('public.stops_stop_id_seq'::regclass);
 <   ALTER TABLE public.stops ALTER COLUMN stop_id DROP DEFAULT;
       public          matatu_user    false    222    221    222                       2604    16394    user_roles role_id    DEFAULT     x   ALTER TABLE ONLY public.user_roles ALTER COLUMN role_id SET DEFAULT nextval('public.user_roles_role_id_seq'::regclass);
 A   ALTER TABLE public.user_roles ALTER COLUMN role_id DROP DEFAULT;
       public          matatu_user    false    215    216    216                       2604    16525    users user_id    DEFAULT     n   ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);
 <   ALTER TABLE public.users ALTER COLUMN user_id DROP DEFAULT;
       public          matatu_user    false    224    225    225                        2604    16612    votes vote_id    DEFAULT     n   ALTER TABLE ONLY public.votes ALTER COLUMN vote_id SET DEFAULT nextval('public.votes_vote_id_seq'::regclass);
 <   ALTER TABLE public.votes ALTER COLUMN vote_id DROP DEFAULT;
       public          matatu_user    false    233    232    233                      0    16576    contributions 
   TABLE DATA           �   COPY public.contributions (contribution_id, user_id, contribution_type, content, date_submitted, status, route_id, stop_id, matatu_id) FROM stdin;
    public          matatu_user    false    231   6�                 0    16658    fares 
   TABLE DATA           �   COPY public.fares (fare_id, user_id, matatu_id, route_id, amount, payment_method, date_paid, transaction_reference, payment_status, payment_provider) FROM stdin;
    public          matatu_user    false    237   S�                 0    16563    matatu_locations 
   TABLE DATA           d   COPY public.matatu_locations (location_id, matatu_id, latitude, longitude, "timestamp") FROM stdin;
    public          matatu_user    false    229   p�       
          0    16542    matatus 
   TABLE DATA           �   COPY public.matatus (matatu_id, operator_id, registration_number, capacity, route_id, current_status, model, make, year) FROM stdin;
    public          matatu_user    false    227   ��                 0    16682    notifications 
   TABLE DATA           q   COPY public.notifications (notification_id, user_id, notification_type, content, is_read, date_sent) FROM stdin;
    public          matatu_user    false    239   ��                 0    16398 	   operators 
   TABLE DATA           V   COPY public.operators (operator_id, name, contact_info, address, user_id) FROM stdin;
    public          matatu_user    false    218   Ǟ                 0    16630    reports 
   TABLE DATA           {   COPY public.reports (report_id, user_id, matatu_id, route_id, report_type, description, date_reported, status) FROM stdin;
    public          matatu_user    false    235   �                 0    16441    route_stops 
   TABLE DATA           D   COPY public.route_stops (route_id, stop_id, stop_order) FROM stdin;
    public          matatu_user    false    223   �                 0    16421    routes 
   TABLE DATA           T   COPY public.routes (route_id, route_name, description, fare, is_active) FROM stdin;
    public          matatu_user    false    220   �                 0    16433    stops 
   TABLE DATA           U   COPY public.stops (stop_id, stop_name, latitude, longitude, description) FROM stdin;
    public          matatu_user    false    222   ;�       �          0    16391 
   user_roles 
   TABLE DATA           8   COPY public.user_roles (role_id, role_name) FROM stdin;
    public          matatu_user    false    216   X�                 0    16522    users 
   TABLE DATA           �   COPY public.users (user_id, username, email, password_hash, phone_number, date_joined, role_id, is_active, last_login, profile_picture) FROM stdin;
    public          matatu_user    false    225   u�                 0    16609    votes 
   TABLE DATA           Y   COPY public.votes (vote_id, user_id, contribution_id, vote_type, date_voted) FROM stdin;
    public          matatu_user    false    233   ��       )           0    0 !   contributions_contribution_id_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public.contributions_contribution_id_seq', 1, false);
          public          matatu_user    false    230            *           0    0    fares_fare_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.fares_fare_id_seq', 1, false);
          public          matatu_user    false    236            +           0    0     matatu_locations_location_id_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.matatu_locations_location_id_seq', 1, false);
          public          matatu_user    false    228            ,           0    0    matatus_matatu_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.matatus_matatu_id_seq', 1, false);
          public          matatu_user    false    226            -           0    0 !   notifications_notification_id_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public.notifications_notification_id_seq', 1, false);
          public          matatu_user    false    238            .           0    0    operators_operator_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.operators_operator_id_seq', 1, false);
          public          matatu_user    false    217            /           0    0    reports_report_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.reports_report_id_seq', 1, false);
          public          matatu_user    false    234            0           0    0    routes_route_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.routes_route_id_seq', 1, false);
          public          matatu_user    false    219            1           0    0    stops_stop_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.stops_stop_id_seq', 1, false);
          public          matatu_user    false    221            2           0    0    user_roles_role_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.user_roles_role_id_seq', 1, false);
          public          matatu_user    false    215            3           0    0    users_user_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.users_user_id_seq', 1, false);
          public          matatu_user    false    224            4           0    0    votes_vote_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.votes_vote_id_seq', 1, false);
          public          matatu_user    false    232            P           2606    16587     contributions contributions_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.contributions
    ADD CONSTRAINT contributions_pkey PRIMARY KEY (contribution_id);
 J   ALTER TABLE ONLY public.contributions DROP CONSTRAINT contributions_pkey;
       public            matatu_user    false    231            X           2606    16665    fares fares_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.fares
    ADD CONSTRAINT fares_pkey PRIMARY KEY (fare_id);
 :   ALTER TABLE ONLY public.fares DROP CONSTRAINT fares_pkey;
       public            matatu_user    false    237            N           2606    16569 &   matatu_locations matatu_locations_pkey 
   CONSTRAINT     m   ALTER TABLE ONLY public.matatu_locations
    ADD CONSTRAINT matatu_locations_pkey PRIMARY KEY (location_id);
 P   ALTER TABLE ONLY public.matatu_locations DROP CONSTRAINT matatu_locations_pkey;
       public            matatu_user    false    229            I           2606    16547    matatus matatus_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.matatus
    ADD CONSTRAINT matatus_pkey PRIMARY KEY (matatu_id);
 >   ALTER TABLE ONLY public.matatus DROP CONSTRAINT matatus_pkey;
       public            matatu_user    false    227            K           2606    16549 '   matatus matatus_registration_number_key 
   CONSTRAINT     q   ALTER TABLE ONLY public.matatus
    ADD CONSTRAINT matatus_registration_number_key UNIQUE (registration_number);
 Q   ALTER TABLE ONLY public.matatus DROP CONSTRAINT matatus_registration_number_key;
       public            matatu_user    false    227            Z           2606    16691     notifications notifications_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (notification_id);
 J   ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_pkey;
       public            matatu_user    false    239            6           2606    16405    operators operators_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.operators
    ADD CONSTRAINT operators_pkey PRIMARY KEY (operator_id);
 B   ALTER TABLE ONLY public.operators DROP CONSTRAINT operators_pkey;
       public            matatu_user    false    218            8           2606    16715    operators operators_user_id_key 
   CONSTRAINT     ]   ALTER TABLE ONLY public.operators
    ADD CONSTRAINT operators_user_id_key UNIQUE (user_id);
 I   ALTER TABLE ONLY public.operators DROP CONSTRAINT operators_user_id_key;
       public            matatu_user    false    218            V           2606    16641    reports reports_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (report_id);
 >   ALTER TABLE ONLY public.reports DROP CONSTRAINT reports_pkey;
       public            matatu_user    false    235            A           2606    16445    route_stops route_stops_pkey 
   CONSTRAINT     i   ALTER TABLE ONLY public.route_stops
    ADD CONSTRAINT route_stops_pkey PRIMARY KEY (route_id, stop_id);
 F   ALTER TABLE ONLY public.route_stops DROP CONSTRAINT route_stops_pkey;
       public            matatu_user    false    223    223            :           2606    16429    routes routes_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.routes
    ADD CONSTRAINT routes_pkey PRIMARY KEY (route_id);
 <   ALTER TABLE ONLY public.routes DROP CONSTRAINT routes_pkey;
       public            matatu_user    false    220            <           2606    16431    routes routes_route_name_key 
   CONSTRAINT     ]   ALTER TABLE ONLY public.routes
    ADD CONSTRAINT routes_route_name_key UNIQUE (route_name);
 F   ALTER TABLE ONLY public.routes DROP CONSTRAINT routes_route_name_key;
       public            matatu_user    false    220            ?           2606    16440    stops stops_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.stops
    ADD CONSTRAINT stops_pkey PRIMARY KEY (stop_id);
 :   ALTER TABLE ONLY public.stops DROP CONSTRAINT stops_pkey;
       public            matatu_user    false    222            4           2606    16396    user_roles user_roles_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (role_id);
 D   ALTER TABLE ONLY public.user_roles DROP CONSTRAINT user_roles_pkey;
       public            matatu_user    false    216            C           2606    16533    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            matatu_user    false    225            E           2606    16529    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            matatu_user    false    225            G           2606    16531    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public            matatu_user    false    225            R           2606    16616    votes votes_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_pkey PRIMARY KEY (vote_id);
 :   ALTER TABLE ONLY public.votes DROP CONSTRAINT votes_pkey;
       public            matatu_user    false    233            T           2606    16618 '   votes votes_user_id_contribution_id_key 
   CONSTRAINT     v   ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_user_id_contribution_id_key UNIQUE (user_id, contribution_id);
 Q   ALTER TABLE ONLY public.votes DROP CONSTRAINT votes_user_id_contribution_id_key;
       public            matatu_user    false    233    233            L           1259    16712 (   idx_matatu_locations_matatu_id_timestamp    INDEX     |   CREATE INDEX idx_matatu_locations_matatu_id_timestamp ON public.matatu_locations USING btree (matatu_id, "timestamp" DESC);
 <   DROP INDEX public.idx_matatu_locations_matatu_id_timestamp;
       public            matatu_user    false    229    229            =           1259    16713    idx_stops_stop_name    INDEX     J   CREATE INDEX idx_stops_stop_name ON public.stops USING btree (stop_name);
 '   DROP INDEX public.idx_stops_stop_name;
       public            matatu_user    false    222            b           2606    16603 *   contributions contributions_matatu_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.contributions
    ADD CONSTRAINT contributions_matatu_id_fkey FOREIGN KEY (matatu_id) REFERENCES public.matatus(matatu_id);
 T   ALTER TABLE ONLY public.contributions DROP CONSTRAINT contributions_matatu_id_fkey;
       public          matatu_user    false    227    3401    231            c           2606    16593 )   contributions contributions_route_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.contributions
    ADD CONSTRAINT contributions_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.routes(route_id);
 S   ALTER TABLE ONLY public.contributions DROP CONSTRAINT contributions_route_id_fkey;
       public          matatu_user    false    3386    220    231            d           2606    16598 (   contributions contributions_stop_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.contributions
    ADD CONSTRAINT contributions_stop_id_fkey FOREIGN KEY (stop_id) REFERENCES public.stops(stop_id);
 R   ALTER TABLE ONLY public.contributions DROP CONSTRAINT contributions_stop_id_fkey;
       public          matatu_user    false    231    3391    222            e           2606    16588 (   contributions contributions_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.contributions
    ADD CONSTRAINT contributions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 R   ALTER TABLE ONLY public.contributions DROP CONSTRAINT contributions_user_id_fkey;
       public          matatu_user    false    225    3397    231            k           2606    16671    fares fares_matatu_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.fares
    ADD CONSTRAINT fares_matatu_id_fkey FOREIGN KEY (matatu_id) REFERENCES public.matatus(matatu_id);
 D   ALTER TABLE ONLY public.fares DROP CONSTRAINT fares_matatu_id_fkey;
       public          matatu_user    false    227    237    3401            l           2606    16676    fares fares_route_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.fares
    ADD CONSTRAINT fares_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.routes(route_id);
 C   ALTER TABLE ONLY public.fares DROP CONSTRAINT fares_route_id_fkey;
       public          matatu_user    false    220    3386    237            m           2606    16666    fares fares_user_id_fkey    FK CONSTRAINT     |   ALTER TABLE ONLY public.fares
    ADD CONSTRAINT fares_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 B   ALTER TABLE ONLY public.fares DROP CONSTRAINT fares_user_id_fkey;
       public          matatu_user    false    237    225    3397            a           2606    16570 0   matatu_locations matatu_locations_matatu_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matatu_locations
    ADD CONSTRAINT matatu_locations_matatu_id_fkey FOREIGN KEY (matatu_id) REFERENCES public.matatus(matatu_id);
 Z   ALTER TABLE ONLY public.matatu_locations DROP CONSTRAINT matatu_locations_matatu_id_fkey;
       public          matatu_user    false    229    227    3401            _           2606    16750     matatus matatus_operator_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matatus
    ADD CONSTRAINT matatus_operator_id_fkey FOREIGN KEY (operator_id) REFERENCES public.operators(operator_id) ON DELETE SET NULL;
 J   ALTER TABLE ONLY public.matatus DROP CONSTRAINT matatus_operator_id_fkey;
       public          matatu_user    false    218    227    3382            `           2606    16555    matatus matatus_route_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matatus
    ADD CONSTRAINT matatus_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.routes(route_id);
 G   ALTER TABLE ONLY public.matatus DROP CONSTRAINT matatus_route_id_fkey;
       public          matatu_user    false    220    227    3386            n           2606    16692 (   notifications notifications_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 R   ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_user_id_fkey;
       public          matatu_user    false    239    225    3397            [           2606    16716     operators operators_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.operators
    ADD CONSTRAINT operators_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 J   ALTER TABLE ONLY public.operators DROP CONSTRAINT operators_user_id_fkey;
       public          matatu_user    false    225    3397    218            h           2606    16647    reports reports_matatu_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_matatu_id_fkey FOREIGN KEY (matatu_id) REFERENCES public.matatus(matatu_id);
 H   ALTER TABLE ONLY public.reports DROP CONSTRAINT reports_matatu_id_fkey;
       public          matatu_user    false    227    235    3401            i           2606    16652    reports reports_route_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.routes(route_id);
 G   ALTER TABLE ONLY public.reports DROP CONSTRAINT reports_route_id_fkey;
       public          matatu_user    false    3386    220    235            j           2606    16642    reports reports_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 F   ALTER TABLE ONLY public.reports DROP CONSTRAINT reports_user_id_fkey;
       public          matatu_user    false    235    3397    225            \           2606    16446 %   route_stops route_stops_route_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.route_stops
    ADD CONSTRAINT route_stops_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.routes(route_id);
 O   ALTER TABLE ONLY public.route_stops DROP CONSTRAINT route_stops_route_id_fkey;
       public          matatu_user    false    220    223    3386            ]           2606    16451 $   route_stops route_stops_stop_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.route_stops
    ADD CONSTRAINT route_stops_stop_id_fkey FOREIGN KEY (stop_id) REFERENCES public.stops(stop_id);
 N   ALTER TABLE ONLY public.route_stops DROP CONSTRAINT route_stops_stop_id_fkey;
       public          matatu_user    false    223    3391    222            ^           2606    16534    users users_role_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.user_roles(role_id);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_role_id_fkey;
       public          matatu_user    false    225    216    3380            f           2606    16624     votes votes_contribution_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_contribution_id_fkey FOREIGN KEY (contribution_id) REFERENCES public.contributions(contribution_id);
 J   ALTER TABLE ONLY public.votes DROP CONSTRAINT votes_contribution_id_fkey;
       public          matatu_user    false    233    231    3408            g           2606    16619    votes votes_user_id_fkey    FK CONSTRAINT     |   ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 B   ALTER TABLE ONLY public.votes DROP CONSTRAINT votes_user_id_fkey;
       public          matatu_user    false    233    3397    225                  x������ � �            x������ � �            x������ � �      
      x������ � �            x������ � �            x������ � �            x������ � �            x������ � �            x������ � �            x������ � �      �      x������ � �            x������ � �            x������ � �     