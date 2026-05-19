"use client";
import AdminPageInfo from "@/components/admin/AdminPageInfo";


import { useState, useEffect } from "react";
import DataTable, { Column } from "@/components/admin/DataTable";
import { Trash2, Edit, Plus, Image as ImageIcon, X, Eye, EyeOff } from "lucide-react";
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
  number: number;
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
  const [types, setTypes] = useState<ProductType[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, typesRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/product-types")
      ]);
      
      if (prodRes.ok && typesRes.ok) {
        setProducts(await prodRes.json());
        setTypes(await typesRes.json());
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

  const handleToggleVisibility = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/toggle-visibility', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'product', id, isHidden: !currentStatus })
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
    const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : "/api/admin/products";
    const method = editingProduct ? "PUT" : "POST";

    formData.set("isHidden", (formData.get("isHidden") === "on").toString());
    
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

  const toggleDeleteImage = (id: string) => {
    setDeletedImageIds(prev => 
      prev.includes(id) ? prev.filter(img => img !== id) : [...prev, id]
    );
  };

  const openModal = (product: Product | null) => {
    setEditingProduct(product);
    setDeletedImageIds([]);
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(p => 
    p.nameAr.toLowerCase().includes(search.toLowerCase()) || 
    p.nameEn.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Product>[] = [
    { 
      key: "index", 
      label: "#", 
      render: (_, index) => <span className="text-gray-500 font-medium">{(index ?? 0) + 1}</span> 
    },
    { key: "number", label: t("الترتيب", "Order") },
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
        titleAr="إدارة المنتجات (Products)" 
        titleEn="Products Catalog"
        descriptionAr="التحكم الكامل في جميع منتجات الشركة المعروضة على الموقع." 
        descriptionEn="Full CRUD management over Orouba food product listings."
        prereq1Ar="⚠️ تنبيه هام: يجب أن تكون قد أضفت (الأقسام، العلامات التجارية، والمميزات) أولاً قبل إضافة المنتجات." 
        prereq1En="⚠️ Required first: Ensure Categories, Brands, and Features exist before listing products."
        prereq2Ar="ستقوم هنا باختيار التصنيف الذي ينتمي له المنتج والمميزات التي تمت إضافتها سابقاً." 
        prereq2En="You will bind items to their parent category, brand, and toggle features."
      />

      

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
              <a 
                href={`/admin/products/${item.id}/categories`}
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                title={dict.sidebar.categories}
              >
                {dict.sidebar.categories}
              </a>
              <a 
                href={`/admin/products/${item.id}/recipes`}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                title={dict.sidebar.recipes}
              >
                {dict.sidebar.recipes}
              </a>
              <button 
                onClick={() => handleToggleVisibility(item.id, item.isHidden)}
                className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold ${item.isHidden ? 'text-green-600 hover:bg-green-50' : 'text-orange-600 hover:bg-orange-50'}`}
                title={item.isHidden ? t("إظهار", "Show") : t("إخفاء", "Hide")}
              >
                {item.isHidden ? t("إظهار", "Show") : t("إخفاء", "Hide")}
              </button>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t("الترتيب", "Order")} *</label>
                  <input
                    type="number"
                    name="number"
                    required
                    defaultValue={editingProduct?.number ?? 999}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none"
                  />
                </div>
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
                  disabled={isSaving}
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
