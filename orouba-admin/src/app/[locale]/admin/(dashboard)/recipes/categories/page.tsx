"use client";

import { useState, useEffect } from "react";
import DataTable, { Column } from "@/components/admin/DataTable";
import { Trash2, Edit, Plus } from "lucide-react";

interface RecipeCategory {
  id: string;
  nameAr: string;
  nameEn: string;
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      nameAr: formData.get("nameAr"),
      nameEn: formData.get("nameEn"),
    };

    const url = editingCategory ? `/api/admin/recipes/categories/${editingCategory.id}` : "/api/admin/recipes/categories";
    const method = editingCategory ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
    { key: "nameAr", label: "الاسم (عربي)" },
    { key: "nameEn", label: "الاسم (إنجليزي)", render: (item) => <span dir="ltr">{item.nameEn}</span> },
  ];

  return (
    <div className="space-y-6">
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
