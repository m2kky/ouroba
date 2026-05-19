"use client";
import AdminPageInfo from "@/components/admin/AdminPageInfo";

import { useState, useEffect } from "react";
import DataTable, { Column } from "@/components/admin/DataTable";
import { Trash2, Edit, Plus, Eye, EyeOff } from "lucide-react";
import { useAdminTranslation } from "@/components/admin/AdminTranslationProvider";

interface Country { id: string; nameAr: string; nameEn: string; }
interface Continent { id: string; nameAr: string; nameEn: string; isHidden: boolean; countries: Country[]; }

export default function ContinentsPage() {
  const { t, dict, locale } = useAdminTranslation();
  const [items, setItems] = useState<Continent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Continent | null>(null);

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => { setIsLoading(true); try { const r = await fetch("/api/admin/continents"); if (r.ok) setItems(await r.json()); } catch (e) { console.error(e); } finally { setIsLoading(false); } };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); const fd = new FormData(e.currentTarget);
    const body = { id: editItem?.id, nameAr: fd.get("nameAr"), nameEn: fd.get("nameEn"), isHidden: fd.get("isHidden") === "on" };
    try { const r = await fetch("/api/admin/continents", { method: editItem ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); if (r.ok) { fetchItems(); setShowModal(false); setEditItem(null); } } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => { if (!confirm(dict.common.confirmDelete)) return; try { const r = await fetch(`/api/admin/continents?id=${id}`, { method: "DELETE" }); if (r.ok) setItems(items.filter(i => i.id !== id)); } catch (e) { console.error(e); } }

  const handleToggleVisibility = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/toggle-visibility', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'continent', id, isHidden: !currentStatus })
      });
      if (res.ok) {
        fetchItems();
      } else {
        alert("حدث خطأ أثناء التحديث");
      }
    } catch (error) {
      console.error("Failed to toggle visibility", error);
    }
  };;

  const filtered = items.filter(i => i.nameAr?.includes(search) || i.nameEn?.toLowerCase().includes(search.toLowerCase()));
  const columns: Column<Continent>[] = [
    { key: "nameAr", label: t("الاسم (عربي)", "Name (Arabic)") },
    { key: "nameEn", label: t("الاسم (إنجليزي)", "Name (English)") },
    { key: "countries", label: t("عدد الدول", "Countries Count"), render: (i) => <span className="font-bold text-orouba-blue">{i.countries?.length || 0}</span> },
    {
      key: "isHidden",
      label: dict.common.status,
      render: (item) => (
        <button
          onClick={() => handleToggleVisibility(item.id, item.isHidden)}
          className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95 flex items-center gap-1 ${
            item.isHidden 
              ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100/70" 
              : "bg-green-50 text-green-600 border border-green-200 hover:bg-green-100/70"
          }`}
          title={item.isHidden ? dict.common.hidden : dict.common.visible}
        >
          {item.isHidden ? (
            <><EyeOff className="w-3.5 h-3.5" /> {dict.common.hidden}</>
          ) : (
            <><Eye className="w-3.5 h-3.5" /> {dict.common.visible}</>
          )}
        </button>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageInfo 
        titleAr="خريطة التصدير (Export Map)" 
        titleEn="Export Geography Map"
        descriptionAr="إدارة القارات والدول التي يتم تصدير المنتجات إليها." 
        descriptionEn="Manage continents and countries Orouba exports products to."
        prereq1Ar="خطوة أساسية أولاً: يجب إضافة القارة (مثل أفريقيا) قبل التمكن من إضافة دول بداخلها (مثل مصر)." 
        prereq1En="⚠️ Required first: Add Continents (e.g. Europe) before attaching export countries."
        prereq2Ar="تستخدم هذه البيانات لبناء خريطة التصدير التفاعلية في الموقع." 
        prereq2En="Supplies interactive markers on the global export map."
      />

      

      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-900">{dict.sidebar.export}</h1><p className="text-gray-500 mt-1">{t("إدارة القارات ودول التصدير", "Manage continents and export countries")}</p></div>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} className="flex items-center gap-2 bg-orouba-blue text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-800"><Plus className="w-5 h-5" /> {dict.common.add}</button>
      </div>
      {isLoading ? <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orouba-blue" /></div> : (
        <DataTable columns={columns} data={filtered} onSearch={setSearch} searchPlaceholder={dict.common.search} actions={(item) => (<><button onClick={() => { setEditItem(item); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title={dict.common.edit}><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title={dict.common.delete}><Trash2 className="w-4 h-4" /></button></>)} />
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <div className="p-6 border-b flex justify-between items-center"><h3 className="text-xl font-bold">{editItem ? dict.common.edit : dict.common.add}</h3><button onClick={() => { setShowModal(false); setEditItem(null); }} className="text-gray-400 hover:text-gray-600">✕</button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className="block text-sm font-medium mb-1">{dict.common.nameAr}</label><input name="nameAr" defaultValue={editItem?.nameAr || ""} required className="w-full border rounded-lg px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">{dict.common.nameEn}</label><input name="nameEn" defaultValue={editItem?.nameEn || ""} required className="w-full border rounded-lg px-3 py-2" /></div>
              <div className="flex items-center gap-2"><input type="checkbox" name="isHidden" id="isHidden" defaultChecked={editItem?.isHidden || false} className="rounded" /><label htmlFor="isHidden" className="text-sm">{t("إخفاء", "Hide")}</label></div>
              {editItem && editItem.countries?.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-bold mb-2 text-sm">{t("الدول", "Countries")} ({editItem.countries.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {editItem.countries.map(c => <span key={c.id} className="bg-orouba-blue/10 text-orouba-blue px-3 py-1 rounded-full text-sm font-medium">{locale === 'ar' ? c.nameAr : c.nameEn}</span>)}
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-4"><button type="submit" className="flex-1 bg-orouba-blue text-white py-2.5 rounded-xl font-bold hover:bg-blue-800">{editItem ? dict.common.save : dict.common.add}</button><button type="button" onClick={() => { setShowModal(false); setEditItem(null); }} className="px-6 py-2.5 border rounded-xl text-gray-700 hover:bg-gray-50">{dict.common.cancel}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
