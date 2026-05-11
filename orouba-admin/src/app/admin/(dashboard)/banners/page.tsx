"use client";

import { useState, useEffect } from "react";
import DataTable, { Column } from "@/components/admin/DataTable";
import { Trash2, Edit, Plus, Image as ImageIcon, Video } from "lucide-react";
import Image from "next/image";

interface Banner {
  id: string;
  titleAr: string;
  titleEn: string;
  type: "image" | "video";
  image: string | null;
  imageEn: string | null;
  videoLink: string | null;
  videoLinkEn: string | null;
  smallImg: string | null;
  smallImgEn: string | null;
  smallVideo: string | null;
  smallVideoEn: string | null;
  isHidden: boolean;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedType, setSelectedType] = useState<"image" | "video">("image");

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/banners");
      if (res.ok) setBanners(await res.json());
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا البانر؟")) return;
    
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBanners(banners.filter(b => b.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    formData.set("isHidden", (formData.get("isHidden") === "on").toString());
    formData.set("type", selectedType);

    const url = editingBanner ? `/api/admin/banners/${editingBanner.id}` : "/api/admin/banners";
    const method = editingBanner ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingBanner(null);
        fetchBanners();
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

  const filteredBanners = banners.filter(b => 
    b.titleAr.toLowerCase().includes(search.toLowerCase()) || 
    b.titleEn.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Banner>[] = [
    { 
      key: "image", 
      label: "الوسائط", 
      render: (item) => {
        if (item.type === "image" && item.image) {
          return <Image src={item.image} alt={item.titleAr} width={60} height={30} className="rounded object-cover" />;
        }
        if (item.type === "video") {
          return <Video className="w-8 h-8 text-blue-400" />;
        }
        return <ImageIcon className="w-8 h-8 text-gray-300" />;
      }
    },
    { key: "titleAr", label: "العنوان (عربي)" },
    { 
      key: "type", 
      label: "النوع", 
      render: (item) => item.type === "image" 
        ? <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-bold">صورة</span>
        : <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold">فيديو</span>
    },
    {
      key: "isHidden",
      label: "الحالة",
      render: (item) => item.isHidden 
        ? <span className="text-red-500 font-semibold text-sm">مخفي</span> 
        : <span className="text-green-500 font-semibold text-sm">ظاهر</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة البانرات (Banners)</h1>
          <p className="text-gray-500 mt-1">عرض وتعديل صور وفيديوهات السلايدر الرئيسي للموقع</p>
        </div>
        <button
          onClick={() => {
            setEditingBanner(null);
            setSelectedType("image");
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-orouba-blue text-white px-4 py-2 rounded-xl font-bold hover:bg-orouba-blue/90 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          إضافة بانر جديد
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orouba-blue"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredBanners}
          onSearch={setSearch}
          searchPlaceholder="ابحث باسم البانر..."
          actions={(item) => (
            <>
              <button 
                onClick={() => {
                  setEditingBanner(item);
                  setSelectedType(item.type);
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-xl my-8" dir="rtl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">
                {editingBanner ? "تعديل بانر" : "إضافة بانر جديد"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto hide-scrollbar">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">العنوان (عربي) *</label>
                  <input type="text" name="titleAr" required defaultValue={editingBanner?.titleAr} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">العنوان (إنجليزي) *</label>
                  <input type="text" name="titleEn" required defaultValue={editingBanner?.titleEn} dir="ltr" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">نوع البانر</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="type" value="image" checked={selectedType === "image"} onChange={() => setSelectedType("image")} className="w-4 h-4 text-orouba-blue focus:ring-orouba-blue" />
                    صورة (Image)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="type" value="video" checked={selectedType === "video"} onChange={() => setSelectedType("video")} className="w-4 h-4 text-orouba-blue focus:ring-orouba-blue" />
                    فيديو (Video)
                  </label>
                </div>
              </div>

              {selectedType === "image" ? (
                <div className="space-y-4">
                  <h4 className="font-bold text-orouba-blue border-b pb-2">صور البانر الأساسية (Desktop)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">صورة البانر - عربي</label>
                      <input type="file" name="image" accept="image/*" className="w-full text-sm border border-gray-200 rounded-lg p-1" />
                      {editingBanner?.image && <div className="mt-2 text-xs text-green-600">صورة حالية مرفوعة</div>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">صورة البانر - إنجليزي</label>
                      <input type="file" name="imageEn" accept="image/*" className="w-full text-sm border border-gray-200 rounded-lg p-1" />
                      {editingBanner?.imageEn && <div className="mt-2 text-xs text-green-600">صورة حالية مرفوعة</div>}
                    </div>
                  </div>

                  <h4 className="font-bold text-orouba-blue border-b pb-2 mt-4">صور الموبايل (Mobile)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">صورة الموبايل - عربي</label>
                      <input type="file" name="smallImg" accept="image/*" className="w-full text-sm border border-gray-200 rounded-lg p-1" />
                      {editingBanner?.smallImg && <div className="mt-2 text-xs text-green-600">صورة حالية مرفوعة</div>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">صورة الموبايل - إنجليزي</label>
                      <input type="file" name="smallImgEn" accept="image/*" className="w-full text-sm border border-gray-200 rounded-lg p-1" />
                      {editingBanner?.smallImgEn && <div className="mt-2 text-xs text-green-600">صورة حالية مرفوعة</div>}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-bold text-orouba-blue border-b pb-2">روابط الفيديو (YouTube, Vimeo, MP4)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">رابط الفيديو الأساسي - عربي</label>
                      <input type="url" name="videoLink" defaultValue={editingBanner?.videoLink || ""} dir="ltr" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">رابط الفيديو الأساسي - إنجليزي</label>
                      <input type="url" name="videoLinkEn" defaultValue={editingBanner?.videoLinkEn || ""} dir="ltr" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">رابط فيديو الموبايل - عربي (اختياري)</label>
                      <input type="url" name="smallVideo" defaultValue={editingBanner?.smallVideo || ""} dir="ltr" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">رابط فيديو الموبايل - إنجليزي (اختياري)</label>
                      <input type="url" name="smallVideoEn" defaultValue={editingBanner?.smallVideoEn || ""} dir="ltr" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isHidden"
                  name="isHidden"
                  defaultChecked={editingBanner?.isHidden}
                  className="w-5 h-5 text-orouba-blue focus:ring-orouba-blue rounded border-gray-300"
                />
                <label htmlFor="isHidden" className="text-sm font-semibold text-gray-700 cursor-pointer">
                  إخفاء البانر من الموقع مؤقتاً
                </label>
              </div>

              <div className="mt-8 pt-4 flex justify-end gap-3 border-t border-gray-100">
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
                  className="px-6 py-2 bg-orouba-blue text-white rounded-xl font-medium hover:bg-orouba-blue/90 shadow-lg"
                >
                  {isSaving ? "جاري الحفظ..." : "حفظ البانر"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
