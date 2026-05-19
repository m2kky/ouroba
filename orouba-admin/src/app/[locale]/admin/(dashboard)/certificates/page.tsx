"use client";
import AdminPageInfo from "@/components/admin/AdminPageInfo";

import { useState, useEffect } from "react";
import DataTable, { Column } from "@/components/admin/DataTable";
import { Trash2, Edit, Plus, Eye, EyeOff } from "lucide-react";
import { useAdminTranslation } from "@/components/admin/AdminTranslationProvider";
/* eslint-disable @next/next/no-img-element */

interface Certificate { id: string; image: string; isHidden: boolean; createdAt: string; }

export default function CertificatesPage() {
  const { t, dict } = useAdminTranslation();
  const [items, setItems] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Certificate | null>(null);

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => { setIsLoading(true); try { const r = await fetch("/api/admin/certificates"); if (r.ok) setItems(await r.json()); } catch (e) { console.error(e); } finally { setIsLoading(false); } };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("isHidden", (fd.get("isHidden") === "on").toString());
    if (editItem) fd.set("id", editItem.id);
    try { const r = await fetch("/api/admin/certificates", { method: editItem ? "PUT" : "POST", body: fd }); if (r.ok) { fetchItems(); setShowModal(false); setEditItem(null); } } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => { if (!confirm(dict.common.confirmDelete)) return; try { const r = await fetch(`/api/admin/certificates?id=${id}`, { method: "DELETE" }); if (r.ok) setItems(items.filter(i => i.id !== id)); } catch (e) { console.error(e); } }

  const handleToggleVisibility = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/toggle-visibility', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'certificate', id, isHidden: !currentStatus })
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

  const columns: Column<Certificate>[] = [
    { key: "image", label: t("الشهادة", "Certificate"), render: (item) => <img src={item.image} alt="" className="w-20 h-20 rounded object-cover" /> },
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
        titleAr="شهادات الجودة (Certificates)" 
        titleEn="Quality Certificates"
        descriptionAr="إدارة شهادات الجودة والاعتمادات الحاصلة عليها الشركة." 
        descriptionEn="Manage industrial safety and quality certifications obtained by the firm."
        prereq1Ar="تُعرض هذه الشهادات لتعزيز ثقة العملاء والمستوردين." 
        prereq1En="Enhances buyer and export credibility by demonstrating certifications (ISO, HACCP)."
        prereq2Ar="يمكنك رفع صورة الشعار و كتابة اسم الشهادة ليتم عرضها في صفحة من نحن." 
        prereq2En="Upload certificate badges to display them in the 'About' section."
      />

      

      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-900">{dict.sidebar.certificates}</h1><p className="text-gray-500 mt-1">{t("إدارة شهادات الجودة", "Manage quality certificates")}</p></div>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} className="flex items-center gap-2 bg-orouba-blue text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-800"><Plus className="w-5 h-5" /> {dict.common.add}</button>
      </div>
      {isLoading ? <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orouba-blue" /></div> : (
        <DataTable columns={columns} data={items.filter(i => i.image?.includes(search))} onSearch={setSearch} searchPlaceholder={dict.common.search}
          actions={(item) => (<><button onClick={() => { setEditItem(item); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title={dict.common.edit}><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title={dict.common.delete}><Trash2 className="w-4 h-4" /></button></>)} />
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="p-6 border-b flex justify-between items-center"><h3 className="text-xl font-bold">{editItem ? dict.common.edit : dict.common.add}</h3><button onClick={() => { setShowModal(false); setEditItem(null); }} className="text-gray-400 hover:text-gray-600">✕</button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className="block text-sm font-medium mb-1">{dict.common.image}</label>{editItem?.image && <img src={editItem.image} alt="" className="w-20 h-20 object-cover rounded mb-2" />}<input type="file" name="image" accept="image/*" required={!editItem} className="w-full border rounded-lg px-3 py-2" /></div>
              <div className="flex items-center gap-2"><input type="checkbox" name="isHidden" id="isHidden" defaultChecked={editItem?.isHidden || false} className="rounded" /><label htmlFor="isHidden" className="text-sm">{t("إخفاء", "Hide")}</label></div>
              <div className="flex gap-3 pt-4"><button type="submit" className="flex-1 bg-orouba-blue text-white py-2.5 rounded-xl font-bold hover:bg-blue-800">{editItem ? dict.common.save : dict.common.add}</button><button type="button" onClick={() => { setShowModal(false); setEditItem(null); }} className="px-6 py-2.5 border rounded-xl text-gray-700 hover:bg-gray-50">{dict.common.cancel}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
