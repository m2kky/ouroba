"use client";
import AdminPageInfo from "@/components/admin/AdminPageInfo";


import { useState, useEffect } from "react";
import DataTable, { Column } from "@/components/admin/DataTable";
import { Trash2, Edit, Plus, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useAdminTranslation } from "@/components/admin/AdminTranslationProvider";

interface Food {
  id: string;
  nameAr: string;
  nameEn: string;
  image: string | null;
  brandId: string | null;
  isHidden: boolean;
}

export default function FoodsPage() {
  const { t, dict } = useAdminTranslation();
  const [foods, setFoods] = useState<Food[]>([]);
  const [brands, setBrands] = useState<{id: string, nameAr: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    setIsLoading(true);
    try {
      const [foodsRes, brandsRes] = await Promise.all([
        fetch("/api/admin/foods"),
        fetch("/api/admin/brands")
      ]);
      if (foodsRes.ok) setFoods(await foodsRes.json());
      if (brandsRes.ok) {
        const brandsData = await brandsRes.json();
        setBrands(brandsData.map((b: any) => ({ id: b.id, nameAr: b.nameAr, nameEn: b.nameEn })));
      }
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(dict.common.confirmDelete)) return;
    
    try {
      const res = await fetch(`/api/admin/foods/${id}`, { method: "DELETE" });
      if (res.ok) {
        setFoods(foods.filter(f => f.id !== id));
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
        body: JSON.stringify({ model: 'food', id, isHidden: !currentStatus })
      });
      if (res.ok) {
        fetchFoods();
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

    const url = editingFood ? `/api/admin/foods/${editingFood.id}` : "/api/admin/foods";
    const method = editingFood ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingFood(null);
        fetchFoods();
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

  const filteredFoods = foods.filter(f => 
    (f.nameAr && f.nameAr.toLowerCase().includes(search.toLowerCase())) || 
    (f.nameEn && f.nameEn.toLowerCase().includes(search.toLowerCase()))
  );

  const columns: Column<Food>[] = [
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
      <AdminPageInfo 
        titleAr="المكونات الأساسية (Foods/Ingredients)" 
        titleEn="Base Ingredients (Foods)"
        descriptionAr="إدارة قائمة المكونات التي تستخدم في تحضير الوصفات." 
        descriptionEn="Manage core ingredient lists used to formulate delicious cooking recipes."
        prereq1Ar="الخطوة السابقة للوصفات: يجب إضافة جميع المكونات (مثل: طماطم، دجاج) هنا أولاً." 
        prereq1En="⚠️ Required for recipes: Create ingredient items (e.g. Tomatoes, Spices) first."
        prereq2Ar="عند إضافة وصفة، ستقوم بربط المكونات التي تمت إضافتها في هذا الجدول بالوصفة." 
        prereq2En="Allows mapping ingredient checkboxes inside recipe editor."
      />

      

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{dict.sidebar.foods}</h1>
          <p className="text-gray-500 mt-1">{t("إدارة المكونات التي يتم استخدامها في الوصفات", "Manage recipe ingredients")}</p>
        </div>
        <button
          onClick={() => {
            setEditingFood(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-orouba-blue text-white px-4 py-2 rounded-xl font-bold hover:bg-orouba-blue/90 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          {t("إضافة مكون", "Add Food")}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orouba-blue"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredFoods}
          onSearch={setSearch}
          searchPlaceholder={dict.common.search}
          actions={(item) => (
            <>
              <button 
                onClick={() => {
                  setEditingFood(item);
                  setIsModalOpen(true);
                }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title={dict.common.edit}
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(item.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title={dict.common.delete}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        />
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">
                {editingFood ? dict.common.edit : dict.common.add}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{dict.common.nameAr} *</label>
                  <input
                    type="text"
                    name="nameAr"
                    required
                    defaultValue={editingFood?.nameAr || ""}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{dict.common.nameEn} *</label>
                  <input
                    type="text"
                    name="nameEn"
                    required
                    defaultValue={editingFood?.nameEn || ""}
                    dir="ltr"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{dict.common.image}</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-200 rounded-lg p-1"
                />
                {editingFood?.image && (
                  <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                    <Image src={editingFood.image} alt="current" width={30} height={30} className="rounded object-cover" />
                    {t("صورة حالية", "Current image")}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t("البراند التابع له (اختياري)", "Brand (Optional)")}</label>
                <select
                  name="brandId"
                  defaultValue={editingFood?.brandId || ""}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none"
                >
                  <option value="">{t("-- بدون براند محدد --", "-- No Brand --")}</option>
                  {brands.map((brand: any) => (
                    <option key={brand.id} value={brand.id}>{t(brand.nameAr, brand.nameEn)}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isHidden"
                  name="isHidden"
                  defaultChecked={editingFood?.isHidden}
                  className="w-5 h-5 text-orouba-blue focus:ring-orouba-blue rounded border-gray-300"
                />
                <label htmlFor="isHidden" className="text-sm font-semibold text-gray-700 cursor-pointer">
                  {t("إخفاء المكون", "Hide food")}
                </label>
              </div>

              <div className="mt-8 pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-gray-100 rounded-xl text-gray-700 font-medium hover:bg-gray-200"
                  disabled={isSaving}
                >
                  {dict.common.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-orouba-blue text-white rounded-xl font-medium hover:bg-orouba-blue/90"
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
