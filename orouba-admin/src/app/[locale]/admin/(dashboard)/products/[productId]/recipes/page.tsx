"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import DataTable, { Column } from "@/components/admin/DataTable";
import { Trash2, Plus, ArrowRight, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useAdminTranslation } from "@/components/admin/AdminTranslationProvider";

interface Recipe {
  id: string;
  nameAr: string;
  nameEn: string;
  image: string | null;
}

export default function ProductRecipesPage() {
  const { t, dict } = useAdminTranslation();
  const params = useParams();
  const router = useRouter();
  const productId = params?.productId as string;
  
  const [assignedRecipes, setAssignedRecipes] = useState<Recipe[]>([]);
  const [availableRecipes, setAvailableRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchData();
    }
  }, [productId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [assignedRes, allRes] = await Promise.all([
        fetch(`/api/admin/products/${productId}/recipes`),
        fetch("/api/admin/recipes")
      ]);
      
      if (assignedRes.ok && allRes.ok) {
        setAssignedRecipes(await assignedRes.json());
        setAvailableRecipes(await allRes.json());
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnassign = async (recipeId: string) => {
    if (!confirm(dict.common.confirmDelete)) return;
    
    try {
      const res = await fetch(`/api/admin/products/${productId}/recipes?recipeId=${recipeId}`, { 
        method: "DELETE" 
      });
      if (res.ok) {
        setAssignedRecipes(assignedRecipes.filter(r => r.id !== recipeId));
      }
    } catch (error) {
      console.error("Failed to unassign recipe", error);
    }
  };

  const handleAssign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const recipeId = formData.get("recipeId") as string;

    if (!recipeId) {
      alert("الرجاء اختيار وصفة");
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/products/${productId}/recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchData(); // Refresh list
      } else {
        const error = await res.json();
        alert(error.error || dict.common.error);
      }
    } catch (error) {
      console.error("Failed to assign recipe", error);
      alert(dict.common.error);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredRecipes = assignedRecipes.filter(r => 
    r.nameAr.toLowerCase().includes(search.toLowerCase()) || 
    r.nameEn.toLowerCase().includes(search.toLowerCase())
  );

  // Filter out already assigned recipes for the dropdown
  const unassignedRecipes = availableRecipes.filter(
    avail => !assignedRecipes.some(assigned => assigned.id === avail.id)
  );

  const columns: Column<Recipe>[] = [
    { 
      key: "index", 
      label: "#", 
      render: (_, index) => <span className="text-gray-500 font-medium">{(index ?? 0) + 1}</span> 
    },
    { 
      key: "image", 
      label: dict.common.image, 
      render: (item) => item.image ? (
        <Image src={item.image} alt={item.nameAr} width={40} height={40} className="rounded object-cover" />
      ) : <ImageIcon className="w-8 h-8 text-gray-300" />
    },
    { key: "nameAr", label: dict.common.nameAr },
    { key: "nameEn", label: dict.common.nameEn, render: (item) => <span dir="ltr">{item.nameEn}</span> }
  ];

  return (
    <div className="space-y-6">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors font-medium mb-4"
      >
        <ArrowRight className="w-4 h-4" />
        {t("العودة للمنتجات", "Back to Products")}
      </button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("الوصفات المقترحة للمنتج", "Recommended Recipes")}</h1>
          <p className="text-gray-500 mt-1">{t("إدارة الوصفات المقترحة التي تستخدم هذا المنتج", "Manage recommended recipes that use this product")}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-orouba-blue text-white px-4 py-2 rounded-xl font-bold hover:bg-orouba-blue/90 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          {t("ربط وصفة جديدة", "Link Recipe")}
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
            <button 
              onClick={() => handleUnassign(item.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title={t("إزالة الارتباط", "Unlink")}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        />
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl my-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900">
                {t("إضافة وصفة للمنتج", "Add Recipe to Product")}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAssign} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t("اختر الوصفة", "Select Recipe")} *</label>
                <select
                  name="recipeId"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none bg-white"
                >
                  <option value="">{t("-- اختر الوصفة --", "-- Select Recipe --")}</option>
                  {unassignedRecipes.map(recipe => (
                    <option key={recipe.id} value={recipe.id}>
                      {t(recipe.nameAr, recipe.nameEn)}
                    </option>
                  ))}
                </select>
                {unassignedRecipes.length === 0 && (
                  <p className="text-xs text-orange-500 mt-2">{t("تم ربط المنتج بجميع الوصفات المتاحة", "Product is linked to all available recipes")}</p>
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
                  disabled={isSaving || unassignedRecipes.length === 0}
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
