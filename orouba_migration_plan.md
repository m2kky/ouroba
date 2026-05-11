# 🏗️ خطة تحويل موقع العروبة — Laravel → Next.js

> **آخر تحديث:** بعد استكشاف الداشبورد والموقع الحي + إجابات العميل

---

## 📌 القرارات المؤكدة

| القرار | التفاصيل |
|--------|----------|
| **URLs** | هنحسن الروابط (مثلاً `/Reciepe` → `/recipes`) |
| **Storage** | Cloudflare R2 أو خدمة مشابهة للصور والملفات |
| **Mobile App** | مخطط له في المستقبل — لازم API layer يكون جاهز |
| **Database** | هنحسن الـ schema عن القديم لتكون أسرع |
| **Features جديدة** | لا حالياً — نفس الوظائف بس بتقنيات أحسن |

---

## 📋 أولاً: هل معانا الفرونت اند الأصلية؟

### ✅ اللي عندنا فعلاً:

| العنصر | الحالة | التفاصيل |
|--------|--------|----------|
| **الكود المصدري (JSX/JS)** | ✅ موجود جزئياً | **68 ملف** تم استخراجهم من Source Maps |
| **هيكل الكومبوننتس** | ✅ موجود | App.js, Routes, Pages, Layouts, Reducers |
| **الـ Redux Store** | ✅ موجود | `cartReducer`, `siteReducer`, `languageReducer`, `favoriteReducer`, `offlineCartReducer` |
| **الـ Routing** | ✅ موجود | 13 route كاملين (Home, Brands, Recipes, Export, Careers, Contact, etc.) |
| **الـ API Base URL** | ✅ موجود | `https://camp-coding.site/eloroba/api/` |
| **صور ثابتة (Static Media)** | ✅ موجود | 29 ملف (logos, certificates, sliders, backgrounds) |
| **SVG Icons** | ✅ موجود | مجلد `svgIcons/` |

### ❌ اللي ناقصنا:

| العنصر | الحالة | التأثير |
|--------|--------|---------|
| **CSS / Styles** | ❌ ناقص بشكل كبير | عندنا بس 2 ملف CSS Module (`Careers.module.css`, `WhoWeAre.module.css`). **الـ App.css الرئيسي مش موجود** ولا باقي الـ styles |
| **الـ Compiled CSS** | ⚠️ موجود مضغوط | `main.56115a45.css` — ملف CSS واحد minified يحتوي كل الستايلات بس مش readable |
| **صور ديناميكية** | ❌ على السيرفر القديم | كل صور المنتجات والبرندز والوصفات مستضافة على `camp-coding.site` |
| **الفونتات** | ❌ غير محدد | لازم نشوفهم من الموقع الحي |
| **Animations / Transitions** | ⚠️ جزئي | الكود فيه استخدام لـ `rsuite Loader` و `react-loading-skeleton` بس الـ CSS animations مش واضحة |

### 💡 الخلاصة:
> **معانا الهيكل البرمجي (skeleton) كامل — لكن مش معانا الـ "الجلد" (CSS/Styles/Animations).** يعني نقدر نفهم كل component بيعمل إيه وبياخد إيه data، لكن لازم نعمل pixel-perfect matching من الموقع الحي أو نفك الـ compiled CSS.

---

## ⚖️ ثانياً: Next.js vs NestJS — أيهما أفضل للمشروع ده؟

### مقارنة مباشرة:

| المعيار | Next.js | NestJS |
|---------|---------|--------|
| **نوع الفريمورك** | Full-stack (Frontend + Backend) | Backend فقط (API only) |
| **الفرونت اند** | ✅ مدمج — React SSR/SSG | ❌ محتاج فرونت منفصل (React/Vue) |
| **الباك اند / API** | ✅ Route Handlers + Server Actions | ✅ Controllers + Services (أقوى) |
| **SEO** | ✅ ممتاز — SSR + metadata API | ❌ مش بيأثر (API بس) |
| **الأداء** | ✅ أسرع بكتير — SSR + Static Generation | ⚠️ عادي — SPA loading |
| **الـ Database** | ✅ Prisma ORM يشتغل مباشرة | ✅ TypeORM / Prisma |
| **Authentication** | ✅ NextAuth.js مدمج | ✅ Passport.js |
| **عدد المشاريع** | **مشروع واحد** | **مشروعين** (backend + frontend) |
| **الـ Deployment** | ✅ أبسط — Vercel / VPS واحد | ⚠️ محتاج 2 deployments |
| **تعقيد الباك اند** | ⚠️ كويس لـ CRUD بسيط-متوسط | ✅ أفضل لـ complex business logic |
| **Community / Ecosystem** | ✅ أكبر وأنشط | ✅ كويس بس أصغر |

### 🎯 التوصية النهائية: **Next.js هو الأنسب ١٠٠٪ للمشروع ده**

**الأسباب:**

1. **المشروع ده في الأساس موقع Content/Marketing + Dashboard بسيط** — مش فيه business logic معقد يحتاج NestJS.
2. **الـ API endpoints بسيطة** — كلها CRUD operations على ~35 جدول.
3. **الـ SEO حاسم** — ده موقع B2B لشركة أغذية، لازم Google يشوفه كويس. Next.js بيدي SSR مجاني.
4. **التوفير في الوقت** — مشروع واحد بدل اتنين = نص الوقت تقريباً.
5. **الأداء** — الموقع الحالي بطيء لأنه SPA (React) + API خارجي (Laravel). Next.js هيخلي كل حاجة server-rendered وسريعة جداً.
6. **الفرونت اند الأصلي React** — وNext.js هو React بالظبط + extras.

> [!IMPORTANT]
> **بما إن فيه mobile app في المستقبل:**
> هنبني الـ API Routes في Next.js كـ **RESTful API نظيف ومنفصل** بحيث الـ mobile app يقدر يستخدمه مباشرة بدون أي تعديل. لو الـ mobile app احتاج API أكثر تعقيداً في المستقبل، ممكن نضيف NestJS كـ microservice جنب Next.js.

---

## 🗺️ ثالثاً: خطة التنفيذ المفصلة

### Tech Stack النهائي:

```
Frontend:  Next.js 15 (App Router) + TypeScript + Tailwind CSS
Backend:   Next.js API Routes (RESTful — mobile-ready)
Database:  PostgreSQL 16 (VPS) + Prisma ORM (محسّن)
Auth:      NextAuth.js (Credentials — Admin only) + JWT للـ API
State:     React Query (TanStack Query) for data fetching
i18n:      next-intl (Arabic/English)
Storage:   Cloudflare R2 (صور + ملفات)
Deploy:    VPS (Docker) or Vercel
```

### 🏗️ Architecture Diagram:

```
┌──────────────────────────────────────────┐
│              Next.js 15 App              │
│  ┌────────────┐  ┌────────────────────┐  │
│  │  Frontend   │  │   API Routes       │  │
│  │  (SSR/SSG) │  │   /api/v1/*        │◄─┼── Future Mobile App
│  │  Pages +   │  │   RESTful JSON     │  │
│  │  Components│  │   + Auth (JWT)     │  │
│  └─────┬──────┘  └────────┬───────────┘  │
│        │                  │              │
│        └──────┬───────────┘              │
│               ▼                          │
│        ┌──────────────┐                  │
│        │  Prisma ORM  │                  │
│        └──────┬───────┘                  │
└───────────────┼──────────────────────────┘
                ▼
        ┌──────────────┐     ┌─────────────┐
        │ PostgreSQL   │     │ Cloudflare  │
        │ 16 (VPS)     │     │ R2 Storage  │
        └──────────────┘     └─────────────┘
```

---

### 🔵 Phase 1: تحضير قاعدة البيانات (3-4 أيام)

**الهدف:** تحويل الـ MySQL schema من ملف SQL إلى PostgreSQL + Prisma

| # | المهمة | التفاصيل |
|---|--------|----------|
| 1.1 | ✅ مراجعة كل الـ 35 جدول من ملف SQL | مقارنة `campcod3_eloroba.sql` مع `schema.prisma` الحالي |
| 1.2 | ✅ تحديث `schema.prisma` بالحقول الناقصة | جداول ناقصة: `logs`, `food`, `food_cooks`, `food_steps`, `cook_props`, `cook_images`, `product_images`, `recipe_foods`, `recommend_recipes`, `types`, `social_parents`, `category_type_categories` |
| 1.3 | ✅ ضبط العلاقات (Relations) | مطابقة الـ foreign keys من SQL بالظبط |
| 1.4 | ✅ كتابة Seed Script | نقل البيانات الحقيقية من API → PostgreSQL |
| 1.5 | ✅ تشغيل `prisma migrate` | إنشاء قاعدة البيانات النهائية |

> [!NOTE]
> **جداول ناقصة في الـ Prisma الحالي مقارنة بالـ SQL:**
> - `cook_props` — مكونات الوصفات
> - `cook_images` — صور إضافية للوصفات
> - `food` / `food_cooks` / `food_steps` — نظام الأطعمة والخطوات
> - `product_images` — صور متعددة للمنتجات
> - `recipe_foods` / `recommend_recipes` — علاقات الوصفات بالأطعمة
> - `types` — أنواع المنتجات
> - `social_parents` — روابط سوشيال ميديا للأقسام
> - `category_type_categories` — علاقة pivot بين Categories و CategoryTypes
> - `logs` — سجل العمليات

#### 🚀 تحسينات قاعدة البيانات (مقارنة بالقديمة):

| التحسين | القديم (MySQL/Laravel) | الجديد (PostgreSQL/Prisma) |
|---------|----------------------|---------------------------|
| **Indexing** | لا يوجد indexes مناسبة | Composite indexes على الحقول المستخدمة في الفلتر (`isHidden`, `brand_id`, `category_id`) |
| **IDs** | Auto-increment `bigint` | `cuid()` — أسرع في الـ distributed systems وآمن للـ API |
| **Text Fields** | `varchar(255)` لكل حاجة | `@db.Text` للوصف الطويل، `String` للقصير |
| **Soft Delete** | `hidden tinyint` | `isHidden Boolean` + `@@index` |
| **Relations** | بدون Foreign Key constraints | Prisma relations مع `onDelete: Cascade` |
| **Query Performance** | N+1 queries في Laravel | Prisma `include` + React Query caching |
| **Connection Pooling** | لا يوجد | Prisma connection pool + PgBouncer |
| **الأخطاء الإملائية** | `contiries` بدل `countries` | أسماء نظيفة ومعيارية |
| **Timestamps** | `timestamp NULL` | `@default(now())` + `@updatedAt` تلقائي |

---

### 🟢 Phase 2: بناء الـ API Layer (5-7 أيام)

**الهدف:** بناء كل الـ endpoints اللي الفرونت بتستدعيها

من تحليل الكود المستخرج، الـ API calls الأساسية هي:

```
GET  /api/site_info/get_all_for_user          → بيانات الموقع العامة
GET  /api/pages/about_page                    → صفحة من نحن
GET  /api/pages/contact_page                  → صفحة اتصل بنا
GET  /api/user/get_for_user                   → بيانات المستخدم
GET  /api/user/get_all_for_user               → كل المستخدمين
GET  /api/cart/all_carts_for_user              → عربة التسوق
POST /api/contacts                            → إرسال رسالة
POST /api/collaborates                        → طلب تعاون
POST /api/joins                               → طلب وظيفة
GET  /api/brands                              → البرندز (بسمة، فريدة، باببيتس)
GET  /api/categories                          → الأقسام
GET  /api/products                            → المنتجات
GET  /api/cooks (recipes)                     → الوصفات
GET  /api/category_types                      → أنواع الأقسام
GET  /api/continents + /contiries             → القارات والدول
GET  /api/certifications                      → الشهادات
GET  /api/banners                             → البانرات/السلايدرز
GET  /api/buildings                           → مباني المصنع
GET  /api/production_steps                    → خطوات الإنتاج
GET  /api/features                            → المميزات
GET  /api/values                              → القيم
GET  /api/why_chooses                         → لماذا تختارنا
GET  /api/standards                           → المعايير
GET  /api/socials                             → روابط السوشيال
```

| # | المهمة | التفاصيل |
|---|--------|----------|
| 2.1 | إنشاء Prisma Client singleton | `src/lib/prisma.ts` |
| 2.2 | بناء API routes لكل endpoint | `src/app/api/[entity]/route.ts` |
| 2.3 | بناء Admin CRUD endpoints | `src/app/api/admin/[entity]/route.ts` (GET, POST, PUT, DELETE) |
| 2.4 | إعداد NextAuth.js | Credentials provider للأدمن |
| 2.5 | إعداد middleware للحماية | حماية routes الأدمن |

---

### 🟡 Phase 3: إعادة بناء الفرونت اند (10-14 يوم) ⚠️ أكبر مرحلة

**الهدف:** نسخة متطابقة pixel-perfect من الموقع الحالي

**الاستراتيجية:**
1. نأخذ screenshots من الموقع الحي لكل صفحة
2. نستخدم الكومبوننتس المستخرجة كمرجع للهيكل والـ logic
3. نفك الـ compiled CSS (`main.56115a45.css`) لاستخراج الـ styles
4. نبني كل component في Next.js مع Tailwind أو CSS Modules

#### الصفحات المطلوبة:

| # | الصفحة | Route الحالي | Route الجديد |
|---|--------|-------------|-------------|
| 1 | الرئيسية | `/:lang` | `/[locale]` |
| 2 | الوصفات | `/Reciepe/:lang` | `/[locale]/recipes` |
| 3 | تفاصيل الوصفة | `/recipe_details/:id/.../:lang` | `/[locale]/recipes/[id]` |
| 4 | أنواع المنتجات | `/about/ProductType/:lang` | `/[locale]/products` |
| 5 | فئة المنتج | `/brands/ProductType/ProductTypeCategory/.../:lang` | `/[locale]/products/[categoryId]` |
| 6 | من نحن | `/about/whoWeAre/:lang` | `/[locale]/about` |
| 7 | الشهادات | `/about/certifications/:lang` | `/[locale]/certifications` |
| 8 | التصدير | `/export/:lang` | `/[locale]/export` |
| 9 | كتالوج التصدير | `/ExportCatalog/:lang` | `/[locale]/export/catalog` |
| 10 | الوظائف | `/career/:lang` | `/[locale]/careers` |
| 11 | اتصل بنا | `/ContactUs/:lang` | `/[locale]/contact` |
| 12 | ✅ البراند | `/Brands/:id/:lang` | `/[locale]/brands/[id]` |
| 13 | تفاصيل البراند | `/Brands/:brandName/:brandId/.../:lang` | `/[locale]/brands/[id]/[categoryId]` |

#### الكومبوننتس الأساسية:

| المجموعة | الكومبوننتس |
|----------|-------------|
| **Layout** | Header (TopHeader, BottomHeader, HeaderIcons, SearchBox), Footer, DefaultLayout, BreadcrumbsLinks |
| **Home** | HeroSection, Banner (Video/Image Slider), Brands Carousel, Recipes Section, Standards, WhyUs, MapSection |
| **Brands** | ✅ Brand Cards, ✅ Brand Category Data, Brand Products |
| **Recipes** | Recipe Categories, Recipe Cards, Recipe Details (Banner, About, Features) |
| **Export** | ExportBanner, ExportCountries, ExportCertifications, ExportStandards, ExportForm |
| **Content** | WhoWeAre, Certifications, Values, Careers, ContactUs |
| **Shared** | SectionTitle, SVG Icons, Loading Skeletons |

---

### 🟠 Phase 4: لوحة التحكم — Admin Dashboard (7-10 أيام)

**الهدف:** داشبورد كامل لإدارة المحتوى (مطابق للداشبورد الحالي)

> تم استكشاف الداشبورد الحالي على `orouba-dashboard-main.vercel.app` وتوثيق **17 قسم** كامل.

| # | القسم | العمليات | ملاحظات |
|---|-------|----------|--------|
| 4.1 | **Login** | تسجيل دخول الأدمن | Credentials only |
| 4.2 | **Brands** | إضافة/تعديل/حذف/إخفاء | صور متعددة (Main, Small, Logo) + Color Picker |
| 4.3 | **Types** | إضافة/تعديل/إخفاء | أسماء عربي/إنجليزي |
| 4.4 | **Products** | إضافة/تعديل/إخفاء + Nested Categories & Recipes | صورة + لون + نوع |
| 4.5 | **Recipes (Cooking)** | إضافة/تعديل/إخفاء | أسماء + صورتين + رابط فيديو |
| 4.6 | **Recipe Category** | إضافة/تعديل/إخفاء + Sub Categories | ترتيب + صورة |
| 4.7 | **Banners** | إضافة/تعديل/إخفاء | فيديو (Main + Small) عربي/إنجليزي |
| 4.8 | **Certificates** | إضافة/تعديل/إخفاء | صورة فقط |
| 4.9 | **Standards** | إضافة/تعديل/إخفاء | وصف + صورة |
| 4.10 | **Values** | إضافة/تعديل/إخفاء | عنوان + وصف + صورة |
| 4.11 | **Why Choose Us** | إضافة/تعديل/إخفاء | وصف عربي/إنجليزي |
| 4.12 | **Buildings** | إضافة/تعديل/إخفاء | عنوان + وصف + صورة |
| 4.13 | **Features** | إضافة/تعديل/إخفاء | عنوان + وصف + صورة |
| 4.14 | **Continent** | إضافة/تعديل/إخفاء + Nested Countries | أسماء عربي/إنجليزي |
| 4.15 | **Collaborates** | عرض فقط (Read-only) | اسم + إيميل + تليفون |
| 4.16 | **Joins** | عرض فقط (Read-only) | اسم + تليفون + إيميل + الوظيفة |
| 4.17 | **Contacts** | عرض فقط (Read-only) | اسم + تليفون + إيميل |
| 4.18 | **Site Info** | تعديل فقط | لوجوهات + خريطة + رؤية + كتالوجات PDF + سوشيال + بيانات تواصل |

#### UI Components المطلوبة للداشبورد:
- **Sidebar Navigation** — 17 عنصر مع active state
- **Data Tables** — sorting + pagination + action buttons (Edit ✏️, Toggle 👁️, Delete 🗑️)
- **Modal Forms** — لعمليات Add/Edit
- **Rich Text Editor** — React Quill أو Tiptap للنصوص الطويلة
- **Color Picker** — للبرندز والمنتجات
- **File Uploader** — صور + فيديو مع Preview + حذف → رفع على Cloudflare R2
- **Multilingual Inputs** — كل حقل نصي ليه نسختين (عربي/إنجليزي)

---

### 🔴 Phase 5: الترجمة والـ i18n (3-4 أيام)

**الهدف:** دعم كامل عربي/إنجليزي

| # | المهمة | التفاصيل |
|---|--------|----------|
| 5.1 | إعداد `next-intl` | Middleware + locale detection |
| 5.2 | ملفات الترجمة | `messages/ar.json` + `messages/en.json` لكل النصوص الثابتة |
| 5.3 | RTL Support | تبديل الاتجاه تلقائياً حسب اللغة |
| 5.4 | تحويل الأرقام | أرقام عربية ← أرقام هندية (كما في الكود الأصلي) |
| 5.5 | الـ Dynamic Content | عرض `nameAr`/`nameEn` حسب اللغة المختارة |

---

### 🟣 Phase 6: النشر والتشغيل (2-3 أيام)

| # | المهمة | التفاصيل |
|---|--------|----------|
| 6.1 | Docker Setup | `docker-compose.yml` لـ PostgreSQL + Next.js |
| 6.2 | ترحيل الصور | نقل الصور من `camp-coding.site` → storage جديد (S3 / VPS local) |
| 6.3 | ترحيل البيانات | تشغيل الـ Seed script بالبيانات الحقيقية |
| 6.4 | Domain Setup | ربط `oroubafoods.com` بالسيرفر الجديد |
| 6.5 | SSL + CDN | شهادة أمان + Cloudflare |
| 6.6 | اختبار نهائي | مقارنة pixel-perfect مع الموقع القديم |

---

## ⏱️ الجدول الزمني الكلي

| المرحلة | المدة | البداية |
|---------|-------|---------|
| Phase 1: Database | 3-4 أيام | الأسبوع 1 |
| Phase 2: API Layer | 5-7 أيام | الأسبوع 1-2 |
| Phase 3: Frontend | 10-14 يوم | الأسبوع 2-4 |
| Phase 4: Admin Dashboard | 7-10 أيام | الأسبوع 3-5 |
| Phase 5: i18n | 3-4 أيام | الأسبوع 5 |
| Phase 6: Deployment | 2-3 أيام | الأسبوع 5-6 |

> **الإجمالي: ~30-42 يوم عمل (6-8 أسابيع)**

---

## ⚠️ المخاطر والتحديات

| المخاطر | الحل |
|---------|------|
| **CSS الأصلي ناقص** | نفك الـ compiled CSS + نأخذ screenshots من الموقع الحي كمرجع |
| **صور المنتجات على سيرفر خارجي** | ننقلها بـ migration script إلى Cloudflare R2 |
| **أنيميشن مش واضحة بالكامل** | لازم نسجل الموقع الحي فيديو ونحلل كل animation |
| **حجم البيانات كبير (55MB SQL)** | الـ seed script لازم يكون incremental |
| **الـ Schema القديم فيه أخطاء** | مثلاً الجدول اسمه `contiries` بدل `countries` — لازم ننظف |
| **Mobile App في المستقبل** | API مبني من الأول كـ RESTful + JWT ready |

---

## ✅ إجابات الأسئلة المفتوحة (تم التأكيد)

| السؤال | الإجابة |
|--------|--------|
| الداشبورد شغال؟ | ✅ أيوه — تم استكشافه وتوثيق 17 قسم |
| نحافظ على نفس الـ URLs؟ | ❌ لا — هنحسنها (أنظف وأقصر) |
| Features جديدة؟ | ❌ لا حالياً |
| استضافة الصور؟ | Cloudflare R2 أو خدمة مشابهة |
| Mobile app؟ | ✅ مخطط له — API جاهز من الأول |
| تحسين الداتابيز؟ | ✅ هنحسنها (indexes, naming, types) |

---

## 🔜 الخطوة التالية

**جاهزين نبدأ Phase 1** — تحديث الـ Prisma Schema بالكامل بناءً على ملف SQL + تحسينات الداتابيز.

عايز أبدأ؟ 🚀
