"use client";

import { useState } from "react";

export default function ContactForms({ locale }: { locale: "ar" | "en" }) {
  const isEn = locale === "en";
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Something went wrong");
      
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(isEn ? "An error occurred while sending your request. Please try again later." : "حدث خطأ أثناء إرسال طلبك. يرجى المحاولة مرة أخرى لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 border border-green-200 font-medium">
          {isEn ? "Your request has been sent successfully! We will contact you soon." : "تم إرسال طلبك بنجاح! سنتواصل معك في أقرب وقت."}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 border border-red-200 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-orouba-blue mb-2">{isEn ? "Your Name" : "اسمك بالكامل"}</label>
          <input required name="name" type="text" placeholder={isEn ? "Ex. Rick Jourden" : "مثال: أحمد محمد"} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orouba-yellow" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-orouba-blue mb-2">{isEn ? "Your Mail" : "بريدك الإلكتروني"}</label>
            <input required name="email" type="email" dir="ltr" placeholder={isEn ? "Ex. example@gmail.com" : "مثال: example@gmail.com"} className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orouba-yellow ${isEn ? 'text-left' : 'text-right'}`} />
          </div>
          <div>
            <label className="block text-sm font-bold text-orouba-blue mb-2">{isEn ? "Your Number" : "رقم هاتفك"}</label>
            <input name="phone" type="tel" dir="ltr" placeholder={isEn ? "Enter your number" : "أدخل رقمك"} className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orouba-yellow ${isEn ? 'text-left' : 'text-right'}`} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-orouba-blue mb-2">{isEn ? "Type Of Inquiry" : "نوع الاستفسار"}</label>
          <select required name="inquiryType" className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orouba-yellow ${isEn ? 'text-left' : 'text-right'}`}>
            <option value="">{isEn ? "-Please choose an option-" : "-الرجاء اختيار نوع الاستفسار-"}</option>
            <option value="general">{isEn ? "General Inquiry" : "استفسار عام"}</option>
            <option value="sales">{isEn ? "Sales & Partnerships" : "المبيعات والشراكات"}</option>
            <option value="support">{isEn ? "Support" : "الدعم الفني"}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-orouba-blue mb-2">{isEn ? "Your Message" : "رسالتك"}</label>
          <textarea required name="message" rows={5} placeholder={isEn ? "Type your message here" : "اكتب رسالتك هنا"} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orouba-yellow resize-none"></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-orouba-blue hover:bg-blue-800 disabled:bg-gray-400 text-orouba-yellow font-bold py-4 rounded-xl transition-colors text-lg"
        >
          {loading ? (isEn ? "Sending..." : "جاري الإرسال...") : (isEn ? "Submit Request" : "إرسال الطلب")}
        </button>
      </form>
    </div>
  );
}
