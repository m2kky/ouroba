"use client";

import { useState, useEffect } from "react";
import DataTable, { Column } from "@/components/admin/DataTable";
import { Trash2, Edit, Plus, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useAdminTranslation } from "@/components/admin/AdminTranslationProvider";

type SectionType = "certificates" | "standards" | "values" | "why-choose-us" | "buildings" | "features" | "production-steps" | "section-texts";

interface SectionConfig {
  title: string;
  desc: string;
  fields: {
    key: string;
    label: string;
    type: "text" | "textarea" | "number" | "image";
    dir?: "rtl" | "ltr";
  }[];
}

const getSectionConfigs = (t: any): Record<SectionType, SectionConfig> => ({
  certificates: {
    title: t("الشهادات (Certificates)", "Certificates"),
    desc: t("إدارة شهادات الجودة والاعتمادات", "Manage quality certificates and accreditations"),
    fields: [
      { key: "image", label: t("صورة الشهادة", "Certificate Image"), type: "image" }
    ]
  },
  standards: {
    title: t("معايير الجودة (Standards)", "Quality Standards"),
    desc: t("إدارة معايير الإنتاج والجودة", "Manage production and quality standards"),
    fields: [
      { key: "descriptionAr", label: t("الوصف (عربي)", "Description (Arabic)"), type: "textarea", dir: "rtl" },
      { key: "descriptionEn", label: t("الوصف (إنجليزي)", "Description (English)"), type: "textarea", dir: "ltr" },
      { key: "image", label: t("أيقونة/صورة", "Icon/Image"), type: "image" }
    ]
  },
  values: {
    title: t("القيم المؤسسية (Values)", "Institutional Values"),
    desc: t("إدارة قيم ومبادئ الشركة", "Manage company values and principles"),
    fields: [
      { key: "titleAr", label: t("العنوان (عربي)", "Title (Arabic)"), type: "text", dir: "rtl" },
      { key: "titleEn", label: t("العنوان (إنجليزي)", "Title (English)"), type: "text", dir: "ltr" },
      { key: "descriptionAr", label: t("الوصف (عربي)", "Description (Arabic)"), type: "textarea", dir: "rtl" },
      { key: "descriptionEn", label: t("الوصف (إنجليزي)", "Description (English)"), type: "textarea", dir: "ltr" },
      { key: "image", label: t("أيقونة/صورة", "Icon/Image"), type: "image" }
    ]
  },
  "why-choose-us": {
    title: t("لماذا نحن؟ (Why Choose Us)", "Why Choose Us"),
    desc: t("إدارة أسباب اختيار العميل لمنتجاتنا", "Manage reasons why customers choose our products"),
    fields: [
      { key: "descriptionAr", label: t("الوصف (عربي)", "Description (Arabic)"), type: "textarea", dir: "rtl" },
      { key: "descriptionEn", label: t("الوصف (إنجليزي)", "Description (English)"), type: "textarea", dir: "ltr" }
    ]
  },
  buildings: {
    title: t("مرافق الشركة (Buildings)", "Company Facilities (Buildings)"),
    desc: t("إدارة معلومات المباني والمرافق", "Manage building and facility information"),
    fields: [
      { key: "titleAr", label: t("العنوان (عربي)", "Title (Arabic)"), type: "text", dir: "rtl" },
      { key: "titleEn", label: t("العنوان (إنجليزي)", "Title (English)"), type: "text", dir: "ltr" },
      { key: "descriptionAr", label: t("الوصف (عربي)", "Description (Arabic)"), type: "textarea", dir: "rtl" },
      { key: "descriptionEn", label: t("الوصف (إنجليزي)", "Description (English)"), type: "textarea", dir: "ltr" },
      { key: "image", label: t("صورة المرفق", "Facility Image"), type: "image" }
    ]
  },
  features: {
    title: t("المميزات (Features)", "Features"),
    desc: t("إدارة مميزات المنتجات أو الشركة", "Manage product or company features"),
    fields: [
      { key: "titleAr", label: t("العنوان (عربي)", "Title (Arabic)"), type: "text", dir: "rtl" },
      { key: "titleEn", label: t("العنوان (إنجليزي)", "Title (English)"), type: "text", dir: "ltr" },
      { key: "descriptionAr", label: t("الوصف (عربي)", "Description (Arabic)"), type: "textarea", dir: "rtl" },
      { key: "descriptionEn", label: t("الوصف (إنجليزي)", "Description (English)"), type: "textarea", dir: "ltr" },
      { key: "image", label: t("أيقونة/صورة", "Icon/Image"), type: "image" }
    ]
  },
  "production-steps": {
    title: t("خطوات الإنتاج (Production Steps)", "Production Steps"),
    desc: t("إدارة مراحل عملية الإنتاج", "Manage production process stages"),
    fields: [
      { key: "textAr", label: t("النص (عربي)", "Text (Arabic)"), type: "textarea", dir: "rtl" },
      { key: "textEn", label: t("النص (إنجليزي)", "Text (English)"), type: "textarea", dir: "ltr" },
      { key: "number", label: t("رقم الخطوة (الترتيب)", "Step Number (Order)"), type: "number" },
      { key: "image", label: t("صورة الخطوة", "Step Image"), type: "image" }
    ]
  },
  "section-texts": {
    title: t("نصوص الأقسام (Section Texts)", "Section Texts"),
    desc: t("إدارة النصوص العامة في الأقسام المختلفة", "Manage general texts in different sections"),
    fields: [
      { key: "titleAr", label: t("العنوان (عربي)", "Title (Arabic)"), type: "text", dir: "rtl" },
      { key: "titleEn", label: t("العنوان (إنجليزي)", "Title (English)"), type: "text", dir: "ltr" },
      { key: "textAr", label: t("النص (عربي)", "Text (Arabic)"), type: "textarea", dir: "rtl" },
      { key: "textEn", label: t("النص (إنجليزي)", "Text (English)"), type: "textarea", dir: "ltr" },
      { key: "number", label: t("رقم القسم (ترتيب)", "Section Number (Order)"), type: "number" }
    ]
  }
});

export default function DynamicAboutPage({ params }: { params: { section: string } }) {
  const { t, dict, locale } = useAdminTranslation();
  const section = params.section as SectionType;
  const config = getSectionConfigs(t)[section];

  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (config) fetchItems();
  }, [section]);

  if (!config) {
    return <div className="p-10 text-center text-red-500 font-bold">{t("القسم غير موجود!", "Section not found!")}</div>;
  }

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/about/${section}`);
      if (res.ok) setItems(await res.json());
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(dict.common.confirmDelete)) return;
    
    try {
      const res = await fetch(`/api/admin/about/${section}/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems(items.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    formData.set("isHidden", (formData.get("isHidden") === "on").toString());

    const url = editingItem ? `/api/admin/about/${section}/${editingItem.id}` : `/api/admin/about/${section}`;
    const method = editingItem ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingItem(null);
        fetchItems();
      } else {
        const error = await res.json();
        alert(error.error || dict.common.error);
      }
    } catch (error) {
      console.error("Failed to save", error);
      alert(dict.common.error);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredItems = items.filter(item => {
    const s = search.toLowerCase();
    return (
      (item.titleAr && item.titleAr.toLowerCase().includes(s)) ||
      (item.titleEn && item.titleEn.toLowerCase().includes(s)) ||
      (item.descriptionAr && item.descriptionAr.toLowerCase().includes(s)) ||
      (item.textAr && item.textAr.toLowerCase().includes(s))
    );
  });

  const generateColumns = (): Column<any>[] => {
    const cols: Column<any>[] = [];
    
    if (config.fields.some(f => f.key === "image")) {
      cols.push({ 
        key: "image", 
        label: dict.common.image, 
        render: (item) => item.image ? (
          <Image src={item.image} alt="img" width={40} height={40} className="rounded object-cover" />
        ) : <ImageIcon className="w-8 h-8 text-gray-300" />
      });
    }

    if (config.fields.some(f => f.key === "titleAr")) {
      cols.push({ key: "titleAr", label: t("العنوان", "Title"), render: (item) => t(item.titleAr, item.titleEn) });
    } else if (config.fields.some(f => f.key === "descriptionAr")) {
      cols.push({ 
        key: "descriptionAr", 
        label: t("الوصف", "Description"),
        render: (item) => <div className="truncate max-w-xs">{t(item.descriptionAr, item.descriptionEn)}</div>
      });
    } else if (config.fields.some(f => f.key === "textAr")) {
      cols.push({ 
        key: "textAr", 
        label: t("النص", "Text"),
        render: (item) => <div className="truncate max-w-xs">{t(item.textAr, item.textEn)}</div>
      });
    }

    cols.push({
      key: "isHidden",
      label: dict.common.status,
      render: (item) => item.isHidden 
        ? <span className="text-red-500 font-semibold text-sm">{dict.common.hidden}</span> 
        : <span className="text-green-500 font-semibold text-sm">{dict.common.visible}</span>
    });

    return cols;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
          <p className="text-gray-500 mt-1">{config.desc}</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-orouba-blue text-white px-4 py-2 rounded-xl font-bold hover:bg-orouba-blue/90 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          {dict.common.add}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orouba-blue"></div>
        </div>
      ) : (
        <DataTable
          columns={generateColumns()}
          data={filteredItems}
          onSearch={setSearch}
          searchPlaceholder={dict.common.search}
          actions={(item) => (
            <>
              <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title={dict.common.edit}>
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title={dict.common.delete}>
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        />
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-xl" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">
                {editingItem ? dict.common.edit : dict.common.add}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto hide-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {config.fields.map(field => {
                  if (field.type === "image") {
                    return (
                      <div key={field.key} className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">{field.label}</label>
                        <input
                          type="file"
                          name={field.key}
                          accept="image/*"
                          className="w-full text-sm border border-gray-200 rounded-lg p-1"
                          required={!editingItem && field.key === "image" && section === "certificates"}
                        />
                        {editingItem?.[field.key] && (
                          <div className="mt-2 text-xs text-green-600 flex items-center gap-2">
                            <Image src={editingItem[field.key]} alt="current" width={40} height={40} className="rounded object-cover" />
                            {t("صورة حالية مرفوعة", "Current image uploaded")}
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (field.type === "textarea") {
                    return (
                      <div key={field.key} className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">{field.label}</label>
                        <textarea
                          name={field.key}
                          defaultValue={editingItem?.[field.key] || ""}
                          dir={field.dir}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none resize-none"
                        />
                      </div>
                    );
                  }

                  return (
                    <div key={field.key} className="col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">{field.label}</label>
                      <input
                        type={field.type}
                        name={field.key}
                        defaultValue={editingItem?.[field.key] || ""}
                        dir={field.dir}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isHidden"
                  name="isHidden"
                  defaultChecked={editingItem?.isHidden}
                  className="w-5 h-5 text-orouba-blue rounded border-gray-300"
                />
                <label htmlFor="isHidden" className="text-sm font-semibold text-gray-700 cursor-pointer">
                  {t("إخفاء هذا العنصر", "Hide this item")}
                </label>
              </div>

              <div className="mt-8 pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-gray-100 rounded-xl font-medium" disabled={isSaving}>{dict.common.cancel}</button>
                <button type="submit" disabled={isSaving} className="px-6 py-2 bg-orouba-blue text-white rounded-xl font-medium shadow-lg disabled:opacity-50">
                  {isSaving ? dict.common.saving : dict.common.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
