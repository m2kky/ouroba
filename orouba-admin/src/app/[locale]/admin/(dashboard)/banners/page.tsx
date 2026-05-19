"use client";
import AdminPageInfo from "@/components/admin/AdminPageInfo";


import { useState, useEffect } from "react";
import DataTable, { Column } from "@/components/admin/DataTable";
import { Trash2, Edit, Plus, Image as ImageIcon, Video, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useAdminTranslation } from "@/components/admin/AdminTranslationProvider";

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
  const { t, dict } = useAdminTranslation();
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
    if (!confirm(dict.common.confirmDelete)) return;
    
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBanners(banners.filter(b => b.id !== id));
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
        body: JSON.stringify({ model: 'banner', id, isHidden: !currentStatus })
      });
      if (res.ok) {
        fetchBanners();
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
        alert(error.error || dict.common.error);
      }
    } catch (error) {
      console.error("Failed to save", error);
      alert(dict.common.error);
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
      label: dict.common.image, 
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
    { key: "titleAr", label: t("العنوان", "Title"), render: (item) => t(item.titleAr, item.titleEn) },
    { 
      key: "type", 
      label: t("النوع", "Type"), 
      render: (item) => item.type === "image" 
        ? <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-bold">{t("صورة", "Image")}</span>
        : <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold">{t("فيديو", "Video")}</span>
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
        titleAr="إدارة البانرات (Main Banners)" 
        titleEn="Main Banners"
        descriptionAr="إضافة وإدارة صور وفيديوهات السلايدر الرئيسي في الصفحة الرئيسية للموقع." 
        descriptionEn="Add and manage main slider images and videos on the homepage."
        prereq1Ar="يمكنك رفع صور أو وضع روابط فيديوهات لتعمل كبانر رئيسي." 
        prereq1En="Upload slider graphics or embed promo videos."
        prereq2Ar="خطوة اختيارية: يمكنك التعديل عليها في أي وقت ولا تعتمد على جداول أخرى." 
        prereq2En="Optional step: Works independently, update anytime."
      />

      

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{dict.sidebar.banners}</h1>
          <p className="text-gray-500 mt-1">{t("عرض وتعديل صور وفيديوهات السلايدر الرئيسي للموقع", "View and edit main slider images and videos")}</p>
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
          {t("إضافة بانر", "Add Banner")}
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
                  setEditingBanner(item);
                  setSelectedType(item.type);
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
          <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-xl my-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">
                {editingBanner ? dict.common.edit : dict.common.add}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto hide-scrollbar">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{dict.common.nameAr} *</label>
                  <input type="text" name="titleAr" required defaultValue={editingBanner?.titleAr} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{dict.common.nameEn} *</label>
                  <input type="text" name="titleEn" required defaultValue={editingBanner?.titleEn} dir="ltr" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t("نوع البانر", "Banner Type")}</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="type" value="image" checked={selectedType === "image"} onChange={() => setSelectedType("image")} className="w-4 h-4 text-orouba-blue focus:ring-orouba-blue" />
                    {t("صورة (Image)", "Image")}
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="type" value="video" checked={selectedType === "video"} onChange={() => setSelectedType("video")} className="w-4 h-4 text-orouba-blue focus:ring-orouba-blue" />
                    {t("فيديو (Video)", "Video")}
                  </label>
                </div>
              </div>

              {selectedType === "image" ? (
                <div className="space-y-4">
                  <h4 className="font-bold text-orouba-blue border-b pb-2">{t("صور البانر الأساسية (Desktop)", "Main Banner Images (Desktop)")}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">{t("صورة البانر - عربي", "Banner Image - Arabic")}</label>
                      <input type="file" name="image" accept="image/*" className="w-full text-sm border border-gray-200 rounded-lg p-1" />
                      {editingBanner?.image && <div className="mt-2 text-xs text-green-600">{t("صورة حالية مرفوعة", "Current image uploaded")}</div>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">{t("صورة البانر - إنجليزي", "Banner Image - English")}</label>
                      <input type="file" name="imageEn" accept="image/*" className="w-full text-sm border border-gray-200 rounded-lg p-1" />
                      {editingBanner?.imageEn && <div className="mt-2 text-xs text-green-600">{t("صورة حالية مرفوعة", "Current image uploaded")}</div>}
                    </div>
                  </div>

                  <h4 className="font-bold text-orouba-blue border-b pb-2 mt-4">{t("صور الموبايل (Mobile)", "Mobile Images")}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">{t("صورة الموبايل - عربي", "Mobile Image - Arabic")}</label>
                      <input type="file" name="smallImg" accept="image/*" className="w-full text-sm border border-gray-200 rounded-lg p-1" />
                      {editingBanner?.smallImg && <div className="mt-2 text-xs text-green-600">{t("صورة حالية مرفوعة", "Current image uploaded")}</div>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">{t("صورة الموبايل - إنجليزي", "Mobile Image - English")}</label>
                      <input type="file" name="smallImgEn" accept="image/*" className="w-full text-sm border border-gray-200 rounded-lg p-1" />
                      {editingBanner?.smallImgEn && <div className="mt-2 text-xs text-green-600">{t("صورة حالية مرفوعة", "Current image uploaded")}</div>}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-bold text-orouba-blue border-b pb-2">{t("روابط الفيديو (YouTube, Vimeo, MP4)", "Video Links (YouTube, Vimeo, MP4)")}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">{t("رفع فيديو أساسي - عربي", "Upload Main Video - Arabic")}</label>
                      <input type="file" name="videoFile" accept="video/*" className="w-full text-sm border border-gray-200 rounded-lg p-1" />
                      {editingBanner?.videoLink && <div className="mt-2 text-xs text-green-600">{t("يوجد فيديو حالي (مرفوع أو رابط)", "Current video exists (uploaded or link)")}</div>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">{t("رفع فيديو أساسي - إنجليزي", "Upload Main Video - English")}</label>
                      <input type="file" name="videoFileEn" accept="video/*" className="w-full text-sm border border-gray-200 rounded-lg p-1" />
                      {editingBanner?.videoLinkEn && <div className="mt-2 text-xs text-green-600">{t("يوجد فيديو حالي (مرفوع أو رابط)", "Current video exists (uploaded or link)")}</div>}
                    </div>
                  </div>
                  
                  <div className="text-center text-sm font-bold text-gray-500 my-2">{t("أو أدخل رابطاً مباشراً", "OR Enter direct link")}</div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">{t("رابط الفيديو الأساسي - عربي", "Main Video Link - Arabic")}</label>
                      <input type="url" name="videoLink" defaultValue={editingBanner?.videoLink || ""} dir="ltr" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">{t("رابط الفيديو الأساسي - إنجليزي", "Main Video Link - English")}</label>
                      <input type="url" name="videoLinkEn" defaultValue={editingBanner?.videoLinkEn || ""} dir="ltr" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">{t("رفع فيديو موبايل - عربي (اختياري)", "Upload Mobile Video - Arabic (Optional)")}</label>
                      <input type="file" name="smallVideoFile" accept="video/*" className="w-full text-sm border border-gray-200 rounded-lg p-1" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">{t("رفع فيديو موبايل - إنجليزي (اختياري)", "Upload Mobile Video - English (Optional)")}</label>
                      <input type="file" name="smallVideoFileEn" accept="video/*" className="w-full text-sm border border-gray-200 rounded-lg p-1" />
                    </div>
                  </div>

                  <div className="text-center text-sm font-bold text-gray-500 my-2">{t("أو أدخل رابطاً مباشراً", "OR Enter direct link")}</div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">{t("رابط فيديو الموبايل - عربي (اختياري)", "Mobile Video Link - Arabic (Optional)")}</label>
                      <input type="url" name="smallVideo" defaultValue={editingBanner?.smallVideo || ""} dir="ltr" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">{t("رابط فيديو الموبايل - إنجليزي (اختياري)", "Mobile Video Link - English (Optional)")}</label>
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
                  {t("إخفاء البانر من الموقع مؤقتاً", "Hide banner temporarily")}
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
                  className="px-6 py-2 bg-orouba-blue text-white rounded-xl font-medium hover:bg-orouba-blue/90 shadow-lg"
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
