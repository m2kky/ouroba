"use client";

import { useState, useEffect } from "react";
import DataTable, { Column } from "@/components/admin/DataTable";
import { Trash2, Eye } from "lucide-react";
import { useAdminTranslation } from "@/components/admin/AdminTranslationProvider";

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function ContactsPage() {
  const { t, dict, locale } = useAdminTranslation();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/contacts");
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (error) {
      console.error("Failed to fetch contacts", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(dict.common.confirmDelete)) return;
    
    try {
      const res = await fetch(`/api/admin/contacts?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setContacts(contacts.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete contact", error);
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const columns: Column<Contact>[] = [
    { key: "name", label: t("الاسم", "Name") },
    { key: "email", label: t("البريد الإلكتروني", "Email") },
    { key: "phone", label: t("رقم الهاتف", "Phone"), render: (item) => <span dir="ltr">{item.phone}</span> },
    { 
      key: "createdAt", 
      label: t("تاريخ الإرسال", "Date"), 
      render: (item) => new Date(item.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US') 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{dict.sidebar.contacts}</h1>
          <p className="text-gray-500 mt-1">{t("عرض وإدارة الرسائل الواردة من صفحة اتصل بنا", "View and manage incoming contact messages")}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orouba-blue"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredContacts}
          onSearch={setSearch}
          searchPlaceholder={dict.common.search}
          actions={(item) => (
            <>
              <button 
                onClick={() => setSelectedContact(item)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title={t("عرض الرسالة", "View message")}
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

      {/* View Message Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900">{t("تفاصيل الرسالة", "Message Details")}</h3>
              <button 
                onClick={() => setSelectedContact(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t("الاسم", "Name")}</p>
                  <p className="font-semibold text-gray-800">{selectedContact.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t("تاريخ الإرسال", "Date")}</p>
                  <p className="font-semibold text-gray-800">{new Date(selectedContact.createdAt).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t("البريد الإلكتروني", "Email")}</p>
                  <p className="font-semibold text-gray-800" dir="ltr">{selectedContact.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t("رقم الهاتف", "Phone")}</p>
                  <p className="font-semibold text-gray-800" dir="ltr">{selectedContact.phone}</p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-2">{t("نص الرسالة", "Message Content")}</p>
                <div className="bg-gray-50 p-4 rounded-xl text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedContact.message}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setSelectedContact(null)}
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
