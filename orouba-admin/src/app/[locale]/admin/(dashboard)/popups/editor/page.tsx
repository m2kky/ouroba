"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Plus, Trash2, Save, Eye } from "lucide-react";
import { Suspense } from "react";
import { useAdminTranslation } from "@/components/admin/AdminTranslationProvider";

interface PopupButton {
  id: string;
  textAr: string;
  textEn: string;
  bgColor: string;
  textColor: string;
  actionType: string;
  actionValue: string;
  sequencePopupId: string;
}

interface PopupConditions {
  maxDisplays: number;
  cooldownDays: number;
  deviceType: string;
  pages: string[];
}

interface PopupData {
  id?: string;
  internalName: string;
  titleAr: string;
  titleEn: string;
  contentAr: string;
  contentEn: string;
  image: string;
  type: string;
  animation: string;
  backgroundColor: string;
  textColor: string;
  overlayColor: string;
  borderRadius: number;
  maxWidth: number;
  buttons: PopupButton[];
  trigger: string;
  triggerValue: number;
  conditions: PopupConditions;
  isActive: boolean;
  priority: number;
  startDate: string;
  endDate: string;
}

const defaultPopup: PopupData = {
  internalName: "",
  titleAr: "",
  titleEn: "",
  contentAr: "",
  contentEn: "",
  image: "",
  type: "MODAL",
  animation: "FADE",
  backgroundColor: "#ffffff",
  textColor: "#1a1a2e",
  overlayColor: "rgba(0,0,0,0.5)",
  borderRadius: 16,
  maxWidth: 500,
  buttons: [],
  trigger: "ON_LOAD",
  triggerValue: 0,
  conditions: { maxDisplays: 0, cooldownDays: 0, deviceType: "ALL", pages: [] },
  isActive: false,
  priority: 0,
  startDate: "",
  endDate: "",
};

const animations: Record<string, object> = {
  FADE: { initial: { opacity: 0 }, animate: { opacity: 1 } },
  ZOOM: { initial: { opacity: 0, scale: 0.7 }, animate: { opacity: 1, scale: 1 } },
  SLIDE_UP: { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 } },
  BOUNCE: { initial: { opacity: 0, scale: 0.3 }, animate: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 15 } } },
};

function PopupEditorInner() {
  const { t, dict, locale } = useAdminTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [popup, setPopup] = useState<PopupData>({ ...defaultPopup });
  const [tab, setTab] = useState<"content" | "design" | "rules">("content");
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [allPopups, setAllPopups] = useState<{ id: string; internalName: string }[]>([]);
  const [pagesInput, setPagesInput] = useState("");

  const fetchPopup = useCallback(async () => {
    if (!editId) return;
    const res = await fetch(`/api/admin/popups/${editId}`);
    const data = await res.json();
    setPopup({
      ...defaultPopup,
      ...data,
      buttons: data.buttons || [],
      conditions: { ...defaultPopup.conditions, ...(data.conditions || {}) },
      startDate: data.startDate ? data.startDate.slice(0, 16) : "",
      endDate: data.endDate ? data.endDate.slice(0, 16) : "",
    });
    setPagesInput((data.conditions?.pages || []).join(", "));
  }, [editId]);

  useEffect(() => { fetchPopup(); }, [fetchPopup]);
  useEffect(() => {
    fetch("/api/admin/popups").then(r => r.json()).then(d => {
      if (Array.isArray(d)) setAllPopups(d.map((p: PopupData) => ({ id: p.id || "", internalName: p.internalName })));
    });
  }, []);

  const update = (field: string, value: unknown) => setPopup(p => ({ ...p, [field]: value }));
  const updateCondition = (field: string, value: unknown) => setPopup(p => ({ ...p, conditions: { ...p.conditions, [field]: value } }));

  const addButton = () => {
    const btn: PopupButton = { id: Date.now().toString(), textAr: "زر جديد", textEn: "New Button", bgColor: "#1e4a8c", textColor: "#ffffff", actionType: "CLOSE", actionValue: "", sequencePopupId: "" };
    update("buttons", [...popup.buttons, btn]);
  };

  const updateButton = (idx: number, field: string, val: string) => {
    const btns = [...popup.buttons];
    btns[idx] = { ...btns[idx], [field]: val };
    update("buttons", btns);
  };

  const removeButton = (idx: number) => update("buttons", popup.buttons.filter((_, i) => i !== idx));

  const save = async () => {
    setSaving(true);
    try {
      const body = {
        ...popup,
        conditions: { ...popup.conditions, pages: pagesInput.split(",").map(s => s.trim()).filter(Boolean) },
        startDate: popup.startDate || null,
        endDate: popup.endDate || null,
      };
      const url = editId ? `/api/admin/popups/${editId}` : "/api/admin/popups";
      const method = editId ? "PUT" : "POST";
      await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      router.push(`/${locale}/admin/popups`);
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  const anim = animations[popup.animation] || animations.FADE;

  return (
    <div className="min-h-screen" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push(`/${locale}/admin/popups`)} className={`p-2 hover:bg-gray-100 rounded-lg ${locale === 'en' ? 'rotate-180' : ''}`}><ArrowRight className="w-5 h-5" /></button>
          <h1 className="text-xl font-bold text-gray-800">{editId ? t("تعديل البوب آب", "Edit Popup") : t("إنشاء بوب آب جديد", "Create New Popup")}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowPreview(!showPreview)} className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
            <Eye className="w-4 h-4" />{showPreview ? t("إخفاء المعاينة", "Hide Preview") : t("إظهار المعاينة", "Show Preview")}
          </button>
          <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 font-medium">
            <Save className="w-4 h-4" />{saving ? dict.common.saving : dict.common.save}
          </button>
        </div>
      </div>

      <div className={`grid gap-6 ${showPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 max-w-3xl"}`}>
        {/* LEFT: Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {(["content", "design", "rules"] as const).map(tName => (
              <button key={tName} onClick={() => setTab(tName)} className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === tName ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" : "text-gray-500 hover:text-gray-700"}`}>
                {tName === "content" ? t("📝 المحتوى", "📝 Content") : tName === "design" ? t("🎨 التصميم", "🎨 Design") : t("⚙️ القواعد", "⚙️ Rules")}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* CONTENT TAB */}
            {tab === "content" && (<>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("اسم داخلي (للإدارة فقط)", "Internal Name (Admin Only)")}</label>
                <input value={popup.internalName} onChange={e => update("internalName", e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder={t("مثال: بوب آب العيد", "e.g., Eid Popup")} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("العنوان (عربي)", "Title (Arabic)")}</label>
                  <input value={popup.titleAr} onChange={e => update("titleAr", e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("العنوان (إنجليزي)", "Title (English)")}</label>
                  <input value={popup.titleEn} onChange={e => update("titleEn", e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" dir="ltr" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("المحتوى (عربي)", "Content (Arabic)")}</label>
                <textarea value={popup.contentAr} onChange={e => update("contentAr", e.target.value)} rows={3} className="w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("المحتوى (إنجليزي)", "Content (English)")}</label>
                <textarea value={popup.contentEn} onChange={e => update("contentEn", e.target.value)} rows={3} className="w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("رابط الصورة", "Image URL")}</label>
                <input value={popup.image} onChange={e => update("image", e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" dir="ltr" placeholder="https://..." />
              </div>
              {/* Buttons Builder */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">{t("الأزرار", "Buttons")}</label>
                  <button onClick={addButton} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"><Plus className="w-3.5 h-3.5" />{t("إضافة زر", "Add Button")}</button>
                </div>
                <div className="space-y-4">
                  {popup.buttons.map((btn, idx) => (
                    <div key={btn.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500">{t(`زر #${idx + 1}`, `Button #${idx + 1}`)}</span>
                        <button onClick={() => removeButton(idx)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input value={btn.textAr} onChange={e => updateButton(idx, "textAr", e.target.value)} className="border rounded-lg px-3 py-2 text-sm" placeholder={t("نص عربي", "Arabic Text")} />
                        <input value={btn.textEn} onChange={e => updateButton(idx, "textEn", e.target.value)} className="border rounded-lg px-3 py-2 text-sm" dir="ltr" placeholder="English text" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="text-xs text-gray-500">{t("لون الخلفية", "Background Color")}</label><input type="color" value={btn.bgColor} onChange={e => updateButton(idx, "bgColor", e.target.value)} className="w-full h-8 rounded cursor-pointer" /></div>
                        <div><label className="text-xs text-gray-500">{t("لون النص", "Text Color")}</label><input type="color" value={btn.textColor} onChange={e => updateButton(idx, "textColor", e.target.value)} className="w-full h-8 rounded cursor-pointer" /></div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">{t("نوع الأكشن", "Action Type")}</label>
                        <select value={btn.actionType} onChange={e => updateButton(idx, "actionType", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mt-1">
                          <option value="CLOSE">{t("إغلاق البوب آب", "Close Popup")}</option>
                          <option value="LINK">{t("فتح رابط", "Open Link")}</option>
                          <option value="NEXT_POPUP">{t("فتح بوب آب آخر (سيكوانس)", "Open Sequence Popup")}</option>
                        </select>
                      </div>
                      {btn.actionType === "LINK" && (
                        <input value={btn.actionValue} onChange={e => updateButton(idx, "actionValue", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" dir="ltr" placeholder="https://..." />
                      )}
                      {btn.actionType === "NEXT_POPUP" && (
                        <select value={btn.sequencePopupId} onChange={e => updateButton(idx, "sequencePopupId", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                          <option value="">{t("اختر البوب آب التالي", "Choose next popup")}</option>
                          {allPopups.filter(p => p.id !== editId).map(p => (<option key={p.id} value={p.id}>{p.internalName}</option>))}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>)}

            {/* DESIGN TAB */}
            {tab === "design" && (<>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("نوع البوب آب", "Popup Type")}</label>
                <select value={popup.type} onChange={e => update("type", e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm">
                  <option value="MODAL">{t("نافذة وسطية (Modal)", "Modal")}</option>
                  <option value="BANNER_TOP">{t("شريط علوي (Banner Top)", "Top Banner")}</option>
                  <option value="BANNER_BOTTOM">{t("شريط سفلي (Banner Bottom)", "Bottom Banner")}</option>
                  <option value="SLIDE_IN">{t("منزلق جانبي (Slide-in)", "Slide In")}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("الأنيميشن", "Animation")}</label>
                <select value={popup.animation} onChange={e => update("animation", e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm">
                  <option value="FADE">{t("تلاشي (Fade)", "Fade")}</option>
                  <option value="ZOOM">{t("تكبير (Zoom)", "Zoom")}</option>
                  <option value="SLIDE_UP">{t("انزلاق للأعلى (Slide Up)", "Slide Up")}</option>
                  <option value="BOUNCE">{t("ارتداد (Bounce)", "Bounce")}</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{t("لون الخلفية", "Background Color")}</label><input type="color" value={popup.backgroundColor} onChange={e => update("backgroundColor", e.target.value)} className="w-full h-10 rounded-lg cursor-pointer border" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{t("لون النص", "Text Color")}</label><input type="color" value={popup.textColor} onChange={e => update("textColor", e.target.value)} className="w-full h-10 rounded-lg cursor-pointer border" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("حجم الزوايا (px)", "Border Radius (px)")}</label>
                  <input type="range" min={0} max={40} value={popup.borderRadius} onChange={e => update("borderRadius", +e.target.value)} className="w-full" />
                  <span className="text-xs text-gray-400">{popup.borderRadius}px</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("العرض الأقصى (px)", "Max Width (px)")}</label>
                  <input type="number" min={300} max={900} value={popup.maxWidth} onChange={e => update("maxWidth", +e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm" />
                </div>
              </div>
            </>)}

            {/* RULES TAB */}
            {tab === "rules" && (<>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("طريقة الظهور (Trigger)", "Trigger")}</label>
                <select value={popup.trigger} onChange={e => update("trigger", e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm">
                  <option value="ON_LOAD">{t("عند تحميل الصفحة", "On Page Load")}</option>
                  <option value="TIME_DELAY">{t("بعد تأخير زمني", "Time Delay")}</option>
                  <option value="ON_SCROLL">{t("عند التمرير لنسبة معينة", "On Scroll Percentage")}</option>
                  <option value="EXIT_INTENT">{t("عند نية الخروج", "On Exit Intent")}</option>
                  <option value="SEQUENCE_ONLY">{t("سيكوانس فقط (يظهر من زر بوب آب آخر)", "Sequence Only")}</option>
                </select>
              </div>
              {(popup.trigger === "TIME_DELAY" || popup.trigger === "ON_SCROLL") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{popup.trigger === "TIME_DELAY" ? t("التأخير (بالمللي ثانية)", "Delay (ms)") : t("نسبة التمرير (%)", "Scroll Percentage (%)")}</label>
                  <input type="number" min={0} value={popup.triggerValue} onChange={e => update("triggerValue", +e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("الحد الأقصى للعرض", "Max Displays")}</label>
                  <input type="number" min={0} value={popup.conditions.maxDisplays} onChange={e => updateCondition("maxDisplays", +e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm" placeholder={t("0 = بلا حدود", "0 = Unlimited")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("فترة التبريد (أيام)", "Cooldown (Days)")}</label>
                  <input type="number" min={0} value={popup.conditions.cooldownDays} onChange={e => updateCondition("cooldownDays", +e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm" placeholder={t("0 = لا يوجد", "0 = None")} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("نوع الجهاز", "Device Type")}</label>
                <select value={popup.conditions.deviceType} onChange={e => updateCondition("deviceType", e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm">
                  <option value="ALL">{t("الكل", "All")}</option>
                  <option value="MOBILE">{t("موبايل فقط", "Mobile Only")}</option>
                  <option value="DESKTOP">{t("ديسكتوب فقط", "Desktop Only")}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("الصفحات المستهدفة", "Target Pages")}</label>
                <input value={pagesInput} onChange={e => setPagesInput(e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm" dir="ltr" placeholder="/, /products, /about" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{t("تاريخ البداية", "Start Date")}</label><input type="datetime-local" value={popup.startDate} onChange={e => update("startDate", e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{t("تاريخ النهاية", "End Date")}</label><input type="datetime-local" value={popup.endDate} onChange={e => update("endDate", e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("الأولوية", "Priority")}</label>
                  <input type="number" min={0} value={popup.priority} onChange={e => update("priority", +e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={popup.isActive} onChange={e => update("isActive", e.target.checked)} className="w-5 h-5 rounded text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">{t("تفعيل البوب آب", "Activate Popup")}</span>
                  </label>
                </div>
              </div>
            </>)}
          </div>
        </div>

        {/* RIGHT: Live Preview */}
        {showPreview && (
          <div className="bg-gray-100 rounded-xl border border-gray-200 overflow-hidden sticky top-6 self-start">
            <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center gap-2">
              <div className="flex gap-1.5"><span className="w-3 h-3 rounded-full bg-red-400" /><span className="w-3 h-3 rounded-full bg-yellow-400" /><span className="w-3 h-3 rounded-full bg-green-400" /></div>
              <span className="text-xs text-gray-400 mx-auto">{t("معاينة حية", "Live Preview")}</span>
            </div>
            <div className="relative h-[550px] flex items-center justify-center overflow-hidden" style={{ background: popup.overlayColor }}>
              {/* Fake page behind */}
              <div className="absolute inset-0 bg-white opacity-30" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={popup.animation + popup.type + popup.borderRadius + popup.maxWidth}
                  {...(anim as { initial: object; animate: object })}
                  transition={{ duration: 0.4 }}
                  className={`relative z-10 shadow-2xl overflow-hidden ${
                    popup.type === "BANNER_TOP" ? "absolute top-0 left-0 right-0 rounded-none" :
                    popup.type === "BANNER_BOTTOM" ? "absolute bottom-0 left-0 right-0 rounded-none" :
                    popup.type === "SLIDE_IN" ? `absolute bottom-4 ${locale === 'ar' ? 'right-4' : 'left-4'}` : ""
                  }`}
                  style={{
                    backgroundColor: popup.backgroundColor,
                    color: popup.textColor,
                    borderRadius: popup.type === "MODAL" || popup.type === "SLIDE_IN" ? popup.borderRadius : 0,
                    maxWidth: popup.type === "MODAL" || popup.type === "SLIDE_IN" ? popup.maxWidth : "100%",
                    width: popup.type === "MODAL" || popup.type === "SLIDE_IN" ? "90%" : "100%",
                  }}
                >
                  {/* Close Button */}
                  <button className={`absolute top-3 ${locale === 'ar' ? 'left-3' : 'right-3'} w-7 h-7 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-sm font-bold`} style={{ color: popup.textColor }}>✕</button>

                  {/* Image */}
                  {popup.image && (
                    <div className="w-full h-40 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={popup.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 text-center" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                    {(locale === 'ar' ? popup.titleAr : popup.titleEn) && <h3 className="text-xl font-bold mb-2">{locale === 'ar' ? popup.titleAr : popup.titleEn}</h3>}
                    {(locale === 'ar' ? popup.contentAr : popup.contentEn) && <p className="text-sm leading-relaxed opacity-80 mb-5">{locale === 'ar' ? popup.contentAr : popup.contentEn}</p>}
                    {/* Buttons */}
                    {popup.buttons.length > 0 && (
                      <div className="flex flex-wrap gap-3 justify-center">
                        {popup.buttons.map((btn) => (
                          <button key={btn.id} style={{ backgroundColor: btn.bgColor, color: btn.textColor, borderRadius: popup.borderRadius / 2 }} className="px-5 py-2.5 text-sm font-bold shadow-sm transition-transform hover:scale-105">
                            {locale === 'ar' ? (btn.textAr || "زر") : (btn.textEn || "Button")}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PopupEditorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>}>
      <PopupEditorInner />
    </Suspense>
  );
}
