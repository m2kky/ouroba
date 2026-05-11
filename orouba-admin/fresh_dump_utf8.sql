--
-- PostgreSQL database dump
--

\restrict ma2j0TUj85pgaqEHapkZHet3D4vz3c8TJU0EXOge98dYPdSSr2flFAx2w77rqS9

-- Dumped from database version 16.12
-- Dumped by pg_dump version 16.13 (Debian 16.13-1.pgdg13+1)

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
-- Name: BannerType; Type: TYPE; Schema: public; Owner: orouba_user
--

CREATE TYPE public."BannerType" AS ENUM (
    'image',
    'video'
);


ALTER TYPE public."BannerType" OWNER TO orouba_user;

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: orouba_user
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
);


ALTER TYPE public."OrderStatus" OWNER TO orouba_user;

--
-- Name: RequestStatus; Type: TYPE; Schema: public; Owner: orouba_user
--

CREATE TYPE public."RequestStatus" AS ENUM (
    'UNREAD',
    'READ',
    'ARCHIVED'
);


ALTER TYPE public."RequestStatus" OWNER TO orouba_user;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: orouba_user
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'ADMIN',
    'EDITOR'
);


ALTER TYPE public."Role" OWNER TO orouba_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Banner; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."Banner" (
    id text NOT NULL,
    "titleEn" text NOT NULL,
    "titleAr" text NOT NULL,
    type public."BannerType" DEFAULT 'image'::public."BannerType" NOT NULL,
    image text,
    "imageEn" text,
    "videoLink" text,
    "videoLinkEn" text,
    "smallImg" text,
    "smallImgEn" text,
    "smallVideo" text,
    "smallVideoEn" text,
    number integer DEFAULT 999 NOT NULL,
    "isHidden" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Banner" OWNER TO orouba_user;

--
-- Name: Brand; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."Brand" (
    id text NOT NULL,
    "nameEn" text NOT NULL,
    "nameAr" text NOT NULL,
    number integer DEFAULT 999 NOT NULL,
    image text,
    "imageMain" text,
    "imageSmall" text,
    "imageSmallMain" text,
    "colorBrand" text,
    "colorHover" text,
    "descriptionEn" text,
    "descriptionAr" text,
    "isHidden" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Brand" OWNER TO orouba_user;

--
-- Name: Building; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."Building" (
    id text NOT NULL,
    "titleEn" text,
    "titleAr" text,
    "descriptionEn" text,
    "descriptionAr" text,
    image text,
    "isHidden" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Building" OWNER TO orouba_user;

--
-- Name: CareerRequest; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."CareerRequest" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    "position" text,
    "resumeUrl" text,
    status public."RequestStatus" DEFAULT 'UNREAD'::public."RequestStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    message text
);


ALTER TABLE public."CareerRequest" OWNER TO orouba_user;

--
-- Name: CartItem; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."CartItem" (
    id text NOT NULL,
    "sessionId" text NOT NULL,
    "userId" text,
    "productId" text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CartItem" OWNER TO orouba_user;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."Category" (
    id text NOT NULL,
    "nameEn" text NOT NULL,
    "nameAr" text NOT NULL,
    "descriptionEn" text,
    "descriptionAr" text,
    image text,
    "imageEn" text,
    number integer DEFAULT 999 NOT NULL,
    "isHidden" boolean DEFAULT false NOT NULL,
    "brandId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Category" OWNER TO orouba_user;

--
-- Name: CategoryProduct; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."CategoryProduct" (
    id text NOT NULL,
    "categoryId" text NOT NULL,
    "productId" text NOT NULL,
    "isHidden" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CategoryProduct" OWNER TO orouba_user;

--
-- Name: CategoryType; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."CategoryType" (
    id text NOT NULL,
    "titleEn" text NOT NULL,
    "titleAr" text NOT NULL,
    "descriptionEn" text,
    "descriptionAr" text,
    image text,
    number integer DEFAULT 999 NOT NULL,
    "isHidden" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CategoryType" OWNER TO orouba_user;

--
-- Name: CategoryTypeCategory; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."CategoryTypeCategory" (
    id text NOT NULL,
    "categoryId" text NOT NULL,
    "categoryTypeId" text NOT NULL,
    image text,
    number integer DEFAULT 999 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CategoryTypeCategory" OWNER TO orouba_user;

--
-- Name: Certificate; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."Certificate" (
    id text NOT NULL,
    image text NOT NULL,
    "isHidden" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Certificate" OWNER TO orouba_user;

--
-- Name: CollaborateRequest; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."CollaborateRequest" (
    id text NOT NULL,
    "firstName" text,
    "lastName" text,
    name text,
    email text NOT NULL,
    phone text,
    status public."RequestStatus" DEFAULT 'UNREAD'::public."RequestStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    message text
);


ALTER TABLE public."CollaborateRequest" OWNER TO orouba_user;

--
-- Name: ContactRequest; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."ContactRequest" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    message text,
    status public."RequestStatus" DEFAULT 'UNREAD'::public."RequestStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ContactRequest" OWNER TO orouba_user;

--
-- Name: Continent; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."Continent" (
    id text NOT NULL,
    "nameEn" text,
    "nameAr" text,
    "isHidden" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Continent" OWNER TO orouba_user;

--
-- Name: Country; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."Country" (
    id text NOT NULL,
    "nameEn" text,
    "nameAr" text,
    "continentId" text NOT NULL,
    "isHidden" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Country" OWNER TO orouba_user;

--
-- Name: Feature; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."Feature" (
    id text NOT NULL,
    "titleEn" text,
    "titleAr" text,
    "descriptionEn" text,
    "descriptionAr" text,
    image text,
    "isHidden" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Feature" OWNER TO orouba_user;

--
-- Name: Food; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."Food" (
    id text NOT NULL,
    "nameEn" text,
    "nameAr" text,
    image text,
    number integer DEFAULT 999 NOT NULL,
    "isHidden" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Food" OWNER TO orouba_user;

--
-- Name: Order; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    "userId" text,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    "totalAmount" double precision DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Order" OWNER TO orouba_user;

--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."OrderItem" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "productId" text NOT NULL,
    quantity integer NOT NULL,
    price double precision DEFAULT 0 NOT NULL
);


ALTER TABLE public."OrderItem" OWNER TO orouba_user;

--
-- Name: Product; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."Product" (
    id text NOT NULL,
    "nameEn" text NOT NULL,
    "nameAr" text NOT NULL,
    "descriptionEn" text,
    "descriptionAr" text,
    color text DEFAULT '#ffffff'::text NOT NULL,
    number integer DEFAULT 999 NOT NULL,
    "isHidden" boolean DEFAULT false NOT NULL,
    "typeId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Product" OWNER TO orouba_user;

--
-- Name: ProductImage; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."ProductImage" (
    id text NOT NULL,
    "productId" text NOT NULL,
    url text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ProductImage" OWNER TO orouba_user;

--
-- Name: ProductSocial; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."ProductSocial" (
    id text NOT NULL,
    image text,
    "productId" text NOT NULL,
    "isHidden" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ProductSocial" OWNER TO orouba_user;

--
-- Name: ProductType; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."ProductType" (
    id text NOT NULL,
    "nameEn" text NOT NULL,
    "nameAr" text NOT NULL,
    "isHidden" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ProductType" OWNER TO orouba_user;

--
-- Name: ProductionStep; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."ProductionStep" (
    id text NOT NULL,
    "textEn" text NOT NULL,
    "textAr" text NOT NULL,
    number integer DEFAULT 999 NOT NULL,
    image text,
    "isHidden" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ProductionStep" OWNER TO orouba_user;

--
-- Name: Recipe; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."Recipe" (
    id text NOT NULL,
    "nameEn" text,
    "nameAr" text,
    "descriptionEn" text,
    "descriptionAr" text,
    "videoLink" text,
    "internalImage" text,
    number integer DEFAULT 999 NOT NULL,
    "isHidden" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Recipe" OWNER TO orouba_user;

--
-- Name: RecipeCategory; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."RecipeCategory" (
    id text NOT NULL,
    "nameEn" text NOT NULL,
    "nameAr" text NOT NULL,
    image text,
    number integer DEFAULT 999 NOT NULL,
    "isHidden" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."RecipeCategory" OWNER TO orouba_user;

--
-- Name: RecipeCategoryFood; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."RecipeCategoryFood" (
    id text NOT NULL,
    "recipeCategoryId" text NOT NULL,
    "foodId" text NOT NULL
);


ALTER TABLE public."RecipeCategoryFood" OWNER TO orouba_user;

--
-- Name: RecipeFood; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."RecipeFood" (
    id text NOT NULL,
    "recipeId" text NOT NULL,
    "foodId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."RecipeFood" OWNER TO orouba_user;

--
-- Name: RecipeImage; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."RecipeImage" (
    id text NOT NULL,
    "recipeId" text NOT NULL,
    url text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."RecipeImage" OWNER TO orouba_user;

--
-- Name: RecipeProperty; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."RecipeProperty" (
    id text NOT NULL,
    "recipeId" text NOT NULL,
    icon text,
    "titleEn" text NOT NULL,
    "titleAr" text NOT NULL,
    "textEn" text NOT NULL,
    "textAr" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."RecipeProperty" OWNER TO orouba_user;

--
-- Name: RecipeStep; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."RecipeStep" (
    id text NOT NULL,
    "recipeId" text NOT NULL,
    "stepEn" text NOT NULL,
    "stepAr" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."RecipeStep" OWNER TO orouba_user;

--
-- Name: RecommendedRecipe; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."RecommendedRecipe" (
    id text NOT NULL,
    "productId" text NOT NULL,
    "recipeId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."RecommendedRecipe" OWNER TO orouba_user;

--
-- Name: SectionText; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."SectionText" (
    id text NOT NULL,
    "titleEn" text,
    "titleAr" text,
    "textEn" text,
    "textAr" text,
    number integer DEFAULT 999 NOT NULL,
    "isHidden" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SectionText" OWNER TO orouba_user;

--
-- Name: SiteSetting; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."SiteSetting" (
    id text NOT NULL,
    key text NOT NULL,
    "valueEn" text,
    "valueAr" text,
    description text,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SiteSetting" OWNER TO orouba_user;

--
-- Name: Social; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."Social" (
    id text NOT NULL,
    image text,
    link text NOT NULL,
    "isHidden" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Social" OWNER TO orouba_user;

--
-- Name: SocialParent; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."SocialParent" (
    id text NOT NULL,
    image text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SocialParent" OWNER TO orouba_user;

--
-- Name: Standard; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."Standard" (
    id text NOT NULL,
    "descriptionEn" text NOT NULL,
    "descriptionAr" text NOT NULL,
    image text,
    "isHidden" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Standard" OWNER TO orouba_user;

--
-- Name: SystemLog; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."SystemLog" (
    id text NOT NULL,
    "userId" text,
    action text,
    date text,
    ip text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SystemLog" OWNER TO orouba_user;

--
-- Name: User; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text,
    email text,
    "emailVerified" timestamp(3) without time zone,
    image text,
    password text,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    permissions text[] DEFAULT ARRAY[]::text[],
    phone text
);


ALTER TABLE public."User" OWNER TO orouba_user;

--
-- Name: Value; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."Value" (
    id text NOT NULL,
    "titleEn" text,
    "titleAr" text,
    "descriptionEn" text,
    "descriptionAr" text,
    image text,
    "isHidden" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Value" OWNER TO orouba_user;

--
-- Name: WhyChooseUs; Type: TABLE; Schema: public; Owner: orouba_user
--

CREATE TABLE public."WhyChooseUs" (
    id text NOT NULL,
    "descriptionEn" text NOT NULL,
    "descriptionAr" text NOT NULL,
    "isHidden" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."WhyChooseUs" OWNER TO orouba_user;

--
-- Data for Name: Banner; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."Banner" (id, "titleEn", "titleAr", type, image, "imageEn", "videoLink", "videoLinkEn", "smallImg", "smallImgEn", "smallVideo", "smallVideoEn", number, "isHidden", "createdAt", "updatedAt") FROM stdin;
cmp0xcg4y0062vzjou9ppdqf3	Orouba for Food Industry Co.	العروبة لصناعة الغذاء	video	\N	\N	https://camp-coding.site/eloroba/storage/app/images/1.mp4	\N	\N	\N	\N	\N	1	f	2026-05-11 08:12:56.626	2026-05-11 08:12:56.626
cmp0xcg4y0063vzjobsx8x7d0	Quality You Can Trust	جودة تثق بها	image	https://camp-coding.site/eloroba/storage/app/images/banner-2.png	\N	\N	\N	\N	\N	\N	\N	2	f	2026-05-11 08:12:56.626	2026-05-11 08:12:56.626
\.


--
-- Data for Name: Brand; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."Brand" (id, "nameEn", "nameAr", number, image, "imageMain", "imageSmall", "imageSmallMain", "colorBrand", "colorHover", "descriptionEn", "descriptionAr", "isHidden", "createdAt", "updatedAt") FROM stdin;
5	Basma	بسمة	999	https://camp-coding.site/eloroba/storage/app/images/yeaQYQUjSi9l9iThgxvahIGd8khBLpWoE6KbDznW.png	https://camp-coding.site/eloroba/storage/app/images/yeaQYQUjSi9l9iThgxvahIGd8khBLpWoE6KbDznW.png	\N	\N	#ffffff	#eeeeee			f	2026-05-11 08:12:54.556	2026-05-11 08:12:54.556
8	Bap Bites	باببيتس	999	https://camp-coding.site/eloroba/storage/app/images/IUCTGnDAvK2nTDvkbXysdBfNmCrJgh9Z4OBRh0Xl.png	https://camp-coding.site/eloroba/storage/app/images/IUCTGnDAvK2nTDvkbXysdBfNmCrJgh9Z4OBRh0Xl.png	\N	\N	#ffffff	#eeeeee			f	2026-05-11 08:12:55.878	2026-05-11 08:12:55.878
7	Farida	فريدة	999	https://camp-coding.site/eloroba/storage/app/images/dkLxVxvEFQ2yzgnKAalEmGfbN6CzMkKEUSThjPvq.jpg	https://camp-coding.site/eloroba/storage/app/images/dkLxVxvEFQ2yzgnKAalEmGfbN6CzMkKEUSThjPvq.jpg	\N	\N	#ffffff	#eeeeee			f	2026-05-11 08:12:55.893	2026-05-11 08:12:55.893
\.


--
-- Data for Name: Building; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."Building" (id, "titleEn", "titleAr", "descriptionEn", "descriptionAr", image, "isHidden", "createdAt", "updatedAt") FROM stdin;
cmp0xcgbo006yvzjo32624byf	Main Factory	المصنع الرئيسي	Our main production facility.	مرفق الإنتاج الرئيسي لدينا.	https://camp-coding.site/eloroba/storage/app/images/building-main.png	f	2026-05-11 08:12:56.868	2026-05-11 08:12:56.868
cmp0xcgbo006zvzjog1tvnvoj	Cold Storage	التخزين البارد	Advanced cold storage warehouses.	مستودعات تخزين بارد متطورة.	https://camp-coding.site/eloroba/storage/app/images/building-cold.png	f	2026-05-11 08:12:56.868	2026-05-11 08:12:56.868
\.


--
-- Data for Name: CareerRequest; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."CareerRequest" (id, name, email, phone, "position", "resumeUrl", status, "createdAt", message) FROM stdin;
\.


--
-- Data for Name: CartItem; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."CartItem" (id, "sessionId", "userId", "productId", quantity, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."Category" (id, "nameEn", "nameAr", "descriptionEn", "descriptionAr", image, "imageEn", number, "isHidden", "brandId", "createdAt", "updatedAt") FROM stdin;
11	Frozen Vegetables & Fruits	الخضار والفواكه المجمدة			https://camp-coding.site/eloroba/storage/app/images/SDOzNwx7kU3yBZ2DnhRcwEljl7sneNJuyQrTJ3zT.png	\N	999	f	5	2026-05-11 08:12:54.575	2026-05-11 08:12:54.575
13	Frozen Beans & Grains	بقوليات وحبوب مجمدة			https://camp-coding.site/eloroba/storage/app/images/NS9UID7h3hUojYNvafYfaNQJzeSBRgD4AkF9sm7E.png	\N	999	f	5	2026-05-11 08:12:55.44	2026-05-11 08:12:55.44
12	Frozen Falafel	فلافل مجمدة			https://camp-coding.site/eloroba/storage/app/images/yTszxfbcMR9nKPEWqOiw7PawjtTeZhvYu0w5Zw8n.png	\N	999	f	5	2026-05-11 08:12:55.645	2026-05-11 08:12:55.645
14	Frozen Pre-Fried Bites	باببيتس			https://camp-coding.site/eloroba/storage/app/images/4pzUNp7Mu4tjoWcLUq0ovxK15cLWnL9YiqS72toW.png	\N	999	f	5	2026-05-11 08:12:55.737	2026-05-11 08:12:55.737
4	Frozen Vegetables	الخضروات المجمدة			https://camp-coding.site/eloroba/storage/app/images/MANqaL9ulOnMqPXva2Rpa6B2bYoHBKi1n4wDOI9z.png	\N	999	f	7	2026-05-11 08:12:55.907	2026-05-11 08:12:55.907
5	Frozen Fruits	الفواكه المجمدة			https://camp-coding.site/eloroba/storage/app/images/RRxQ5OczyF6XMjd3j1qwt1bXq8YV8us6afIMHrsY.png	\N	999	f	7	2026-05-11 08:12:56.303	2026-05-11 08:12:56.303
6	Frozen Falafel	فلافل مجمدة			https://camp-coding.site/eloroba/storage/app/images/Am4sKeSMyAQdciiXENh5H65nHQfiXVaDLaBbHcdQ.png	\N	999	f	7	2026-05-11 08:12:56.489	2026-05-11 08:12:56.489
7	Frozen Beans & Grains	بقوليات وحبوب مجمدة			https://camp-coding.site/eloroba/storage/app/images/BOimPZmzHZPo0jodNFatKVbi5DEnS0FKWrsHtMTG.png	\N	999	f	7	2026-05-11 08:12:56.578	2026-05-11 08:12:56.578
\.


--
-- Data for Name: CategoryProduct; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."CategoryProduct" (id, "categoryId", "productId", "isHidden", "createdAt", "updatedAt") FROM stdin;
cmp0xcekz0008vzjo4fpo43p2	11	27	f	2026-05-11 08:12:54.611	2026-05-11 08:12:54.611
cmp0xcelq000bvzjopqiv7s7w	11	28	f	2026-05-11 08:12:54.639	2026-05-11 08:12:54.639
cmp0xcem9000evzjoaapg2b3m	11	29	f	2026-05-11 08:12:54.658	2026-05-11 08:12:54.658
cmp0xcemt000hvzjoelo2i58n	11	21	f	2026-05-11 08:12:54.678	2026-05-11 08:12:54.678
cmp0xcenf000kvzjoyhdm9839	11	22	f	2026-05-11 08:12:54.7	2026-05-11 08:12:54.7
cmp0xcepj000nvzjoa65en4aw	11	80	f	2026-05-11 08:12:54.776	2026-05-11 08:12:54.776
cmp0xceq3000qvzjo1l7h51fn	11	23	f	2026-05-11 08:12:54.796	2026-05-11 08:12:54.796
cmp0xceqp000tvzjoeo9vt44m	11	24	f	2026-05-11 08:12:54.817	2026-05-11 08:12:54.817
cmp0xceri000wvzjoqh728x0n	11	32	f	2026-05-11 08:12:54.846	2026-05-11 08:12:54.846
cmp0xces4000zvzjo72vzjkte	11	33	f	2026-05-11 08:12:54.869	2026-05-11 08:12:54.869
cmp0xceso0012vzjomvp0dzko	11	34	f	2026-05-11 08:12:54.889	2026-05-11 08:12:54.889
cmp0xcet80015vzjom3s2m325	11	79	f	2026-05-11 08:12:54.908	2026-05-11 08:12:54.908
cmp0xcetq0018vzjodn3g0p6a	11	31	f	2026-05-11 08:12:54.926	2026-05-11 08:12:54.926
cmp0xceu9001bvzjos8w831ha	11	30	f	2026-05-11 08:12:54.945	2026-05-11 08:12:54.945
cmp0xceut001evzjow5kstyk7	11	75	f	2026-05-11 08:12:54.965	2026-05-11 08:12:54.965
cmp0xcevc001hvzjof13nxvpq	11	25	f	2026-05-11 08:12:54.985	2026-05-11 08:12:54.985
cmp0xcevv001kvzjopbouec3r	11	44	f	2026-05-11 08:12:55.003	2026-05-11 08:12:55.003
cmp0xcewe001nvzjota63fgpe	11	46	f	2026-05-11 08:12:55.022	2026-05-11 08:12:55.022
cmp0xcewx001qvzjom0gtk8ok	11	45	f	2026-05-11 08:12:55.042	2026-05-11 08:12:55.042
cmp0xcexg001tvzjor8xb7s47	11	39	f	2026-05-11 08:12:55.06	2026-05-11 08:12:55.06
cmp0xcexy001wvzjoquylmqoo	11	38	f	2026-05-11 08:12:55.078	2026-05-11 08:12:55.078
cmp0xceyp001zvzjoxlrlixb9	11	36	f	2026-05-11 08:12:55.105	2026-05-11 08:12:55.105
cmp0xcezf0022vzjohkw73eoq	11	35	f	2026-05-11 08:12:55.131	2026-05-11 08:12:55.131
cmp0xcf0j0025vzjojygoee6n	11	37	f	2026-05-11 08:12:55.172	2026-05-11 08:12:55.172
cmp0xcf1m0028vzjoo76h5l1f	11	40	f	2026-05-11 08:12:55.21	2026-05-11 08:12:55.21
cmp0xcf2q002bvzjot449zt90	11	47	f	2026-05-11 08:12:55.251	2026-05-11 08:12:55.251
cmp0xcf3f002evzjok97fsl1w	11	82	f	2026-05-11 08:12:55.275	2026-05-11 08:12:55.275
cmp0xcf45002hvzjo569icvsy	11	41	f	2026-05-11 08:12:55.301	2026-05-11 08:12:55.301
cmp0xcf5s002kvzjok3aqsqd5	11	42	f	2026-05-11 08:12:55.36	2026-05-11 08:12:55.36
cmp0xcf6s002nvzjov480erm1	11	85	f	2026-05-11 08:12:55.396	2026-05-11 08:12:55.396
cmp0xcf7h002qvzjo2xpmrsfx	11	87	f	2026-05-11 08:12:55.421	2026-05-11 08:12:55.421
cmp0xcf8u002vvzjofc2esp56	13	51	f	2026-05-11 08:12:55.471	2026-05-11 08:12:55.471
cmp0xcfad002yvzjovy2uk4cd	13	54	f	2026-05-11 08:12:55.526	2026-05-11 08:12:55.526
cmp0xcfbi0031vzjomxh03jmu	13	50	f	2026-05-11 08:12:55.566	2026-05-11 08:12:55.566
cmp0xcfc70034vzjo4d1rtc68	13	53	f	2026-05-11 08:12:55.592	2026-05-11 08:12:55.592
cmp0xcfcp0037vzjo79zv8477	13	52	f	2026-05-11 08:12:55.61	2026-05-11 08:12:55.61
cmp0xcfd7003avzjolhpwkq9i	13	58	f	2026-05-11 08:12:55.628	2026-05-11 08:12:55.628
cmp0xcfeq003fvzjoh2stm4tq	12	48	f	2026-05-11 08:12:55.682	2026-05-11 08:12:55.682
cmp0xcff9003ivzjotortzq1q	12	49	f	2026-05-11 08:12:55.702	2026-05-11 08:12:55.702
cmp0xcffr003lvzjojq1lsge9	12	43	f	2026-05-11 08:12:55.719	2026-05-11 08:12:55.719
cmp0xcfh3003qvzjobcescmpr	14	55	f	2026-05-11 08:12:55.767	2026-05-11 08:12:55.767
cmp0xcfhl003tvzjobd510pr6	14	83	f	2026-05-11 08:12:55.786	2026-05-11 08:12:55.786
cmp0xcfi5003wvzjo0lrm7suw	14	84	f	2026-05-11 08:12:55.805	2026-05-11 08:12:55.805
cmp0xcfio003zvzjos708olez	14	56	f	2026-05-11 08:12:55.824	2026-05-11 08:12:55.824
cmp0xcfj60042vzjo4z7f820u	14	57	f	2026-05-11 08:12:55.842	2026-05-11 08:12:55.842
cmp0xcfjo0045vzjoh2s6ihod	14	88	f	2026-05-11 08:12:55.86	2026-05-11 08:12:55.86
cmp0xcflt004avzjo9uyr8pac	4	59	f	2026-05-11 08:12:55.937	2026-05-11 08:12:55.937
cmp0xcfmb004dvzjothanv1aq	4	72	f	2026-05-11 08:12:55.956	2026-05-11 08:12:55.956
cmp0xcfmu004gvzjolvv0fwnn	4	73	f	2026-05-11 08:12:55.974	2026-05-11 08:12:55.974
cmp0xcfnp004jvzjoj087fc0l	4	76	f	2026-05-11 08:12:56.006	2026-05-11 08:12:56.006
cmp0xcfo8004mvzjowiblklt8	4	64	f	2026-05-11 08:12:56.024	2026-05-11 08:12:56.024
cmp0xcfoq004pvzjo1znuytfn	4	81	f	2026-05-11 08:12:56.043	2026-05-11 08:12:56.043
cmp0xcfp8004svzjodbq0ibkz	4	71	f	2026-05-11 08:12:56.06	2026-05-11 08:12:56.06
cmp0xcfpr004vvzjol4je19ik	4	60	f	2026-05-11 08:12:56.079	2026-05-11 08:12:56.079
cmp0xcfqb004yvzjoeytsgc78	4	77	f	2026-05-11 08:12:56.099	2026-05-11 08:12:56.099
cmp0xcfqw0051vzjo4cf6qirx	4	69	f	2026-05-11 08:12:56.12	2026-05-11 08:12:56.12
cmp0xcfro0054vzjovvgo44x3	4	78	f	2026-05-11 08:12:56.148	2026-05-11 08:12:56.148
cmp0xcfsf0057vzjogvzyh5j3	4	70	f	2026-05-11 08:12:56.175	2026-05-11 08:12:56.175
cmp0xcft4005avzjo4087192x	4	62	f	2026-05-11 08:12:56.2	2026-05-11 08:12:56.2
cmp0xcfts005dvzjo1tkn7jnc	4	68	f	2026-05-11 08:12:56.224	2026-05-11 08:12:56.224
cmp0xcfv1005gvzjot75qtrev	4	66	f	2026-05-11 08:12:56.269	2026-05-11 08:12:56.269
cmp0xcfwx005lvzjo4knvy8vb	5	86	f	2026-05-11 08:12:56.337	2026-05-11 08:12:56.337
cmp0xcfzq005ovzjoq81v9sgf	5	63	f	2026-05-11 08:12:56.438	2026-05-11 08:12:56.438
cmp0xcg2l005tvzjoo5b0afks	6	67	f	2026-05-11 08:12:56.542	2026-05-11 08:12:56.542
cmp0xcg34005wvzjou1bw5ajh	6	61	f	2026-05-11 08:12:56.56	2026-05-11 08:12:56.56
cmp0xcg4f0061vzjoyuzfbps3	7	74	f	2026-05-11 08:12:56.607	2026-05-11 08:12:56.607
\.


--
-- Data for Name: CategoryType; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."CategoryType" (id, "titleEn", "titleAr", "descriptionEn", "descriptionAr", image, number, "isHidden", "createdAt", "updatedAt") FROM stdin;
cmp0xceiv0003vzjod65wcr4j	Products	المنتجات	All our products	كل منتجاتنا	https://camp-coding.site/eloroba/storage/app/images/cooking-method.png	1	f	2026-05-11 08:12:54.536	2026-05-11 08:12:54.536
cmp0xcg99006mvzjou41he35j	By Cooking Method	حسب طريقة الطهي	Browse products by cooking method	تصفح المنتجات حسب طريقة الطهي	https://camp-coding.site/eloroba/storage/app/images/cooking-method.png	1	f	2026-05-11 08:12:56.782	2026-05-11 08:12:56.782
\.


--
-- Data for Name: CategoryTypeCategory; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."CategoryTypeCategory" (id, "categoryId", "categoryTypeId", image, number, "createdAt", "updatedAt") FROM stdin;
cmp0xcekg0005vzjosgfj9ch8	11	cmp0xceiv0003vzjod65wcr4j	https://camp-coding.site/eloroba/storage/app/images/SDOzNwx7kU3yBZ2DnhRcwEljl7sneNJuyQrTJ3zT.png	999	2026-05-11 08:12:54.593	2026-05-11 08:12:54.593
cmp0xcf8f002svzjojjmaklkx	13	cmp0xceiv0003vzjod65wcr4j	https://camp-coding.site/eloroba/storage/app/images/NS9UID7h3hUojYNvafYfaNQJzeSBRgD4AkF9sm7E.png	999	2026-05-11 08:12:55.456	2026-05-11 08:12:55.456
cmp0xcfeb003cvzjoe4aw0skr	12	cmp0xceiv0003vzjod65wcr4j	https://camp-coding.site/eloroba/storage/app/images/yTszxfbcMR9nKPEWqOiw7PawjtTeZhvYu0w5Zw8n.png	999	2026-05-11 08:12:55.667	2026-05-11 08:12:55.667
cmp0xcfgn003nvzjo5rnvwyel	14	cmp0xceiv0003vzjod65wcr4j	https://camp-coding.site/eloroba/storage/app/images/4pzUNp7Mu4tjoWcLUq0ovxK15cLWnL9YiqS72toW.png	999	2026-05-11 08:12:55.752	2026-05-11 08:12:55.752
cmp0xcfle0047vzjokziyk9q6	4	cmp0xceiv0003vzjod65wcr4j	https://camp-coding.site/eloroba/storage/app/images/MANqaL9ulOnMqPXva2Rpa6B2bYoHBKi1n4wDOI9z.png	999	2026-05-11 08:12:55.922	2026-05-11 08:12:55.922
cmp0xcfwf005ivzjoqle9izxr	5	cmp0xceiv0003vzjod65wcr4j	https://camp-coding.site/eloroba/storage/app/images/RRxQ5OczyF6XMjd3j1qwt1bXq8YV8us6afIMHrsY.png	999	2026-05-11 08:12:56.32	2026-05-11 08:12:56.32
cmp0xcg1x005qvzjozomj46v5	6	cmp0xceiv0003vzjod65wcr4j	https://camp-coding.site/eloroba/storage/app/images/Am4sKeSMyAQdciiXENh5H65nHQfiXVaDLaBbHcdQ.png	999	2026-05-11 08:12:56.517	2026-05-11 08:12:56.517
cmp0xcg41005yvzjolpppf8gm	7	cmp0xceiv0003vzjod65wcr4j	https://camp-coding.site/eloroba/storage/app/images/BOimPZmzHZPo0jodNFatKVbi5DEnS0FKWrsHtMTG.png	999	2026-05-11 08:12:56.593	2026-05-11 08:12:56.593
\.


--
-- Data for Name: Certificate; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."Certificate" (id, image, "isHidden", "createdAt", "updatedAt") FROM stdin;
cmp0xcg9p006nvzjo6o4vhfjn	https://camp-coding.site/eloroba/storage/app/images/cert-iso.png	f	2026-05-11 08:12:56.797	2026-05-11 08:12:56.797
cmp0xcg9p006ovzjotbvos72r	https://camp-coding.site/eloroba/storage/app/images/cert-halal.png	f	2026-05-11 08:12:56.797	2026-05-11 08:12:56.797
cmp0xcg9p006pvzjog2vs02gs	https://camp-coding.site/eloroba/storage/app/images/cert-haccp.png	f	2026-05-11 08:12:56.797	2026-05-11 08:12:56.797
\.


--
-- Data for Name: CollaborateRequest; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."CollaborateRequest" (id, "firstName", "lastName", name, email, phone, status, "createdAt", message) FROM stdin;
\.


--
-- Data for Name: ContactRequest; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."ContactRequest" (id, name, email, phone, message, status, "createdAt") FROM stdin;
\.


--
-- Data for Name: Continent; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."Continent" (id, "nameEn", "nameAr", "isHidden", "createdAt", "updatedAt") FROM stdin;
cmp0xcgcl0072vzjon17zgpuc	Africa	أفريقيا	f	2026-05-11 08:12:56.902	2026-05-11 08:12:56.902
cmp0xcgd10073vzjowhxwg947	Asia	آسيا	f	2026-05-11 08:12:56.917	2026-05-11 08:12:56.917
cmp0xcge20074vzjo80t4i2x8	Europe	أوروبا	f	2026-05-11 08:12:56.955	2026-05-11 08:12:56.955
\.


--
-- Data for Name: Country; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."Country" (id, "nameEn", "nameAr", "continentId", "isHidden", "createdAt", "updatedAt") FROM stdin;
cmp0xcgeh0075vzjo6hrdm1dp	Egypt	مصر	cmp0xcgcl0072vzjon17zgpuc	f	2026-05-11 08:12:56.97	2026-05-11 08:12:56.97
cmp0xcgeh0076vzjocp1d3vw7	Libya	ليبيا	cmp0xcgcl0072vzjon17zgpuc	f	2026-05-11 08:12:56.97	2026-05-11 08:12:56.97
cmp0xcgeh0077vzjohnbx0kiy	Saudi Arabia	المملكة العربية السعودية	cmp0xcgd10073vzjowhxwg947	f	2026-05-11 08:12:56.97	2026-05-11 08:12:56.97
cmp0xcgeh0078vzjoewbuodsx	UAE	الإمارات	cmp0xcgd10073vzjowhxwg947	f	2026-05-11 08:12:56.97	2026-05-11 08:12:56.97
cmp0xcgeh0079vzjomleq43tu	Germany	ألمانيا	cmp0xcge20074vzjo80t4i2x8	f	2026-05-11 08:12:56.97	2026-05-11 08:12:56.97
\.


--
-- Data for Name: Feature; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."Feature" (id, "titleEn", "titleAr", "descriptionEn", "descriptionAr", image, "isHidden", "createdAt", "updatedAt") FROM stdin;
cmp0xcgc40070vzjos8vq118b	Automated Production	إنتاج آلي	Fully automated production lines.	خطوط إنتاج مؤتمتة بالكامل.	https://camp-coding.site/eloroba/storage/app/images/feature-auto.png	f	2026-05-11 08:12:56.885	2026-05-11 08:12:56.885
cmp0xcgc40071vzjosnxvz0fs	Quality Control	مراقبة الجودة	Multi-stage quality control process.	عملية مراقبة جودة متعددة المراحل.	https://camp-coding.site/eloroba/storage/app/images/feature-qc.png	f	2026-05-11 08:12:56.885	2026-05-11 08:12:56.885
\.


--
-- Data for Name: Food; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."Food" (id, "nameEn", "nameAr", image, number, "isHidden", "createdAt", "updatedAt") FROM stdin;
cmp0xcg7j006gvzjoypom5seg	Chicken Nuggets	ناجتس دجاج	https://camp-coding.site/eloroba/storage/app/images/nuggets-1.png	1	f	2026-05-11 08:12:56.719	2026-05-11 08:12:56.719
cmp0xcg7z006hvzjoenmlrfe2	Flour	دقيق	\N	2	f	2026-05-11 08:12:56.735	2026-05-11 08:12:56.735
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."Order" (id, "userId", status, "totalAmount", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."OrderItem" (id, "orderId", "productId", quantity, price) FROM stdin;
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."Product" (id, "nameEn", "nameAr", "descriptionEn", "descriptionAr", color, number, "isHidden", "typeId", "createdAt", "updatedAt") FROM stdin;
27	Molokhia Leaves	ملوخية خضراء أوراق			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:54.611	2026-05-11 08:12:54.611
28	Minced Molokhia	ملوخية خضراء مخروطة			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:54.639	2026-05-11 08:12:54.639
29	Minced Molokhia with Garlic Mix Sachet	ملوخية خضراء مخروطة بالتقلية			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:54.658	2026-05-11 08:12:54.658
21	Green Peas	بسلة خضراء مجمدة			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:54.678	2026-05-11 08:12:54.678
22	Peas with Carrots	بسلة بالجزر			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:54.7	2026-05-11 08:12:54.7
80	Mixed Vegetables with sweet corn	خضار مشكل بالذرة السكرية			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:54.776	2026-05-11 08:12:54.776
23	Mixed Vegetables	خضار مشكل			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:54.796	2026-05-11 08:12:54.796
24	Vegetables Mix for Soup	خضروات مشكلة لشوربة الخضار			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:54.817	2026-05-11 08:12:54.817
32	Okra Extra	بامية إكسترا			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:54.846	2026-05-11 08:12:54.846
33	Okra Zero	بامية زيرو			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:54.869	2026-05-11 08:12:54.869
34	Okra Excellent	بامية ممتازة			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:54.889	2026-05-11 08:12:54.889
79	Okra No.1	بامية رقم 1			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:54.908	2026-05-11 08:12:54.908
31	Green Okra	بامية خضراء			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:54.926	2026-05-11 08:12:54.926
30	Green Broad Beans	فول اخضر			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:54.945	2026-05-11 08:12:54.945
75	Peeled Green Broad Beans	فول اخضر مقشر			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:54.965	2026-05-11 08:12:54.965
25	Cut Green Beans	فاصوليا خضراء مقطعة			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:54.985	2026-05-11 08:12:54.985
44	Grated Onion	بصل مبشور			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.003	2026-05-11 08:12:55.003
46	Chopped Tomato (sifted)	طماطم مفرومة (مصفاه)			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.022	2026-05-11 08:12:55.022
45	Crushed Garlic	ثوم مفروم (مكعبات)			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.042	2026-05-11 08:12:55.042
39	Coloccasia (Taro)	قلقاس			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.06	2026-05-11 08:12:55.06
38	Artichoke (Bottoms)	خرشوف (أقراص)			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.078	2026-05-11 08:12:55.078
36	Spinach (Cut)	سبانخ مقطعة			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.105	2026-05-11 08:12:55.105
35	Vine Leaves	ورق العنب			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.131	2026-05-11 08:12:55.131
37	Cauliflower	قرنبيط			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.172	2026-05-11 08:12:55.172
40	Broccoli	بروكلي			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.21	2026-05-11 08:12:55.21
47	Beetroot (Cubes)	بنجر مكعبات			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.251	2026-05-11 08:12:55.251
82	Diced Carrots	جزر مكعبات صغيرة			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.275	2026-05-11 08:12:55.275
41	Strawberries	فراولة			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.301	2026-05-11 08:12:55.301
42	Mango (Juice)	مانجو (عصير)			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.36	2026-05-11 08:12:55.36
85	Mango (Slices)	مانجو (شرائح)			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.396	2026-05-11 08:12:55.396
87	Barhi Dates	بلح برحي			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.421	2026-05-11 08:12:55.421
51	Chickpeas (Boiled)	حمص (مسلوق)			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.471	2026-05-11 08:12:55.471
54	Lupini (Boiled)	ترمس (مسلوق)			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.526	2026-05-11 08:12:55.526
50	White Beans (Boiled)	فاصوليا بيضاء (مسلوقة)			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.566	2026-05-11 08:12:55.566
53	Sweet Corn	ذرة سكرية			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.592	2026-05-11 08:12:55.592
52	Black Eyed Peas (Boiled)	لوبيا (مسلوقة)			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.61	2026-05-11 08:12:55.61
58	Wheat (Boiled)	قمح (مسلوق)			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.628	2026-05-11 08:12:55.628
48	Pre- Fried Falafel Beans	فلافل نصف مقلية			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.682	2026-05-11 08:12:55.682
49	Pre-Fried Falafel Chick-Peas	فلافل حمص نصف مقلية			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.702	2026-05-11 08:12:55.702
43	Pre- fried Vegetarian Burger	برجر نباتي نصف مقلي			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.719	2026-05-11 08:12:55.719
55	Pre-Fried Potato & Spinach Strips	بطاطس بالسبانخ ستربس			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.767	2026-05-11 08:12:55.767
83	Pre-Fried Crispy Spuds	بطاطس مقرمشة			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.786	2026-05-11 08:12:55.786
84	Pre-Fried Crispy Eggplant Fingers	أصابع باذنجان مقرمشة			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.805	2026-05-11 08:12:55.805
56	Pre-Fried Spicy Chickpeas Falafel Bites	فلافل حمص حارة			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.824	2026-05-11 08:12:55.824
57	Pre-Fried Cauliflower	قرنبيط نصف مقلي			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.842	2026-05-11 08:12:55.842
88	Pre-Fried Spiced Crispy Fries	بطاطس بهارات مقرمشة			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.86	2026-05-11 08:12:55.86
59	Minced Molokhia	ملوخية خضراء مخروطة			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.937	2026-05-11 08:12:55.937
72	Spinach Leaves	سبانخ أوراق			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.956	2026-05-11 08:12:55.956
73	Spinach Leaves (Cut)	سبانخ مقطعة			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:55.974	2026-05-11 08:12:55.974
76	Green Broad Beans	فول اخضر			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:56.006	2026-05-11 08:12:56.006
64	Peeled Green Broad Beans	فول اخضر مقشر			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:56.024	2026-05-11 08:12:56.024
81	Green Beans (Cut)	فاصوليا خضراء مقطعة			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:56.043	2026-05-11 08:12:56.043
71	Okra Very Small	بامية صغيرة جدًا			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:56.06	2026-05-11 08:12:56.06
60	Okra Small	بامية صغيرة			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:56.079	2026-05-11 08:12:56.079
77	Okra Medium	بامية متوسطة			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:56.099	2026-05-11 08:12:56.099
69	Peas	بسلة خضراء			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:56.12	2026-05-11 08:12:56.12
78	Frozen Mixed Vegetables	خضار مشكل			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:56.148	2026-05-11 08:12:56.148
70	Peas with Carrots	بسلة بالجزر			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:56.175	2026-05-11 08:12:56.175
62	Taro	قلقاس			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:56.2	2026-05-11 08:12:56.2
68	Artichoke (Bottoms)	خرشوف (أقراص)			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:56.224	2026-05-11 08:12:56.224
66	Broccoli	بروكلي			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:56.269	2026-05-11 08:12:56.269
86	Mango Slices	مانجو شرائح			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:56.337	2026-05-11 08:12:56.337
63	Strawberries	فراولة			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:56.438	2026-05-11 08:12:56.438
67	Pre-Fried Falafel Chick-Peas	فلافل حمص نصف مقلية			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:56.542	2026-05-11 08:12:56.542
61	Pre-Fried Falafel Beans	فلافل نصف مقلية			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:56.56	2026-05-11 08:12:56.56
74	Sweet Corn	ذرة سكرية مجمدة			#ffffff	999	f	cmp0xcehw0001vzjopt5fwkar	2026-05-11 08:12:56.607	2026-05-11 08:12:56.607
\.


--
-- Data for Name: ProductImage; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."ProductImage" (id, "productId", url, "createdAt", "updatedAt") FROM stdin;
cmp0xcekz0006vzjoqcuuo3rq	27	https://camp-coding.site/eloroba/storage/app/images/SDOzNwx7kU3yBZ2DnhRcwEljl7sneNJuyQrTJ3zT.png	2026-05-11 08:12:54.611	2026-05-11 08:12:54.611
cmp0xcelq0009vzjokj3z1fmt	28	https://camp-coding.site/eloroba/storage/app/images/7RtsXYVs5pregZwlGvvdqnyjf4R51wjHLvGk8zhC.png	2026-05-11 08:12:54.639	2026-05-11 08:12:54.639
cmp0xcem9000cvzjofz8yt7y6	29	https://camp-coding.site/eloroba/storage/app/images/F1Nqsq5wQ9xjZN1qkEd6r8xoSEk4rz4AipE0mrOR.png	2026-05-11 08:12:54.658	2026-05-11 08:12:54.658
cmp0xcemt000fvzjodd7z0xd5	21	https://camp-coding.site/eloroba/storage/app/images/pNjztYF62nkpP41Ts1G8fiywKEvpqfpWBVvVHbJb.png	2026-05-11 08:12:54.678	2026-05-11 08:12:54.678
cmp0xcenf000ivzjop44nwfs1	22	https://camp-coding.site/eloroba/storage/app/images/Ba1RQVgDidJVpGhTImXhY3vjONrWWkrxeC4m4BlZ.png	2026-05-11 08:12:54.7	2026-05-11 08:12:54.7
cmp0xcepj000lvzjoqrqlvj5f	80	https://camp-coding.site/eloroba/storage/app/images/RrngGBkkOQIMwgprua7muURhxqQZTNgXDMT65RER.png	2026-05-11 08:12:54.776	2026-05-11 08:12:54.776
cmp0xceq3000ovzjovh2168r1	23	https://camp-coding.site/eloroba/storage/app/images/2HFHwdVnOwusUSsiBrwLw87FtFiFVH8XQddrueKr.png	2026-05-11 08:12:54.796	2026-05-11 08:12:54.796
cmp0xceqp000rvzjo6ey1ropy	24	https://camp-coding.site/eloroba/storage/app/images/uk7flMGyClD0IUnnhWGkwJqTNeeSQusRi0gm4rpd.png	2026-05-11 08:12:54.817	2026-05-11 08:12:54.817
cmp0xceri000uvzjodshkjqii	32	https://camp-coding.site/eloroba/storage/app/images/8ZvMrlSBXGYCYlLrsH4Wa3tmn8IQCIGzqwBY1iwz.png	2026-05-11 08:12:54.846	2026-05-11 08:12:54.846
cmp0xces4000xvzjo86z4x0iv	33	https://camp-coding.site/eloroba/storage/app/images/nM5BgyMjfMR0K7jNtGsaEEd9Vp38Lt7zgXGZ575u.png	2026-05-11 08:12:54.869	2026-05-11 08:12:54.869
cmp0xceso0010vzjo5eyx9bvh	34	https://camp-coding.site/eloroba/storage/app/images/2AVAs63bwhM0IDnqUovcuz5DgqJMxKsQ2zWCbSNG.png	2026-05-11 08:12:54.889	2026-05-11 08:12:54.889
cmp0xcet80013vzjod13nw2a0	79	https://camp-coding.site/eloroba/storage/app/images/Qs7Zm0HfwWMxPrgOYbKa0LMpUPZwFg2hZXgmyecW.png	2026-05-11 08:12:54.908	2026-05-11 08:12:54.908
cmp0xcetq0016vzjoeo3s1h7f	31	https://camp-coding.site/eloroba/storage/app/images/D5yw6CbSE0firA0D9NXjfd0VYbBlwDcCuwkMNh9t.png	2026-05-11 08:12:54.926	2026-05-11 08:12:54.926
cmp0xceu90019vzjo7cpyf1n4	30	https://camp-coding.site/eloroba/storage/app/images/k4iDzuN6722Tx6pMGsMjIqWoCr6lndEM2D82xPlF.png	2026-05-11 08:12:54.945	2026-05-11 08:12:54.945
cmp0xceut001cvzjodaarn82s	75	https://camp-coding.site/eloroba/storage/app/images/r0HBX3FxiewTZGMKdbh77ovWmvemR1PIru7ZCLhN.png	2026-05-11 08:12:54.965	2026-05-11 08:12:54.965
cmp0xcevc001fvzjougosytve	25	https://camp-coding.site/eloroba/storage/app/images/lD7urgTmmX7ghLUQiLyGJd5KNe2jjfivvWDp5KX5.png	2026-05-11 08:12:54.985	2026-05-11 08:12:54.985
cmp0xcevv001ivzjofi8r5bx3	44	https://camp-coding.site/eloroba/storage/app/images/hR0HLoTnhUPm74urs8yp4XL6wqhj1P1tllVMNwMT.png	2026-05-11 08:12:55.003	2026-05-11 08:12:55.003
cmp0xcewe001lvzjo9dfqilw9	46	https://camp-coding.site/eloroba/storage/app/images/v1wKKdmoAG0U5ps4n4K3980mBUTxjrzhCytU5G8X.png	2026-05-11 08:12:55.022	2026-05-11 08:12:55.022
cmp0xcewx001ovzjon9bn6oqo	45	https://camp-coding.site/eloroba/storage/app/images/6tVBuvejgLiiI0WoW3jLpIyq94SqexHB1fjvO9lA.png	2026-05-11 08:12:55.042	2026-05-11 08:12:55.042
cmp0xcexg001rvzjojbqye19e	39	https://camp-coding.site/eloroba/storage/app/images/3oWI9VpOtv01J2n6aVwXZQrInnDoAZLwdzq9vr4G.png	2026-05-11 08:12:55.06	2026-05-11 08:12:55.06
cmp0xcexy001uvzjokvz1blul	38	https://camp-coding.site/eloroba/storage/app/images/LSvtdESjZLUDO1tSFDtqBSWsXkUoGl7Nqm0Ez4JJ.png	2026-05-11 08:12:55.078	2026-05-11 08:12:55.078
cmp0xceyp001xvzjom7g2mm9c	36	https://camp-coding.site/eloroba/storage/app/images/jqAP6xNff0PCXnubTqhyt9Y5Je8KsUylfHd8CaHl.png	2026-05-11 08:12:55.105	2026-05-11 08:12:55.105
cmp0xcezf0020vzjo4dwdcuwp	35	https://camp-coding.site/eloroba/storage/app/images/rhXcXaRzEKApb1xZqgsV3gykgge1Xr7QnE4EZ9e0.png	2026-05-11 08:12:55.131	2026-05-11 08:12:55.131
cmp0xcf0j0023vzjohfjq4dlt	37	https://camp-coding.site/eloroba/storage/app/images/ZZ7h33d7O15mdJelUZGGeqJmkHzJj0vr5VxYLlIK.png	2026-05-11 08:12:55.172	2026-05-11 08:12:55.172
cmp0xcf1m0026vzjonchp50bl	40	https://camp-coding.site/eloroba/storage/app/images/GJZuE93uNREn5uC8yfxxNtWCXXmyrK8P4hy5sWHe.png	2026-05-11 08:12:55.21	2026-05-11 08:12:55.21
cmp0xcf2q0029vzjo5tswzyj9	47	https://camp-coding.site/eloroba/storage/app/images/NNojYX0stJLXyl0u3Rrp8GItu7cNkDimV0XN68Fb.png	2026-05-11 08:12:55.251	2026-05-11 08:12:55.251
cmp0xcf3f002cvzjoc3nd3iso	82	https://camp-coding.site/eloroba/storage/app/images/AL3JIE4qZWPMdaYDwHjtymSUCvNhfziggl14cmHo.png	2026-05-11 08:12:55.275	2026-05-11 08:12:55.275
cmp0xcf45002fvzjoa93k7o40	41	https://camp-coding.site/eloroba/storage/app/images/f6GZAd4EmLPuMiXbpJ7gi15qrKfIRBU2WnNETVIW.png	2026-05-11 08:12:55.301	2026-05-11 08:12:55.301
cmp0xcf5s002ivzjoi1mgdlx1	42	https://camp-coding.site/eloroba/storage/app/images/dpXGu1wNm2KE6lFicQlT93GjV1F1y47TyyHXjLMA.png	2026-05-11 08:12:55.36	2026-05-11 08:12:55.36
cmp0xcf6s002lvzjoi2ylyxga	85	https://camp-coding.site/eloroba/storage/app/images/oWffh0Xb4tvBhvjCtMcr2ZcPmhgHsRNgRXrjvcYF.png	2026-05-11 08:12:55.396	2026-05-11 08:12:55.396
cmp0xcf7h002ovzjogxxk8i1t	87	https://camp-coding.site/eloroba/storage/app/images/pV6W2O1X5NUI8TqZviOct0QG1XTtcL0x4sXA56I5.png	2026-05-11 08:12:55.421	2026-05-11 08:12:55.421
cmp0xcf8u002tvzjoux28w4qp	51	https://camp-coding.site/eloroba/storage/app/images/NS9UID7h3hUojYNvafYfaNQJzeSBRgD4AkF9sm7E.png	2026-05-11 08:12:55.471	2026-05-11 08:12:55.471
cmp0xcfad002wvzjok7ul652h	54	https://camp-coding.site/eloroba/storage/app/images/QoQNHrRb94omTtooRc3Oza3xgUb0nzuXfJmdv0uB.png	2026-05-11 08:12:55.526	2026-05-11 08:12:55.526
cmp0xcfbi002zvzjovf0w1a5e	50	https://camp-coding.site/eloroba/storage/app/images/WqdwYvD5qd9Jjjkok7w6Ve0MoZp5QbSQKxoJDnLN.png	2026-05-11 08:12:55.566	2026-05-11 08:12:55.566
cmp0xcfc70032vzjoziz6k8xb	53	https://camp-coding.site/eloroba/storage/app/images/N9RazfDFZNR9AHKp1GGW9n3UuPtW9oRRa2xd8z39.png	2026-05-11 08:12:55.592	2026-05-11 08:12:55.592
cmp0xcfcp0035vzjoy4nk9f6u	52	https://camp-coding.site/eloroba/storage/app/images/TfxxmPR77rSMjTTB3Qqkv0motvzfuojCm7k70fob.png	2026-05-11 08:12:55.61	2026-05-11 08:12:55.61
cmp0xcfd70038vzjoopnfc61i	58	https://camp-coding.site/eloroba/storage/app/images/ctEfbunJWsH0rK5xa3WJXYxgrWjh45JzfAoc7BsZ.png	2026-05-11 08:12:55.628	2026-05-11 08:12:55.628
cmp0xcfeq003dvzjok5grpb9m	48	https://camp-coding.site/eloroba/storage/app/images/yTszxfbcMR9nKPEWqOiw7PawjtTeZhvYu0w5Zw8n.png	2026-05-11 08:12:55.682	2026-05-11 08:12:55.682
cmp0xcff9003gvzjodgdaflmr	49	https://camp-coding.site/eloroba/storage/app/images/5iJNOSfT1aXCqrZZ2n9bEFiSOtTh3OGZ1MMcMB45.png	2026-05-11 08:12:55.702	2026-05-11 08:12:55.702
cmp0xcffr003jvzjov5xd17i3	43	https://camp-coding.site/eloroba/storage/app/images/7YCX7uLmSVmzryuEo8aucOWihi15ScvDPdDvwWPe.png	2026-05-11 08:12:55.719	2026-05-11 08:12:55.719
cmp0xcfh3003ovzjobdw4e22s	55	https://camp-coding.site/eloroba/storage/app/images/4pzUNp7Mu4tjoWcLUq0ovxK15cLWnL9YiqS72toW.png	2026-05-11 08:12:55.767	2026-05-11 08:12:55.767
cmp0xcfhl003rvzjo49ma124h	83	https://camp-coding.site/eloroba/storage/app/images/xu3gVkKG9OZ27mLYSQNRpUDBU4dPNEkD7jFCMGkk.png	2026-05-11 08:12:55.786	2026-05-11 08:12:55.786
cmp0xcfi5003uvzjofc1fdx3f	84	https://camp-coding.site/eloroba/storage/app/images/L5Qz8LS5DNdd8E2VN8Hj7uaC65rKOcRq6YxNdG1L.png	2026-05-11 08:12:55.805	2026-05-11 08:12:55.805
cmp0xcfio003xvzjoi58vtnj2	56	https://camp-coding.site/eloroba/storage/app/images/GzVDpE7bdovh6eAaoUbOa0eFYnf2cWlRe8kvTqFj.png	2026-05-11 08:12:55.824	2026-05-11 08:12:55.824
cmp0xcfj60040vzjof9mhcc30	57	https://camp-coding.site/eloroba/storage/app/images/si6VSL7oftrZnP9UOgxlgghB1uUQVJ5AlF9ATc05.png	2026-05-11 08:12:55.842	2026-05-11 08:12:55.842
cmp0xcfjn0043vzjomcu4wov9	88	https://camp-coding.site/eloroba/storage/app/images/MbEBltDDTTTbd6TXAqbrYrVOdEbr9685SaP34Q4y.png	2026-05-11 08:12:55.86	2026-05-11 08:12:55.86
cmp0xcflt0048vzjoz0qfubwd	59	https://camp-coding.site/eloroba/storage/app/images/MANqaL9ulOnMqPXva2Rpa6B2bYoHBKi1n4wDOI9z.png	2026-05-11 08:12:55.937	2026-05-11 08:12:55.937
cmp0xcfmb004bvzjokayfk07k	72	https://camp-coding.site/eloroba/storage/app/images/ZL1Tm185TLgI0cQm1xy8Cht2kOtAJGoVUyEI4XQR.png	2026-05-11 08:12:55.956	2026-05-11 08:12:55.956
cmp0xcfmu004evzjokih3rzte	73	https://camp-coding.site/eloroba/storage/app/images/eSz1XNzjLOOsd9wUtu7wna0rWvLP4onCra7cjeV3.png	2026-05-11 08:12:55.974	2026-05-11 08:12:55.974
cmp0xcfnp004hvzjoldafbt0m	76	https://camp-coding.site/eloroba/storage/app/images/C2bTkOzAV70z2DjMlZDrGGoexz2y2iO6Z5R6VKMW.png	2026-05-11 08:12:56.006	2026-05-11 08:12:56.006
cmp0xcfo8004kvzjow8wfn4pi	64	https://camp-coding.site/eloroba/storage/app/images/qyuqUL5voBBEywMs3hRX9M8aytCZsSkq1GirKacy.png	2026-05-11 08:12:56.024	2026-05-11 08:12:56.024
cmp0xcfoq004nvzjo6mp5nnt4	81	https://camp-coding.site/eloroba/storage/app/images/eYlHl1frKossCR6Sjf9dOuA4MkklkQqZsJ5RWiqi.png	2026-05-11 08:12:56.043	2026-05-11 08:12:56.043
cmp0xcfp8004qvzjoy3kh8ktj	71	https://camp-coding.site/eloroba/storage/app/images/dI9aSFNJAGIjitQsEtBp5H1o9iV6c6UsCizAZogD.png	2026-05-11 08:12:56.06	2026-05-11 08:12:56.06
cmp0xcfpr004tvzjo6l8qctdu	60	https://camp-coding.site/eloroba/storage/app/images/0DsWtORtwJ1zGAPj3LLUZOBtF9WlVZ4qZPKoMwmt.png	2026-05-11 08:12:56.079	2026-05-11 08:12:56.079
cmp0xcfqb004wvzjo8pn5gd6y	77	https://camp-coding.site/eloroba/storage/app/images/r0vcnpL2nOsKtg7U2kBaJox2RCLEuv9SwInVUBBl.png	2026-05-11 08:12:56.099	2026-05-11 08:12:56.099
cmp0xcfqw004zvzjoeu68k4m1	69	https://camp-coding.site/eloroba/storage/app/images/UW3Ong0MFVO2WgqK1eepm56XqOwGWWzzBBgDa8wi.png	2026-05-11 08:12:56.12	2026-05-11 08:12:56.12
cmp0xcfro0052vzjotw8y3t7x	78	https://camp-coding.site/eloroba/storage/app/images/jfioQqu1PAYosGoPmSaWDIiav77Tk6IDHBCLa8G1.png	2026-05-11 08:12:56.148	2026-05-11 08:12:56.148
cmp0xcfsf0055vzjoz69t2d2l	70	https://camp-coding.site/eloroba/storage/app/images/l35dkgPcTezg5Ex6FXRDSbPcojlpMNXl8y97zI7k.png	2026-05-11 08:12:56.175	2026-05-11 08:12:56.175
cmp0xcft40058vzjo49txhuol	62	https://camp-coding.site/eloroba/storage/app/images/k0OQ5j4Wm8eLjIuHESZVCJFOqI8oT0FBBGAPdVJA.png	2026-05-11 08:12:56.2	2026-05-11 08:12:56.2
cmp0xcfts005bvzjo8t3cw252	68	https://camp-coding.site/eloroba/storage/app/images/ca0iIJ39VIB5LMG47rzlH9IdMQ1NNot7aCUeTCY2.png	2026-05-11 08:12:56.224	2026-05-11 08:12:56.224
cmp0xcfv1005evzjom4k0amn0	66	https://camp-coding.site/eloroba/storage/app/images/sQ8Ww78aMuKVdnflhtwbUVvKwvayei5hSgEMFLcQ.png	2026-05-11 08:12:56.269	2026-05-11 08:12:56.269
cmp0xcfwx005jvzjo3kzki0x6	86	https://camp-coding.site/eloroba/storage/app/images/RRxQ5OczyF6XMjd3j1qwt1bXq8YV8us6afIMHrsY.png	2026-05-11 08:12:56.337	2026-05-11 08:12:56.337
cmp0xcfzq005mvzjo5b2jvb6u	63	https://camp-coding.site/eloroba/storage/app/images/z6VNIMFEa5ytFITNHyJb0BstJiTJpmf7mxiLybZU.png	2026-05-11 08:12:56.438	2026-05-11 08:12:56.438
cmp0xcg2l005rvzjo511rgdfs	67	https://camp-coding.site/eloroba/storage/app/images/Am4sKeSMyAQdciiXENh5H65nHQfiXVaDLaBbHcdQ.png	2026-05-11 08:12:56.542	2026-05-11 08:12:56.542
cmp0xcg33005uvzjongoxc3d6	61	https://camp-coding.site/eloroba/storage/app/images/jFnENFfQ3kK94rLA0ZSyZKcXlpfHtb78JQNSkxb6.png	2026-05-11 08:12:56.56	2026-05-11 08:12:56.56
cmp0xcg4f005zvzjomq74bcyk	74	https://camp-coding.site/eloroba/storage/app/images/BOimPZmzHZPo0jodNFatKVbi5DEnS0FKWrsHtMTG.png	2026-05-11 08:12:56.607	2026-05-11 08:12:56.607
\.


--
-- Data for Name: ProductSocial; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."ProductSocial" (id, image, "productId", "isHidden", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ProductType; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."ProductType" (id, "nameEn", "nameAr", "isHidden", "createdAt", "updatedAt") FROM stdin;
cmp0xcehw0001vzjopt5fwkar	Frozen	مجمد	f	2026-05-11 08:12:54.501	2026-05-11 08:12:54.501
cmp0xceid0002vzjovbpb3331	Fresh	طازج	f	2026-05-11 08:12:54.518	2026-05-11 08:12:54.518
\.


--
-- Data for Name: ProductionStep; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."ProductionStep" (id, "textEn", "textAr", number, image, "isHidden", "createdAt", "updatedAt") FROM stdin;
cmp0xcgez007avzjoglmtlivz	Raw material selection and inspection	اختيار وفحص المواد الخام	1	https://camp-coding.site/eloroba/storage/app/images/step-1.png	f	2026-05-11 08:12:56.987	2026-05-11 08:12:56.987
cmp0xcgez007bvzjo8b6bnz4n	Processing and preparation	المعالجة والتحضير	2	https://camp-coding.site/eloroba/storage/app/images/step-2.png	f	2026-05-11 08:12:56.987	2026-05-11 08:12:56.987
cmp0xcgez007cvzjoxpci6rn5	Quality testing and packaging	اختبار الجودة والتعبئة	3	https://camp-coding.site/eloroba/storage/app/images/step-3.png	f	2026-05-11 08:12:56.987	2026-05-11 08:12:56.987
\.


--
-- Data for Name: Recipe; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."Recipe" (id, "nameEn", "nameAr", "descriptionEn", "descriptionAr", "videoLink", "internalImage", number, "isHidden", "createdAt", "updatedAt") FROM stdin;
cmp0xcg6b0066vzjockdcpra6	Crispy Chicken Nuggets Recipe	وصفة ناجتس الدجاج المقرمش	Learn how to make the crispiest chicken nuggets at home.	تعلم كيف تصنع أكثر ناجتس الدجاج قرمشة في المنزل.	https://www.youtube.com/watch?v=example	https://camp-coding.site/eloroba/storage/app/images/recipe-nuggets.png	1	f	2026-05-11 08:12:56.675	2026-05-11 08:12:56.675
\.


--
-- Data for Name: RecipeCategory; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."RecipeCategory" (id, "nameEn", "nameAr", image, number, "isHidden", "createdAt", "updatedAt") FROM stdin;
cmp0xcg5g0064vzjo2jza53je	Main Dishes	أطباق رئيسية	\N	1	f	2026-05-11 08:12:56.644	2026-05-11 08:12:56.644
cmp0xcg5w0065vzjohsnhz9ic	Appetizers	مقبلات	\N	2	f	2026-05-11 08:12:56.66	2026-05-11 08:12:56.66
\.


--
-- Data for Name: RecipeCategoryFood; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."RecipeCategoryFood" (id, "recipeCategoryId", "foodId") FROM stdin;
cmp0xcg8u006lvzjo50exoe69	cmp0xcg5g0064vzjo2jza53je	cmp0xcg7j006gvzjoypom5seg
\.


--
-- Data for Name: RecipeFood; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."RecipeFood" (id, "recipeId", "foodId", "createdAt", "updatedAt") FROM stdin;
cmp0xcg8e006jvzjoif0gz8wd	cmp0xcg6b0066vzjockdcpra6	cmp0xcg7j006gvzjoypom5seg	2026-05-11 08:12:56.75	2026-05-11 08:12:56.75
\.


--
-- Data for Name: RecipeImage; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."RecipeImage" (id, "recipeId", url, "createdAt", "updatedAt") FROM stdin;
cmp0xcg6b006dvzjoxglenpbx	cmp0xcg6b0066vzjockdcpra6	https://camp-coding.site/eloroba/storage/app/images/recipe-nuggets-1.png	2026-05-11 08:12:56.675	2026-05-11 08:12:56.675
\.


--
-- Data for Name: RecipeProperty; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."RecipeProperty" (id, "recipeId", icon, "titleEn", "titleAr", "textEn", "textAr", "createdAt", "updatedAt") FROM stdin;
cmp0xcg6b0067vzjoz13ipslc	cmp0xcg6b0066vzjockdcpra6	⏱	Prep Time	وقت التحضير	15 min	15 دقيقة	2026-05-11 08:12:56.675	2026-05-11 08:12:56.675
cmp0xcg6b0068vzjotawy0lqf	cmp0xcg6b0066vzjockdcpra6	🔥	Cook Time	وقت الطهي	20 min	20 دقيقة	2026-05-11 08:12:56.675	2026-05-11 08:12:56.675
cmp0xcg6b0069vzjofiieavik	cmp0xcg6b0066vzjockdcpra6	🍽	Servings	الحصص	4 servings	4 حصص	2026-05-11 08:12:56.675	2026-05-11 08:12:56.675
\.


--
-- Data for Name: RecipeStep; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."RecipeStep" (id, "recipeId", "stepEn", "stepAr", "createdAt", "updatedAt") FROM stdin;
cmp0xcg6b006avzjoudvlgb0l	cmp0xcg6b0066vzjockdcpra6	Preheat oven to 200°C.	سخن الفرن على 200 درجة مئوية.	2026-05-11 08:12:56.675	2026-05-11 08:12:56.675
cmp0xcg6b006bvzjoy8f19bne	cmp0xcg6b0066vzjockdcpra6	Place nuggets on baking tray.	ضع الناجتس على صينية الخبز.	2026-05-11 08:12:56.675	2026-05-11 08:12:56.675
cmp0xcg6b006cvzjodi9oi4pr	cmp0xcg6b0066vzjockdcpra6	Bake for 15-20 minutes until golden.	اخبز لمدة 15-20 دقيقة حتى يصبح ذهبياً.	2026-05-11 08:12:56.675	2026-05-11 08:12:56.675
\.


--
-- Data for Name: RecommendedRecipe; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."RecommendedRecipe" (id, "productId", "recipeId", "createdAt", "updatedAt") FROM stdin;
cmp0xcg73006fvzjohzbilfjf	27	cmp0xcg6b0066vzjockdcpra6	2026-05-11 08:12:56.703	2026-05-11 08:12:56.703
\.


--
-- Data for Name: SectionText; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."SectionText" (id, "titleEn", "titleAr", "textEn", "textAr", number, "isHidden", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: SiteSetting; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."SiteSetting" (id, key, "valueEn", "valueAr", description, "updatedAt") FROM stdin;
cmp0xcgff007dvzjob70o57cx	site_title	Orouba Foods	العروبة للأغذية	\N	2026-05-11 08:12:57.004
cmp0xcgff007evzjoupvpo3xn	site_description	Leading food industry company	شركة رائدة في صناعة الغذاء	\N	2026-05-11 08:12:57.004
cmp0xcgff007fvzjoubtim75m	phone	+20 123 456 7890	+20 123 456 7890	\N	2026-05-11 08:12:57.004
cmp0xcgff007gvzjoc16baqy2	email	info@oroubafoods.com	info@oroubafoods.com	\N	2026-05-11 08:12:57.004
cmp0xcgff007hvzjojdye4u0q	address	10th of Ramadan City, Egypt	مدينة العاشر من رمضان، مصر	\N	2026-05-11 08:12:57.004
cmp0xcgff007ivzjocj73j65r	about_text	Orouba for Food Industry is one of the leading companies in the food manufacturing sector in Egypt and the Middle East.	العروبة لصناعة الغذاء هي إحدى الشركات الرائدة في قطاع التصنيع الغذائي في مصر والشرق الأوسط.	\N	2026-05-11 08:12:57.004
\.


--
-- Data for Name: Social; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."Social" (id, image, link, "isHidden", "createdAt", "updatedAt") FROM stdin;
cmp0xcgfx007jvzjo2oi6k3t1	https://camp-coding.site/eloroba/storage/app/images/facebook.png	https://facebook.com/oroubafoods	f	2026-05-11 08:12:57.021	2026-05-11 08:12:57.021
cmp0xcgfx007kvzjoxooun02e	https://camp-coding.site/eloroba/storage/app/images/instagram.png	https://instagram.com/oroubafoods	f	2026-05-11 08:12:57.021	2026-05-11 08:12:57.021
cmp0xcgfx007lvzjoct9yh5al	https://camp-coding.site/eloroba/storage/app/images/youtube.png	https://youtube.com/oroubafoods	f	2026-05-11 08:12:57.021	2026-05-11 08:12:57.021
\.


--
-- Data for Name: SocialParent; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."SocialParent" (id, image, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Standard; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."Standard" (id, "descriptionEn", "descriptionAr", image, "isHidden", "createdAt", "updatedAt") FROM stdin;
cmp0xcga7006qvzjoyqejb5fk	ISO 22000 certified food safety management system.	نظام إدارة سلامة الغذاء معتمد بشهادة ISO 22000.	https://camp-coding.site/eloroba/storage/app/images/standard-iso.png	f	2026-05-11 08:12:56.815	2026-05-11 08:12:56.815
cmp0xcga7006rvzjoz288son7	HACCP compliant production lines.	خطوط إنتاج متوافقة مع نظام HACCP.	https://camp-coding.site/eloroba/storage/app/images/standard-haccp.png	f	2026-05-11 08:12:56.815	2026-05-11 08:12:56.815
\.


--
-- Data for Name: SystemLog; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."SystemLog" (id, "userId", action, date, ip, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."User" (id, name, email, "emailVerified", image, password, role, "createdAt", "updatedAt", permissions, phone) FROM stdin;
cmp13rr8l0000vzis67r3yjda	Super Admin	admin@valueims.com	\N	\N	$2b$10$izIICJAGPtBWx5k6dIS5KuFGn631PLUcYnvLWYT0fG9MVX3jPBv.a	ADMIN	2026-05-11 11:12:48.549	2026-05-11 11:12:48.549	{*}	\N
\.


--
-- Data for Name: Value; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."Value" (id, "titleEn", "titleAr", "descriptionEn", "descriptionAr", image, "isHidden", "createdAt", "updatedAt") FROM stdin;
cmp0xcgap006svzjovt7i1wwr	Quality	الجودة	We maintain the highest quality standards.	نحافظ على أعلى معايير الجودة.	https://camp-coding.site/eloroba/storage/app/images/value-quality.png	f	2026-05-11 08:12:56.834	2026-05-11 08:12:56.834
cmp0xcgap006tvzjomzapqq2e	Innovation	الابتكار	Continuous innovation in food production.	ابتكار مستمر في إنتاج الغذاء.	https://camp-coding.site/eloroba/storage/app/images/value-innovation.png	f	2026-05-11 08:12:56.834	2026-05-11 08:12:56.834
cmp0xcgap006uvzjouuj1jv6u	Integrity	النزاهة	We operate with integrity and transparency.	نعمل بنزاهة وشفافية.	https://camp-coding.site/eloroba/storage/app/images/value-integrity.png	f	2026-05-11 08:12:56.834	2026-05-11 08:12:56.834
\.


--
-- Data for Name: WhyChooseUs; Type: TABLE DATA; Schema: public; Owner: orouba_user
--

COPY public."WhyChooseUs" (id, "descriptionEn", "descriptionAr", "isHidden", "createdAt", "updatedAt") FROM stdin;
cmp0xcgb7006vvzjor86y7iw0	Over 30 years of experience in food industry.	أكثر من 30 عاماً من الخبرة في صناعة الغذاء.	f	2026-05-11 08:12:56.851	2026-05-11 08:12:56.851
cmp0xcgb7006wvzjo6oa598jf	Exported to over 40 countries worldwide.	نُصدّر لأكثر من 40 دولة حول العالم.	f	2026-05-11 08:12:56.851	2026-05-11 08:12:56.851
cmp0xcgb7006xvzjok6tme1r4	State-of-the-art production facilities.	مرافق إنتاج بأحدث التقنيات.	f	2026-05-11 08:12:56.851	2026-05-11 08:12:56.851
\.


--
-- Name: Banner Banner_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."Banner"
    ADD CONSTRAINT "Banner_pkey" PRIMARY KEY (id);


--
-- Name: Brand Brand_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."Brand"
    ADD CONSTRAINT "Brand_pkey" PRIMARY KEY (id);


--
-- Name: Building Building_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."Building"
    ADD CONSTRAINT "Building_pkey" PRIMARY KEY (id);


--
-- Name: CareerRequest CareerRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."CareerRequest"
    ADD CONSTRAINT "CareerRequest_pkey" PRIMARY KEY (id);


--
-- Name: CartItem CartItem_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_pkey" PRIMARY KEY (id);


--
-- Name: CategoryProduct CategoryProduct_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."CategoryProduct"
    ADD CONSTRAINT "CategoryProduct_pkey" PRIMARY KEY (id);


--
-- Name: CategoryTypeCategory CategoryTypeCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."CategoryTypeCategory"
    ADD CONSTRAINT "CategoryTypeCategory_pkey" PRIMARY KEY (id);


--
-- Name: CategoryType CategoryType_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."CategoryType"
    ADD CONSTRAINT "CategoryType_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: Certificate Certificate_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."Certificate"
    ADD CONSTRAINT "Certificate_pkey" PRIMARY KEY (id);


--
-- Name: CollaborateRequest CollaborateRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."CollaborateRequest"
    ADD CONSTRAINT "CollaborateRequest_pkey" PRIMARY KEY (id);


--
-- Name: ContactRequest ContactRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."ContactRequest"
    ADD CONSTRAINT "ContactRequest_pkey" PRIMARY KEY (id);


--
-- Name: Continent Continent_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."Continent"
    ADD CONSTRAINT "Continent_pkey" PRIMARY KEY (id);


--
-- Name: Country Country_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."Country"
    ADD CONSTRAINT "Country_pkey" PRIMARY KEY (id);


--
-- Name: Feature Feature_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."Feature"
    ADD CONSTRAINT "Feature_pkey" PRIMARY KEY (id);


--
-- Name: Food Food_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."Food"
    ADD CONSTRAINT "Food_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: ProductImage ProductImage_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."ProductImage"
    ADD CONSTRAINT "ProductImage_pkey" PRIMARY KEY (id);


--
-- Name: ProductSocial ProductSocial_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."ProductSocial"
    ADD CONSTRAINT "ProductSocial_pkey" PRIMARY KEY (id);


--
-- Name: ProductType ProductType_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."ProductType"
    ADD CONSTRAINT "ProductType_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: ProductionStep ProductionStep_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."ProductionStep"
    ADD CONSTRAINT "ProductionStep_pkey" PRIMARY KEY (id);


--
-- Name: RecipeCategoryFood RecipeCategoryFood_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."RecipeCategoryFood"
    ADD CONSTRAINT "RecipeCategoryFood_pkey" PRIMARY KEY (id);


--
-- Name: RecipeCategory RecipeCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."RecipeCategory"
    ADD CONSTRAINT "RecipeCategory_pkey" PRIMARY KEY (id);


--
-- Name: RecipeFood RecipeFood_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."RecipeFood"
    ADD CONSTRAINT "RecipeFood_pkey" PRIMARY KEY (id);


--
-- Name: RecipeImage RecipeImage_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."RecipeImage"
    ADD CONSTRAINT "RecipeImage_pkey" PRIMARY KEY (id);


--
-- Name: RecipeProperty RecipeProperty_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."RecipeProperty"
    ADD CONSTRAINT "RecipeProperty_pkey" PRIMARY KEY (id);


--
-- Name: RecipeStep RecipeStep_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."RecipeStep"
    ADD CONSTRAINT "RecipeStep_pkey" PRIMARY KEY (id);


--
-- Name: Recipe Recipe_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."Recipe"
    ADD CONSTRAINT "Recipe_pkey" PRIMARY KEY (id);


--
-- Name: RecommendedRecipe RecommendedRecipe_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."RecommendedRecipe"
    ADD CONSTRAINT "RecommendedRecipe_pkey" PRIMARY KEY (id);


--
-- Name: SectionText SectionText_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."SectionText"
    ADD CONSTRAINT "SectionText_pkey" PRIMARY KEY (id);


--
-- Name: SiteSetting SiteSetting_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."SiteSetting"
    ADD CONSTRAINT "SiteSetting_pkey" PRIMARY KEY (id);


--
-- Name: SocialParent SocialParent_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."SocialParent"
    ADD CONSTRAINT "SocialParent_pkey" PRIMARY KEY (id);


--
-- Name: Social Social_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."Social"
    ADD CONSTRAINT "Social_pkey" PRIMARY KEY (id);


--
-- Name: Standard Standard_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."Standard"
    ADD CONSTRAINT "Standard_pkey" PRIMARY KEY (id);


--
-- Name: SystemLog SystemLog_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."SystemLog"
    ADD CONSTRAINT "SystemLog_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Value Value_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."Value"
    ADD CONSTRAINT "Value_pkey" PRIMARY KEY (id);


--
-- Name: WhyChooseUs WhyChooseUs_pkey; Type: CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."WhyChooseUs"
    ADD CONSTRAINT "WhyChooseUs_pkey" PRIMARY KEY (id);


--
-- Name: Banner_isHidden_idx; Type: INDEX; Schema: public; Owner: orouba_user
--

CREATE INDEX "Banner_isHidden_idx" ON public."Banner" USING btree ("isHidden");


--
-- Name: Brand_isHidden_idx; Type: INDEX; Schema: public; Owner: orouba_user
--

CREATE INDEX "Brand_isHidden_idx" ON public."Brand" USING btree ("isHidden");


--
-- Name: CartItem_sessionId_productId_key; Type: INDEX; Schema: public; Owner: orouba_user
--

CREATE UNIQUE INDEX "CartItem_sessionId_productId_key" ON public."CartItem" USING btree ("sessionId", "productId");


--
-- Name: CategoryProduct_categoryId_productId_key; Type: INDEX; Schema: public; Owner: orouba_user
--

CREATE UNIQUE INDEX "CategoryProduct_categoryId_productId_key" ON public."CategoryProduct" USING btree ("categoryId", "productId");


--
-- Name: CategoryTypeCategory_categoryId_categoryTypeId_key; Type: INDEX; Schema: public; Owner: orouba_user
--

CREATE UNIQUE INDEX "CategoryTypeCategory_categoryId_categoryTypeId_key" ON public."CategoryTypeCategory" USING btree ("categoryId", "categoryTypeId");


--
-- Name: CategoryType_isHidden_idx; Type: INDEX; Schema: public; Owner: orouba_user
--

CREATE INDEX "CategoryType_isHidden_idx" ON public."CategoryType" USING btree ("isHidden");


--
-- Name: Category_brandId_idx; Type: INDEX; Schema: public; Owner: orouba_user
--

CREATE INDEX "Category_brandId_idx" ON public."Category" USING btree ("brandId");


--
-- Name: Category_isHidden_idx; Type: INDEX; Schema: public; Owner: orouba_user
--

CREATE INDEX "Category_isHidden_idx" ON public."Category" USING btree ("isHidden");


--
-- Name: Food_isHidden_idx; Type: INDEX; Schema: public; Owner: orouba_user
--

CREATE INDEX "Food_isHidden_idx" ON public."Food" USING btree ("isHidden");


--
-- Name: ProductType_isHidden_idx; Type: INDEX; Schema: public; Owner: orouba_user
--

CREATE INDEX "ProductType_isHidden_idx" ON public."ProductType" USING btree ("isHidden");


--
-- Name: Product_isHidden_idx; Type: INDEX; Schema: public; Owner: orouba_user
--

CREATE INDEX "Product_isHidden_idx" ON public."Product" USING btree ("isHidden");


--
-- Name: Product_typeId_idx; Type: INDEX; Schema: public; Owner: orouba_user
--

CREATE INDEX "Product_typeId_idx" ON public."Product" USING btree ("typeId");


--
-- Name: RecipeCategoryFood_recipeCategoryId_foodId_key; Type: INDEX; Schema: public; Owner: orouba_user
--

CREATE UNIQUE INDEX "RecipeCategoryFood_recipeCategoryId_foodId_key" ON public."RecipeCategoryFood" USING btree ("recipeCategoryId", "foodId");


--
-- Name: RecipeFood_recipeId_foodId_key; Type: INDEX; Schema: public; Owner: orouba_user
--

CREATE UNIQUE INDEX "RecipeFood_recipeId_foodId_key" ON public."RecipeFood" USING btree ("recipeId", "foodId");


--
-- Name: Recipe_isHidden_idx; Type: INDEX; Schema: public; Owner: orouba_user
--

CREATE INDEX "Recipe_isHidden_idx" ON public."Recipe" USING btree ("isHidden");


--
-- Name: RecommendedRecipe_productId_recipeId_key; Type: INDEX; Schema: public; Owner: orouba_user
--

CREATE UNIQUE INDEX "RecommendedRecipe_productId_recipeId_key" ON public."RecommendedRecipe" USING btree ("productId", "recipeId");


--
-- Name: SiteSetting_key_key; Type: INDEX; Schema: public; Owner: orouba_user
--

CREATE UNIQUE INDEX "SiteSetting_key_key" ON public."SiteSetting" USING btree (key);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: orouba_user
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: CartItem CartItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CartItem CartItem_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CategoryProduct CategoryProduct_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."CategoryProduct"
    ADD CONSTRAINT "CategoryProduct_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CategoryProduct CategoryProduct_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."CategoryProduct"
    ADD CONSTRAINT "CategoryProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CategoryTypeCategory CategoryTypeCategory_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."CategoryTypeCategory"
    ADD CONSTRAINT "CategoryTypeCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CategoryTypeCategory CategoryTypeCategory_categoryTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."CategoryTypeCategory"
    ADD CONSTRAINT "CategoryTypeCategory_categoryTypeId_fkey" FOREIGN KEY ("categoryTypeId") REFERENCES public."CategoryType"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Category Category_brandId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES public."Brand"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Country Country_continentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."Country"
    ADD CONSTRAINT "Country_continentId_fkey" FOREIGN KEY ("continentId") REFERENCES public."Continent"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ProductImage ProductImage_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."ProductImage"
    ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProductSocial ProductSocial_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."ProductSocial"
    ADD CONSTRAINT "ProductSocial_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Product Product_typeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES public."ProductType"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: RecipeCategoryFood RecipeCategoryFood_foodId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."RecipeCategoryFood"
    ADD CONSTRAINT "RecipeCategoryFood_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES public."Food"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RecipeCategoryFood RecipeCategoryFood_recipeCategoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."RecipeCategoryFood"
    ADD CONSTRAINT "RecipeCategoryFood_recipeCategoryId_fkey" FOREIGN KEY ("recipeCategoryId") REFERENCES public."RecipeCategory"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RecipeFood RecipeFood_foodId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."RecipeFood"
    ADD CONSTRAINT "RecipeFood_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES public."Food"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RecipeFood RecipeFood_recipeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."RecipeFood"
    ADD CONSTRAINT "RecipeFood_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES public."Recipe"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RecipeImage RecipeImage_recipeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."RecipeImage"
    ADD CONSTRAINT "RecipeImage_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES public."Recipe"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RecipeProperty RecipeProperty_recipeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."RecipeProperty"
    ADD CONSTRAINT "RecipeProperty_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES public."Recipe"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RecipeStep RecipeStep_recipeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."RecipeStep"
    ADD CONSTRAINT "RecipeStep_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES public."Recipe"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RecommendedRecipe RecommendedRecipe_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."RecommendedRecipe"
    ADD CONSTRAINT "RecommendedRecipe_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RecommendedRecipe RecommendedRecipe_recipeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: orouba_user
--

ALTER TABLE ONLY public."RecommendedRecipe"
    ADD CONSTRAINT "RecommendedRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES public."Recipe"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict ma2j0TUj85pgaqEHapkZHet3D4vz3c8TJU0EXOge98dYPdSSr2flFAx2w77rqS9

