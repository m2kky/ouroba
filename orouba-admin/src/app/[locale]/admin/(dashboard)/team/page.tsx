"use client";
import AdminPageInfo from "@/components/admin/AdminPageInfo";


import { useState, useEffect } from "react";
import DataTable, { Column } from "@/components/admin/DataTable";
import { Trash2, Edit, Plus, Shield, User } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EDITOR";
  createdAt: string;
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/team");
      if (res.ok) setMembers(await res.json());
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العضو؟")) return;
    
    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMembers(members.filter(m => m.id !== id));
      } else {
        const err = await res.json();
        alert(err.error || "فشل الحذف");
      }
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Only include password if provided
    if (!data.password) {
      delete data.password;
    }

    const url = editingMember ? `/api/admin/team/${editingMember.id}` : "/api/admin/team";
    const method = editingMember ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingMember(null);
        fetchMembers();
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

  const filteredMembers = members.filter(m => 
    (m.name && m.name.toLowerCase().includes(search.toLowerCase())) || 
    (m.email && m.email.toLowerCase().includes(search.toLowerCase()))
  );

  const columns: Column<TeamMember>[] = [
    { 
      key: "name", 
      label: "الاسم", 
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orouba-blue/10 flex items-center justify-center text-orouba-blue font-bold">
            {item.name ? item.name[0].toUpperCase() : <User className="w-4 h-4" />}
          </div>
          <span className="font-semibold">{item.name}</span>
        </div>
      )
    },
    { key: "email", label: "البريد الإلكتروني", render: (item) => <span dir="ltr">{item.email}</span> },
    { 
      key: "role", 
      label: "الدور والصلاحيات", 
      render: (item) => item.role === "ADMIN" ? (
        <span className="flex items-center gap-1 w-fit px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold">
          <Shield className="w-3 h-3" /> مدير نظام (Admin)
        </span>
      ) : (
        <span className="flex items-center gap-1 w-fit px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold">
          <User className="w-3 h-3" /> محرر (Editor)
        </span>
      )
    },
    { 
      key: "createdAt", 
      label: "تاريخ الإضافة", 
      render: (item) => new Date(item.createdAt).toLocaleDateString('ar-EG')
    }
  ];

  return (
    <div className="space-y-6">
      <AdminPageInfo 
        titleAr="إدارة الفريق (Team/Directors)" 
        titleEn="Board & Team Directors"
        descriptionAr="إضافة وتعديل بيانات أعضاء مجلس الإدارة أو فريق العمل." 
        descriptionEn="Manage administrative board members and team highlights."
        prereq1Ar="تُعرض هذه البيانات في قسم التعرف على الشركة." 
        prereq1En="Displays portraits and roles under the 'Our Team' web layout."
        prereq2Ar="يمكن إضافة الاسم، المنصب، وصورة شخصية لكل عضو كخطوة مستقلة." 
        prereq2En="Upload name, position title, and professional photo individually."
      />

      

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">فريق العمل (Team)</h1>
          <p className="text-gray-500 mt-1">إدارة حسابات وصلاحيات دخول لوحة التحكم</p>
        </div>
        <button
          onClick={() => {
            setEditingMember(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-orouba-blue text-white px-4 py-2 rounded-xl font-bold hover:bg-orouba-blue/90 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          إضافة عضو جديد
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orouba-blue"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredMembers}
          onSearch={setSearch}
          searchPlaceholder="ابحث بالاسم أو البريد..."
          actions={(item) => (
            <>
              <button 
                onClick={() => {
                  setEditingMember(item);
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
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl" dir="rtl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">
                {editingMember ? "تعديل عضو الفريق" : "إضافة عضو فريق جديد"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">الاسم الكامل *</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingMember?.name || ""}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">البريد الإلكتروني (Email) *</label>
                <input
                  type="email"
                  name="email"
                  required
                  defaultValue={editingMember?.email || ""}
                  dir="ltr"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  كلمة المرور (Password) {editingMember ? "(اتركه فارغاً إذا لم ترد التغيير)" : "*"}
                </label>
                <input
                  type="password"
                  name="password"
                  required={!editingMember}
                  dir="ltr"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">الدور (Role) *</label>
                <div className="flex flex-col gap-3">
                  <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input 
                      type="radio" 
                      name="role" 
                      value="EDITOR" 
                      defaultChecked={!editingMember || editingMember.role === "EDITOR"} 
                      className="mt-1 w-4 h-4 text-orouba-blue focus:ring-orouba-blue" 
                    />
                    <div>
                      <div className="font-bold text-gray-900">محرر (Editor)</div>
                      <div className="text-xs text-gray-500 mt-1">يمكنه إدارة المحتوى والمنتجات، لا يمكنه إدارة الفريق والإعدادات.</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input 
                      type="radio" 
                      name="role" 
                      value="ADMIN" 
                      defaultChecked={editingMember?.role === "ADMIN"} 
                      className="mt-1 w-4 h-4 text-purple-600 focus:ring-purple-600" 
                    />
                    <div>
                      <div className="font-bold text-purple-700">مدير نظام (Admin)</div>
                      <div className="text-xs text-gray-500 mt-1">يملك صلاحيات كاملة على كل لوحة التحكم.</div>
                    </div>
                  </label>
                </div>
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
                  {isSaving ? "جاري الحفظ..." : "حفظ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
