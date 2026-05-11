"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff, Copy, ExternalLink } from "lucide-react";

interface PopupButton {
  id: string;
  textAr?: string;
  textEn?: string;
  bgColor?: string;
  textColor?: string;
  actionType: string;
  actionValue?: string;
  sequencePopupId?: string;
}

interface PopupConditions {
  maxDisplays?: number;
  cooldownDays?: number;
  deviceType?: string;
  pages?: string[];
}

interface PopupItem {
  id: string;
  internalName: string;
  titleAr?: string;
  type: string;
  animation: string;
  trigger: string;
  triggerValue: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  buttons?: PopupButton[];
  conditions?: PopupConditions;
  createdAt: string;
}

const typeLabels: Record<string, string> = {
  MODAL: "نافذة وسطية",
  BANNER_TOP: "شريط علوي",
  BANNER_BOTTOM: "شريط سفلي",
  SLIDE_IN: "منزلق جانبي",
};

const triggerLabels: Record<string, string> = {
  ON_LOAD: "عند التحميل",
  TIME_DELAY: "بعد تأخير",
  ON_SCROLL: "عند التمرير",
  EXIT_INTENT: "نية الخروج",
  SEQUENCE_ONLY: "سيكوانس فقط",
};

const animationLabels: Record<string, string> = {
  FADE: "تلاشي",
  ZOOM: "تكبير",
  SLIDE_UP: "انزلاق للأعلى",
  BOUNCE: "ارتداد",
};

export default function PopupsPage() {
  const [popups, setPopups] = useState<PopupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPopups = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/popups");
      const data = await res.json();
      setPopups(data);
    } catch (error) {
      console.error("Failed to fetch popups:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPopups();
  }, [fetchPopups]);

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      await fetch(`/api/admin/popups/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      fetchPopups();
    } catch (error) {
      console.error("Failed to toggle popup:", error);
    }
  };

  const deletePopup = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا البوب آب؟")) return;
    try {
      await fetch(`/api/admin/popups/${id}`, { method: "DELETE" });
      fetchPopups();
    } catch (error) {
      console.error("Failed to delete popup:", error);
    }
  };

  const duplicatePopup = async (popup: PopupItem) => {
    try {
      await fetch("/api/admin/popups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...popup,
          id: undefined,
          internalName: `${popup.internalName} (نسخة)`,
          isActive: false,
          createdAt: undefined,
        }),
      });
      fetchPopups();
    } catch (error) {
      console.error("Failed to duplicate popup:", error);
    }
  };

  const filtered = popups.filter((p) =>
    p.internalName.toLowerCase().includes(search.toLowerCase()) ||
    (p.titleAr && p.titleAr.includes(search))
  );

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة النوافذ المنبثقة</h1>
          <p className="text-gray-500 text-sm mt-1">
            إنشاء وإدارة البوب آب بتحكم كامل في المحتوى والتصميم والشروط
          </p>
        </div>
        <Link
          href="/admin/popups/editor"
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          إنشاء بوب آب جديد
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <input
          type="text"
          placeholder="بحث بالاسم..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <div className="text-6xl mb-4">🪟</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">لا توجد نوافذ منبثقة بعد</h3>
          <p className="text-gray-400 mb-6">ابدأ بإنشاء أول بوب آب</p>
          <Link
            href="/admin/popups/editor"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            إنشاء بوب آب
          </Link>
        </div>
      )}

      {/* Popups Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((popup) => (
            <div
              key={popup.id}
              className={`bg-white rounded-xl border-2 shadow-sm overflow-hidden transition-all hover:shadow-md ${
                popup.isActive ? "border-green-200" : "border-gray-100"
              }`}
            >
              {/* Card Header */}
              <div className="p-5 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-800 truncate text-lg">{popup.internalName}</h3>
                    {popup.titleAr && (
                      <p className="text-sm text-gray-400 truncate mt-0.5">{popup.titleAr}</p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleActive(popup.id, popup.isActive)}
                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                      popup.isActive
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {popup.isActive ? "مفعّل" : "معطّل"}
                  </button>
                </div>
              </div>

              {/* Meta Tags */}
              <div className="px-5 pb-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                  {typeLabels[popup.type] || popup.type}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-medium">
                  {animationLabels[popup.animation] || popup.animation}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-medium">
                  {triggerLabels[popup.trigger] || popup.trigger}
                  {popup.trigger === "TIME_DELAY" && ` (${popup.triggerValue / 1000}ث)`}
                  {popup.trigger === "ON_SCROLL" && ` (${popup.triggerValue}%)`}
                </span>
                {popup.buttons && Array.isArray(popup.buttons) && (
                  <span className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 text-xs font-medium">
                    {(popup.buttons as PopupButton[]).length} أزرار
                  </span>
                )}
                {popup.conditions && (popup.conditions as PopupConditions).maxDisplays && (
                  <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 text-xs font-medium">
                    حد أقصى: {(popup.conditions as PopupConditions).maxDisplays}
                  </span>
                )}
              </div>

              {/* Date Range */}
              {(popup.startDate || popup.endDate) && (
                <div className="px-5 pb-3 text-xs text-gray-400">
                  {popup.startDate && `من: ${new Date(popup.startDate).toLocaleDateString("ar-EG")}`}
                  {popup.startDate && popup.endDate && " — "}
                  {popup.endDate && `إلى: ${new Date(popup.endDate).toLocaleDateString("ar-EG")}`}
                </div>
              )}

              {/* Actions */}
              <div className="border-t border-gray-100 px-5 py-3 flex items-center gap-2">
                <Link
                  href={`/admin/popups/editor?id=${popup.id}`}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  <Pencil className="w-4 h-4" />
                  تعديل
                </Link>
                <button
                  onClick={() => duplicatePopup(popup)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mr-auto"
                >
                  <Copy className="w-4 h-4" />
                  نسخ
                </button>
                <button
                  onClick={() => toggleActive(popup.id, popup.isActive)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
                  title={popup.isActive ? "تعطيل" : "تفعيل"}
                >
                  {popup.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => deletePopup(popup.id)}
                  className="p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
