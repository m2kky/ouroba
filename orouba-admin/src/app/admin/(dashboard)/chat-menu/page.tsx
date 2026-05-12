"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Save, GripVertical, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";

interface MenuItem {
  id: string;
  labelAr: string;
  labelEn: string;
  icon: string;
  linkUrl: string;
  parentId: string | null;
  number: number;
  isHidden: boolean;
}

export default function ChatMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/chat-menu");
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const topItems = items.filter(i => !i.parentId).sort((a, b) => a.number - b.number);
  const getChildren = (parentId: string) => items.filter(i => i.parentId === parentId).sort((a, b) => a.number - b.number);

  const addItem = async (parentId: string | null = null) => {
    try {
      const res = await fetch("/api/admin/chat-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          labelAr: parentId ? "عنصر فرعي جديد" : "قسم جديد",
          labelEn: parentId ? "New Sub-item" : "New Category",
          icon: parentId ? "" : "📌",
          linkUrl: "",
          parentId,
          number: items.length + 1,
        }),
      });
      if (res.ok) fetchItems();
    } catch (e) { console.error(e); }
  };

  const updateItem = async (id: string, field: string, value: string | number | boolean) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const saveItem = async (item: MenuItem) => {
    setSaving(true);
    try {
      await fetch(`/api/admin/chat-menu/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("هل أنت متأكد؟")) return;
    try {
      await fetch(`/api/admin/chat-menu/${id}`, { method: "DELETE" });
      fetchItems();
    } catch (e) { console.error(e); }
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      await Promise.all(items.map(item =>
        fetch(`/api/admin/chat-menu/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        })
      ));
      alert("تم الحفظ بنجاح!");
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة قائمة الشات</h1>
          <p className="text-gray-500 text-sm mt-1">إضافة وتعديل الأقسام والروابط اللي بتظهر في أيقونة المساعدة</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => addItem()} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 font-medium shadow-sm">
            <Plus className="w-5 h-5" /> إضافة قسم رئيسي
          </button>
          <button onClick={saveAll} disabled={saving} className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 font-medium shadow-sm disabled:opacity-50">
            <Save className="w-5 h-5" /> {saving ? "جاري الحفظ..." : "حفظ الكل"}
          </button>
        </div>
      </div>

      {topItems.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">لا توجد أقسام بعد</h3>
          <p className="text-gray-400 mb-6">أضف أول قسم في قائمة الشات</p>
          <button onClick={() => addItem()} className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 font-medium">
            <Plus className="w-5 h-5" /> إضافة قسم
          </button>
        </div>
      )}

      <div className="space-y-4">
        {topItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Parent Item */}
            <div className="p-5 flex flex-wrap items-center gap-3">
              <GripVertical className="w-5 h-5 text-gray-300 cursor-grab shrink-0" />
              <input value={item.icon} onChange={e => updateItem(item.id, "icon", e.target.value)} onBlur={() => saveItem(items.find(i => i.id === item.id)!)} className="w-14 text-center text-2xl border rounded-lg py-1" placeholder="📌" />
              <input value={item.labelAr} onChange={e => updateItem(item.id, "labelAr", e.target.value)} onBlur={() => saveItem(items.find(i => i.id === item.id)!)} className="flex-1 min-w-[120px] border rounded-lg px-3 py-2 text-sm font-medium" placeholder="الاسم بالعربي" />
              <input value={item.labelEn} onChange={e => updateItem(item.id, "labelEn", e.target.value)} onBlur={() => saveItem(items.find(i => i.id === item.id)!)} className="flex-1 min-w-[120px] border rounded-lg px-3 py-2 text-sm" dir="ltr" placeholder="English label" />
              <input value={item.linkUrl || ""} onChange={e => updateItem(item.id, "linkUrl", e.target.value)} onBlur={() => saveItem(items.find(i => i.id === item.id)!)} className="flex-1 min-w-[140px] border rounded-lg px-3 py-2 text-sm text-gray-500" dir="ltr" placeholder="/about (اختياري)" />
              <input type="number" value={item.number} onChange={e => updateItem(item.id, "number", +e.target.value)} onBlur={() => saveItem(items.find(i => i.id === item.id)!)} className="w-16 border rounded-lg px-2 py-2 text-sm text-center" title="الترتيب" />
              <button onClick={() => { updateItem(item.id, "isHidden", !item.isHidden); setTimeout(() => saveItem({ ...item, isHidden: !item.isHidden }), 0); }} className={`p-2 rounded-lg ${item.isHidden ? "text-gray-400 bg-gray-50" : "text-green-600 bg-green-50"}`}>
                {item.isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button onClick={() => deleteItem(item.id)} className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Children */}
            {getChildren(item.id).length > 0 && (
              <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 space-y-2">
                {getChildren(item.id).map((child) => (
                  <div key={child.id} className="flex flex-wrap items-center gap-3 pr-8">
                    <span className="text-gray-300 text-sm">↳</span>
                    <input value={child.labelAr} onChange={e => updateItem(child.id, "labelAr", e.target.value)} onBlur={() => saveItem(items.find(i => i.id === child.id)!)} className="flex-1 min-w-[100px] border rounded-lg px-3 py-1.5 text-sm bg-white" placeholder="الاسم بالعربي" />
                    <input value={child.labelEn} onChange={e => updateItem(child.id, "labelEn", e.target.value)} onBlur={() => saveItem(items.find(i => i.id === child.id)!)} className="flex-1 min-w-[100px] border rounded-lg px-3 py-1.5 text-sm bg-white" dir="ltr" placeholder="English" />
                    <input value={child.linkUrl || ""} onChange={e => updateItem(child.id, "linkUrl", e.target.value)} onBlur={() => saveItem(items.find(i => i.id === child.id)!)} className="flex-1 min-w-[120px] border rounded-lg px-3 py-1.5 text-sm bg-white text-gray-500" dir="ltr" placeholder="/link" />
                    <input type="number" value={child.number} onChange={e => updateItem(child.id, "number", +e.target.value)} onBlur={() => saveItem(items.find(i => i.id === child.id)!)} className="w-14 border rounded-lg px-2 py-1.5 text-sm text-center bg-white" />
                    <button onClick={() => deleteItem(child.id)} className="p-1.5 text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            )}

            {/* Add sub-item button */}
            <div className="border-t border-gray-100 px-5 py-2">
              <button onClick={() => addItem(item.id)} className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> إضافة عنصر فرعي
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
