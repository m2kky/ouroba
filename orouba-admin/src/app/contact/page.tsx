import { getSiteData } from "@/lib/api-client";
import { Metadata } from "next";
import ContactForms from "./ContactForms";

export const metadata: Metadata = {
  title: "تواصل معنا | Orouba Foods",
  description: "تواصل مع شركة العروبة للصناعات الغذائية، أو انضم لفريقنا.",
};

export default async function ContactPage() {
  const data = await getSiteData();
  const { settings } = data;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero */}
      <section className="py-24 bg-orouba-blue text-white text-center relative">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-orouba-yellow">تواصل معنا</h1>
          <div className="w-24 h-1 bg-orouba-yellow mx-auto rounded-full mb-8" />
          <p className="text-xl text-blue-50 leading-relaxed font-medium">
            سواء كان لديك استفسار عن منتجاتنا، أو تود الانضمام لفريقنا، أو تبحث عن فرص للشراكة، يسعدنا تواصلك معنا دائماً.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-12 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact Info Card */}
        <div className="bg-white rounded-[2rem] shadow-lg border border-gray-100 p-8 lg:col-span-1 h-fit">
          <h2 className="text-2xl font-bold text-orouba-blue mb-8 border-b border-gray-100 pb-4">معلومات الاتصال</h2>
          <div className="space-y-6">
            {settings?.address?.ar && (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📍</span>
                </div>
                <div>
                  <h4 className="font-bold text-orouba-blue mb-1">المكتب الرئيسي</h4>
                  <p className="text-gray-600 leading-relaxed font-medium">{settings.address.ar}</p>
                </div>
              </div>
            )}
            
            {settings?.phone?.ar && (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📞</span>
                </div>
                <div className="flex flex-col">
                  <h4 className="font-bold text-orouba-blue mb-1">الهاتف</h4>
                  <p dir="ltr" className="text-gray-600 leading-relaxed font-medium text-right">{settings.phone.ar}</p>
                </div>
              </div>
            )}

            {settings?.email?.en && (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">✉️</span>
                </div>
                <div>
                  <h4 className="font-bold text-orouba-blue mb-1">البريد الإلكتروني</h4>
                  <a href={`mailto:${settings.email.en}`} className="text-blue-600 hover:text-orouba-yellow font-medium transition-colors leading-relaxed">
                    {settings.email.en}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Forms Container */}
        <div className="bg-white rounded-[2rem] shadow-lg border border-gray-100 p-8 lg:col-span-2">
          <ContactForms />
        </div>
      </div>
    </div>
  );
}
