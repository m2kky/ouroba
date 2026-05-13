# 🔒 تقرير الفحص الأمني الشامل — Orouba Foods Platform

**التاريخ:** 13 مايو 2026  
**الهدف:** `demo.oroubafoods.com` + الكود المحلي  
**المراجع:** كل ملفات API، Authentication، Middleware، Upload، والـ Configuration

---

## ملخص تنفيذي

| المستوى | العدد | الوصف |
|---------|-------|-------|
| 🔴 حرج (Critical) | **3** | يجب إصلاحه فوراً — خطر اختراق مباشر |
| 🟠 عالي (High) | **4** | مهم جداً — يسبب تسريب بيانات أو استغلال |
| 🟡 متوسط (Medium) | **3** | يحتاج تحسين قبل الإنتاج الكامل |
| 🟢 منخفض (Low) | **2** | تحسينات عامة |

---

## 🔴 مشاكل حرجة (Critical) — يجب الإصلاح فوراً

### 1. 🔴 مفتاح SSH الخاص (Private Key) متخزن في Git ومتاح للعالم!

**الملف:** [coolify_key](file:///d:/projects/ouroba/orouba-admin/coolify_key)

> [!CAUTION]
> مفتاح SSH الخاص بتاع Coolify (`coolify_key`) **مترفع على GitHub**! أي حد عنده Access على الريبو يقدر يستخدمه عشان يدخل السيرفر بتاعك مباشرة عن طريق SSH. ده خطر اختراق كامل للسيرفر.

**الإصلاح المطلوب:**
1. امسح الملف فوراً من Git:
   ```bash
   git rm orouba-admin/coolify_key
   git commit -m "security: remove exposed SSH private key"
   git push
   ```
2. روح على Coolify وغيّر الـ SSH Key فوراً (Regenerate Key).
3. أضف `coolify_key` في `.gitignore`.

---

### 2. 🔴 الـ Public API Routes (POST) مفتوحة بدون أي حماية (Authentication)!

**الملفات المتأثرة:**
- [/api/recipes POST](file:///d:/projects/ouroba/orouba-admin/src/app/api/recipes/route.ts#L39-L70) — أي حد يقدر **يضيف وصفات** في الداتا بيز بدون تسجيل دخول!
- [/api/products POST](file:///d:/projects/ouroba/orouba-admin/src/app/api/products/route.ts#L61-L93) — أي حد يقدر **يضيف منتجات** في الداتا بيز!
- [/api/contacts POST](file:///d:/projects/ouroba/orouba-admin/src/app/api/contacts/route.ts#L6-L21) — مفتوح لـ spam بدون Rate Limiting.
- [/api/collaborates POST](file:///d:/projects/ouroba/orouba-admin/src/app/api/collaborates/route.ts#L6-L21) — مفتوح لـ spam بدون Rate Limiting.
- [/api/careers POST](file:///d:/projects/ouroba/orouba-admin/src/app/api/careers/route.ts#L7-L34) — مفتوح لأي حد يرفع ملفات على الـ R2 بتاعك! (هاكر يقدر يرفع ملفات خبيثة ويملالك السيرفر).

> [!WARNING]
> الـ Recipes و Products POST routes مفروض تكون للـ Admin بس (زي الـ `/api/admin/recipes`). لكن في نسخة تانية عامة من نفس الـ route بدون أي Auth check، وده يسمح لأي حد يكتب في الداتا بيز بتاعك!

**الإصلاح المطلوب:**
- احذف الـ `POST` handlers من الـ Public routes (`/api/recipes`, `/api/products`) لأنها متكررة مع الـ Admin versions.
- أو أضف `getServerSession` check عليها.

---

### 3. 🔴 الـ Admin GET Routes بدون Authentication!

**الملف:** [/api/admin/recipes GET](file:///d:/projects/ouroba/orouba-admin/src/app/api/admin/recipes/route.ts#L7-L23)

الـ `GET` handler في `/api/admin/recipes` **مفيهوش `getServerSession` check** — أي حد يقدر يجيب كل الوصفات بالكامل مع كل التفاصيل الداخلية. نفس المشكلة في:
- `/api/contacts GET` — أي حد يقدر يقرأ **كل بيانات العملاء** (أسماء، إيميلات، أرقام تليفونات)!
- `/api/careers GET` — نفس المشكلة.
- `/api/collaborates GET` — نفس المشكلة.

> [!CAUTION]
> ده معناه إن أي هاكر يقدر يكتب في المتصفح `https://demo.oroubafoods.com/api/contacts` ويشوف **كل بيانات العملاء اللي بعتوا رسائل**!

---

## 🟠 مشاكل عالية الخطورة (High)

### 4. 🟠 ثغرة XSS — استخدام `dangerouslySetInnerHTML` بدون Sanitization

**الملفات المتأثرة:**
- [RecipeAbout.tsx](file:///d:/projects/ouroba/orouba-admin/src/components/recipes/RecipeAbout.tsx#L68)
- [recipes/[id]/page.tsx](file:///d:/projects/ouroba/orouba-admin/src/app/%5Blocale%5D/recipes/%5Bid%5D/page.tsx#L79)
- [products/details page](file:///d:/projects/ouroba/orouba-admin/src/app/%5Blocale%5D/products/details/%5Bid%5D/%5BproductName%5D/page.tsx#L175)
- [whoWeAre page](file:///d:/projects/ouroba/orouba-admin/src/app/%5Blocale%5D/about/whoWeAre/page.tsx#L80)

البيانات من الداتا بيز بتتعرض مباشرة كـ HTML بدون ما تتنضف من أكواد خبيثة. لو أي Admin أضاف `<script>` tag في الوصف، هيتنفذ عند كل مستخدم.

**الإصلاح:** استخدم مكتبة `DOMPurify` أو `sanitize-html` عشان تنضف الـ HTML قبل العرض.

---

### 5. 🟠 Fallback Secret في NextAuth — ثغرة JWT

**الملف:** [auth.ts L75](file:///d:/projects/ouroba/orouba-admin/src/lib/auth.ts#L75)

```typescript
secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_development",
```

لو لأي سبب الـ `NEXTAUTH_SECRET` ما اتعرّفش في الـ ENV، السيستم هيستخدم كلمة سر ثابتة ومعروفة، وده بيخلي أي حد يقدر يزوّر JWT Tokens ويدخل كأدمن.

**الإصلاح:** شيل الـ fallback خالص وخلي الأبلكيشن يقع لو مفيش Secret:
```typescript
secret: process.env.NEXTAUTH_SECRET!,
```

---

### 6. 🟠 مفيش أي File Validation على الـ Uploads!

كل الـ Upload endpoints بتقبل **أي نوع ملف وأي حجم** — مفيش check على:
- نوع الملف (Content-Type) — ممكن حد يرفع `.exe` أو `.php`
- حجم الملف — ممكن حد يرفع ملف 10GB ويملا الـ R2 Bucket ويكلّفك فلوس

**الإصلاح:** أضف validation في `upload.ts`:
```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'application/pdf'];

if (fileBuffer.length > MAX_FILE_SIZE) throw new Error("File too large");
if (!ALLOWED_TYPES.includes(contentType)) throw new Error("File type not allowed");
```

---

### 7. 🟠 الـ Careers endpoint بيرفع ملفات بدون Auth!

**الملف:** [careers/route.ts](file:///d:/projects/ouroba/orouba-admin/src/app/api/careers/route.ts#L22-L25)

أي حد يقدر يبعت ملفات على Cloudflare R2 بتاعك! ممكن هاكر يرفع آلاف الملفات عن طريق script ويملالك الـ Bucket.

---

## 🟡 مشاكل متوسطة (Medium)

### 8. 🟡 مفيش Rate Limiting على أي API Endpoint

مفيش حماية ضد Brute Force أو Spam على:
- `/admin/login` — ممكن حد يجرب ملايين الباسوردات
- `/api/contacts` — ممكن حد يبعت آلاف الرسائل
- `/api/careers` — نفس المشكلة

**الإصلاح:** أضف Rate Limiting باستخدام مكتبة زي `@upstash/ratelimit` أو حتى in-memory map بسيط.

---

### 9. 🟡 مفيش Security Headers

مفيش `next.config.ts` headers configuration. الموقع ناقصه:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` (حماية من Clickjacking)
- `Content-Security-Policy` (حماية من XSS)
- `Strict-Transport-Security` (HTTPS إجباري)

---

### 10. 🟡 الـ Cloudflare R2 URL يجب يتضاف في `next.config.ts` Images

**الملف:** [next.config.ts](file:///d:/projects/ouroba/orouba-admin/next.config.ts#L10-L24)

الـ R2 public URL (`pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev`) مش مضاف في `remotePatterns`، فالصور اللي هتتحفظ على R2 مش هتشتغل مع Next.js Image Optimization.

---

## 🟢 مشاكل منخفضة (Low)

### 11. 🟢 الـ `.gitignore` فيه Encoding Issues

**الملف:** [.gitignore](file:///d:/projects/ouroba/orouba-admin/.gitignore#L42-L45)

الأسطر الأخيرة فيها null bytes (`\u0000`) بسبب مشكلة encoding. ده ممكن يخلي Git ما يقراش الـ ignore rules دي صح.

### 12. 🟢 Session بتنتهي بعد 30 يوم

مدة الـ JWT session `30 * 24 * 60 * 60` (30 يوم) — ده كتير لحساب Admin. الأفضل 24 ساعة أو أقل.

---

## ✅ نقاط قوة موجودة

| النقطة | التقييم |
|--------|---------|
| Passwords مشفرة بـ `bcrypt` | ✅ ممتاز |
| Prisma ORM (محمي من SQL Injection) | ✅ ممتاز |
| مفيش Raw SQL queries | ✅ ممتاز |
| Admin routes فيها Auth checks (POST/PUT/DELETE) | ✅ جيد |
| JWT Strategy مع Session Callbacks | ✅ جيد |
| Role-based access control (ADMIN check) | ✅ جيد |

---

## 🎯 خطة الإصلاح المقترحة (بالأولوية)

| الأولوية | المهمة | الوقت المتوقع |
|----------|--------|--------------|
| 1️⃣ | حذف `coolify_key` من Git + إعادة توليد المفتاح | 5 دقائق |
| 2️⃣ | حذف أو تأمين الـ Public POST routes (recipes, products) | 15 دقيقة |
| 3️⃣ | إضافة Auth على الـ GET routes الحساسة (contacts, careers, collaborates) | 15 دقيقة |
| 4️⃣ | إزالة الـ Fallback Secret | 2 دقيقة |
| 5️⃣ | إضافة File Upload Validation (نوع + حجم) | 10 دقائق |
| 6️⃣ | إضافة R2 hostname في `next.config.ts` | 2 دقيقة |
| 7️⃣ | إضافة Security Headers | 10 دقائق |
| 8️⃣ | إضافة Rate Limiting | 30 دقيقة |
| 9️⃣ | إضافة HTML Sanitization | 20 دقيقة |

> [!IMPORTANT]
> أول 4 خطوات **لازم يتعملوا فوراً قبل ما الموقع يروح Production كامل!** الباقي مهم بس مش blocking.
