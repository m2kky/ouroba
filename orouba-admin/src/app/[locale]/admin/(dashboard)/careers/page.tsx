"use client";

import { useState, useEffect } from "react";
import DataTable, { Column } from "@/components/admin/DataTable";
import { Trash2, Eye, Download } from "lucide-react";
import { useAdminTranslation } from "@/components/admin/AdminTranslationProvider";

interface Career {
  id: string;
  name: string;
  phone: string;
  email: string;
  resumeUrl: string | null;
  createdAt: string;
}

export default function CareersPage() {
  const { t, dict, locale } = useAdminTranslation();
  const [careers, setCareers] = useState<Career[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/careers");
      if (res.ok) {
        const data = await res.json();
        setCareers(data);
      }
    } catch (error) {
      console.error("Failed to fetch careers", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(dict.common.confirmDelete)) return;
    
    try {
      const res = await fetch(`/api/admin/careers?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setCareers(careers.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete career", error);
    }
  };

  const filteredCareers = careers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const columns: Column<Career>[] = [
    { key: "name", label: t("الاسم", "Name") },
    { key: "email", label: t("البريد الإلكتروني", "Email") },
    { key: "phone", label: t("رقم الهاتف", "Phone"), render: (item) => <span dir="ltr">{item.phone}</span> },
    { 
      key: "resumeUrl", 
      label: t("السيرة الذاتية", "Resume"), 
      render: (item) => item.resumeUrl ? (
        <a 
          href={item.resumeUrl} 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-orouba-blue hover:underline font-semibold"
        >
          {t("تحميل", "Download")} <Download className="w-4 h-4" />
        </a>
      ) : <span className="text-gray-400">{t("غير متوفر", "N/A")}</span>
    },
    { 
      key: "createdAt", 
      label: t("تاريخ التقديم", "Date"), 
      render: (item) => new Date(item.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US') 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{dict.sidebar.careers}</h1>
          <p className="text-gray-500 mt-1">{t("عرض وإدارة السير الذاتية وطلبات التوظيف", "View and manage resumes and job applications")}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orouba-blue"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredCareers}
          onSearch={setSearch}
          searchPlaceholder={dict.common.search}
          actions={(item) => (
            <>
              <button 
                onClick={() => setSelectedCareer(item)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title={t("التفاصيل", "Details")}
              >
                <Eye className="w-4 h-4" />
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

      {/* View Modal */}
      {selectedCareer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900">{t("تفاصيل المتقدم", "Applicant Details")}</h3>
              <button 
                onClick={() => setSelectedCareer(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t("الاسم", "Name")}</p>
                  <p className="font-semibold text-gray-800">{selectedCareer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t("تاريخ التقديم", "Date")}</p>
                  <p className="font-semibold text-gray-800">{new Date(selectedCareer.createdAt).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t("البريد الإلكتروني", "Email")}</p>
                  <p className="font-semibold text-gray-800" dir="ltr">{selectedCareer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t("رقم الهاتف", "Phone")}</p>
                  <p className="font-semibold text-gray-800" dir="ltr">{selectedCareer.phone}</p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100 flex justify-center">
                 {selectedCareer.resumeUrl ? (
                    <a 
                      href={selectedCareer.resumeUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-2 bg-orouba-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-orouba-blue/90 transition-colors shadow-md hover:shadow-lg"
                    >
                      <Download className="w-5 h-5" />
                      {t("تنزيل السيرة الذاتية (CV)", "Download Resume (CV)")}
                    </a>
                  ) : (
                    <div className="text-center p-4 bg-gray-50 rounded-xl w-full text-gray-500">
                      {t("لا يوجد سيرة ذاتية مرفقة", "No resume attached")}
                    </div>
                  )}
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setSelectedCareer(null)}
                className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                {dict.common.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
