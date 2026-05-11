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
    <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 max-w-5xl mx-auto w-full relative z-10 my-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-orouba-blue mb-4">
          {locale === "ar" ? "تعاون معنا الآن" : "Collaborate With Us Now"}
        </h2>
        <p className="text-gray-600 text-lg">
          {locale === "ar"
            ? "تواصل معنا لمساعدتك على تلبية طلبك"
            : "We are here to help and excited to hear from you"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            required
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder={locale === "ar" ? "الاسم الأول" : "First Name"}
            className="w-full px-6 py-4 bg-[#f8f9fa] rounded-[2rem] border border-gray-100 focus:outline-none focus:border-orouba-yellow focus:ring-1 focus:ring-orouba-yellow transition-all"
          />
          <input
            required
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder={locale === "ar" ? "الاسم الثاني" : "Last Name"}
            className="w-full px-6 py-4 bg-[#f8f9fa] rounded-[2rem] border border-gray-100 focus:outline-none focus:border-orouba-yellow focus:ring-1 focus:ring-orouba-yellow transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder={locale === "ar" ? "رقم الهاتف" : "Your Number"}
            className="w-full px-6 py-4 bg-[#f8f9fa] rounded-[2rem] border border-gray-100 focus:outline-none focus:border-orouba-yellow focus:ring-1 focus:ring-orouba-yellow transition-all"
          />
          <input
            required
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder={locale === "ar" ? "البريد الإلكترونى" : "Your Email"}
            className="w-full px-6 py-4 bg-[#f8f9fa] rounded-[2rem] border border-gray-100 focus:outline-none focus:border-orouba-yellow focus:ring-1 focus:ring-orouba-yellow transition-all"
          />
        </div>

        <textarea
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder={locale === "ar" ? "تفاصيل الطلب" : "Request Details"}
          rows={4}
          className="w-full px-6 py-4 bg-[#f8f9fa] rounded-[2rem] border border-gray-100 focus:outline-none focus:border-orouba-yellow focus:ring-1 focus:ring-orouba-yellow transition-all resize-none"
        ></textarea>

        {successMsg && <p className="text-green-600 font-medium text-center">{successMsg}</p>}
        {errorMsg && <p className="text-red-600 font-medium text-center">{errorMsg}</p>}

        <div className="flex justify-center mt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-16 py-4 bg-orouba-yellow text-orouba-blue rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors shadow-md disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {locale === "ar" ? "إرسال" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
