"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { ArrowRight, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useAdminTranslation } from "@/components/admin/AdminTranslationProvider";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function RecipeStepsPage() {
  const { t, dict } = useAdminTranslation();
  const params = useParams();
  const router = useRouter();
  const recipeId = params?.recipeId as string;
  
  const [stepAr, setStepAr] = useState("");
  const [stepEn, setStepEn] = useState("");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (recipeId) {
      fetchData();
    }
  }, [recipeId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/recipes/${recipeId}/steps`);
      if (res.ok) {
        const data = await res.json();
        // The API returns an array. We expect only 1 item containing the rich HTML block.
        if (data && data.length > 0) {
          setStepAr(data[0].stepAr || "");
          setStepEn(data[0].stepEn || "");
        } else {
          setStepAr("");
          setStepEn("");
        }
      }
    } catch (error) {
      console.error("Failed to fetch steps", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Send a single step object containing the HTML
      const payload = {
        steps: [{ stepAr, stepEn }]
      };
      
      const res = await fetch(`/api/admin/recipes/${recipeId}/steps`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(t("تم الحفظ بنجاح", "Saved successfully"));
        fetchData();
      } else {
        const error = await res.json();
        alert(error.error || dict.common.error);
      }
    } catch (error) {
      console.error("Failed to save steps", error);
      alert(dict.common.error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors font-medium mb-4"
      >
        <ArrowRight className="w-4 h-4" />
        {t("العودة للوصفات", "Back to Recipes")}
      </button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("مكونات الوصفة", "Recipe Ingredients")}</h1>
          <p className="text-gray-500 mt-1">{t("قم بإدخال وتنسيق مكونات الوصفة (عربي وإنجليزي)", "Enter and format recipe ingredients (Arabic and English)")}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="flex items-center gap-2 bg-orouba-blue text-white px-6 py-2 rounded-xl font-bold hover:bg-orouba-blue/90 transition-colors shadow-sm disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isSaving ? dict.common.saving : dict.common.save}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orouba-blue"></div>
        </div>
      ) : (
        <div className="space-y-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">{t("المكونات (عربي)", "Ingredients (Arabic)")}</label>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <RichTextEditor
                  value={stepAr}
                  onChange={setStepAr}
                  dir="rtl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">{t("المكونات (إنجليزي)", "Ingredients (English)")}</label>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <RichTextEditor
                  value={stepEn}
                  onChange={setStepEn}
                  dir="ltr"
                />
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
