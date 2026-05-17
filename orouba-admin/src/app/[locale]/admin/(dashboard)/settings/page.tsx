"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { useAdminTranslation } from "@/components/admin/AdminTranslationProvider";

interface SiteSetting {
  key: string;
  valueEn: string | null;
  valueAr: string | null;
  description: string | null;
}

export default function SettingsPage() {
  const { t, dict } = useAdminTranslation();
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) setSettings(await res.json());
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

  const defaultKeys = [
    { key: "site_name", desc: t("اسم الموقع", "Site Name") },
    { key: "phone_1", desc: t("رقم الهاتف الأساسي", "Primary Phone") },
    { key: "phone_2", desc: t("رقم الهاتف البديل", "Alternate Phone") },
    { key: "email_support", desc: t("البريد الإلكتروني للدعم", "Support Email") },
    { key: "address", desc: t("العنوان الرئيسي", "Main Address") },
    { key: "facebook_url", desc: t("رابط فيسبوك", "Facebook URL") },
    { key: "instagram_url", desc: t("رابط إنستجرام", "Instagram URL") },
    { key: "linkedin_url", desc: t("رابط لينكد إن", "LinkedIn URL") },
    { key: "whatsapp_number", desc: t("رقم واتساب", "WhatsApp Number") },
  ];

  const addDefaultKey = (k: string, desc: string) => {
    if (!settings.find(s => s.key === k)) {
      setSettings([...settings, { key: k, valueAr: "", valueEn: "", description: desc }]);
    }
  };

  return (
    <div className="space-y-6">
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
              settings.map((setting, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-4 items-start bg-gray-50 p-2 rounded-xl">
                  <div className="col-span-3 space-y-2">
                    <input
                      type="text"
                      placeholder={t("مثال: phone_1", "Example: phone_1")}
                      value={setting.key}
                      dir="ltr"
                      onChange={(e) => handleChange(idx, "key", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                    />
                    <input
                      type="text"
                      placeholder={t("وصف (اختياري)", "Description (Optional)")}
                      value={setting.description || ""}
                      onChange={(e) => handleChange(idx, "description", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-500 bg-transparent"
                    />
                  </div>
                  <div className="col-span-4">
                    <textarea
                      placeholder={t("القيمة بالعربي", "Value in Arabic")}
                      value={setting.valueAr || ""}
                      onChange={(e) => handleChange(idx, "valueAr", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white resize-none h-20"
                    />
                  </div>
                  <div className="col-span-4">
                    <textarea
                      placeholder="Value in English"
                      value={setting.valueEn || ""}
                      dir="ltr"
                      onChange={(e) => handleChange(idx, "valueEn", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white resize-none h-20"
                    />
                  </div>
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
              ))
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
