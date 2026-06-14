"use client";

import { useAdminTranslation } from "@/components/admin/AdminTranslationProvider";
import { 
  HelpCircle, 
  ArrowRight, 
  Settings, 
  Store, 
  Tags, 
  Package, 
  ChefHat, 
  Award, 
  Megaphone, 
  Play, 
  Map, 
  FileText,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";

export default function DocsPage() {
  const { locale, t } = useAdminTranslation();
  const [activeTab, setActiveTab] = useState<"workflow" | "tables" | "pages">("workflow");

  const workflowSteps = [
    {
      step: "1",
      title: t("الإعدادات العامة والموقع الجغرافي", "General Settings & Geography"),
      icon: Settings,
      color: "bg-blue-500",
      description: t(
        "قبل البدء في أي عمل، تأكد من ملء إعدادات الشركة وبيانات التواصل الأساسية، وتحديد الدول التي يتم التصدير إليها.",
        "Before starting, configure basic company details, contact information, and export countries."
      ),
      tables: [
        { name: t("إعدادات الموقع (Site Settings)", "Site Settings"), link: "settings" },
        { name: t("خريطة التصدير (Export Map)", "Export Map"), link: "continents" },
        { name: t("قائمة المحادثة (Chat Menu)", "Chat Menu"), link: "chat-menu" },
        { name: t("روابط السوشيال لكل لوجو", "Social links per logo"), link: "social-links" }
      ]
    },
    {
      step: "2",
      title: t("السمات الأساسية للمنتجات", "Core Product Taxonomy"),
      icon: Tags,
      color: "bg-purple-500",
      description: t(
        "الخطوة التمهيدية للمنتجات. لا يمكن إضافة منتج بدون تحديد علامته التجارية وقسمه الأساسي. قم بإنشاء هذه الكيانات أولاً.",
        "Prerequisites for products. You cannot add a product without defining its brand and main category first."
      ),
      tables: [
        { name: t("العلامات التجارية (Brands)", "Brands"), link: "brands" },
        { name: t("أقسام المنتجات (Categories)", "Categories"), link: "categories" },
        { name: t("أنواع المنتجات (Product Types)", "Product Types"), link: "types" },
        { name: t("مميزات المنتجات (Product Features)", "Product Features"), link: "about/features" }
      ]
    },
    {
      step: "3",
      title: t("إدارة كتالوج المنتجات", "Product Catalog Management"),
      icon: Package,
      color: "bg-emerald-500",
      description: t(
        "الآن يمكنك البدء في رفع كتالوج المنتجات وربط كل منتج بتصنيفه، علامته التجارية، أنواعه، ومميزاته التي تم تحديدها في الخطوات السابقة.",
        "Now you can begin uploading the products catalog, linking each item to its category, brand, and features."
      ),
      tables: [
        { name: t("المنتجات (Products)", "Products"), link: "products" }
      ]
    },
    {
      step: "4",
      title: t("المكونات والوصفات", "Ingredients & Recipes"),
      icon: ChefHat,
      color: "bg-amber-500",
      description: t(
        "تعتمد الوصفات بشكل أساسي على المكونات والمنتجات. قم بإضافة المكونات أولاً، ثم أنشئ الوصفات واربطها بالمنتجات المعنية.",
        "Recipes heavily depend on ingredients and products. Add ingredients first, then create and link the recipes."
      ),
      tables: [
        { name: t("المكونات الأساسية (Foods)", "Foods"), link: "foods" },
        { name: t("أقسام الوصفات (Recipe Categories)", "Recipe Categories"), link: "recipes/categories" },
        { name: t("الوصفات (Recipes)", "Recipes"), link: "recipes" },
        { name: t("ترتيب وصفات الرئيسية", "Homepage Recipes Order"), link: "home-recipes" }
      ]
    },
    {
      step: "5",
      title: t("محتوى الموقع والماركتنج", "Marketing & Core Content"),
      icon: Megaphone,
      color: "bg-rose-500",
      description: t(
        "محتوى الصفحات العامة مهم مثل المنتجات تماماً: البانرات، الشهادات، نصوص من نحن، صور التصدير، الكتالوج، والنوافذ المنبثقة.",
        "Public page content is as important as products: banners, certificates, About copy, export images, catalog assets, and popups."
      ),
      tables: [
        { name: t("البانرات الرئيسية (Banners)", "Banners"), link: "banners" },
        { name: t("النوافذ المنبثقة (Popups)", "Popups"), link: "popups" },
        { name: t("شهادات الجودة (Certificates)", "Certificates"), link: "about/certificates" },
        { name: t("نبذة عن الشركة ومقاطع الفيديو", "About Us & Assets"), link: "about/buildings" }
      ]
    }
  ];

  const tableDetails = [
    {
      category: t("إدارة المنتجات", "Products Management"),
      items: [
        {
          name: t("العلامات التجارية (Brands)", "Brands"),
          desc: t("إضافة الماركات المختلفة (مثل العروبة، إلخ) مع اللوجو والفيديو الخاص بكل براند.", "Add brand profiles (e.g. Orouba) with logos and intro videos."),
          prereq: t("لا يوجد متطلبات.", "No prerequisites.")
        },
        {
          name: t("أقسام المنتجات (Categories)", "Categories"),
          desc: t("أقسام رئيسية مثل (توابل، حبوب، زيوت) لعرضها كأقسام تصفح رئيسية للمتجر.", "Main categories like (Spices, Beans, Oils) to structure shop catalog."),
          prereq: t("لا يوجد متطلبات.", "No prerequisites.")
        },
        {
          name: t("أنواع المنتجات (Product Types)", "Product Types"),
          desc: t("تخصيص وتفريعات بداخل البراند (مثل: حبوب كاملة، حجم عائلي).", "Sub-attributes within a brand (e.g., Whole Wheat, Family Size)."),
          prereq: t("يفضل ربطها ببراند تم إنشاؤه مسبقاً.", "Recommended to link with an existing Brand.")
        },
        {
          name: t("المنتجات (Products)", "Products"),
          desc: t("تعبئة معلومات المنتج بالكامل كالوصف باللغتين، الأبعاد، المميزات، والوزن.", "Specify details, weights, images, and package info for products."),
          prereq: t("⚠️ يتطلب: قسم منتجات (Category) وعلامة تجارية (Brand).", "⚠️ Requires: Category & Brand.")
        }
      ]
    },
    {
      category: t("الوصفات والطبخ", "Recipes & Cooking"),
      items: [
        {
          name: t("المكونات الأساسية (Foods)", "Foods"),
          desc: t("إضافة المكونات المستخدمة في إعداد الوجبات (مثل: ثوم، بصل، أرز).", "Add food ingredients used to build recipes."),
          prereq: t("لا يوجد متطلبات.", "No prerequisites.")
        },
        {
          name: t("أقسام الوصفات (Recipe Categories)", "Recipe Categories"),
          desc: t("تقسيم الوصفات (مثل: أطباق رئيسية، حلويات، مشويات) لتسهيل الفلترة.", "Categories like Main Dishes or Desserts for better user filtering."),
          prereq: t("لا يوجد متطلبات.", "No prerequisites.")
        },
        {
          name: t("الوصفات (Recipes)", "Recipes"),
          desc: t("إضافة الوصفات بخطواتها والخصائص وتوصيتها للمنتجات المعنية.", "Complete recipes with cooking steps, time, levels, and products."),
          prereq: t("⚠️ يتطلب: مكونات مسبقة (Foods) ومنتجات (Products) لربطها.", "⚠️ Requires: Foods & Products to be linked.")
        },
        {
          name: t("ترتيب وصفات الرئيسية", "Homepage Recipes Order"),
          desc: t("اختيار وترتيب الوصفات التي تظهر فقط داخل سيكشن وصفات مقترحة في الصفحة الرئيسية.", "Choose and order only the recipes shown in the homepage Recommended Recipes section."),
          prereq: t("يتطلب وصفات ظاهرة مسبقاً.", "Requires existing visible recipes.")
        }
      ]
    },
    {
      category: t("التسويق والمحتوى العام", "Marketing & Public Content"),
      items: [
        {
          name: t("البانرات (Banners)", "Banners"),
          desc: t("السلايدر الرئيسي للموقع في الصفحة الرئيسية لجذب انتباه الزوار.", "Main slider on landing page to showcase brand offers."),
          prereq: t("لا يوجد.", "No prerequisites.")
        },
        {
          name: t("النوافذ المنبثقة (Popups)", "Popups"),
          desc: t("نوافذ مخصصة بشروط ظهور ذكية (مثل تأخير بالوقت أو تمرير الصفحة) للإعلانات.", "Highly targeted marketing overlays showing discount offers."),
          prereq: t("لا يوجد.", "No prerequisites.")
        },
        {
          name: t("شهادات ومعايير الجودة", "Certificates & Quality"),
          desc: t("إضافة معايير التصنيع وشهادات الجودة. صور الشهادات التي تظهر في صفحة التصدير تتحكم فيها من صفحة شهادات الجودة داخل قسم About.", "Add quality standards and certificates. Certificate images shown on Export are controlled from About Certificates."),
          prereq: t("صور الشهادات: /admin/about/certificates", "Certificate images: /admin/about/certificates")
        }
      ]
    }
  ];

  const publicPagesGuide = [
    {
      title: t("الصفحة الرئيسية", "Homepage"),
      path: `/${locale}`,
      icon: Store,
      controls: [
        t("السلايدر الرئيسي: من /admin/banners، ويفضل ترتيب الصور والفيديوهات برقم واضح.", "Main slider: /admin/banners. Use clear ordering numbers for images and videos."),
        t("قسم الرؤية ولماذا العروبة ومعاييرنا وحول العالم: من /admin/settings باستخدام مفاتيح home_vision_* و home_why_* و home_standards_* و home_world_*.", "Vision, Why Orouba, Standards, and Around the World sections: /admin/settings using home_vision_*, home_why_*, home_standards_*, and home_world_* keys."),
        t("سيكشن وصفات مقترحة في الرئيسية: من /admin/home-recipes، وهو يتحكم في هذا السيكشن فقط.", "Homepage Recommended Recipes section: /admin/home-recipes, and it controls only that section."),
        t("البراندات والمنتجات الظاهرة في الرئيسية تأتي من Brands وProducts بعد ضبط الإظهار والترتيب.", "Homepage brands and products come from Brands and Products after visibility and ordering are set.")
      ],
      settings: ["home_vision_title", "home_vision_text", "home_why_title", "home_why_text", "home_standards_text", "home_world_text", "home_recommended_recipe_order"]
    },
    {
      title: t("من نحن", "About / Who We Are"),
      path: `/${locale}/about/whoWeAre`,
      icon: FileText,
      controls: [
        t("صورة ونص مقدمة من نحن: من /admin/settings عبر about_image و small_about_img و how_we_are.", "Intro image and copy: /admin/settings via about_image, small_about_img, and how_we_are."),
        t("مراحل الإنتاج نفسها: من /admin/about/production-steps، ويمكن ترتيب كل خطوة برقم وإضافة صورة لها.", "Production steps: /admin/about/production-steps. Each step can be ordered and given an image."),
        t("الكوت أسفل مراحل الإنتاج: من /admin/settings بالمفتاح about_production_note، والمفتاح القديم quotation يعمل كاحتياطي.", "Bottom quote below production steps: /admin/settings with about_production_note. Legacy quotation remains a fallback.")
      ],
      settings: ["about_image", "small_about_img", "how_we_are", "production_steps_title", "about_production_note", "quotation"]
    },
    {
      title: t("أصناف المنتجات", "Product Types"),
      path: `/${locale}/about/ProductType`,
      icon: Tags,
      controls: [
        t("نص وصورة مقدمة الصفحة: من /admin/settings عبر product_type_text و product_type_img.", "Page intro text and image: /admin/settings via product_type_text and product_type_img."),
        t("الأصناف والكروت: من /admin/types، واربط كل نوع بالبراندات والأقسام المناسبة.", "Type cards: /admin/types. Link each type to the relevant brands and categories."),
        t("صور أصناف ثابتة مثل الفواكه والخضار يمكن تغييرها من مفاتيح product_type_*_image في الإعدادات.", "Fixed category images can be changed from product_type_*_image settings keys.")
      ],
      settings: ["product_type_text", "product_type_img", "product_type_fruits_image", "product_type_veg_image", "product_type_beans_image"]
    },
    {
      title: t("الشهادات", "Certifications"),
      path: `/${locale}/certifications`,
      icon: Award,
      controls: [
        t("الفرونت الجديدة orouba_new تقرأ هذه الصفحة من /api/site-data مباشرة؛ أي تعديل محفوظ هنا يظهر في /certifications.", "The new orouba_new frontend reads this page from /api/site-data directly; saved changes appear on /certifications."),
        t("نص مقدمة صفحة الشهادات وصورة البانر: من /admin/settings عبر certificationText و certification_image.", "Intro copy and hero image: /admin/settings via certificationText and certification_image."),
        t("صور الشهادات نفسها: من /admin/about/certificates. نفس الصور تظهر أيضاً في صفحة التصدير /export.", "Certificate images: /admin/about/certificates. The same images also appear on /export."),
        t("القيم ومعايير الجودة الداعمة: من /admin/about/values و /admin/about/standards.", "Supporting values and standards: /admin/about/values and /admin/about/standards.")
      ],
      settings: ["certificationText", "certification_image"]
    },
    {
      title: t("التصدير", "Export"),
      path: `/${locale}/export`,
      icon: Map,
      controls: [
        t("عنوان ووصف وصور صفحة التصدير: من /admin/settings عبر exportTitle و exportDescription و exportImage و exportMap.", "Export title, copy, and images: /admin/settings via exportTitle, exportDescription, exportImage, and exportMap."),
        t("الدول والقارات: من /admin/continents، وتظهر كأسماء مناطق وخريطة تصدير.", "Countries and continents: /admin/continents. They appear as export regions and map context."),
        t("معايير التصدير: من /admin/about/standards. صور الشهادات: من /admin/about/certificates.", "Export standards: /admin/about/standards. Certificate images: /admin/about/certificates.")
      ],
      settings: ["exportTitle", "exportDescription", "exportImage", "exportMap", "exportStandardsText", "exportCertificationsTitle", "exportCatalogButtonText"]
    },
    {
      title: t("كتالوج التصدير", "Export Catalog"),
      path: `/${locale}/export_cat`,
      icon: Package,
      controls: [
        t("صفحة الكتالوج في orouba_new تقرأ من نفس إعدادات الداشبورد عبر /api/site-data.", "The orouba_new catalog page reads from the same dashboard settings via /api/site-data."),
        t("عنوان ونص وصورة الكتالوج: من /admin/settings عبر catalogTitle و catalogText و catalogImage.", "Catalog title, copy, and image: /admin/settings via catalogTitle, catalogText, and catalogImage."),
        t("ملف التحميل أو الرابط: من catalogFile، ونص الزر من catalogButtonText.", "Download file or URL: catalogFile. Button text: catalogButtonText."),
        t("يمكن استخدام catalogAr و catalogEn لو محتاج نص مختلف لكل لغة.", "Use catalogAr and catalogEn if each language needs separate catalog copy.")
      ],
      settings: ["catalogTitle", "catalogText", "catalogAr", "catalogEn", "catalogImage", "catalogFile", "catalogButtonText"]
    },
    {
      title: t("التواصل والفوتر والهيدر", "Contact, Footer & Header"),
      path: `/${locale}/contact`,
      icon: Settings,
      controls: [
        t("بيانات التواصل: من /admin/settings عبر contact_title و contact_intro و address و phone_1 و phone_2 و email و map_url.", "Contact data: /admin/settings via contact_title, contact_intro, address, phone_1, phone_2, email, and map_url."),
        t("اللوجو والفافيكون وحقوق الملكية: من main_logo و favicon_logo و copy_right.", "Logo, favicon, and copyright: main_logo, favicon_logo, and copy_right."),
        t("روابط السوشيال لكل لوجو: من /admin/social-links. مفاتيح facebook_url و instagram_url تعمل كاحتياطي عام فقط.", "Per-logo social links: /admin/social-links. facebook_url and instagram_url are fallback only.")
      ],
      settings: ["contact_title", "contact_intro", "address", "phone_1", "phone_2", "email", "map_url", "main_logo", "copy_right"]
    },
    {
      title: t("الوصفات والمحتوى التفاعلي", "Recipes & Interactive Content"),
      path: `/${locale}/recipes`,
      icon: ChefHat,
      controls: [
        t("أقسام الوصفات: من /admin/recipes/categories، والوصفات نفسها من /admin/recipes.", "Recipe categories: /admin/recipes/categories. Recipes: /admin/recipes."),
        t("المكونات المستخدمة في الوصفات: من /admin/foods، ثم يتم ربطها داخل الوصفة.", "Recipe ingredients: /admin/foods, then linked inside each recipe."),
        t("النوافذ المنبثقة وقائمة المحادثة: من /admin/popups و /admin/chat-menu.", "Popups and chat menu: /admin/popups and /admin/chat-menu.")
      ],
      settings: []
    }
  ];

  return (
    <div className="space-y-8" dir={locale === "ar" ? "rtl" : "ltr"}>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-2xl p-6 md:p-8 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold flex items-center gap-3">
              <HelpCircle className="w-8 h-8 text-yellow-400" />
              {t("دليل استخدام لوحة تحكم العروبة", "Orouba Dashboard User Guide")}
            </h1>
            <p className="text-blue-100 max-w-2xl text-base leading-relaxed">
              {t(
                "أهلاً بك في الدليل الشامل. تم تصميم هذا القسم لمساعدتك على تنظيم خطوات العمل وإدخال البيانات بالترتيب الصحيح لضمان تجربة مستخدم خالية من الأخطاء وثبات تام لقواعد البيانات.",
                "Welcome to the comprehensive user guide. Follow this sequence of data entry to ensure correct relational database integrity and error-free rendering."
              )}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-4 mt-8 border-t border-blue-600/40 pt-6">
          <button 
            onClick={() => setActiveTab("workflow")}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "workflow" ? "bg-white text-blue-900 shadow" : "bg-blue-600/30 text-white hover:bg-blue-600/50"}`}
          >
            {t("الترتيب الصحيح لإدخال البيانات (Workflow)", "Suggested Sequence (Workflow)")}
          </button>
          <button 
            onClick={() => setActiveTab("tables")}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "tables" ? "bg-white text-blue-900 shadow" : "bg-blue-600/30 text-white hover:bg-blue-600/50"}`}
          >
            {t("تفاصيل الجداول والعلاقات", "Detailed Tables Guide")}
          </button>
          <button
            onClick={() => setActiveTab("pages")}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "pages" ? "bg-white text-blue-900 shadow" : "bg-blue-600/30 text-white hover:bg-blue-600/50"}`}
          >
            {t("تحكم صفحات الموقع", "Public Pages Control")}
          </button>
        </div>
      </div>

      {activeTab === "workflow" ? (
        /* Workflow Stepper View */
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {t("خارطة طريق إدخال البيانات بالتسلسل المنطقي", "Logical Step-by-Step Data Entry Map")}
            </h2>
            <p className="text-gray-500 text-sm">
              {t(
                "ننصح بشدة باتباع هذا الترتيب عند تصفير لوحة التحكم أو إدخال علامة تجارية أو منتجات جديدة بالكامل لتجنب فقدان العلاقات بين البيانات.",
                "We highly recommend following this order when resetting data or uploading fresh content to avoid database constraint failures."
              )}
            </p>
          </div>

          <div className="relative border-r-2 border-gray-200 mr-4 md:mr-8 space-y-12 py-4">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="relative flex items-start gap-6 md:gap-8 group">
                  {/* Step Badge */}
                  <div className={`absolute -right-[21px] top-1 w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-lg shadow ${step.color} border-4 border-white transition-transform group-hover:scale-110`}>
                    {step.step}
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl text-white ${step.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">{step.title}</h3>
                    </div>

                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">{step.description}</p>

                    <div className="border-t border-gray-50 pt-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        {t("القوائم والجداول التابعة:", "Related Tables:")}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {step.tables.map((tbl, i) => (
                          <a 
                            key={i}
                            href={`/${locale}/admin/${tbl.link}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 font-semibold text-xs border border-gray-100 hover:border-blue-100 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" />
                            {tbl.name}
                            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : activeTab === "tables" ? (
        /* Detailed Table Guide */
        <div className="grid grid-cols-1 gap-8">
          {tableDetails.map((cat, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-gray-800 border-b border-gray-50 pb-3 flex items-center gap-2">
                <span className="w-2.5 h-5 bg-orouba-blue rounded-full" />
                {cat.category}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cat.items.map((item, i) => (
                  <div key={i} className="bg-gray-50/50 hover:bg-gray-50 p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all space-y-3">
                    <h4 className="text-base font-extrabold text-blue-900">{item.name}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-lg text-xs font-bold border border-amber-100">
                      <span>{item.prereq}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {t("كل صفحة في الموقع تتحكم فيها منين؟", "Where do you control each public page?")}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              {t(
                "استخدم هذا التبويب عند مراجعة أي صفحة عامة. كل كارت يوضح رابط الصفحة، مكان التحكم في محتواها، وأهم مفاتيح الإعدادات التي تؤثر عليها.",
                "Use this tab when reviewing any public page. Each card shows the page URL, the dashboard controls, and the key settings that affect it."
              )}
            </p>
          </div>

          {publicPagesGuide.map((page) => {
            const Icon = page.icon;
            return (
              <div key={page.path} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-50 text-orouba-blue">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-gray-900">{page.title}</h3>
                      <a href={page.path} className="text-xs font-semibold text-blue-600 hover:text-blue-800">
                        {page.path}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
                  <div className="space-y-3">
                    {page.controls.map((control, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{control}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4">
                    <h4 className="text-xs font-extrabold text-gray-500 uppercase mb-3">
                      {t("مفاتيح الإعدادات المهمة", "Important Settings Keys")}
                    </h4>
                    {page.settings.length ? (
                      <div className="flex flex-wrap gap-2">
                        {page.settings.map((setting) => (
                          <span key={setting} className="px-2.5 py-1 rounded-lg bg-white border border-gray-100 text-xs font-semibold text-gray-700">
                            {setting}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">
                        {t("هذه الصفحة تعتمد أساساً على الجداول وليس مفاتيح الإعدادات.", "This page mainly depends on tables rather than settings keys.")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
