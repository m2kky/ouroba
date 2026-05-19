"use client";
import AdminPageInfo from "@/components/admin/AdminPageInfo";


import { useState, useEffect } from "react";
import DataTable, { Column } from "@/components/admin/DataTable";
import { Trash2, Edit, Plus, Eye, EyeOff } from "lucide-react";
import { useAdminTranslation } from "@/components/admin/AdminTranslationProvider";

interface Brand {
  id: string;
  nameAr: string;
  nameEn: string;
}

interface ProductType {
  id: string;
  nameAr: string;
  nameEn: string;
  number: number;
  isHidden: boolean;
  brandId: string | null;
  brand?: Brand;
}

export default function ProductTypesPage() {
  const { t, dict } = useAdminTranslation();
  const [types, setTypes] = useState<ProductType[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<ProductType | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [typesRes, brandsRes] = await Promise.all([
        fetch("/api/admin/product-types"),
        fetch("/api/admin/brands")
      ]);
      
      if (typesRes.ok && brandsRes.ok) {
        setTypes(await typesRes.json());
        setBrands(await brandsRes.json());
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
      const res = await fetch(`/api/admin/product-types/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTypes(types.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete type", error);
    }
  };

  const handleToggleVisibility = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/toggle-visibility', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'productType', id, isHidden: !currentStatus })
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
    const data = {
      nameAr: formData.get("nameAr"),
      nameEn: formData.get("nameEn"),
      number: formData.get("number"),
      brandId: formData.get("brandId") || null,
      isHidden: formData.get("isHidden") === "on",
    };

    const url = editingType ? `/api/admin/product-types/${editingType.id}` : "/api/admin/product-types";
    const method = editingType ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingType(null);
        fetchData(); // Refresh list
      } else {
        const error = await res.json();
        alert(error.error || dict.common.error);
      }
    } catch (error) {
      console.error("Failed to save type", error);
      alert(dict.common.error);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredTypes = types.filter(tItem => 
    tItem.nameAr.toLowerCase().includes(search.toLowerCase()) || 
    tItem.nameEn.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<ProductType>[] = [
    { 
      key: "index", 
      label: "#", 
      render: (_, index) => <span className="text-gray-500 font-medium">{(index ?? 0) + 1}</span> 
    },
    { key: "number", label: t("الترتيب", "Order"), render: (item) => item.number },
    { key: "nameAr", label: dict.common.nameAr },
    { key: "nameEn", label: dict.common.nameEn, render: (item) => <span dir="ltr">{item.nameEn}</span> },
    { 
      key: "brandId", 
      label: t("البراند", "Brand"), 
      render: (item) => item.brand ? <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-semibold">{t(item.brand.nameAr, item.brand.nameEn)}</span> : <span className="text-gray-400">—</span>
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
        titleAr="أنواع المنتجات (Product Types)" 
        titleEn="Product Variations & Types"
        descriptionAr="إدارة تصنيفات وتفريعات الأنواع (مثل: حجم كبير، تعبئة مفرغة)." 
        descriptionEn="Manage granular variation sub-types (e.g. Large Package, Vacuum Sealed)."
        prereq1Ar="الخطوة السابقة للأنواع: يمكنك إضافة العلامات التجارية أولاً لربط النوع بعلامة تجارية محددة." 
        prereq1En="Pre-requisite: Add Brands first to associate variations under particular labels."
        prereq2Ar="هذه خطوة تسبق إضافة المنتجات، حيث سيتم إسناد هذه الأنواع للمنتج عند إنشائه." 
        prereq2En="Types are assigned directly inside product builder forms."
      />

      

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("أنواع المنتجات", "Product Types")}</h1>
          <p className="text-gray-500 mt-1">{t("إدارة أنواع المنتجات وتصنيفاتها", "Manage product types and classifications")}</p>
        </div>
        <button
          onClick={() => {
            setEditingType(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-orouba-blue text-white px-4 py-2 rounded-xl font-bold hover:bg-orouba-blue/90 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          {t("إضافة نوع", "Add Type")}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orouba-blue"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredTypes}
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
                  setEditingType(item);
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
                {editingType ? dict.common.edit : t("إضافة نوع جديد", "Add New Type")}
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
                    defaultValue={editingType?.nameAr}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 focus:border-orouba-blue outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{dict.common.nameEn} *</label>
                  <input
                    type="text"
                    name="nameEn"
                    required
                    defaultValue={editingType?.nameEn}
                    dir="ltr"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 focus:border-orouba-blue outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t("البراند التابع له (اختياري)", "Parent Brand (Optional)")}</label>
                  <select
                    name="brandId"
                    defaultValue={editingType?.brandId || ""}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 focus:border-orouba-blue outline-none bg-white"
                  >
                    <option value="">{t("-- بدون براند --", "-- No Brand --")}</option>
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>{t(b.nameAr, b.nameEn)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t("الترتيب (الأقل يظهر أولاً)", "Order (Lowest appears first)")}</label>
                  <input
                    type="number"
                    name="number"
                    defaultValue={editingType?.number || 999}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orouba-blue/20 focus:border-orouba-blue outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="isHidden"
                  name="isHidden"
                  defaultChecked={editingType?.isHidden}
                  className="w-5 h-5 text-orouba-blue focus:ring-orouba-blue rounded border-gray-300"
                />
                <label htmlFor="isHidden" className="text-sm font-semibold text-gray-700 cursor-pointer">
                  {t("إخفاء هذا النوع من الموقع", "Hide this type from website")}
                </label>
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
