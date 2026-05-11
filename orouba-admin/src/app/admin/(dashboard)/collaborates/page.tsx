"use client";

import { useState, useEffect } from "react";
import DataTable, { Column } from "@/components/admin/DataTable";
import { Trash2, Eye } from "lucide-react";

interface Collaborate {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string | null;
  createdAt: string;
}

export default function CollaboratesPage() {
  const [collaborates, setCollaborates] = useState<Collaborate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCollab, setSelectedCollab] = useState<Collaborate | null>(null);

  useEffect(() => {
    fetchCollaborates();
  }, []);

  const fetchCollaborates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/collaborates");
      if (res.ok) {
        const data = await res.json();
        setCollaborates(data);
      }
    } catch (error) {
      console.error("Failed to fetch collaborates", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الطلب؟")) return;
    
    try {
      const res = await fetch(`/api/admin/collaborates?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setCollaborates(collaborates.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete collaborate request", error);
    }
  };

  const filteredCollaborates = collaborates.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const columns: Column<Collaborate>[] = [
    { key: "name", label: "الاسم" },
    { key: "email", label: "البريد الإلكتروني" },
    { key: "phone", label: "رقم الهاتف", render: (item) => <span dir="ltr">{item.phone}</span> },
    { 
      key: "createdAt", 
      label: "تاريخ الطلب", 
      render: (item) => new Date(item.createdAt).toLocaleDateString('ar-EG') 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">طلبات التعاون والتصدير</h1>
          <p className="text-gray-500 mt-1">عرض وإدارة طلبات التصدير الواردة</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orouba-blue"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredCollaborates}
          onSearch={setSearch}
          searchPlaceholder="ابحث بالاسم أو الإيميل أو التليفون..."
          actions={(item) => (
            <>
              <button 
                onClick={() => setSelectedCollab(item)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="التفاصيل"
              >
                <Eye className="w-4 h-4" />
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

      {/* View Modal */}
      {selectedCollab && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl" dir="rtl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900">تفاصيل الطلب</h3>
              <button 
                onClick={() => setSelectedCollab(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">الاسم</p>
                  <p className="font-semibold text-gray-800">{selectedCollab.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">تاريخ الطلب</p>
                  <p className="font-semibold text-gray-800">{new Date(selectedCollab.createdAt).toLocaleString('ar-EG')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">البريد الإلكتروني</p>
                  <p className="font-semibold text-gray-800" dir="ltr">{selectedCollab.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">رقم الهاتف</p>
                  <p className="font-semibold text-gray-800" dir="ltr">{selectedCollab.phone}</p>
                </div>
              </div>
              
              {selectedCollab.message && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">رسالة العميل</p>
                  <div className="bg-gray-50 p-4 rounded-xl text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedCollab.message}
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setSelectedCollab(null)}
                className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
