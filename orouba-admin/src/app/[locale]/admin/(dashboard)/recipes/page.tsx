"use client";

import AdminPageInfo from "@/components/admin/AdminPageInfo";
import { useState, useEffect } from "react";
import DataTable, { Column } from "@/components/admin/DataTable";
import { Trash2, Edit, Plus, Image as ImageIcon, PlusCircle, X, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useAdminTranslation } from "@/components/admin/AdminTranslationProvider";

interface Food {
  id: string;
  nameAr: string;
}

interface Product {
  id: string;
  nameAr: string;
  image: string | null;
}

interface RecipeProperty {
  icon: string | null;
  titleAr: string;
  titleEn: string;
  textAr: string;
  textEn: string;
}

interface RecipeStep {
  stepAr: string;
  stepEn: string;
}

interface RecipeImage {
  id: string;
  url: string;
}

interface Recipe {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  internalImage: string | null;
  videoLink: string | null;
  tagEn: string | null;
  tagAr: string | null;
  number: number;
  isHidden: boolean;
  images: RecipeImage[];
  foods: { food: Food }[];
  recommendedWith: { product: Product }[];
}

export default function RecipesPage() {
  const { t, dict } = useAdminTranslation();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [foodsList, setFoodsList] = useState<Food[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [selectedFoodIds, setSelectedFoodIds] = useState<string[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [recRes, foodsRes, prodRes] = await Promise.all([
        fetch("/api/admin/recipes"),
        fetch("/api/admin/foods"), // basic API for foods
        fetch("/api/admin/products")
      ]);
      
      if (recRes.ok) setRecipes(await recRes.json());
      if (foodsRes.ok) setFoodsList(await foodsRes.json());
      if (prodRes.ok) {
        const allProds = await prodRes.json();
        setProducts(allProds.map((p: any) => ({
          id: p.id,
          nameAr: p.nameAr,
          nameEn: p.nameEn,
          image: p.images?.[0]?.url || null
        })));
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(dict.common.confirmDelete)) return;
    
    try {
      const res = await fetch(`/api/admin/recipes/${id}`, { method: "DELETE" });
      if (res.ok) {
        setRecipes(recipes.filter(r => r.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete recipe", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const url = editingRecipe ? `/api/admin/recipes/${editingRecipe.id}` : "/api/admin/recipes";
    const method = editingRecipe ? "PUT" : "POST";

    formData.set("isHidden", (formData.get("isHidden") === "on").toString());
    
    // Add JSON stringified arrays
    formData.append("foods", JSON.stringify(selectedFoodIds));
    formData.append("recommendedWith", JSON.stringify(selectedProductIds));

    deletedImageIds.forEach(imgId => {
      formData.append("deletedImageIds", imgId);
    });

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingRecipe(null);
        fetchData();
      } else {
        const error = await res.json();
        alert(error.error || dict.common.error);
      }
    } catch (error) {
      console.error("Failed to save recipe", error);
      alert(dict.common.error);
    } finally {
      setIsSaving(false);
    }
  };

  const openModal = (recipe: Recipe | null) => {
    setEditingRecipe(recipe);
    if (recipe) {
      setSelectedFoodIds(recipe.foods.map(f => f.food.id));
      setSelectedProductIds(recipe.recommendedWith.map(rp => rp.product.id));
    } else {
      setSelectedFoodIds([]);
      setSelectedProductIds([]);
    }
    setDeletedImageIds([]);
    setIsModalOpen(true);
  };

  const toggleFood = (id: string) => {
    setSelectedFoodIds(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  };

  const toggleProduct = (id: string) => {
    setSelectedProductIds(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]);
  };

  const toggleDeleteImage = (id: string) => {
    setDeletedImageIds(prev => prev.includes(id) ? prev.filter(img => img !== id) : [...prev, id]);
  };

  const handleToggleVisibility = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/toggle-visibility', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'recipe', id, isHidden: !currentStatus })
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

  const filteredRecipes = recipes.filter(r => 
    r.nameAr.toLowerCase().includes(search.toLowerCase()) || 
    r.nameEn.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Recipe>[] = [
    { 
      key: "index", 
      label: "#", 
      render: (_, index) => <span className="text-gray-500 font-medium">{(index ?? 0) + 1}</span> 
    },
    { key: "number", label: t("الترتيب", "Order"), render: (item) => item.number },
    { 
      key: "images", 
      label: dict.common.image, 
      render: (item) => item.images && item.images.length > 0 ? (
        <Image src={item.images[0].url} alt={item.nameAr} width={50} height={50} className="rounded object-cover" />
      ) : <ImageIcon className="w-8 h-8 text-gray-300" />
    },
    { key: "nameAr", label: t("اسم الوصفة", "Recipe Name"), render: (item) => t(item.nameAr, item.nameEn) },
    { 
      key: "foods", 
      label: t("المكونات المربوطة", "Linked Foods"), 
      render: (item) => `${item.foods.length} ${t("مكون", "foods")}`
    },
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
        titleAr="إدارة الوصفات (Recipes)" 
        titleEn="Recipes Directory"
        descriptionAr="عرض وتعديل وصفات الطبخ وربطها بمنتجات العروبة." 
        descriptionEn="Manage recipes, preparation instructions, and recommended Orouba products."
        prereq1Ar="⚠️ تنبيه هام: يجب إضافة (المكونات Foods) و (المنتجات Products) أولاً لتتمكن من ربط الوصفة بهم." 
        prereq1En="⚠️ Required first: Ingredient items (Foods) and Products must be created first."
        prereq2Ar="بعد حفظ الوصفة، يمكنك استخدام الأزرار الجانبية لإدارة الخصائص (Props) وخطوات التحضير (Steps)." 
        prereq2En="Use side-action buttons to configure individual Steps and Properties."
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{dict.sidebar.recipes}</h1>
          <p className="text-gray-500 mt-1">{t("عرض وتعديل وصفات الطبخ وربطها بالمنتجات والمكونات", "View and edit recipes, link with products and ingredients")}</p>
        </div>
        <button
          onClick={() => openModal(null)}
          className="flex items-center gap-2 bg-orouba-blue text-white px-4 py-2 rounded-xl font-bold hover:bg-orouba-blue/90 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          {t("إضافة وصفة", "Add Recipe")}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orouba-blue"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredRecipes}
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
              <a href={`/admin/recipes/${item.id}/props`} className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
                {t("الخصائص", "Props")}
              </a>
              <a href={`/admin/recipes/${item.id}/steps`} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
                {t("الخطوات", "Steps")}
              </a>
              <button onClick={() => openModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title={dict.common.edit}>
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title={dict.common.delete}>
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        />
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-5xl overflow-hidden shadow-xl my-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900">
                {editingRecipe ? dict.common.edit : dict.common.add}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-8 max-h-[75vh] overflow-y-auto hide-scrollbar">
              
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-orouba-blue border-b pb-2">{t("المعلومات الأساسية", "Basic Info")}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{dict.common.nameAr} *</label>
                    <input type="text" name="nameAr" required defaultValue={editingRecipe?.nameAr} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{dict.common.nameEn} *</label>
                    <input type="text" name="nameEn" required defaultValue={editingRecipe?.nameEn} dir="ltr" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{dict.common.descriptionAr}</label>
                    <textarea name="descriptionAr" defaultValue={editingRecipe?.descriptionAr} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none resize-none" rows={3} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{dict.common.descriptionEn}</label>
                    <textarea name="descriptionEn" defaultValue={editingRecipe?.descriptionEn} dir="ltr" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none resize-none" rows={3} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t("الوسم / الـ Tag (عربي) [اختياري]", "Tag (Arabic) [Optional]")}</label>
                    <input type="text" name="tagAr" placeholder="مثال: وصفة مميزة، جديد، صحي" defaultValue={editingRecipe?.tagAr || ""} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t("الوسم / الـ Tag (إنجليزي) [اختياري]", "Tag (English) [Optional]")}</label>
                    <input type="text" name="tagEn" placeholder="e.g. Special Recipe, New, Healthy" defaultValue={editingRecipe?.tagEn || ""} dir="ltr" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none" />
                  </div>
                </div>
              </div>

              {/* Media */}
              <div className="space-y-4 pt-4">
                <h4 className="text-lg font-bold text-orouba-blue border-b pb-2">{t("الوسائط والصور", "Media & Images")}</h4>
                
                {editingRecipe && editingRecipe.images.length > 0 && (
                  <div className="flex flex-wrap gap-4 mb-4">
                    {editingRecipe.images.map(img => {
                      const isDeleted = deletedImageIds.includes(img.id);
                      return (
                        <div key={img.id} className={`relative rounded-xl border-2 p-1 ${isDeleted ? 'border-red-500 opacity-50' : 'border-gray-200'}`}>
                          <Image src={img.url} alt="recipe" width={80} height={80} className="rounded-lg object-cover" />
                          <button
                            type="button"
                            onClick={() => toggleDeleteImage(img.id)}
                            className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white ${isDeleted ? 'bg-gray-500' : 'bg-red-500'}`}
                          >
                            {isDeleted ? '↺' : <X className="w-3 h-3" />}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t("رفع صور الوصفة (تحديد متعدد)", "Upload recipe images (Multiple)")}</label>
                    <input type="file" name="images" accept="image/*" multiple className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-200 rounded-lg p-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t("صورة داخلية (Internal Image)", "Internal Image")}</label>
                    <input type="file" name="internalImage" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-200 rounded-lg p-1" />
                    {editingRecipe?.internalImage && <span className="text-xs text-gray-500 block mt-1">{t("صورة داخلية حالية موجودة", "Current internal image exists")}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t("رابط فيديو (يوتيوب اختياري)", "Video Link (Youtube Optional)")}</label>
                  <input type="url" name="videoLink" defaultValue={editingRecipe?.videoLink || ""} dir="ltr" placeholder="https://youtube.com/..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none" />
                </div>
              </div>

              {/* Order Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t("الترتيب", "Order")}</label>
                  <input type="number" name="number" defaultValue={editingRecipe?.number || 999} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none" />
                </div>
              </div>

              {/* Foods and Recommended Products */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-orouba-blue border-b pb-2">{dict.sidebar.foods}</h4>
                  <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2 border rounded-xl bg-gray-50">
                    {foodsList.map(food => (
                      <label key={food.id} className={`flex items-center gap-3 p-2 border rounded-xl cursor-pointer bg-white transition-colors ${selectedFoodIds.includes(food.id) ? 'border-orouba-blue ring-1 ring-orouba-blue' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="checkbox" checked={selectedFoodIds.includes(food.id)} onChange={() => toggleFood(food.id)} className="w-4 h-4 text-orouba-blue rounded border-gray-300" />
                        <span className="text-sm font-semibold text-gray-700 truncate">{t(food.nameAr, (food as any).nameEn || food.nameAr)}</span>
                      </label>
                    ))}
                    {foodsList.length === 0 && <p className="text-xs text-gray-500 col-span-2">{t("لا يوجد مكونات مضافة حالياً.", "No ingredients added currently.")}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-orouba-blue border-b pb-2">{t("المنتجات المقترحة للوصفة", "Recommended Products")}</h4>
                  <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2 border rounded-xl bg-gray-50">
                    {products.map(prod => (
                      <label key={prod.id} className={`flex items-center gap-3 p-2 border rounded-xl cursor-pointer bg-white transition-colors ${selectedProductIds.includes(prod.id) ? 'border-orouba-blue ring-1 ring-orouba-blue' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="checkbox" checked={selectedProductIds.includes(prod.id)} onChange={() => toggleProduct(prod.id)} className="w-4 h-4 text-orouba-blue rounded border-gray-300" />
                        {prod.image && <Image src={prod.image} alt={prod.nameAr} width={24} height={24} className="rounded object-cover" />}
                        <span className="text-sm font-semibold text-gray-700 truncate">{t(prod.nameAr, (prod as any).nameEn || prod.nameAr)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <input type="checkbox" id="isHidden" name="isHidden" defaultChecked={editingRecipe?.isHidden} className="w-5 h-5 text-orouba-blue focus:ring-orouba-blue rounded border-gray-300" />
                <label htmlFor="isHidden" className="text-sm font-semibold text-gray-700 cursor-pointer">{t("إخفاء هذه الوصفة من الموقع مؤقتاً", "Hide this recipe temporarily")}</label>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white p-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-gray-100 rounded-xl text-gray-700 font-medium hover:bg-gray-200" disabled={isSaving}>{dict.common.cancel}</button>
                <button type="submit" disabled={isSaving} className="px-8 py-2 bg-orouba-blue text-white rounded-xl font-medium hover:bg-orouba-blue/90 shadow-lg disabled:opacity-50">
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
