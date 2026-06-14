"use client";

export const dynamic = "force-dynamic";

import AdminPageInfo from "@/components/admin/AdminPageInfo";
import { useAdminTranslation } from "@/components/admin/AdminTranslationProvider";
import { Image as ImageIcon, Plus, Save, Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";

type SocialItem = {
  id?: string;
  image?: string | null;
  link: string;
  isHidden: boolean;
};

type SocialParent = {
  id?: string;
  image: string;
  socials: SocialItem[];
};

const tempId = () => `new-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const platformIcon = (link: string) => {
  const normalized = link.toLowerCase();
  if (normalized.includes("facebook.com") || normalized.includes("fb.com")) return "Facebook";
  if (normalized.includes("instagram.com")) return "Instagram";
  return "Platform";
};

export default function SocialLinksPage() {
  const { t } = useAdminTranslation();
  const [parents, setParents] = useState<SocialParent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/social-links");
      if (res.ok) setParents(await res.json());
    } catch (error) {
      console.error("Failed to fetch social links", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateParent = (index: number, updates: Partial<SocialParent>) => {
    setParents((current) =>
      current.map((parent, parentIndex) =>
        parentIndex === index ? { ...parent, ...updates } : parent
      )
    );
  };

  const updateSocial = (parentIndex: number, socialIndex: number, updates: Partial<SocialItem>) => {
    setParents((current) =>
      current.map((parent, currentParentIndex) => {
        if (currentParentIndex !== parentIndex) return parent;
        return {
          ...parent,
          socials: parent.socials.map((social, currentSocialIndex) =>
            currentSocialIndex === socialIndex ? { ...social, ...updates } : social
          ),
        };
      })
    );
  };

  const uploadImage = async (
    file: File,
    parentIndex: number,
    socialIndex?: number
  ) => {
    const key = `${parentIndex}-${socialIndex ?? "parent"}`;
    setUploadingKey(key);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "socials");
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const payload = await res.json();

      if (!res.ok || !payload.url) {
        alert(payload.error || t("فشل رفع الصورة", "Image upload failed"));
        return;
      }

      if (typeof socialIndex === "number") {
        updateSocial(parentIndex, socialIndex, { image: payload.url });
      } else {
        updateParent(parentIndex, { image: payload.url });
      }
    } catch (error) {
      console.error("Failed to upload image", error);
      alert(t("فشل رفع الصورة", "Image upload failed"));
    } finally {
      setUploadingKey(null);
    }
  };

  const addParent = () => {
    setParents((current) => [...current, { id: tempId(), image: "", socials: [] }]);
  };

  const removeParent = (index: number) => {
    if (!confirm(t("حذف هذا اللوجو وروابطه؟", "Delete this logo and its links?"))) return;
    setParents((current) => current.filter((_, parentIndex) => parentIndex !== index));
  };

  const addSocial = (parentIndex: number) => {
    setParents((current) =>
      current.map((parent, currentParentIndex) =>
        currentParentIndex === parentIndex
          ? {
              ...parent,
              socials: [
                ...parent.socials,
                { id: tempId(), image: "", link: "", isHidden: false },
              ],
            }
          : parent
      )
    );
  };

  const removeSocial = (parentIndex: number, socialIndex: number) => {
    setParents((current) =>
      current.map((parent, currentParentIndex) =>
        currentParentIndex === parentIndex
          ? {
              ...parent,
              socials: parent.socials.filter((_, currentSocialIndex) => currentSocialIndex !== socialIndex),
            }
          : parent
      )
    );
  };

  const save = async () => {
    if (parents.some((parent) => !parent.image.trim())) {
      alert(t("كل لوجو لازم يكون له صورة.", "Each logo must have an image."));
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/social-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parents }),
      });
      const payload = await res.json();

      if (!res.ok) {
        alert(payload.error || t("فشل حفظ روابط السوشيال", "Failed to save social links"));
        return;
      }

      setParents(payload);
      alert(t("تم حفظ روابط السوشيال", "Social links saved"));
    } catch (error) {
      console.error("Failed to save social links", error);
      alert(t("فشل حفظ روابط السوشيال", "Failed to save social links"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageInfo
        titleAr="روابط السوشيال لكل لوجو"
        titleEn="Social Links Per Logo"
        descriptionAr="تحكم في كل لوجو وروابط Facebook وInstagram الخاصة به بشكل منفصل."
        descriptionEn="Manage each logo group and its Facebook/Instagram links separately."
        prereq1Ar="ارفع صورة اللوجو، ثم أضف روابط المنصات الخاصة به."
        prereq1En="Upload the logo image, then add its platform links."
        prereq2Ar="لو لم تضف روابط هنا، سيستخدم الموقع روابط facebook_url و instagram_url كاحتياطي عام."
        prereq2En="If no links are added here, the site falls back to facebook_url and instagram_url."
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("روابط السوشيال", "Social Links")}
          </h1>
          <p className="mt-1 text-gray-500">
            {t("كل كارت هنا يمثل لوجو مستقل بروابط منصاته.", "Each card is one logo with its own platforms.")}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={addParent}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 font-bold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Plus className="h-5 w-5" />
            {t("إضافة لوجو", "Add Logo")}
          </button>
          <button
            onClick={save}
            disabled={isSaving || isLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-orouba-blue px-5 py-2 font-bold text-white shadow-sm transition-colors hover:bg-orouba-blue/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-5 w-5" />
            {isSaving ? t("جاري الحفظ...", "Saving...") : t("حفظ", "Save")}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-orouba-blue" />
        </div>
      ) : parents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500">
          {t("لا توجد لوجوهات سوشيال بعد.", "No social logo groups yet.")}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {parents.map((parent, parentIndex) => (
            <section key={parent.id || parentIndex} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 ring-1 ring-gray-100">
                    {parent.image ? (
                      <img src={parent.image} alt="" className="h-full w-full object-contain p-2" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-gray-300" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-gray-900">
                      {t("لوجو", "Logo")} #{parentIndex + 1}
                    </p>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200">
                      <Upload className="h-4 w-4" />
                      {uploadingKey === `${parentIndex}-parent`
                        ? t("جاري الرفع...", "Uploading...")
                        : t("رفع صورة اللوجو", "Upload logo")}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) uploadImage(file, parentIndex);
                          event.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                </div>
                <button
                  onClick={() => removeParent(parentIndex)}
                  className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                  title={t("حذف", "Delete")}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                {parent.socials.map((social, socialIndex) => (
                  <div key={social.id || socialIndex} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-orouba-blue/10 px-3 py-1 text-xs font-bold text-orouba-blue">
                        {platformIcon(social.link)}
                      </span>
                      <button
                        onClick={() => removeSocial(parentIndex, socialIndex)}
                        className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                        title={t("حذف", "Delete")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      {t("رابط المنصة", "Platform Link")}
                    </label>
                    <input
                      value={social.link}
                      onChange={(event) => updateSocial(parentIndex, socialIndex, { link: event.target.value })}
                      placeholder="https://www.facebook.com/..."
                      dir="ltr"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-orouba-blue focus:ring-2 focus:ring-orouba-blue/10"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => addSocial(parentIndex)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white px-4 py-2 font-bold text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
                {t("إضافة منصة", "Add Platform")}
              </button>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
