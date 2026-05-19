"use client";
import AdminPageInfo from "@/components/admin/AdminPageInfo";


import { useState, useEffect } from "react";
import DataTable, { Column } from "@/components/admin/DataTable";
import { Trash2, Edit, Plus, Eye, EyeOff } from "lucide-react";

interface RecipeCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  image: string | null;
  number: number;
  isHidden: boolean;
}

export default function RecipeCategoriesPage() {
  const [categories, setCategories] = useState<RecipeCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<RecipeCategory | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/recipes/categories");
      if (res.ok) setCategories(await res.json());
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟ قد تتأثر الوصفات المرتبطة به!")) return;
    
    try {
      const res = await fetch(`/api/admin/recipes/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCategories(categories.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const handleToggleVisibility = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/toggle-visibility', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'recipeCategory', id, isHidden: !currentStatus })
      });
      if (res.ok) {
        fetchCategories();
      } else {
        alert("حدث خطأ");
      }
    } catch (error) {
      console.error("Failed to toggle visibility", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    formData.set("isHidden", (formData.get("isHidden") === "on").toString());

    const url = editingCategory ? `/api/admin/recipes/categories/${editingCategory.id}` : "/api/admin/recipes/categories";
    const method = editingCategory ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingCategory(null);
        fetchCategories();
      } else {
        const error = await res.json();
        alert(error.error || "حدث خطأ أثناء الحفظ");
      }
    } catch (error) {
      console.error("Failed to save", error);
      alert("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.nameAr.toLowerCase().includes(search.toLowerCase()) || 
    c.nameEn.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<RecipeCategory>[] = [
    { 
      key: "index", 
      label: "#", 
      render: (_, index) => <span className="text-gray-500 font-medium">{(index ?? 0) + 1}</span> 
    },
    { key: "number", label: "الترتيب" },
    { 
      key: "image", 
      label: "الصورة", 
      render: (item) => item.image ? (
        <img src={item.image} alt={item.nameAr} width={40} height={40} className="rounded object-cover" />
      ) : <span className="text-gray-300">بدون</span>
    },
    { key: "nameAr", label: "الاسم (عربي)" },
    { key: "nameEn", label: "الاسم (إنجليزي)", render: (item) => <span dir="ltr">{item.nameEn}</span> },
    {
      key: "isHidden",
      label: "الحالة",
      render: (item) => (
        <button
          onClick={() => handleToggleVisibility(item.id, item.isHidden)}
          className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95 flex items-center gap-1 ${
            item.isHidden 
              ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100/70" 
              : "bg-green-50 text-green-600 border border-green-200 hover:bg-green-100/70"
          }`}
          title={(item.isHidden ? "تغيير إلى ظاهر" : "تغيير إلى مخفي")}
        >
          {item.isHidden ? (
            <><EyeOff className="w-3.5 h-3.5" /> مخفي</>
          ) : (
            <><Eye className="w-3.5 h-3.5" /> مرئي</>
          )}
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <AdminPageInfo description="تصنيف الوصفات إلى أقسام (مثل: حلويات، أطباق رئيسية) لسهولة فلترتها." />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">أقسام الوصفات</h1>
          <p className="text-gray-500 mt-1">إدارة الأقسام الخاصة بالوصفات (مثل: أطباق رئيسية، حلويات)</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-orouba-blue text-white px-4 py-2 rounded-xl font-bold hover:bg-orouba-blue/90 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          إضافة قسم جديد
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orouba-blue"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredCategories}
          onSearch={setSearch}
          searchPlaceholder="ابحث باسم القسم..."
          actions={(item) => (
            <>
              <a 
                href={`/admin/recipes/categories/${item.id}/subcategories`}
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                title="الأقسام الفرعية"
              >
                الأقسام الفرعية
              </a>
              <button 
                onClick={() => handleToggleVisibility(item.id, item.isHidden)}
                className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold ${item.isHidden ? 'text-green-600 hover:bg-green-50' : 'text-orange-600 hover:bg-orange-50'}`}
                title={item.isHidden ? "إظهار" : "إخفاء"}
              >
                {item.isHidden ? "إظهار" : "إخفاء"}
              </button>
              <button 
                onClick={() => {
                  setEditingCategory(item);
                  setIsModalOpen(true);
                }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="تعديل"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(item.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="حذف"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        />
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl" dir="rtl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">
                {editingCategory ? "تعديل قسم" : "إضافة قسم جديد"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">الاسم (عربي) *</label>
                <input
                  type="text"
                  name="nameAr"
                  required
                  defaultValue={editingCategory?.nameAr}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">الاسم (إنجليزي) *</label>
                <input
                  type="text"
                  name="nameEn"
                  required
                  defaultValue={editingCategory?.nameEn}
                  dir="ltr"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">الترتيب *</label>
                <input
                  type="number"
                  name="number"
                  required
                  defaultValue={editingCategory?.number ?? 999}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">الصورة</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-200 rounded-lg p-1"
                />
                {editingCategory?.image && (
                  <div className="mt-2">
                    <img src={editingCategory.image} alt="current" width={50} className="rounded" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isHidden"
                  name="isHidden"
                  defaultChecked={editingCategory?.isHidden}
                  className="w-5 h-5 text-orouba-blue focus:ring-orouba-blue rounded border-gray-300"
                />
                <label htmlFor="isHidden" className="text-sm font-semibold text-gray-700 cursor-pointer">
                  إخفاء هذا القسم من الموقع
                </label>
              </div>

              <div className="mt-8 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-gray-100 rounded-xl text-gray-700 font-medium hover:bg-gray-200"
                  disabled={isSaving}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-orouba-blue text-white rounded-xl font-medium hover:bg-orouba-blue/90"
                >
                  {isSaving ? "جاري الحفظ..." : "حفظ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
