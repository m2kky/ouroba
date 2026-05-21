"use client";
import AdminPageInfo from "@/components/admin/AdminPageInfo";


import { useState, useEffect, useRef } from "react";
import DataTable, { Column } from "@/components/admin/DataTable";
import { Trash2, Edit, Plus, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useAdminTranslation } from "@/components/admin/AdminTranslationProvider";

interface Brand {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  brandTextAr: string | null;
  brandTextEn: string | null;
  image: string | null;
  imageMain: string | null;
  colorHover: string;
  number: number;
  isHidden: boolean;
  videoUrl: string | null;
  videoUrlEn: string | null;
}

export default function BrandsPage() {
  const { t, dict } = useAdminTranslation();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/brands");
      if (res.ok) {
        const data = await res.json();
        setBrands(data);
      }
    } catch (error) {
      console.error("Failed to fetch brands", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(dict.common.confirmDelete)) return;
    
    try {
      const res = await fetch(`/api/admin/brands/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBrands(brands.filter(b => b.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete brand", error);
    }
  };

  const handleToggleVisibility = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/toggle-visibility', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'brand', id, isHidden: !currentStatus })
      });
      if (res.ok) {
        fetchBrands();
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
    const url = editingBrand ? `/api/admin/brands/${editingBrand.id}` : "/api/admin/brands";
    const method = editingBrand ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingBrand(null);
        fetchBrands(); // Refresh list
      } else {
        const error = await res.json();
        alert(error.error || dict.common.error);
      }
    } catch (error) {
      console.error("Failed to save brand", error);
      alert(dict.common.error);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredBrands = brands.filter(b => 
    b.nameAr.toLowerCase().includes(search.toLowerCase()) || 
    b.nameEn.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Brand>[] = [
    { 
      key: "index", 
      label: "#", 
      render: (_, index) => <span className="text-gray-500 font-medium">{(index ?? 0) + 1}</span> 
    },
    { key: "number", label: t("الترتيب", "Order") },
    { 
      key: "image", 
      label: dict.common.image, 
      render: (item) => item.image ? (
        <Image src={item.image} alt={item.nameAr} width={40} height={40} className="rounded object-cover" />
      ) : <ImageIcon className="w-8 h-8 text-gray-300" />
    },
    { key: "nameAr", label: dict.common.nameAr },
    { key: "nameEn", label: dict.common.nameEn, render: (item) => <span dir="ltr">{item.nameEn}</span> },
    { 
      key: "colorBrand", 
      label: t("اللون", "Color"), 
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded border border-gray-200" style={{ backgroundColor: item.colorBrand }}></div>
          <span dir="ltr" className="text-xs text-gray-500">{item.colorBrand}</span>
        </div>
      ) 
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
        titleAr="إدارة العلامات التجارية (Brands)" 
        titleEn="Brands Management"
        descriptionAr="إضافة وإدارة العلامات التجارية التي تملكها الشركة (مثل: العروبة، الخ)." 
        descriptionEn="Add and manage brand names belonging to Orouba (e.g. Orouba Foods, etc)."
        prereq1Ar="تعتبر هذه من أولى خطوات بناء المتجر، حيث سترتبط بها الأنواع والمنتجات لاحقاً." 
        prereq1En="This is one of the initial catalog steps; all products and types will link to these brands."
        prereq2Ar="خطوة مطلوبة أولاً: يرجى إضافة العلامات التجارية قبل إضافة أي أنواع (Types) أو منتجات." 
        prereq2En="⚠️ Required first: Please configure Brands before adding Types or Products."
      />

      

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{dict.sidebar.brands}</h1>
          <p className="text-gray-500 mt-1">{t("عرض وتعديل البراندات الرئيسية للمنتجات", "View and edit main product brands")}</p>
        </div>
        <button
          onClick={() => {
            setEditingBrand(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-orouba-blue text-white px-4 py-2 rounded-xl font-bold hover:bg-orouba-blue/90 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          {t("إضافة براند", "Add Brand")}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orouba-blue"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredBrands}
          onSearch={setSearch}
          searchPlaceholder={dict.common.search}
          actions={(item) => (
            <>
              <a 
                href={`/admin/brands/${item.id}/categories`}
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                title={t("الأقسام", "Categories")}
              >
                {t("الأقسام", "Categories")}
              </a>
              <button 
                onClick={() => handleToggleVisibility(item.id, item.isHidden)}
                className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold ${item.isHidden ? 'text-green-600 hover:bg-green-50' : 'text-orange-600 hover:bg-orange-50'}`}
                title={item.isHidden ? t("إظهار", "Show") : t("إخفاء", "Hide")}
              >
                {item.isHidden ? t("إظهار", "Show") : t("إخفاء", "Hide")}
              </button>
              <button 
                onClick={() => {
                  setEditingBrand(item);
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl my-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900">
                {editingBrand ? dict.common.edit : dict.common.add}
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
                    defaultValue={editingBrand?.nameAr}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 focus:border-orouba-blue outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{dict.common.nameEn} *</label>
                  <input
                    type="text"
                    name="nameEn"
                    required
                    defaultValue={editingBrand?.nameEn}
                    dir="ltr"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 focus:border-orouba-blue outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t("الترتيب", "Order")} *</label>
                  <input
                    type="number"
                    name="number"
                    required
                    defaultValue={editingBrand?.number ?? 999}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      name="isHidden"
                      defaultChecked={editingBrand?.isHidden}
                      className="w-5 h-5 text-orouba-blue border-gray-300 rounded focus:ring-orouba-blue"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      {t("إخفاء هذا البراند من الموقع", "Hide this brand")}
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{dict.common.descriptionAr}</label>
                  <textarea
                    name="descriptionAr"
                    defaultValue={editingBrand?.descriptionAr}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 focus:border-orouba-blue outline-none resize-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{dict.common.descriptionEn}</label>
                  <textarea
                    name="descriptionEn"
                    defaultValue={editingBrand?.descriptionEn}
                    dir="ltr"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 focus:border-orouba-blue outline-none resize-none"
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t("نص تفصيلي (عربي) - اختياري", "Detailed Text (Arabic) - Optional")}</label>
                  <textarea
                    name="brandTextAr"
                    defaultValue={editingBrand?.brandTextAr || ""}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 focus:border-orouba-blue outline-none resize-none"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t("نص تفصيلي (إنجليزي) - اختياري", "Detailed Text (English) - Optional")}</label>
                  <textarea
                    name="brandTextEn"
                    defaultValue={editingBrand?.brandTextEn || ""}
                    dir="ltr"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 focus:border-orouba-blue outline-none resize-none"
                    rows={4}
                  />
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h4 className="font-bold text-orouba-blue border-b pb-2">{t("فيديو البراند (اختياري)", "Brand Video (Optional)")}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t("رفع فيديو - عربي", "Upload Video - Arabic")}</label>
                    <input type="file" name="videoFile" accept="video/*" className="w-full text-sm border border-gray-200 rounded-lg p-1" />
                    {editingBrand?.videoUrl && <div className="mt-2 text-xs text-green-600">{t("يوجد فيديو حالي", "Current video exists")}</div>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t("رفع فيديو - إنجليزي", "Upload Video - English")}</label>
                    <input type="file" name="videoFileEn" accept="video/*" className="w-full text-sm border border-gray-200 rounded-lg p-1" />
                    {editingBrand?.videoUrlEn && <div className="mt-2 text-xs text-green-600">{t("يوجد فيديو حالي", "Current video exists")}</div>}
                  </div>
                </div>
                
                <div className="text-center text-sm font-bold text-gray-500 my-2">{t("أو أدخل رابطاً مباشراً (R2 أو YouTube)", "OR Enter direct link (R2 or YouTube)")}</div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t("رابط الفيديو - عربي", "Video Link - Arabic")}</label>
                    <input type="url" name="videoUrl" defaultValue={editingBrand?.videoUrl || ""} dir="ltr" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t("رابط الفيديو - إنجليزي", "Video Link - English")}</label>
                    <input type="url" name="videoUrlEn" defaultValue={editingBrand?.videoUrlEn || ""} dir="ltr" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t("لون البراند الأساسي", "Primary Brand Color")}</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="colorBrand"
                      defaultValue={editingBrand?.colorBrand || "#ffffff"}
                      className="w-12 h-10 p-1 border border-gray-200 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      defaultValue={editingBrand?.colorBrand || "#ffffff"}
                      dir="ltr"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none"
                      onChange={(e) => {
                        const colorInput = e.target.previousSibling as HTMLInputElement;
                        if (colorInput) colorInput.value = e.target.value;
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t("لون الـ Hover", "Hover Color")}</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="colorHover"
                      defaultValue={editingBrand?.colorHover || "#eeeeee"}
                      className="w-12 h-10 p-1 border border-gray-200 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      defaultValue={editingBrand?.colorHover || "#eeeeee"}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {t("لوجو البراند (Image)", "Brand Logo (Image)")}
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-200 rounded-lg p-1"
                  />
                  {editingBrand?.image && (
                    <div className="mt-2 text-xs text-gray-500">{t("صورة حالية موجودة", "Current image exists")}</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {t("الصورة الرئيسية (Main Image)", "Main Image")}
                  </label>
                  <input
                    type="file"
                    name="imageMain"
                    accept="image/*"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-200 rounded-lg p-1"
                  />
                  {editingBrand?.imageMain && (
                    <div className="mt-2 text-xs text-gray-500">{t("صورة رئيسية موجودة", "Current main image exists")}</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {t("فيديو البراند بالعربية (Video Ar)", "Brand Video (Arabic)")}
                  </label>
                  <input
                    type="file"
                    name="videoFile"
                    accept="video/*"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-200 rounded-lg p-1"
                  />
                  {editingBrand?.videoUrl && (
                    <div className="mt-2 text-xs text-gray-500">{t("يوجد فيديو حالي", "Current video exists")}</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {t("فيديو البراند بالإنجليزية (Video En)", "Brand Video (English)")}
                  </label>
                  <input
                    type="file"
                    name="videoFileEn"
                    accept="video/*"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-200 rounded-lg p-1"
                  />
                  {editingBrand?.videoUrlEn && (
                    <div className="mt-2 text-xs text-gray-500">{t("يوجد فيديو حالي", "Current video exists")}</div>
                  )}
                </div>
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
