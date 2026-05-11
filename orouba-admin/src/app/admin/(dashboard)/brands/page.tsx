"use client";

import { useState, useEffect, useRef } from "react";
import DataTable, { Column } from "@/components/admin/DataTable";
import { Trash2, Edit, Plus, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface Brand {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string | null;
  imageMain: string | null;
  colorBrand: string;
  colorHover: string;
}

export default function BrandsPage() {
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
    if (!confirm("هل أنت متأكد من حذف هذا البراند؟ جميع الأقسام والمنتجات المرتبطة به قد تتأثر!")) return;
    
    try {
      const res = await fetch(`/api/admin/brands/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBrands(brands.filter(b => b.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete brand", error);
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
        alert(error.error || "حدث خطأ أثناء الحفظ");
      }
    } catch (error) {
      console.error("Failed to save brand", error);
      alert("حدث خطأ أثناء الاتصال بالخادم");
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
      key: "image", 
      label: "الصورة", 
      render: (item) => item.image ? (
        <Image src={item.image} alt={item.nameAr} width={40} height={40} className="rounded object-cover" />
      ) : <ImageIcon className="w-8 h-8 text-gray-300" />
    },
    { key: "nameAr", label: "الاسم (عربي)" },
    { key: "nameEn", label: "الاسم (إنجليزي)", render: (item) => <span dir="ltr">{item.nameEn}</span> },
    { 
      key: "colorBrand", 
      label: "اللون", 
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded border border-gray-200" style={{ backgroundColor: item.colorBrand }}></div>
          <span dir="ltr" className="text-xs text-gray-500">{item.colorBrand}</span>
        </div>
      ) 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة البراندات</h1>
          <p className="text-gray-500 mt-1">عرض وتعديل البراندات الرئيسية للمنتجات</p>
        </div>
        <button
          onClick={() => {
            setEditingBrand(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-orouba-blue text-white px-4 py-2 rounded-xl font-bold hover:bg-orouba-blue/90 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          إضافة براند جديد
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
          searchPlaceholder="ابحث باسم البراند..."
          actions={(item) => (
            <>
              <button 
                onClick={() => {
                  setEditingBrand(item);
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl my-8" dir="rtl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900">
                {editingBrand ? "تعديل براند" : "إضافة براند جديد"}
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1">الاسم (عربي) *</label>
                  <input
                    type="text"
                    name="nameAr"
                    required
                    defaultValue={editingBrand?.nameAr}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 focus:border-orouba-blue outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">الاسم (إنجليزي) *</label>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1">وصف قصير (عربي)</label>
                  <textarea
                    name="descriptionAr"
                    defaultValue={editingBrand?.descriptionAr}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 focus:border-orouba-blue outline-none resize-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">وصف قصير (إنجليزي)</label>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1">لون البراند الأساسي</label>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1">لون الـ Hover</label>
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
                    لوجو البراند (Image)
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-200 rounded-lg p-1"
                  />
                  {editingBrand?.image && (
                    <div className="mt-2 text-xs text-gray-500">صورة حالية موجودة</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    الصورة الرئيسية (Main Image)
                  </label>
                  <input
                    type="file"
                    name="imageMain"
                    accept="image/*"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-200 rounded-lg p-1"
                  />
                  {editingBrand?.imageMain && (
                    <div className="mt-2 text-xs text-gray-500">صورة رئيسية موجودة</div>
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
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-orouba-blue text-white rounded-xl font-medium hover:bg-orouba-blue/90 transition-colors disabled:opacity-50"
                >
                  {isSaving ? "جاري الحفظ..." : "حفظ البراند"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
