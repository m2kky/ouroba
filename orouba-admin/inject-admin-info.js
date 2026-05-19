const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src/app/[locale]/admin/(dashboard)');

const descriptions = {
  "about": {
    "titleAr": "إدارة نصوص الموقع (About & Sections)",
    "titleEn": "Site Texts (About & Sections)",
    "descAr": "إدارة وتعديل النصوص الثابتة في صفحات الموقع (مثل: من نحن، رؤيتنا، رسالتنا).",
    "descEn": "Manage and update static sections across the website (e.g. About Us, Vision, Mission).",
    "li1Ar": "يمكنك تعديل النصوص باللغتين العربية والإنجليزية.",
    "li1En": "You can update descriptions in both Arabic and English.",
    "li2Ar": "خطوة اختيارية: لا توجد متطلبات سابقة، يمكنك تعديل النصوص في أي وقت.",
    "li2En": "Optional step: No prerequisites, update anytime."
  },
  "banners": {
    "titleAr": "إدارة البانرات (Main Banners)",
    "titleEn": "Main Banners",
    "descAr": "إضافة وإدارة صور وفيديوهات السلايدر الرئيسي في الصفحة الرئيسية للموقع.",
    "descEn": "Add and manage main slider images and videos on the homepage.",
    "li1Ar": "يمكنك رفع صور أو وضع روابط فيديوهات لتعمل كبانر رئيسي.",
    "li1En": "Upload slider graphics or embed promo videos.",
    "li2Ar": "خطوة اختيارية: يمكنك التعديل عليها في أي وقت ولا تعتمد على جداول أخرى.",
    "li2En": "Optional step: Works independently, update anytime."
  },
  "brands": {
    "titleAr": "إدارة العلامات التجارية (Brands)",
    "titleEn": "Brands Management",
    "descAr": "إضافة وإدارة العلامات التجارية التي تملكها الشركة (مثل: العروبة، الخ).",
    "descEn": "Add and manage brand names belonging to Orouba (e.g. Orouba Foods, etc).",
    "li1Ar": "تعتبر هذه من أولى خطوات بناء المتجر، حيث سترتبط بها الأنواع والمنتجات لاحقاً.",
    "li1En": "This is one of the initial catalog steps; all products and types will link to these brands.",
    "li2Ar": "خطوة مطلوبة أولاً: يرجى إضافة العلامات التجارية قبل إضافة أي أنواع (Types) أو منتجات.",
    "li2En": "⚠️ Required first: Please configure Brands before adding Types or Products."
  },
  "buildings": {
    "titleAr": "إدارة المنشآت (Facilities)",
    "titleEn": "Facilities & Buildings",
    "descAr": "إدارة صور ومقاطع فيديو لمصانع ومنشآت الشركة.",
    "descEn": "Manage photos and videos showcasing company manufacturing facilities.",
    "li1Ar": "تُعرض هذه المنشآت في صفحة 'عن الشركة' لإبراز القدرة التصنيعية.",
    "li1En": "Showcased on the 'About' page to convey corporate industrial capacity.",
    "li2Ar": "الترتيب المقترح: يفضل إضافتها عند كتابة نبذة 'عن الشركة' (About).",
    "li2En": "Suggested order: Complete when customizing corporate introduction texts."
  },
  "careers": {
    "titleAr": "طلبات التوظيف (Careers)",
    "titleEn": "Careers & Applications",
    "descAr": "استعراض ومتابعة طلبات التوظيف المُقدمة من خلال الموقع.",
    "descEn": "Review and manage job applications submitted by job seekers via the site.",
    "li1Ar": "يمكنك قراءة تفاصيل الطلبات، وتحميل السير الذاتية (CVs).",
    "li1En": "Allows reading applicant details and downloading uploaded resumes.",
    "li2Ar": "هذا الجدول للاستعراض فقط وتستقبل بياناته من زوار الموقع.",
    "li2En": "View-only table populated by user submissions."
  },
  "categories": {
    "titleAr": "إدارة الأقسام (Categories)",
    "titleEn": "Categories",
    "descAr": "إنشاء الأقسام الرئيسية للمنتجات (مثل: توابل، بقوليات، إلخ).",
    "descEn": "Configure main product categories (e.g., Spices, Legumes, Oils).",
    "li1Ar": "تعتبر هذه خطوة أساسية ومبكرة جداً في النظام.",
    "li1En": "Fundamental taxonomy step required early in setup.",
    "li2Ar": "خطوة مطلوبة أولاً: يجب إضافة الأقسام هنا قبل البدء في إضافة 'المنتجات' لتتمكن من تصنيفها.",
    "li2En": "⚠️ Required first: Configure Categories here before adding Products to allow correct routing."
  },
  "certificates": {
    "titleAr": "شهادات الجودة (Certificates)",
    "titleEn": "Quality Certificates",
    "descAr": "إدارة شهادات الجودة والاعتمادات الحاصلة عليها الشركة.",
    "descEn": "Manage industrial safety and quality certifications obtained by the firm.",
    "li1Ar": "تُعرض هذه الشهادات لتعزيز ثقة العملاء والمستوردين.",
    "li1En": "Enhances buyer and export credibility by demonstrating certifications (ISO, HACCP).",
    "li2Ar": "يمكنك رفع صورة الشعار و كتابة اسم الشهادة ليتم عرضها في صفحة من نحن.",
    "li2En": "Upload certificate badges to display them in the 'About' section."
  },
  "chat-menu": {
    "titleAr": "إدارة قائمة المحادثة (Chat Menu)",
    "titleEn": "Chat Menu & Widgets",
    "descAr": "إدارة الروابط وأرقام التواصل التي تظهر في القائمة العائمة أسفل الموقع.",
    "descEn": "Manage quick contact options displaying on the bottom floating bar.",
    "li1Ar": "هذه الخطوة مستقلة تماماً، وتؤثر على زر التواصل العائم (Float Button).",
    "li1En": "Standalone widget affecting floating communication prompts.",
    "li2Ar": "يمكنك وضع روابط واتساب أو فيسبوك ماسنجر مع تحديد أيقوناتها.",
    "li2En": "Supports setting up WhatsApp and Messenger links with custom icons."
  },
  "collaborates": {
    "titleAr": "طلبات التعاون والتصدير (B2B Leads)",
    "titleEn": "B2B Leads & Collaborations",
    "descAr": "متابعة طلبات التعاون التجاري والتصدير المقدمة من الشركات والأفراد.",
    "descEn": "Track commercial distribution and export inquiries from business entities.",
    "li1Ar": "تعرض هذه الصفحة جميع تفاصيل الشركات الراغبة في التعاون.",
    "li1En": "Contains business lead profiles, requirements, and corporate contact info.",
    "li2Ar": "جدول استعراضي يعرض ما يرسله العملاء من صفحة B2B.",
    "li2En": "Lead generation review pipeline."
  },
  "contacts": {
    "titleAr": "رسائل التواصل (Contact Messages)",
    "titleEn": "Contact Messages",
    "descAr": "استعراض الرسائل والاستفسارات الواردة من صفحة 'اتصل بنا'.",
    "descEn": "View and answer direct support or info requests from visitors.",
    "li1Ar": "يمكنك متابعة استفسارات العملاء العاديين والتواصل معهم.",
    "li1En": "Easily follow up with visitors and direct inquiries.",
    "li2Ar": "جدول استعراضي فقط للرسائل الواردة.",
    "li2En": "View-only messages table."
  },
  "continents": {
    "titleAr": "خريطة التصدير (Export Map)",
    "titleEn": "Export Geography Map",
    "descAr": "إدارة القارات والدول التي يتم تصدير المنتجات إليها.",
    "descEn": "Manage continents and countries Orouba exports products to.",
    "li1Ar": "خطوة أساسية أولاً: يجب إضافة القارة (مثل أفريقيا) قبل التمكن من إضافة دول بداخلها (مثل مصر).",
    "li1En": "⚠️ Required first: Add Continents (e.g. Europe) before attaching export countries.",
    "li2Ar": "تستخدم هذه البيانات لبناء خريطة التصدير التفاعلية في الموقع.",
    "li2En": "Supplies interactive markers on the global export map."
  },
  "features": {
    "titleAr": "مميزات المنتجات (Product Features)",
    "titleEn": "Product Features",
    "descAr": "إدارة السمات والمميزات الخاصة بالمنتجات (مثل: عضوي، طبيعي 100%).",
    "descEn": "Manage product selling points (e.g., Organic, 100% Natural, Gluten-Free).",
    "li1Ar": "الخطوة السابقة للمنتجات: قم بإضافة المميزات هنا أولاً لتتمكن من ربطها بالمنتجات.",
    "li1En": "Pre-requisite for products: Add features here first to associate them.",
    "li2Ar": "بعد إضافتها هنا، ستظهر لك كخيارات (Checkboxes) عند إضافة منتج جديد.",
    "li2En": "Features will display as toggles when inserting a product."
  },
  "foods": {
    "titleAr": "المكونات الأساسية (Foods/Ingredients)",
    "titleEn": "Base Ingredients (Foods)",
    "descAr": "إدارة قائمة المكونات التي تستخدم في تحضير الوصفات.",
    "descEn": "Manage core ingredient lists used to formulate delicious cooking recipes.",
    "li1Ar": "الخطوة السابقة للوصفات: يجب إضافة جميع المكونات (مثل: طماطم، دجاج) هنا أولاً.",
    "li1En": "⚠️ Required for recipes: Create ingredient items (e.g. Tomatoes, Spices) first.",
    "li2Ar": "عند إضافة وصفة، ستقوم بربط المكونات التي تمت إضافتها في هذا الجدول بالوصفة.",
    "li2En": "Allows mapping ingredient checkboxes inside recipe editor."
  },
  "popups": {
    "titleAr": "النوافذ المنبثقة (Marketing Popups)",
    "titleEn": "Marketing Popups",
    "descAr": "إدارة النوافذ المنبثقة (Popups) التي تظهر لزوار الموقع.",
    "descEn": "Configure responsive promotional overlay cards for web visitors.",
    "li1Ar": "أداة تسويقية مستقلة لتنبيه الزوار بخصومات أو رسائل هامة.",
    "li1En": "Independent marketing prompt to notify users of seasonal discounts.",
    "li2Ar": "لا يوجد متطلبات مسبقة، يمكنك إنشاء البوب آب في أي وقت.",
    "li2En": "Optional helper: Works on schedule, configure at any time."
  },
  "products": {
    "titleAr": "إدارة المنتجات (Products)",
    "titleEn": "Products Catalog",
    "descAr": "التحكم الكامل في جميع منتجات الشركة المعروضة على الموقع.",
    "descEn": "Full CRUD management over Orouba food product listings.",
    "li1Ar": "⚠️ تنبيه هام: يجب أن تكون قد أضفت (الأقسام، العلامات التجارية، والمميزات) أولاً قبل إضافة المنتجات.",
    "li1En": "⚠️ Required first: Ensure Categories, Brands, and Features exist before listing products.",
    "li2Ar": "ستقوم هنا باختيار التصنيف الذي ينتمي له المنتج والمميزات التي تمت إضافتها سابقاً.",
    "li2En": "You will bind items to their parent category, brand, and toggle features."
  },
  "recipes": {
    "titleAr": "إدارة الوصفات (Recipes)",
    "titleEn": "Recipes Directory",
    "descAr": "عرض وتعديل وصفات الطبخ وربطها بمنتجات العروبة.",
    "descEn": "Manage recipes, preparation instructions, and recommended Orouba products.",
    "li1Ar": "⚠️ تنبيه هام: يجب إضافة (المكونات Foods) و (المنتجات Products) أولاً لتتمكن من ربط الوصفة بهم.",
    "li1En": "⚠️ Required first: Ingredient items (Foods) and Products must be created first.",
    "li2Ar": "بعد حفظ الوصفة، يمكنك استخدام الأزرار الجانبية لإدارة الخصائص (Props) وخطوات التحضير (Steps).",
    "li2En": "Use side-action buttons to configure individual Steps and Properties."
  },
  "settings": {
    "titleAr": "إعدادات الموقع (Site Settings)",
    "titleEn": "Global Site Settings",
    "descAr": "إدارة الإعدادات العامة للموقع مثل بيانات التواصل وروابط السوشيال ميديا.",
    "descEn": "Configure contact profiles, email alerts, social media links, and logos.",
    "li1Ar": "يفضل تعبئة هذا القسم في أول استخدام للوحة التحكم لضمان عمل أرقام التواصل في الموقع.",
    "li1En": "Highly recommended to fill this out first so floating contacts function properly.",
    "li2Ar": "يؤثر هذا القسم على الفوتر (Footer) والتواصل السريع.",
    "li2En": "Binds footer navigation details, emails, and phone hotlines."
  },
  "standards": {
    "titleAr": "معايير الجودة (Standards)",
    "titleEn": "Quality Standards",
    "descAr": "إدارة المعايير والمقاييس التي تعتمد عليها الشركة في التصنيع.",
    "descEn": "Manage health, safety, and operational standards of Orouba factories.",
    "li1Ar": "توضح للعملاء الالتزام العالي بالصحة والسلامة.",
    "li1En": "Demonstrates rigorous safety guidelines and export compliance.",
    "li2Ar": "خطوة مستقلة تُعرض كجزء من صفحة نبذة عن الشركة.",
    "li2En": "Renders as stylized features list in company profile pages."
  },
  "team": {
    "titleAr": "إدارة الفريق (Team/Directors)",
    "titleEn": "Board & Team Directors",
    "descAr": "إضافة وتعديل بيانات أعضاء مجلس الإدارة أو فريق العمل.",
    "descEn": "Manage administrative board members and team highlights.",
    "li1Ar": "تُعرض هذه البيانات في قسم التعرف على الشركة.",
    "li1En": "Displays portraits and roles under the 'Our Team' web layout.",
    "li2Ar": "يمكن إضافة الاسم، المنصب، وصورة شخصية لكل عضو كخطوة مستقلة.",
    "li2En": "Upload name, position title, and professional photo individually."
  },
  "types": {
    "titleAr": "أنواع المنتجات (Product Types)",
    "titleEn": "Product Variations & Types",
    "descAr": "إدارة تصنيفات وتفريعات الأنواع (مثل: حجم كبير، تعبئة مفرغة).",
    "descEn": "Manage granular variation sub-types (e.g. Large Package, Vacuum Sealed).",
    "li1Ar": "الخطوة السابقة للأنواع: يمكنك إضافة العلامات التجارية أولاً لربط النوع بعلامة تجارية محددة.",
    "li1En": "Pre-requisite: Add Brands first to associate variations under particular labels.",
    "li2Ar": "هذه خطوة تسبق إضافة المنتجات، حيث سيتم إسناد هذه الأنواع للمنتج عند إنشائه.",
    "li2En": "Types are assigned directly inside product builder forms."
  },
  "values": {
    "titleAr": "القيم الأساسية (Core Values)",
    "titleEn": "Corporate Core Values",
    "descAr": "إدارة القيم والمبادئ التي تؤمن بها الشركة.",
    "descEn": "Manage operational principles and corporate value markers.",
    "li1Ar": "تُعرض في صفحة الشركة لتعزيز الوعي بالعلامة التجارية.",
    "li1En": "Presented inside corporate 'About' layout to communicate identity.",
    "li2Ar": "لا يوجد متطلبات سابقة.",
    "li2En": "No prerequisites, configure anytime."
  },
  "why-us": {
    "titleAr": "لماذا نحن (Why Choose Us)",
    "titleEn": "Why Choose Orouba",
    "descAr": "إدارة النقاط التي تميز الشركة عن غيرها من المنافسين.",
    "descEn": "Manage unique competitive advantages of Orouba Foods.",
    "li1Ar": "تُستخدم كعناصر تسويقية فعالة في الصفحات الرئيسية.",
    "li1En": "Renders as selling highlights on homepage grids.",
    "li2Ar": "لا يوجد متطلبات سابقة، يمكنك إضافتها في أي وقت.",
    "li2En": "No prerequisites, update anytime."
  }
};

const dirs = fs.readdirSync(baseDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

dirs.forEach(dir => {
  const pagePath = path.join(baseDir, dir, 'page.tsx');
  if (fs.existsSync(pagePath)) {
    let content = fs.readFileSync(pagePath, 'utf-8');
    const desc = descriptions[dir];
    if (!desc) return; // skip if no description

    // Check if AdminPageInfo is imported
    if (!content.includes('AdminPageInfo')) {
      content = content.replace(
        /import {.*?} from "react";/g, 
        match => `import AdminPageInfo from "@/components/admin/AdminPageInfo";\n${match}`
      );
    }

    const infoMarkup = `
      <AdminPageInfo 
        titleAr="${desc.titleAr}" 
        titleEn="${desc.titleEn}"
        descriptionAr="${desc.descAr}" 
        descriptionEn="${desc.descEn}"
        prereq1Ar="${desc.li1Ar}" 
        prereq1En="${desc.li1En}"
        prereq2Ar="${desc.li2Ar}" 
        prereq2En="${desc.li2En}"
      />
`;

    // Replace existing AdminPageInfo completely
    const regexFull = /<AdminPageInfo[\s\S]*?<\/AdminPageInfo>/g;
    const regexSelfClosing = /<AdminPageInfo[^>]*\/>/g;
    
    if (regexFull.test(content)) {
      content = content.replace(regexFull, infoMarkup.trim());
    } else if (regexSelfClosing.test(content)) {
      content = content.replace(regexSelfClosing, infoMarkup.trim());
    } else {
      // Not found? Try injecting it
      const replaceTarget = /return \(\s*<div className="(space-y-\d+|.*?)".*?>/;
      const match = content.match(replaceTarget);
      if (match) {
        content = content.replace(match[0], `${match[0]}\n${infoMarkup}`);
      }
    }
    
    fs.writeFileSync(pagePath, content, 'utf-8');
    console.log(`Updated bilingual headers for ${dir}`);
  }
});

console.log("Bilingual headers generation complete.");
