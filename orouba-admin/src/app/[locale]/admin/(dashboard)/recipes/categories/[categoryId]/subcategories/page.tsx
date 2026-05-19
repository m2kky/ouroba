"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import DataTable, { Column } from "@/components/admin/DataTable";
import { Trash2, Edit, Plus, ArrowRight, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useAdminTranslation } from "@/components/admin/AdminTranslationProvider";

interface Food {
  id: string;
  nameAr: string;
  nameEn: string;
  image: string | null;
  number: number;
  isHidden: boolean;
}

export default function RecipeSubCategoriesPage() {
  const { t, dict } = useAdminTranslation();
  const params = useParams();
  const router = useRouter();
  const categoryId = params?.categoryId as string;
  
  const [subcategories, setSubcategories] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<Food | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/recipes/categories/${categoryId}/subcategories`);
      if (res.ok) {
        setSubcategories(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlink = async (foodId: string) => {
    if (!confirm(dict.common.confirmDelete)) return;
    
    try {
      const res = await fetch(`/api/admin/recipes/categories/${categoryId}/subcategories?foodId=${foodId}`, { 
        method: "DELETE" 
      });
      if (res.ok) {
        setSubcategories(subcategories.filter(s => s.id !== foodId));
      }
    } catch (error) {
      console.error("Failed to unlink subcategory", error);
    }
  };

  const handleToggleVisibility = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/toggle-visibility', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'food', id, isHidden: !currentStatus })
      });
      if (res.ok) {
        fetchData();
      } else {
        alert(dict.common.error);
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

    let url = "";
    let method = "";

    if (editingSubCategory) {
      // Edit existing food
      url = `/api/admin/foods/${editingSubCategory.id}`;
      method = "PUT";
    } else {
      // Create new food and link it
      url = `/api/admin/recipes/categories/${categoryId}/subcategories`;
      method = "POST";
    }

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingSubCategory(null);
        fetchData(); // Refresh list
      } else {
        const error = await res.json();
        alert(error.error || dict.common.error);
      }
    } catch (error) {
      console.error("Failed to save subcategory", error);
      alert(dict.common.error);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredSubCategories = subcategories.filter(s => 
    (s.nameAr || "").toLowerCase().includes(search.toLowerCase()) || 
    (s.nameEn || "").toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Food>[] = [
    { 
      key: "index", 
      label: "#", 
      render: (_, index) => <span className="text-gray-500 font-medium">{(index ?? 0) + 1}</span> 
    },
    { key: "number", label: t("الترتيب", "Order"), render: (item) => item.number },
    { 
      key: "image", 
      label: dict.common.image, 
      render: (item) => item.image ? (
        <Image src={item.image} alt={item.nameAr || ""} width={40} height={40} className="rounded object-cover" />
      ) : <ImageIcon className="w-8 h-8 text-gray-300" />
    },
    { key: "nameAr", label: dict.common.nameAr, render: (item) => item.nameAr || "—" },
    { key: "nameEn", label: dict.common.nameEn, render: (item) => <span dir="ltr">{item.nameEn || "—"}</span> },
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
          title={item.isHidden ? t("تغيير إلى ظاهر", "Change to Visible") : t("تغيير إلى مخفي", "Change to Hidden")}
        >
          {item.isHidden ? (
            <><EyeOff className="w-3.5 h-3.5" /> {dict.common.hidden}</>
          ) : (
            <><Eye className="w-3.5 h-3.5" /> {dict.common.visible}</>
          )}
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors font-medium mb-4"
      >
        <ArrowRight className="w-4 h-4" />
        {t("العودة لأقسام الوصفات", "Back to Recipe Categories")}
      </button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("الأقسام الفرعية (للأطعمة)", "Sub-Categories (Foods)")}</h1>
          <p className="text-gray-500 mt-1">{t("إدارة الأقسام الفرعية الخاصة بهذا القسم الأساسي", "Manage sub-categories for this main category")}</p>
        </div>
        <button
          onClick={() => {
            setEditingSubCategory(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-orouba-blue text-white px-4 py-2 rounded-xl font-bold hover:bg-orouba-blue/90 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          {t("إضافة قسم فرعي", "Add Sub-Category")}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orouba-blue"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredSubCategories}
          onSearch={setSearch}
          searchPlaceholder={dict.common.search}
          actions={(item) => (
            <>
              <button 
                onClick={() => handleToggleVisibility(item.id, item.isHidden)}
                className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold ${item.isHidden ? 'text-green-600 hover:bg-green-50' : 'text-orange-600 hover:bg-orange-50'}`}
                title={item.isHidden ? t("إظهار", "Show") : t("إخفاء", "Hide")}
              >
                {item.isHidden ? t("إظهار", "Show") : t("إخفاء", "Hide")}
              </button>
              <button 
                onClick={() => {
                  setEditingSubCategory(item);
                  setIsModalOpen(true);
                }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title={dict.common.edit}
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleUnlink(item.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title={t("حذف الارتباط", "Unlink")}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        />
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl my-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900">
                {editingSubCategory ? dict.common.edit : t("إضافة قسم فرعي جديد", "Add new sub-category")}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{dict.common.nameAr} *</label>
                  <input
                    type="text"
                    name="nameAr"
                    required
                    defaultValue={editingSubCategory?.nameAr}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 focus:border-orouba-blue outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{dict.common.nameEn} *</label>
                  <input
                    type="text"
                    name="nameEn"
                    required
                    defaultValue={editingSubCategory?.nameEn}
                    dir="ltr"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 focus:border-orouba-blue outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t("الترتيب (الأقل يظهر أولاً)", "Order (Lowest appears first)")}</label>
                  <input
                    type="number"
                    name="number"
                    defaultValue={editingSubCategory?.number || 999}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 focus:border-orouba-blue outline-none"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      name="isHidden"
                      defaultChecked={editingSubCategory?.isHidden}
                      className="w-5 h-5 text-orouba-blue border-gray-300 rounded focus:ring-orouba-blue"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      {t("إخفاء هذا القسم من الموقع", "Hide this category")}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {dict.common.image}
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-200 rounded-lg p-1"
                />
                {editingSubCategory?.image && (
                  <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                    <Image src={editingSubCategory.image} alt="current" width={30} height={30} className="rounded" />
                    {t("صورة حالية", "Current Image")}
                  </div>
                )}
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  disabled={isSaving}
                >
                  {dict.common.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-orouba-blue text-white rounded-xl font-medium hover:bg-orouba-blue/90 transition-colors disabled:opacity-50"
                >
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
