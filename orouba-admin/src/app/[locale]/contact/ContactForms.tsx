"use client";

import { useState } from "react";

type Tab = "contact" | "career" | "collaborate";

export default function ContactForms({ locale }: { locale: "ar" | "en" }) {
  const isEn = locale === "en";
  const [activeTab, setActiveTab] = useState<Tab>("contact");
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

    // Map the endpoint based on active tab
    const endpoint = `/api/${activeTab}s`;

    try {
      const res = await fetch(endpoint, {
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
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
        <button
          onClick={() => { setActiveTab("contact"); setSuccess(false); setError(""); }}
          className={`pb-4 px-6 font-bold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === "contact" ? "border-orouba-blue text-orouba-blue" : "border-transparent text-gray-400 hover:text-gray-700"
          }`}
        >
          {isEn ? "General Inquiry" : "استفسار عام"}
        </button>
        <button
          onClick={() => { setActiveTab("career"); setSuccess(false); setError(""); }}
          className={`pb-4 px-6 font-bold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === "career" ? "border-orouba-blue text-orouba-blue" : "border-transparent text-gray-400 hover:text-gray-700"
          }`}
        >
          {isEn ? "Careers" : "التوظيف"}
        </button>
        <button
          onClick={() => { setActiveTab("collaborate"); setSuccess(false); setError(""); }}
          className={`pb-4 px-6 font-bold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === "collaborate" ? "border-orouba-blue text-orouba-blue" : "border-transparent text-gray-400 hover:text-gray-700"
          }`}
        >
          {isEn ? "Partnerships" : "التعاون والشراكات"}
        </button>
      </div>

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
        {/* Name / Names */}
        {activeTab === "collaborate" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-orouba-blue mb-2">{isEn ? "First Name" : "الاسم الأول"}</label>
              <input required name="firstName" type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orouba-yellow" />
            </div>
            <div>
              <label className="block text-sm font-bold text-orouba-blue mb-2">{isEn ? "Last Name" : "اسم العائلة"}</label>
              <input required name="lastName" type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orouba-yellow" />
            </div>
            {/* hidden generic name field to satisfy API requirements if needed */}
            <input type="hidden" name="name" value="Collaborator" />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-bold text-orouba-blue mb-2">{isEn ? "Full Name" : "الاسم بالكامل"}</label>
            <input required name="name" type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orouba-yellow" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-orouba-blue mb-2">{isEn ? "Email" : "البريد الإلكتروني"}</label>
            <input required name="email" type="email" dir="ltr" className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orouba-yellow ${isEn ? 'text-left' : 'text-right'}`} />
          </div>
          <div>
            <label className="block text-sm font-bold text-orouba-blue mb-2">{isEn ? "Phone" : "رقم الهاتف"}</label>
            <input name="phone" type="tel" dir="ltr" className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orouba-yellow ${isEn ? 'text-left' : 'text-right'}`} />
          </div>
        </div>

        {/* Tab specific fields */}
        {activeTab === "career" && (
          <>
            <div>
              <label className="block text-sm font-bold text-orouba-blue mb-2">{isEn ? "Position Applied For" : "المسمى الوظيفي المتقدم له"}</label>
              <input required name="position" type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orouba-yellow" />
            </div>
            <div>
              <label className="block text-sm font-bold text-orouba-blue mb-2">{isEn ? "CV URL" : "رابط السيرة الذاتية (CV)"}</label>
              <input name="resumeUrl" type="url" dir="ltr" placeholder="https://..." className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orouba-yellow ${isEn ? 'text-left' : 'text-right'}`} />
            </div>
          </>
        )}

        {/* Generic Message (for contact or collaborate) */}
        {activeTab !== "career" && (
          <div>
            <label className="block text-sm font-bold text-orouba-blue mb-2">{isEn ? "Message" : "الرسالة"}</label>
            <textarea required={activeTab === "contact"} name="message" rows={5} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orouba-yellow resize-none"></textarea>
          </div>
        )}

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
