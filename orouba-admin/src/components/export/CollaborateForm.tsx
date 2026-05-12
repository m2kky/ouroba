"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function CollaborateForm({ locale }: { locale: "ar" | "en" }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // In old form: f_name, l_name, phone, email, request
      // We mapped request to message
      const res = await fetch("/api/collaborates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(locale === "ar" ? "تم إرسال طلبك بنجاح. سنتواصل معك قريباً." : "Your request has been sent successfully.");
        setFormData({ firstName: "", lastName: "", phone: "", email: "", message: "" });
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
    <div className="bg-[#fff148] rounded-xl p-8 md:p-12 max-w-5xl mx-auto w-full relative z-10 overflow-hidden shadow-sm">
      {/* Background brush texture effect */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/clean-textile.png')] mix-blend-overlay pointer-events-none"></div>

      <div className="text-right mb-10 relative z-10">
        <h2 className="text-3xl font-bold text-[#0d2a58] mb-3">
          {locale === "ar" ? "تعاون معنا الآن" : "Collaborate With Us Now"}
        </h2>
        <p className="text-[#3b5e8c] text-base font-medium">
          {locale === "ar"
            ? "تواصل معنا لمساعدتك على تلبية طلبك"
            : "We are here to help and excited to hear from you"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            required
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder={locale === "ar" ? "الاسم الثاني" : "Last Name"}
            className="w-full px-6 py-4 bg-white rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#1e4a8c] transition-all text-gray-700"
          />
          <input
            required
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder={locale === "ar" ? "الاسم الأول" : "First Name"}
            className="w-full px-6 py-4 bg-white rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#1e4a8c] transition-all text-gray-700"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            required
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder={locale === "ar" ? "البريد الإلكترونى" : "Your Email"}
            className="w-full px-6 py-4 bg-white rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#1e4a8c] transition-all text-gray-700"
          />
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder={locale === "ar" ? "رقم الهاتف" : "Your Number"}
            className="w-full px-6 py-4 bg-white rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#1e4a8c] transition-all text-gray-700 text-right"
            dir={locale === "ar" ? "rtl" : "ltr"}
          />
        </div>

        <textarea
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder={locale === "ar" ? "تفاصيل الطلب" : "Request Details"}
          rows={5}
          className="w-full px-6 py-4 bg-white rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#1e4a8c] transition-all resize-none text-gray-700"
        ></textarea>

        {successMsg && <p className="text-green-700 font-bold text-center mt-2">{successMsg}</p>}
        {errorMsg && <p className="text-red-600 font-bold text-center mt-2">{errorMsg}</p>}

        <div className="mt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#1e4a8c] text-white rounded-lg font-bold text-lg hover:bg-blue-900 transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {locale === "ar" ? "إرسال" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
