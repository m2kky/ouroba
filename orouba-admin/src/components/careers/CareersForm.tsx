"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function CareersForm({ locale }: { locale: "ar" | "en" }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    message: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      let resumeUrl = "";

      // If there's a file, we could upload it to an endpoint first.
      // Since this is a migration, we'll assume the API expects the URL.
      // We will skip actual file upload logic to cloud storage for now 
      // unless an API route exists. We just pass a placeholder or handle it later.
      if (file) {
        resumeUrl = file.name; // Placeholder for now
      }

      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, resumeUrl }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(locale === "ar" ? "تم إرسال طلبك بنجاح. سنتواصل معك قريباً." : "Your application has been sent successfully.");
        setFormData({ name: "", email: "", phone: "", position: "", message: "" });
        setFile(null);
      } else {
        setErrorMsg(data.message || (locale === "ar" ? "حدث خطأ أثناء الإرسال." : "Failed to submit."));
      }
    } catch (err) {
      setErrorMsg(locale === "ar" ? "حدث خطأ أثناء الإرسال." : "Failed to submit.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccessMsg("");
        setErrorMsg("");
      }, 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          required
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder={locale === "ar" ? "الاسم بالكامل" : "Full Name"}
          className="w-full px-6 py-4 bg-[#f8f9fa] rounded-[2rem] border border-gray-100 focus:outline-none focus:border-orouba-yellow focus:ring-1 focus:ring-orouba-yellow transition-all"
        />
        <input
          required
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder={locale === "ar" ? "البريد الإلكتروني" : "Email Address"}
          className="w-full px-6 py-4 bg-[#f8f9fa] rounded-[2rem] border border-gray-100 focus:outline-none focus:border-orouba-yellow focus:ring-1 focus:ring-orouba-yellow transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder={locale === "ar" ? "رقم الهاتف" : "Phone Number"}
          className="w-full px-6 py-4 bg-[#f8f9fa] rounded-[2rem] border border-gray-100 focus:outline-none focus:border-orouba-yellow focus:ring-1 focus:ring-orouba-yellow transition-all"
        />
        <input
          type="text"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          placeholder={locale === "ar" ? "الوظيفة المتقدم إليها" : "Position Applied For"}
          className="w-full px-6 py-4 bg-[#f8f9fa] rounded-[2rem] border border-gray-100 focus:outline-none focus:border-orouba-yellow focus:ring-1 focus:ring-orouba-yellow transition-all"
        />
      </div>

      <div className="w-full bg-[#f8f9fa] p-4 rounded-[2rem] border border-gray-100 flex items-center justify-between">
        <span className="text-gray-500 px-4 font-medium">
          {file ? file.name : (locale === "ar" ? "إرفاق السيرة الذاتية (CV)" : "Upload Resume (CV)")}
        </span>
        <label className="cursor-pointer bg-orouba-blue text-white px-6 py-2 rounded-full hover:bg-blue-800 transition-colors text-sm font-bold whitespace-nowrap">
          {locale === "ar" ? "اختر ملف" : "Choose File"}
          <input
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>
      </div>

      <textarea
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        placeholder={locale === "ar" ? "رسالة تعريفية (اختياري)" : "Cover Letter / Message"}
        rows={4}
        className="w-full px-6 py-4 bg-[#f8f9fa] rounded-[2rem] border border-gray-100 focus:outline-none focus:border-orouba-yellow focus:ring-1 focus:ring-orouba-yellow transition-all resize-none"
      ></textarea>

      {successMsg && <p className="text-green-600 font-medium text-center">{successMsg}</p>}
      {errorMsg && <p className="text-red-600 font-medium text-center">{errorMsg}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full md:w-auto px-12 py-4 bg-orouba-yellow text-orouba-blue rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors shadow-md disabled:opacity-70 flex justify-center items-center gap-2"
      >
        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
        {locale === "ar" ? "إرسال الطلب" : "Submit Application"}
      </button>
    </form>
  );
}
