"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Plus, Trash2, Save, Eye } from "lucide-react";
import { Suspense } from "react";

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
      router.push("/admin/popups");
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  const anim = animations[popup.animation] || animations.FADE;

  return (
    <div className="min-h-screen" dir="rtl">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/admin/popups")} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowRight className="w-5 h-5" /></button>
          <h1 className="text-xl font-bold text-gray-800">{editId ? "تعديل البوب آب" : "إنشاء بوب آب جديد"}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowPreview(!showPreview)} className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
            <Eye className="w-4 h-4" />{showPreview ? "إخفاء المعاينة" : "إظهار المعاينة"}
          </button>
          <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 font-medium">
            <Save className="w-4 h-4" />{saving ? "جاري الحفظ..." : "حفظ"}
          </button>
        </div>
      </div>

      <div className={`grid gap-6 ${showPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 max-w-3xl"}`}>
        {/* LEFT: Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {(["content", "design", "rules"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === t ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" : "text-gray-500 hover:text-gray-700"}`}>
                {t === "content" ? "📝 المحتوى" : t === "design" ? "🎨 التصميم" : "⚙️ القواعد"}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* CONTENT TAB */}
            {tab === "content" && (<>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">اسم داخلي (للإدارة فقط)</label>
                <input value={popup.internalName} onChange={e => update("internalName", e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="مثال: بوب آب العيد" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">العنوان (عربي)</label>
                  <input value={popup.titleAr} onChange={e => update("titleAr", e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">العنوان (إنجليزي)</label>
                  <input value={popup.titleEn} onChange={e => update("titleEn", e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" dir="ltr" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">المحتوى (عربي)</label>
                <textarea value={popup.contentAr} onChange={e => update("contentAr", e.target.value)} rows={3} className="w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">رابط الصورة</label>
                <input value={popup.image} onChange={e => update("image", e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" dir="ltr" placeholder="https://..." />
              </div>
              {/* Buttons Builder */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">الأزرار</label>
                  <button onClick={addButton} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"><Plus className="w-3.5 h-3.5" />إضافة زر</button>
                </div>
                <div className="space-y-4">
                  {popup.buttons.map((btn, idx) => (
                    <div key={btn.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500">زر #{idx + 1}</span>
                        <button onClick={() => removeButton(idx)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input value={btn.textAr} onChange={e => updateButton(idx, "textAr", e.target.value)} className="border rounded-lg px-3 py-2 text-sm" placeholder="نص عربي" />
                        <input value={btn.textEn} onChange={e => updateButton(idx, "textEn", e.target.value)} className="border rounded-lg px-3 py-2 text-sm" dir="ltr" placeholder="English text" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="text-xs text-gray-500">لون الخلفية</label><input type="color" value={btn.bgColor} onChange={e => updateButton(idx, "bgColor", e.target.value)} className="w-full h-8 rounded cursor-pointer" /></div>
                        <div><label className="text-xs text-gray-500">لون النص</label><input type="color" value={btn.textColor} onChange={e => updateButton(idx, "textColor", e.target.value)} className="w-full h-8 rounded cursor-pointer" /></div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">نوع الأكشن</label>
                        <select value={btn.actionType} onChange={e => updateButton(idx, "actionType", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mt-1">
                          <option value="CLOSE">إغلاق البوب آب</option>
                          <option value="LINK">فتح رابط</option>
                          <option value="NEXT_POPUP">فتح بوب آب آخر (سيكوانس)</option>
                        </select>
                      </div>
                      {btn.actionType === "LINK" && (
                        <input value={btn.actionValue} onChange={e => updateButton(idx, "actionValue", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" dir="ltr" placeholder="https://..." />
                      )}
                      {btn.actionType === "NEXT_POPUP" && (
                        <select value={btn.sequencePopupId} onChange={e => updateButton(idx, "sequencePopupId", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                          <option value="">اختر البوب آب التالي</option>
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">نوع البوب آب</label>
                <select value={popup.type} onChange={e => update("type", e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm">
                  <option value="MODAL">نافذة وسطية (Modal)</option>
                  <option value="BANNER_TOP">شريط علوي (Banner Top)</option>
                  <option value="BANNER_BOTTOM">شريط سفلي (Banner Bottom)</option>
                  <option value="SLIDE_IN">منزلق جانبي (Slide-in)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">الأنيميشن</label>
                <select value={popup.animation} onChange={e => update("animation", e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm">
                  <option value="FADE">تلاشي (Fade)</option>
                  <option value="ZOOM">تكبير (Zoom)</option>
                  <option value="SLIDE_UP">انزلاق للأعلى (Slide Up)</option>
                  <option value="BOUNCE">ارتداد (Bounce)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">لون الخلفية</label><input type="color" value={popup.backgroundColor} onChange={e => update("backgroundColor", e.target.value)} className="w-full h-10 rounded-lg cursor-pointer border" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">لون النص</label><input type="color" value={popup.textColor} onChange={e => update("textColor", e.target.value)} className="w-full h-10 rounded-lg cursor-pointer border" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">حجم الزوايا (px)</label>
                  <input type="range" min={0} max={40} value={popup.borderRadius} onChange={e => update("borderRadius", +e.target.value)} className="w-full" />
                  <span className="text-xs text-gray-400">{popup.borderRadius}px</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">العرض الأقصى (px)</label>
                  <input type="number" min={300} max={900} value={popup.maxWidth} onChange={e => update("maxWidth", +e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm" />
                </div>
              </div>
            </>)}

            {/* RULES TAB */}
            {tab === "rules" && (<>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">طريقة الظهور (Trigger)</label>
                <select value={popup.trigger} onChange={e => update("trigger", e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm">
                  <option value="ON_LOAD">عند تحميل الصفحة</option>
                  <option value="TIME_DELAY">بعد تأخير زمني</option>
                  <option value="ON_SCROLL">عند التمرير لنسبة معينة</option>
                  <option value="EXIT_INTENT">عند نية الخروج</option>
                  <option value="SEQUENCE_ONLY">سيكوانس فقط (يظهر من زر بوب آب آخر)</option>
                </select>
              </div>
              {(popup.trigger === "TIME_DELAY" || popup.trigger === "ON_SCROLL") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{popup.trigger === "TIME_DELAY" ? "التأخير (بالمللي ثانية)" : "نسبة التمرير (%)"}</label>
                  <input type="number" min={0} value={popup.triggerValue} onChange={e => update("triggerValue", +e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">الحد الأقصى للعرض</label>
                  <input type="number" min={0} value={popup.conditions.maxDisplays} onChange={e => updateCondition("maxDisplays", +e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm" placeholder="0 = بلا حدود" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">فترة التبريد (أيام)</label>
                  <input type="number" min={0} value={popup.conditions.cooldownDays} onChange={e => updateCondition("cooldownDays", +e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm" placeholder="0 = لا يوجد" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">نوع الجهاز</label>
                <select value={popup.conditions.deviceType} onChange={e => updateCondition("deviceType", e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm">
                  <option value="ALL">الكل</option>
                  <option value="MOBILE">موبايل فقط</option>
                  <option value="DESKTOP">ديسكتوب فقط</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">الصفحات المستهدفة</label>
                <input value={pagesInput} onChange={e => setPagesInput(e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm" dir="ltr" placeholder="/, /products, /about  (اتركه فارغ = كل الصفحات)" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">تاريخ البداية</label><input type="datetime-local" value={popup.startDate} onChange={e => update("startDate", e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">تاريخ النهاية</label><input type="datetime-local" value={popup.endDate} onChange={e => update("endDate", e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">الأولوية</label>
                  <input type="number" min={0} value={popup.priority} onChange={e => update("priority", +e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={popup.isActive} onChange={e => update("isActive", e.target.checked)} className="w-5 h-5 rounded text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">تفعيل البوب آب</span>
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
              <span className="text-xs text-gray-400 mx-auto">معاينة حية</span>
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
                    popup.type === "SLIDE_IN" ? "absolute bottom-4 left-4" : ""
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
                  <button className="absolute top-3 left-3 w-7 h-7 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-sm font-bold" style={{ color: popup.textColor }}>✕</button>

                  {/* Image */}
                  {popup.image && (
                    <div className="w-full h-40 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={popup.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 text-center" dir="rtl">
                    {popup.titleAr && <h3 className="text-xl font-bold mb-2">{popup.titleAr}</h3>}
                    {popup.contentAr && <p className="text-sm leading-relaxed opacity-80 mb-5">{popup.contentAr}</p>}
                    {/* Buttons */}
                    {popup.buttons.length > 0 && (
                      <div className="flex flex-wrap gap-3 justify-center">
                        {popup.buttons.map((btn) => (
                          <button key={btn.id} style={{ backgroundColor: btn.bgColor, color: btn.textColor, borderRadius: popup.borderRadius / 2 }} className="px-5 py-2.5 text-sm font-bold shadow-sm transition-transform hover:scale-105">
                            {btn.textAr || "زر"}
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
