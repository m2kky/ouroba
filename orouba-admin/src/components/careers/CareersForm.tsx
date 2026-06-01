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
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("position", formData.position);
      formDataToSend.append("message", formData.message);
      if (file) {
        formDataToSend.append("file", file);
      }

      const res = await fetch("/api/careers", {
        method: "POST",
        body: formDataToSend,
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          required
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder={locale === "ar" ? "بريدك الإلكتروني" : "Your Email"}
          className="w-full px-4 py-3 bg-white rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-orouba-blue transition-all font-medium text-gray-700"
        />
        <input
          required
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder={locale === "ar" ? "اسمك بالكامل" : "Your Full Name"}
          className="w-full px-4 py-3 bg-white rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-orouba-blue transition-all font-medium text-gray-700"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder={locale === "ar" ? "رقم هاتفك" : "Your Number"}
          dir="ltr"
          className={`w-full px-4 py-3 bg-white rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-orouba-blue transition-all font-medium text-gray-700 ${locale === 'ar' ? 'text-right' : 'text-left'}`}
        />
        <input
          type="text"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          placeholder={locale === "ar" ? "الوظيفة" : "Position"}
          className="w-full px-4 py-3 bg-white rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-orouba-blue transition-all font-medium text-gray-700"
        />
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <label className="font-bold text-[#002f59] text-sm">{locale === "ar" ? "أضف السيرة الذاتية" : "Add Cover Letter"}</label>
        <div className="flex items-center gap-4">
          <label className="cursor-pointer bg-[#e0e3e5] text-[#002f59] px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-bold whitespace-nowrap">
            {locale === "ar" ? "اختر ملف" : "Choose file"}
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
          {file && <span className="text-sm font-medium text-[#002f59] truncate max-w-[200px]">{file.name}</span>}
        </div>
      </div>

      <textarea
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        placeholder={locale === "ar" ? "رسالتك" : "Your Message"}
        rows={5}
        className="w-full px-4 py-3 bg-white rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-orouba-blue transition-all resize-none mt-2 font-medium text-gray-700"
      ></textarea>

      {successMsg && <p className="text-green-700 font-bold bg-green-50 p-3 rounded-lg text-center">{successMsg}</p>}
      {errorMsg && <p className="text-red-700 font-bold bg-red-50 p-3 rounded-lg text-center">{errorMsg}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-orouba-blue text-white rounded-lg font-bold text-lg hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center gap-2 mt-2"
      >
        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
        {locale === "ar" ? "إرسال" : "Send"}
      </button>
    </form>
  );
}
