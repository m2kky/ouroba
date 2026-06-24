"use client";
import AdminPageInfo from "@/components/admin/AdminPageInfo";


import { useState, useEffect } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { useAdminTranslation } from "@/components/admin/AdminTranslationProvider";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface SiteSetting {
  key: string;
  valueEn: string | null;
  valueAr: string | null;
  description: string | null;
}

const PLAIN_VALUE_KEY_PATTERN =
  /(image|img|logo|map|url|link|href|file|phone|mobile|fax|email|whatsapp|number|tel|favicon|catalogfile|address)/i;

const RICH_VALUE_KEY_PATTERN =
  /(text|description|intro|note|quotation|how_we_are|vision|why|standards|world|catalog|certification|values|about)/i;

const PLAIN_TEXT_SETTING_KEYS = new Set([
  "site_description",
  "copy_right",
  "catalogTitle",
  "catalogButtonText",
  "contact_title",
  "exportTitle",
  "exportStandardsTitle",
  "exportCertificationsTitle",
  "exportCatalogButtonText",
  "home_vision_title",
  "home_vision_button_text",
  "home_why_title",
  "home_why_subtitle",
  "home_why_button_text",
  "home_brands_title",
  "home_recipes_title",
  "home_standards_title",
  "home_world_title",
  "production_steps_title",
  "product_types_title",
  "certifications_title",
  "values_title",
  "careers_title",
  "careers_why_title",
]);

const PAGE_TITLE_SETTING_KEYS = [
  "home_vision_title",
  "home_why_title",
  "home_why_subtitle",
  "home_brands_title",
  "home_recipes_title",
  "home_standards_title",
  "home_world_title",
  "production_steps_title",
  "product_types_title",
  "certifications_title",
  "values_title",
  "careers_title",
  "careers_why_title",
  "contact_title",
  "exportTitle",
  "exportStandardsTitle",
  "exportCertificationsTitle",
  "catalogTitle",
] as const;

const PAGE_TITLE_SETTING_KEY_SET = new Set<string>(PAGE_TITLE_SETTING_KEYS);
const PAGE_TITLE_SETTING_ORDER = new Map<string, number>(
  PAGE_TITLE_SETTING_KEYS.map((key, index) => [key, index])
);

const isImageSettingKey = (key: string) => {
  const normalizedKey = key.toLowerCase();
  return (
    normalizedKey.includes("image") ||
    normalizedKey.includes("img") ||
    normalizedKey.includes("logo") ||
    normalizedKey.includes("map")
  );
};

const isRichTextSettingKey = (key: string) => {
  const trimmedKey = key.trim();
  if (!trimmedKey) return false;
  if (PAGE_TITLE_SETTING_KEY_SET.has(trimmedKey)) return true;
  if (PLAIN_TEXT_SETTING_KEYS.has(trimmedKey)) return false;
  if (PLAIN_VALUE_KEY_PATTERN.test(trimmedKey)) return false;
  return RICH_VALUE_KEY_PATTERN.test(trimmedKey);
};

export default function SettingsPage() {
  const { t, dict } = useAdminTranslation();
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeRichTextEditor, setActiveRichTextEditor] = useState<string | null>(null);
  const productionNoteAr = "بعض الخطوات تتم لأنواع محددة فقط، مثل: فصل الحجم حسب الدرجات للبامية. الفرم والتصفية للطماطم. التقطيع لبعض المنتجات. بشر وفرم بعض المنتجات مثل البصل والثوم";
  const productionNoteEn = "Some steps are done for specific types only, like: size separation by grades for okra. Chopping and sifting for tomatoes. Cutting for some products. Grating and crushing some products like onion and garlic.";

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const loaded: SiteSetting[] = await res.json();
        
        // Define standard default settings keys that are either active or needed by the frontend
        const defaultKeysToEnsure = [
          { key: "site_title", desc: t("عنوان الموقع", "Site Title"), valAr: "العروبة للأغذية", valEn: "Orouba Foods" },
          { key: "site_description", desc: t("وصف الموقع لمحركات البحث", "Site Description"), valAr: "شركة رائدة في صناعة الغذاء", valEn: "Leading food industry company" },
          { key: "about_text", desc: t("نص من نحن المختصر", "Short About Text"), valAr: "العروبة لصناعة الغذاء هي إحدى الشركات الرائدة...", valEn: "Orouba for Food Industry is one of the leading..." },
          { key: "phone", desc: t("رقم الهاتف الأساسي", "Primary Phone"), valAr: "202 44890220", valEn: "202 44890220" },
          { key: "phone_2", desc: t("رقم الهاتف البديل", "Alternate Phone"), valAr: "202 44890227", valEn: "202 44890227" },
          { key: "email", desc: t("البريد الإلكتروني للدعم", "Support Email"), valAr: "info@oroubafoods.com", valEn: "info@oroubafoods.com" },
          { key: "address", desc: t("العنوان الرئيسي", "Main Address"), valAr: "مدينة العاشر من رمضان، مصر", valEn: "10th of Ramadan City, Egypt" },
          { key: "map_url", desc: t("رابط خريطة جوجل في صفحة التواصل", "Google Maps embed URL for contact page"), valAr: "", valEn: "" },
          { key: "copy_right", desc: t("نص حقوق الملكية في الفوتر", "Footer copyright text"), valAr: "جميع الحقوق محفوظة لدى © 2026 العروبة.", valEn: "© 2026 Orouba. All Rights Reserved." },
          { key: "facebook_url", desc: t("رابط فيسبوك", "Facebook URL"), valAr: "", valEn: "" },
          { key: "instagram_url", desc: t("رابط إنستجرام", "Instagram URL"), valAr: "", valEn: "" },
          { key: "linkedin_url", desc: t("رابط لينكد إن", "LinkedIn URL"), valAr: "", valEn: "" },
          { key: "whatsapp_number", desc: t("رقم واتساب", "WhatsApp Number"), valAr: "", valEn: "" },
          // ── Homepage Content ──
          { key: "home_vision_image", desc: t("صورة قسم 'من الرؤية' (الرئيسية)", "Homepage Vision Section Image"), valAr: "", valEn: "" },
          { key: "home_vision_title", desc: t("عنوان 'من الرؤية إلى الواقع' (الرئيسية)", "Homepage Vision Title"), valAr: "من الرؤية إلى الواقع", valEn: "From Vision to Reality" },
          { key: "home_vision_button_text", desc: t("نص زر قسم الرؤية", "Homepage Vision Button Text"), valAr: "عن العروبة", valEn: "About Us" },
          { key: "home_vision_text", desc: t("نص قسم 'من الرؤية' (الرئيسية)", "Homepage Vision Text"), valAr: "", valEn: "" },
          { key: "home_why_image", desc: t("صورة 'لماذا العروبة' (الرئيسية)", "Homepage Why Orouba Image"), valAr: "", valEn: "" },
          { key: "home_why_title", desc: t("عنوان 'لماذا العروبة' (الرئيسية)", "Homepage Why Orouba Title"), valAr: "لماذا العروبة ؟", valEn: "Why Orouba?" },
          { key: "home_why_subtitle", desc: t("عنوان فرعي 'لماذا العروبة' (الرئيسية)", "Homepage Why Orouba Subtitle"), valAr: "اكتشف الفرق في كل قضمة:", valEn: "Discover the Difference in Every Bite:" },
          { key: "home_why_button_text", desc: t("نص زر لماذا العروبة", "Homepage Why Orouba Button Text"), valAr: "المزيد", valEn: "Learn More" },
          { key: "home_why_text", desc: t("نص 'لماذا العروبة' (الرئيسية)", "Homepage Why Orouba Text"), valAr: "", valEn: "" },
          { key: "home_brands_title", desc: t("عنوان العلامات التجارية في الرئيسية", "Homepage Brands Title"), valAr: "منتجاتنا", valEn: "Our Brands" },
          { key: "home_recipes_title", desc: t("عنوان الوصفات في الرئيسية", "Homepage Recipes Title"), valAr: "وصفات مقترحة", valEn: "Recommended Recipes" },
          { key: "home_standards_title", desc: t("عنوان 'معاييرنا' (الرئيسية)", "Homepage Standards Title"), valAr: "معاييرنا", valEn: "Our Standards" },
          { key: "home_standards_text", desc: t("نص 'معاييرنا' (الرئيسية)", "Homepage Standards Text"), valAr: "", valEn: "" },
          { key: "home_world_image", desc: t("صورة خريطة العالم (الرئيسية)", "Homepage World Map Image"), valAr: "", valEn: "" },
          { key: "home_world_title", desc: t("عنوان 'حول العالم' (الرئيسية)", "Homepage Around the World Title"), valAr: "العروبة حول العالم", valEn: "Orouba Around The World" },
          { key: "home_world_text", desc: t("نص 'حول العالم' (الرئيسية)", "Homepage Around the World Text"), valAr: "", valEn: "" },
          // ── About Page Content ──
          { key: "about_image", desc: t("صورة صفحة من نحن الرئيسية", "About Us Main Image"), valAr: "", valEn: "" },
          { key: "small_about_img", desc: t("صورة صفحة من نحن للموبايل", "About Us Mobile Image"), valAr: "", valEn: "" },
          { key: "how_we_are", desc: t("النص التعريفي أعلى صفحة من نحن", "Who We Are intro text"), valAr: "", valEn: "" },
          { key: "about_production_note", desc: t("ملاحظة أسفل مراحل الإنتاج في صفحة من نحن", "Note below production steps on About page"), valAr: productionNoteAr, valEn: productionNoteEn },
          { key: "quotation", desc: t("ملاحظة مراحل الإنتاج القديمة (تعمل كاحتياطي)", "Legacy production steps note fallback"), valAr: productionNoteAr, valEn: productionNoteEn },
          { key: "production_steps_title", desc: t("عنوان مراحل الإنتاج", "Production steps title"), valAr: "مراحل الإنتاج", valEn: "Production Steps" },
          // ── Global Assets ──
          { key: "main_logo", desc: t("اللوجو الأساسي (الهيدر والفوتر)", "Main Logo (Header & Footer)"), valAr: "", valEn: "" },
          { key: "favicon_logo", desc: t("أيقونة المتصفح (Favicon)", "Browser Icon (Favicon)"), valAr: "", valEn: "" },
          { key: "recipe_property_level_image", desc: t("أيقونة خاصية مستوى الوصفة", "Recipe level property icon"), valAr: "", valEn: "" },
          { key: "recipe_property_prep_time_image", desc: t("أيقونة خاصية وقت التحضير", "Recipe prep time property icon"), valAr: "", valEn: "" },
          { key: "recipe_property_cooking_time_image", desc: t("أيقونة خاصية وقت الطبخ", "Recipe cooking time property icon"), valAr: "", valEn: "" },
          { key: "recipe_property_servings_image", desc: t("أيقونة خاصية عدد الأفراد", "Recipe servings property icon"), valAr: "", valEn: "" },
          // ── Product Types ──
          { key: "product_type_img", desc: t("صورة خلفية/بانر أصناف المنتجات", "Product types banner image"), valAr: "", valEn: "" },
          { key: "product_types_title", desc: t("عنوان صفحة أصناف المنتجات", "Product Types Page Title"), valAr: "أصناف المنتجات", valEn: "Product Types" },
          { key: "product_type_text", desc: t("نص مقدمة أصناف المنتجات", "Product types intro text"), valAr: "", valEn: "" },
          { key: "product_type_fruits_image", desc: t("صورة صنف الفواكه", "Fruits Category Image"), valAr: "", valEn: "" },
          { key: "product_type_prefried_image", desc: t("صورة صنف النصف مقلي", "Pre-Fried Category Image"), valAr: "", valEn: "" },
          { key: "product_type_veg_image", desc: t("صورة صنف الخضروات", "Vegetables Category Image"), valAr: "", valEn: "" },
          { key: "product_type_beans_image", desc: t("صورة صنف البقوليات", "Beans Category Image"), valAr: "", valEn: "" },
          // Export Page
          { key: "exportTitle", desc: t("عنوان صفحة التصدير", "Export page title"), valAr: "نحن نصدر إلى جميع أنحاء العالم", valEn: "We Export To All Over The World" },
          { key: "exportDescription", desc: t("وصف صفحة التصدير", "Export page description"), valAr: "", valEn: "" },
          { key: "exportImage", desc: t("صورة بانر صفحة التصدير", "Export banner image"), valAr: "", valEn: "" },
          { key: "exportMap", desc: t("صورة خريطة التصدير", "Export map image"), valAr: "", valEn: "" },
          { key: "exportStandardsTitle", desc: t("عنوان معايير التصدير", "Export standards title"), valAr: "معاييرنا", valEn: "Our Standards" },
          { key: "exportStandardsText", desc: t("نص معايير التصدير", "Export standards text"), valAr: "", valEn: "" },
          { key: "exportCertificationsTitle", desc: t("عنوان شهادات التصدير", "Export certifications title"), valAr: "الشهادات الحاصلة عليها العروبة", valEn: "Orouba Certifications" },
          { key: "exportCatalogButtonText", desc: t("نص زر كتالوج التصدير", "Export catalog button text"), valAr: "تحميل الكتالوج", valEn: "Export Catalogue" },
          { key: "contact_title", desc: t("عنوان صفحة التواصل", "Contact page title"), valAr: "تواصل معنا", valEn: "Contact Us" },
          { key: "contact_intro", desc: t("نص مقدمة نموذج التواصل", "Contact form intro text"), valAr: "املأ النموذج وسيقوم فريقنا بالرد عليك.", valEn: "Fill up the form and our team will get back to you." },
          { key: "careers_title", desc: t("عنوان صفحة الوظائف", "Careers Page Title"), valAr: "انضم إلى فريقنا", valEn: "Join Our Team" },
          { key: "careers_intro", desc: t("مقدمة صفحة الوظائف Rich Text", "Careers page intro rich text"), valAr: `<p style="text-align:center">إذا كنت مهتمًا بالانضمام إلى عائلتنا، يرجى إرسال بريد إلكتروني يحتوي على سيرتك الذاتية وخطاب تقديمي إلى oroubamail@orouba.ajwa.com أو ملء نموذج التوظيف</p>`, valEn: `<p style="text-align:center">If you are interested in joining our family, please send an email with your resume and cover letter to oroubamail@orouba.ajwa.com or fill out the employment form</p>` },
          { key: "careers_why_title", desc: t("عنوان لماذا العمل معنا", "Why Work With Us Title"), valAr: "لماذا تختار العمل معنا؟", valEn: "Why Choose Us?" },
          { key: "careers_why_text", desc: t("نص لماذا العمل معنا", "Why Work With Us Text"), valAr: "نحن نؤمن بتعزيز المواهب وتشجيع النمو وتوفير الفرص للأفراد لتحقيق إمكاناتهم الكاملة.", valEn: "We believe in fostering talent, encouraging growth and providing opportunities for individuals to achieve their full potential." },
          { key: "certifications_title", desc: t("عنوان صفحة الشهادات", "Certifications Page Title"), valAr: "شهادات العروبة", valEn: "Orouba Certifications" },
          { key: "certificationText", desc: t("نص مقدمة صفحة الشهادات", "Certifications intro text"), valAr: "", valEn: "" },
          { key: "values_title", desc: t("عنوان قسم القيم", "Values Section Title"), valAr: "قيمنا", valEn: "Our Values" },
          { key: "values_text", desc: t("نص مقدمة قيم الشركة", "Company values intro text"), valAr: "", valEn: "" },
          { key: "certification_image", desc: t("صورة بانر الشهادات", "Certifications hero image"), valAr: "", valEn: "" },
          { key: "catalogTitle", desc: t("عنوان صفحة كتالوج التصدير", "Export catalog page title"), valAr: "مرحبا بكم في تصدير الكتالوج", valEn: "Welcome To Export Catalogue" },
          { key: "catalogButtonText", desc: t("نص زر تحميل كتالوج التصدير", "Export catalog download button text"), valAr: "تحميل الكتالوج", valEn: "Download Catalogue" },
          { key: "catalogText", desc: t("نص كتالوج التصدير", "Export catalog text"), valAr: "", valEn: "" },
          { key: "catalogAr", desc: t("نص كتالوج التصدير بالعربية", "Export catalog Arabic text"), valAr: "", valEn: "" },
          { key: "catalogEn", desc: t("نص كتالوج التصدير بالإنجليزية", "Export catalog English text"), valAr: "", valEn: "" },
          { key: "catalogImage", desc: t("صورة كتالوج التصدير", "Export catalog image"), valAr: "", valEn: "" },
          { key: "catalogFile", desc: t("رابط ملف كتالوج التصدير", "Export catalog file URL"), valAr: "", valEn: "" },
        ];

        const merged = [...loaded];
        defaultKeysToEnsure.forEach(dk => {
          if (!merged.some(s => s.key === dk.key)) {
            merged.push({
              key: dk.key,
              valueAr: dk.valAr,
              valueEn: dk.valEn,
              description: dk.desc
            });
          } else {
            const existing = merged.find(s => s.key === dk.key);
            if (existing && !existing.description) {
              existing.description = dk.desc;
            }
          }
        });

        merged.sort((a, b) => {
          const aPriority = PAGE_TITLE_SETTING_ORDER.get(a.key);
          const bPriority = PAGE_TITLE_SETTING_ORDER.get(b.key);
          if (aPriority !== undefined || bPriority !== undefined) {
            return (aPriority ?? Number.MAX_SAFE_INTEGER) - (bPriority ?? Number.MAX_SAFE_INTEGER);
          }
          return a.key.localeCompare(b.key);
        });

        setSettings(merged);
      }
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (index: number, field: keyof SiteSetting, value: string) => {
    const newSettings = [...settings];
    newSettings[index] = { ...newSettings[index], [field]: value };
    setSettings(newSettings);
  };

  const handleAdd = () => {
    setSettings([...settings, { key: "", valueAr: "", valueEn: "", description: "" }]);
  };

  const handleRemove = (index: number) => {
    if (confirm(dict.common.confirmDelete)) {
      setSettings(settings.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (res.ok) {
        alert(dict.common.save);
        fetchSettings();
      } else {
        alert(dict.common.error);
      }
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "settings");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const { url } = await res.json();
        const newSettings = [...settings];
        newSettings[index] = { ...newSettings[index], valueAr: url, valueEn: url };
        setSettings(newSettings);
      } else {
        const err = await res.json();
        alert(err.error || dict.common.error);
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert(dict.common.error);
    } finally {
      setIsSaving(false);
    }
  };

  const defaultKeys = [
    { key: "site_name", desc: t("اسم الموقع", "Site Name") },
    { key: "phone_1", desc: t("رقم الهاتف الأساسي", "Primary Phone") },
    { key: "phone_2", desc: t("رقم الهاتف البديل", "Alternate Phone") },
    { key: "email_support", desc: t("البريد الإلكتروني للدعم", "Support Email") },
    { key: "address", desc: t("العنوان الرئيسي", "Main Address") },
    { key: "map_url", desc: t("رابط خريطة جوجل", "Google Maps URL") },
    { key: "copy_right", desc: t("نص حقوق الملكية", "Copyright text") },
    { key: "facebook_url", desc: t("رابط فيسبوك", "Facebook URL") },
    { key: "instagram_url", desc: t("رابط إنستجرام", "Instagram URL") },
    { key: "linkedin_url", desc: t("رابط لينكد إن", "LinkedIn URL") },
    { key: "whatsapp_number", desc: t("رقم واتساب", "WhatsApp Number") },
    { key: "home_vision_image", desc: t("صورة الرؤية (الرئيسية)", "Homepage Vision Image") },
    { key: "home_vision_title", desc: t("عنوان الرؤية (الرئيسية)", "Homepage Vision Title") },
    { key: "home_vision_button_text", desc: t("نص زر الرؤية", "Homepage Vision Button Text") },
    { key: "home_vision_text", desc: t("نص الرؤية (الرئيسية)", "Homepage Vision Text") },
    { key: "home_why_image", desc: t("صورة لماذا العروبة (الرئيسية)", "Homepage Why Image") },
    { key: "home_why_title", desc: t("عنوان لماذا العروبة", "Homepage Why Title") },
    { key: "home_why_subtitle", desc: t("عنوان فرعي للعروبة", "Homepage Why Subtitle") },
    { key: "home_why_button_text", desc: t("نص زر لماذا العروبة", "Homepage Why Button Text") },
    { key: "home_why_text", desc: t("نص لماذا العروبة", "Homepage Why Text") },
    { key: "home_brands_title", desc: t("عنوان العلامات التجارية", "Homepage Brands Title") },
    { key: "home_recipes_title", desc: t("عنوان الوصفات", "Homepage Recipes Title") },
    { key: "home_standards_title", desc: t("عنوان معاييرنا", "Homepage Standards Title") },
    { key: "home_standards_text", desc: t("نص معاييرنا", "Homepage Standards Text") },
    { key: "home_world_image", desc: t("صورة خريطة العالم", "Homepage World Map") },
    { key: "home_world_title", desc: t("عنوان خريطة العالم", "Homepage World Title") },
    { key: "home_world_text", desc: t("نص خريطة العالم", "Homepage World Text") },
    { key: "about_image", desc: t("صورة صفحة من نحن الرئيسية", "About Us Main Image") },
    { key: "small_about_img", desc: t("صورة صفحة من نحن للموبايل", "About Us Mobile Image") },
    { key: "how_we_are", desc: t("النص التعريفي أعلى صفحة من نحن", "Who We Are intro text") },
    { key: "about_production_note", desc: t("ملاحظة أسفل مراحل الإنتاج", "Production steps bottom note") },
    { key: "quotation", desc: t("ملاحظة مراحل الإنتاج القديمة", "Legacy production steps note") },
    { key: "production_steps_title", desc: t("عنوان مراحل الإنتاج", "Production steps title") },
    { key: "recipe_property_level_image", desc: t("أيقونة خاصية مستوى الوصفة", "Recipe level property icon") },
    { key: "recipe_property_prep_time_image", desc: t("أيقونة خاصية وقت التحضير", "Recipe prep time property icon") },
    { key: "recipe_property_cooking_time_image", desc: t("أيقونة خاصية وقت الطبخ", "Recipe cooking time property icon") },
    { key: "recipe_property_servings_image", desc: t("أيقونة خاصية عدد الأفراد", "Recipe servings property icon") },
    { key: "product_type_img", desc: t("صورة بانر أصناف المنتجات", "Product types banner image") },
    { key: "product_types_title", desc: t("عنوان صفحة أصناف المنتجات", "Product Types Page Title") },
    { key: "product_type_text", desc: t("نص مقدمة أصناف المنتجات", "Product types intro text") },
    { key: "exportTitle", desc: t("عنوان صفحة التصدير", "Export page title") },
    { key: "exportDescription", desc: t("وصف صفحة التصدير", "Export page description") },
    { key: "exportImage", desc: t("صورة بانر صفحة التصدير", "Export banner image") },
    { key: "exportMap", desc: t("صورة خريطة التصدير", "Export map image") },
    { key: "exportStandardsTitle", desc: t("عنوان معايير التصدير", "Export standards title") },
    { key: "exportStandardsText", desc: t("نص معايير التصدير", "Export standards text") },
    { key: "exportCertificationsTitle", desc: t("عنوان شهادات التصدير", "Export certifications title") },
    { key: "exportCatalogButtonText", desc: t("نص زر كتالوج التصدير", "Export catalog button text") },
    { key: "contact_title", desc: t("عنوان صفحة التواصل", "Contact page title") },
    { key: "contact_intro", desc: t("نص مقدمة نموذج التواصل", "Contact form intro text") },
    { key: "careers_title", desc: t("عنوان صفحة الوظائف", "Careers Page Title") },
    { key: "careers_intro", desc: t("مقدمة صفحة الوظائف Rich Text", "Careers page intro rich text") },
    { key: "careers_why_title", desc: t("عنوان لماذا العمل معنا", "Why Work With Us Title") },
    { key: "careers_why_text", desc: t("نص لماذا العمل معنا", "Why Work With Us Text") },
    { key: "certifications_title", desc: t("عنوان صفحة الشهادات", "Certifications Page Title") },
    { key: "certificationText", desc: t("نص مقدمة صفحة الشهادات", "Certifications intro text") },
    { key: "values_title", desc: t("عنوان قسم القيم", "Values Section Title") },
    { key: "values_text", desc: t("نص مقدمة قيم الشركة", "Company values intro text") },
    { key: "certification_image", desc: t("صورة بانر الشهادات", "Certifications hero image") },
    { key: "catalogTitle", desc: t("عنوان صفحة كتالوج التصدير", "Export catalog page title") },
    { key: "catalogButtonText", desc: t("نص زر تحميل كتالوج التصدير", "Export catalog download button text") },
    { key: "catalogText", desc: t("نص كتالوج التصدير", "Export catalog text") },
    { key: "catalogAr", desc: t("نص كتالوج التصدير بالعربية", "Export catalog Arabic text") },
    { key: "catalogEn", desc: t("نص كتالوج التصدير بالإنجليزية", "Export catalog English text") },
    { key: "catalogImage", desc: t("صورة كتالوج التصدير", "Export catalog image") },
    { key: "catalogFile", desc: t("رابط ملف كتالوج التصدير", "Export catalog file URL") },
  ];

  const addDefaultKey = (k: string, desc: string) => {
    if (!settings.find(s => s.key === k)) {
      setSettings([...settings, { key: k, valueAr: "", valueEn: "", description: desc }]);
    }
  };

  const renderRichTextField = (
    setting: SiteSetting,
    idx: number,
    field: "valueAr" | "valueEn",
    placeholder: string,
    dir: "rtl" | "ltr"
  ) => {
    const editorId = `${idx}:${field}`;
    const isOpen = activeRichTextEditor === editorId;

    return (
      <div className="space-y-2">
        {isOpen ? (
          <>
            <RichTextEditor
              value={setting[field] || ""}
              onChange={(value) => handleChange(idx, field, value)}
              placeholder={placeholder}
              dir={dir}
            />
            <button
              type="button"
              onClick={() => setActiveRichTextEditor(null)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 hover:border-orouba-blue hover:text-orouba-blue"
            >
              {t("إغلاق المحرر", "Close editor")}
            </button>
          </>
        ) : (
          <>
            <textarea
              placeholder={placeholder}
              value={setting[field] || ""}
              dir={dir}
              rows={PAGE_TITLE_SETTING_KEY_SET.has(setting.key) ? 2 : 4}
              onChange={(e) => handleChange(idx, field, e.target.value)}
              className="w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-orouba-blue"
            />
            <button
              type="button"
              onClick={() => setActiveRichTextEditor(editorId)}
              className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-orouba-blue hover:bg-blue-100"
            >
              {t("فتح محرر التنسيق", "Open rich text editor")}
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <AdminPageInfo 
        titleAr="إعدادات الموقع (Site Settings)" 
        titleEn="Global Site Settings"
        descriptionAr="إدارة الإعدادات العامة للموقع مثل بيانات التواصل وروابط السوشيال ميديا." 
        descriptionEn="Configure contact profiles, email alerts, social media links, and logos."
        prereq1Ar="يفضل تعبئة هذا القسم في أول استخدام للوحة التحكم لضمان عمل أرقام التواصل في الموقع." 
        prereq1En="Highly recommended to fill this out first so floating contacts function properly."
        prereq2Ar="يؤثر هذا القسم على الفوتر (Footer) والتواصل السريع." 
        prereq2En="Binds footer navigation details, emails, and phone hotlines."
      />

      

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{dict.sidebar.settings}</h1>
          <p className="text-gray-500 mt-1">{t("تعديل المتغيرات الديناميكية للموقع (الهاتف، الإيميل، العناوين، الروابط)", "Edit dynamic site variables (Phone, Email, Addresses, Links)")}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-orouba-blue text-white px-6 py-2 rounded-xl font-bold hover:bg-orouba-blue/90 transition-colors shadow-sm disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isSaving ? dict.common.saving : dict.common.save}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orouba-blue"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" dir="rtl">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex gap-2 overflow-x-auto hide-scrollbar">
            <span className="text-sm font-semibold text-gray-600 flex items-center shrink-0">{t("إضافة مفاتيح شائعة:", "Add common keys:")}</span>
            {defaultKeys.map(dk => (
              <button 
                key={dk.key}
                onClick={() => addDefaultKey(dk.key, dk.desc)}
                disabled={settings.some(s => s.key === dk.key)}
                className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold hover:border-orouba-blue hover:text-orouba-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                + {dk.desc}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-12 gap-4 font-bold text-sm text-gray-500 border-b pb-2 px-2">
              <div className="col-span-3">{t("المفتاح (Key)", "Key")}</div>
              <div className="col-span-4">{t("القيمة (عربي)", "Value (Arabic)")}</div>
              <div className="col-span-4">{t("القيمة (إنجليزي)", "Value (English)")}</div>
              <div className="col-span-1 text-center">{t("إجراء", "Action")}</div>
            </div>

            {settings.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm border-2 border-dashed rounded-xl">
                {t("لا يوجد إعدادات مضافة.", "No settings added.")}
              </div>
            ) : (
              settings.map((setting, idx) => {
                const isImageKey = isImageSettingKey(setting.key);
                const isRichTextKey = isRichTextSettingKey(setting.key);
                return (
                <div key={idx} className="grid grid-cols-12 gap-4 items-start bg-gray-50 p-2 rounded-xl">
                  <div className="col-span-3 space-y-2">
                    {PAGE_TITLE_SETTING_KEY_SET.has(setting.key) ? (
                      <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-[11px] font-bold text-orouba-blue">
                        {t("عنوان صفحة / قسم", "Page / Section Title")}
                      </span>
                    ) : null}
                    <input
                      type="text"
                      placeholder={t("مثال: phone_1", "Example: phone_1")}
                      value={setting.key}
                      dir="ltr"
                      onChange={(e) => handleChange(idx, "key", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 placeholder:text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder={t("وصف (اختياري)", "Description (Optional)")}
                      value={setting.description || ""}
                      onChange={(e) => handleChange(idx, "description", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-700 placeholder:text-gray-400 bg-white"
                    />
                  </div>
                  
                  {isImageKey ? (
                    <div className="col-span-8 flex flex-col gap-2 bg-white border border-gray-200 rounded-lg p-3">
                      <div className="text-xs font-semibold text-gray-500">{t("رفع صورة", "Upload Image")}</div>
                      <div className="flex items-center gap-4">
                        {setting.valueEn ? (
                          <img src={setting.valueEn} alt="preview" className="w-16 h-16 object-cover rounded-md border" />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-md border border-dashed flex items-center justify-center text-xs text-gray-400">No Img</div>
                        )}
                        <div className="flex-1 space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(idx, e)}
                            className="text-sm w-full block text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-orouba-blue hover:file:bg-blue-100"
                          />
                          <input
                            type="text"
                            placeholder="URL"
                            value={setting.valueEn || ""}
                            onChange={(e) => {
                              handleChange(idx, "valueEn", e.target.value);
                              handleChange(idx, "valueAr", e.target.value);
                            }}
                            dir="ltr"
                            className="w-full px-3 py-1 border border-gray-100 rounded text-xs bg-gray-50 text-gray-900 placeholder:text-gray-400"
                          />
                        </div>
                      </div>
                    </div>
                  ) : isRichTextKey ? (
                    <>
                      <div className="col-span-4">
                        {renderRichTextField(
                          setting,
                          idx,
                          "valueAr",
                          t("القيمة بالعربي", "Value in Arabic"),
                          "rtl"
                        )}
                      </div>
                      <div className="col-span-4">
                        {renderRichTextField(
                          setting,
                          idx,
                          "valueEn",
                          "Value in English",
                          "ltr"
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-span-4">
                        <input
                          type="text"
                          placeholder={t("القيمة بالعربي", "Value in Arabic")}
                          value={setting.valueAr || ""}
                          onChange={(e) => handleChange(idx, "valueAr", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 placeholder:text-gray-400"
                        />
                      </div>
                      <div className="col-span-4">
                        <input
                          type="text"
                          placeholder="Value in English"
                          value={setting.valueEn || ""}
                          dir="ltr"
                          onChange={(e) => handleChange(idx, "valueEn", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 placeholder:text-gray-400"
                        />
                      </div>
                    </>
                  )}

                  <div className="col-span-1 flex justify-center pt-2">
                    <button
                      onClick={() => handleRemove(idx)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title={dict.common.delete}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )})
            )}

            <button
              onClick={handleAdd}
              className="flex items-center gap-2 text-sm font-bold text-orouba-blue bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors w-fit"
            >
              <Plus className="w-4 h-4" />
              {t("إضافة إعداد مخصص (Custom Key)", "Add Custom Key")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
