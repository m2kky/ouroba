"use client";

import { useState, useEffect } from "react";
import DataTable, { Column } from "@/components/admin/DataTable";
import { Trash2, Edit, Plus, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useAdminTranslation } from "@/components/admin/AdminTranslationProvider";

interface ProductImage {
  id: string;
  url: string;
}

interface CategoryProduct {
  category: {
    id: string;
    nameAr: string;
    nameEn: string;
  };
}

interface ProductType {
  id: string;
  nameAr: string;
  nameEn: string;
}

interface BasicRecipe {
  id: string;
  nameAr: string;
  nameEn: string;
}

interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  color: string;
  isHidden: boolean;
  typeId: string | null;
  type: ProductType | null;
  images: ProductImage[];
  categories: CategoryProduct[];
  recommendedRecipes: { recipe: BasicRecipe }[];
}

interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  brand: { nameAr: string };
}

export default function ProductsPage() {
  const { t, dict } = useAdminTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<ProductType[]>([]);
  const [recipes, setRecipes] = useState<BasicRecipe[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState<string[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes, typesRes, recipesRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
        fetch("/api/admin/product-types"),
        fetch("/api/admin/recipes")
      ]);
      
      if (prodRes.ok && catRes.ok && typesRes.ok && recipesRes.ok) {
        setProducts(await prodRes.json());
        setCategories(await catRes.json());
        setTypes(await typesRes.json());
        
        const allRecipes = await recipesRes.json();
        setRecipes(allRecipes.map((r: any) => ({ id: r.id, nameAr: r.nameAr, nameEn: r.nameEn })));
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
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : "/api/admin/products";
    const method = editingProduct ? "PUT" : "POST";

    formData.set("isHidden", (formData.get("isHidden") === "on").toString());
    
    // Add multiple category selections
    selectedCategoryIds.forEach(catId => {
      formData.append("categoryIds", catId);
    });

    selectedRecipeIds.forEach(recId => {
      formData.append("recipeIds", recId);
    });

    // Add deleted images
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
        setEditingProduct(null);
        setSelectedCategoryIds([]);
        setSelectedRecipeIds([]);
        setDeletedImageIds([]);
        fetchData();
      } else {
        const error = await res.json();
        alert(error.error || dict.common.error);
      }
    } catch (error) {
      console.error("Failed to save product", error);
      alert(dict.common.error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleRecipe = (id: string) => {
    setSelectedRecipeIds(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const toggleDeleteImage = (id: string) => {
    setDeletedImageIds(prev => 
      prev.includes(id) ? prev.filter(img => img !== id) : [...prev, id]
    );
  };

  const openModal = (product: Product | null) => {
    setEditingProduct(product);
    setSelectedCategoryIds(product ? product.categories.map(c => c.category.id) : []);
    setSelectedRecipeIds(product ? (product.recommendedRecipes || []).map(r => r.recipe.id) : []);
    setDeletedImageIds([]);
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(p => 
    p.nameAr.toLowerCase().includes(search.toLowerCase()) || 
    p.nameEn.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Product>[] = [
    { 
      key: "images", 
      label: dict.common.image, 
      render: (item) => item.images && item.images.length > 0 ? (
        <Image src={item.images[0].url} alt={item.nameAr} width={40} height={40} className="rounded object-cover" />
      ) : <ImageIcon className="w-8 h-8 text-gray-300" />
    },
    { key: "nameAr", label: dict.common.nameAr },
    { key: "nameEn", label: dict.common.nameEn, render: (item) => <span dir="ltr">{item.nameEn}</span> },
    { 
      key: "typeId", 
      label: t("النوع", "Type"), 
      render: (item) => item.type ? <span className="text-gray-600">{t(item.type.nameAr, item.type.nameEn)}</span> : "—"
    },
    {
      key: "categories",
      label: dict.sidebar.categories,
      render: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.categories.slice(0, 2).map((c, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-gray-100 rounded text-xs">{c.category.nameAr}</span>
          ))}
          {item.categories.length > 2 && (
            <span className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded text-xs">+{item.categories.length - 2}</span>
          )}
        </div>
      )
    },
    {
      key: "isHidden",
      label: dict.common.status,
      render: (item) => item.isHidden 
        ? <span className="text-red-500 font-semibold text-sm">{dict.common.hidden}</span> 
        : <span className="text-green-500 font-semibold text-sm">{dict.common.visible}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{dict.sidebar.products}</h1>
          <p className="text-gray-500 mt-1">{t("إدارة وعرض المنتجات", "Manage and view products")}</p>
        </div>
        <button
          onClick={() => openModal(null)}
          className="flex items-center gap-2 bg-orouba-blue text-white px-4 py-2 rounded-xl font-bold hover:bg-orouba-blue/90 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          {t("إضافة منتج", "Add Product")}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orouba-blue"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredProducts}
          onSearch={setSearch}
          searchPlaceholder={dict.common.search}
          actions={(item) => (
            <>
              <button 
                onClick={() => openModal(item)}
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-xl my-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900">
                {editingProduct ? dict.common.edit : dict.common.add}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto hide-scrollbar">
              
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-800 border-b pb-2">{t("المعلومات الأساسية", "Basic Info")}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{dict.common.nameAr} *</label>
                    <input
                      type="text"
                      name="nameAr"
                      required
                      defaultValue={editingProduct?.nameAr}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{dict.common.nameEn} *</label>
                    <input
                      type="text"
                      name="nameEn"
                      required
                      defaultValue={editingProduct?.nameEn}
                      dir="ltr"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{dict.common.descriptionAr}</label>
                    <textarea
                      name="descriptionAr"
                      defaultValue={editingProduct?.descriptionAr}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none resize-none"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{dict.common.descriptionEn}</label>
                    <textarea
                      name="descriptionEn"
                      defaultValue={editingProduct?.descriptionEn}
                      dir="ltr"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none resize-none"
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t("نوع المنتج", "Product Type")}</label>
                    <select
                      name="typeId"
                      defaultValue={editingProduct?.typeId || ""}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none bg-white"
                    >
                      <option value="">{t("-- بدون نوع محدد --", "-- No Type --")}</option>
                      {types.map(typ => (
                        <option key={typ.id} value={typ.id}>{t(typ.nameAr, typ.nameEn)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t("لون خلفية المنتج", "Product Background Color")}</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        name="color"
                        defaultValue={editingProduct?.color || "#ffffff"}
                        className="w-12 h-10 p-1 border border-gray-200 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        defaultValue={editingProduct?.color || "#ffffff"}
                        dir="ltr"
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none"
                        onChange={(e) => {
                          const colorInput = e.target.previousSibling as HTMLInputElement;
                          if (colorInput) colorInput.value = e.target.value;
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories Selection */}
              <div className="space-y-4 pt-4">
                <h4 className="text-lg font-bold text-gray-800 border-b pb-2">{dict.sidebar.categories}</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {categories.map(cat => (
                    <label key={cat.id} className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors ${selectedCategoryIds.includes(cat.id) ? 'border-orouba-blue bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input
                        type="checkbox"
                        checked={selectedCategoryIds.includes(cat.id)}
                        onChange={() => toggleCategory(cat.id)}
                        className="w-4 h-4 text-orouba-blue rounded border-gray-300 focus:ring-orouba-blue"
                      />
                      <div className="text-xs font-semibold text-gray-700">
                        <span className="block text-orouba-blue mb-0.5">{t(cat.brand.nameAr, (cat.brand as any)?.nameEn || cat.brand.nameAr)}</span>
                        {t(cat.nameAr, cat.nameEn)}
                      </div>
                    </label>
                  ))}
                </div>
                {selectedCategoryIds.length === 0 && (
                  <p className="text-xs text-red-500">{t("يجب اختيار قسم واحد على الأقل ليظهر المنتج في الموقع", "Select at least one category")}</p>
                )}
              </div>

              {/* Images */}
              <div className="space-y-4 pt-4">
                <h4 className="text-lg font-bold text-gray-800 border-b pb-2">{t("صور المنتج", "Product Images")}</h4>
                
                {editingProduct && editingProduct.images.length > 0 && (
                  <div className="flex flex-wrap gap-4 mb-4">
                    {editingProduct.images.map(img => {
                      const isDeleted = deletedImageIds.includes(img.id);
                      return (
                        <div key={img.id} className={`relative rounded-xl border-2 p-1 transition-all ${isDeleted ? 'border-red-500 opacity-50' : 'border-gray-200'}`}>
                          <Image src={img.url} alt="product" width={80} height={80} className="rounded-lg object-cover" />
                          <button
                            type="button"
                            onClick={() => toggleDeleteImage(img.id)}
                            className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white ${isDeleted ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600'}`}
                          >
                            {isDeleted ? '↺' : <X className="w-3 h-3" />}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {t("إضافة صور جديدة (يمكنك اختيار أكثر من صورة)", "Add images (You can select multiple)")}
                  </label>
                  <input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orouba-blue/10 file:text-orouba-blue hover:file:bg-orouba-blue/20 border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center cursor-pointer"
                  />
                </div>
              </div>

              {/* Recommended Recipes Selection */}
              <div className="space-y-4 pt-4">
                <h4 className="text-lg font-bold text-gray-800 border-b pb-2">{t("الوصفات المقترحة مع هذا المنتج (اختياري)", "Recommended Recipes (Optional)")}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto p-2 border border-gray-100 rounded-xl bg-gray-50/50 hide-scrollbar">
                  {recipes.map(recipe => (
                    <label key={recipe.id} className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors bg-white ${selectedRecipeIds.includes(recipe.id) ? 'border-orouba-blue ring-1 ring-orouba-blue' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="checkbox"
                        checked={selectedRecipeIds.includes(recipe.id)}
                        onChange={() => toggleRecipe(recipe.id)}
                        className="w-4 h-4 text-orouba-blue rounded border-gray-300 focus:ring-orouba-blue"
                      />
                      <div className="text-sm font-semibold text-gray-700 truncate">
                        {t(recipe.nameAr, recipe.nameEn)}
                      </div>
                    </label>
                  ))}
                  {recipes.length === 0 && (
                    <div className="col-span-full text-sm text-gray-500 py-2">{t("لا توجد وصفات مضافة حالياً.", "No recipes found.")}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="isHidden"
                  name="isHidden"
                  defaultChecked={editingProduct?.isHidden}
                  className="w-5 h-5 text-orouba-blue focus:ring-orouba-blue rounded border-gray-300"
                />
                <label htmlFor="isHidden" className="text-sm font-semibold text-gray-700 cursor-pointer">
                  {t("إخفاء هذا المنتج من الموقع مؤقتاً", "Hide product temporarily")}
                </label>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white p-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-gray-100 border border-transparent rounded-xl text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                  disabled={isSaving}
                >
                  {dict.common.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSaving || selectedCategoryIds.length === 0}
                  className="px-8 py-2 bg-orouba-blue text-white rounded-xl font-medium hover:bg-orouba-blue/90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
