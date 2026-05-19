"use client";
import AdminPageInfo from "@/components/admin/AdminPageInfo";

import { useState, useEffect } from "react";
import DataTable, { Column } from "@/components/admin/DataTable";
import { Trash2, Edit, Plus, Eye, EyeOff } from "lucide-react";

interface WhyUs { id: string; descriptionAr: string; descriptionEn: string; isHidden: boolean; }

export default function WhyUsPage() {
  const [items, setItems] = useState<WhyUs[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<WhyUs | null>(null);

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => { setIsLoading(true); try { const r = await fetch("/api/admin/why-us"); if (r.ok) setItems(await r.json()); } catch (e) { console.error(e); } finally { setIsLoading(false); } };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); const fd = new FormData(e.currentTarget);
    const body = { id: editItem?.id, descriptionAr: fd.get("descriptionAr"), descriptionEn: fd.get("descriptionEn"), isHidden: fd.get("isHidden") === "on" };
    try { const r = await fetch("/api/admin/why-us", { method: editItem ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); if (r.ok) { fetchItems(); setShowModal(false); setEditItem(null); } } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => { if (!confirm("هل أنت متأكد؟")) return; try { const r = await fetch(`/api/admin/why-us?id=${id}`, { method: "DELETE" }); if (r.ok) setItems(items.filter(i => i.id !== id)); } catch (e) { console.error(e); } };

  const handleToggleVisibility = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/toggle-visibility', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'whyChooseUs', id, isHidden: !currentStatus })
      });
      if (res.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error("Failed to toggle visibility", error);
    }
  };

  const filtered = items.filter(i => i.descriptionAr?.includes(search) || i.descriptionEn?.toLowerCase().includes(search.toLowerCase()));
  const columns: Column<WhyUs>[] = [
    { key: "descriptionAr", label: "الوصف (عربي)", render: (i) => <span className="line-clamp-2">{i.descriptionAr}</span> },
    { key: "descriptionEn", label: "الوصف (إنجليزي)", render: (i) => <span className="line-clamp-2">{i.descriptionEn}</span> },
    { 
      key: "isHidden", 
      label: "الحالة", 
      render: (i) => (
        <button
          onClick={() => handleToggleVisibility(i.id, i.isHidden)}
          className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95 flex items-center gap-1 ${
            i.isHidden 
              ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100/70" 
              : "bg-green-50 text-green-600 border border-green-200 hover:bg-green-100/70"
          }`}
          title={i.isHidden ? "تغيير إلى ظاهر" : "تغيير إلى مخفي"}
        >
          {i.isHidden ? <><EyeOff className="w-3.5 h-3.5" /> مخفي</> : <><Eye className="w-3.5 h-3.5" /> ظاهر</>}
        </button>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageInfo 
        titleAr="لماذا نحن (Why Choose Us)" 
        titleEn="Why Choose Orouba"
        descriptionAr="إدارة النقاط التي تميز الشركة عن غيرها من المنافسين." 
        descriptionEn="Manage unique competitive advantages of Orouba Foods."
        prereq1Ar="تُستخدم كعناصر تسويقية فعالة في الصفحات الرئيسية." 
        prereq1En="Renders as selling highlights on homepage grids."
        prereq2Ar="لا يوجد متطلبات سابقة، يمكنك إضافتها في أي وقت." 
        prereq2En="No prerequisites, update anytime."
      />

      

      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-900">لماذا نحن</h1><p className="text-gray-500 mt-1">إدارة أسباب اختيار العروبة</p></div>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} className="flex items-center gap-2 bg-orouba-blue text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-800"><Plus className="w-5 h-5" /> إضافة</button>
      </div>
      {isLoading ? <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orouba-blue" /></div> : (
        <DataTable columns={columns} data={filtered} onSearch={setSearch} searchPlaceholder="ابحث..." actions={(item) => (<><button onClick={() => { setEditItem(item); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></>)} />
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl" dir="rtl">
            <div className="p-6 border-b flex justify-between items-center"><h3 className="text-xl font-bold">{editItem ? "تعديل" : "إضافة"}</h3><button onClick={() => { setShowModal(false); setEditItem(null); }} className="text-gray-400 hover:text-gray-600">✕</button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className="block text-sm font-medium mb-1">الوصف (عربي)</label><textarea name="descriptionAr" defaultValue={editItem?.descriptionAr || ""} required rows={3} className="w-full border rounded-lg px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">الوصف (إنجليزي)</label><textarea name="descriptionEn" defaultValue={editItem?.descriptionEn || ""} required rows={3} className="w-full border rounded-lg px-3 py-2" /></div>
              <div className="flex items-center gap-2"><input type="checkbox" name="isHidden" id="isHidden" defaultChecked={editItem?.isHidden || false} className="rounded" /><label htmlFor="isHidden" className="text-sm">إخفاء</label></div>
              <div className="flex gap-3 pt-4"><button type="submit" className="flex-1 bg-orouba-blue text-white py-2.5 rounded-xl font-bold hover:bg-blue-800">{editItem ? "تحديث" : "إضافة"}</button><button type="button" onClick={() => { setShowModal(false); setEditItem(null); }} className="px-6 py-2.5 border rounded-xl text-gray-700 hover:bg-gray-50">إلغاء</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
