import { getSiteData } from "@/lib/api-client";
import { Metadata } from "next";
import ContactForms from "./ContactForms";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? "تواصل معنا | Orouba Foods" : "Contact Us | Orouba Foods",
    description: locale === 'ar' 
      ? "تواصل مع شركة العروبة للصناعات الغذائية، أو انضم لفريقنا."
      : "Contact Orouba Foods company, or join our team.",
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const data = await getSiteData();
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const { settings } = data;

  return (
    <div className="bg-white min-h-screen pb-20 pt-32">
      
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-8">
        <div className="flex items-center gap-2 font-bold text-lg md:text-xl text-[#0b5394]">
          <Link href={`/${locale}`} className="hover:text-orouba-yellow transition-colors">{locale === 'ar' ? 'الرئيسية' : 'Home'}</Link>
          <ChevronLeft className={`w-5 h-5 mt-1 ${locale === 'en' ? 'rotate-180' : ''}`} />
          <span>{locale === 'ar' ? 'تواصل معنا' : 'ContactUs'}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden rounded-[2.5rem]">
          
          {/* Left Column (Yellow: Map + Info) */}
          <div className="bg-[#fff44f] flex flex-col p-6 md:p-10 relative">
            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 opacity-10 bg-[url('/ar7.png')] bg-cover bg-center mix-blend-overlay pointer-events-none" />
            
            <div className="relative z-10 w-full mb-8">
              <iframe 
                src={`https://maps.google.com/maps?q=30.199778,31.451475&t=m&z=17&output=embed&hl=${locale}`}
                width="100%" 
                height="350" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Orouba Foods Location"
                className="rounded-lg shadow-sm"
              ></iframe>
            </div>

            <div className="relative z-10 flex flex-col gap-6 text-[#0b5394] font-bold text-lg md:text-xl">
              {settings?.address?.ar && (
                <div className="flex items-start gap-3">
                  <span className="shrink-0 mt-1">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </span>
                  <span className="leading-relaxed">{locale === 'ar' ? settings.address.ar : (settings.address.en || settings.address.ar)}</span>
                </div>
              )}
              
              {settings?.phone_1?.en && (
                <div className="flex items-center gap-3">
                  <span className="shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </span>
                  <span dir="ltr">{settings.phone_1.en}</span>
                </div>
              )}

              {settings?.phone_2?.en && (
                <div className="flex items-center gap-3">
                  <span className="shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                  </span>
                  <span dir="ltr">{settings.phone_2.en}</span>
                </div>
              )}

              {settings?.email?.en && (
                <div className="flex items-center gap-3">
                  <span className="shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </span>
                  <a href={`mailto:${settings.email.en}`} className="hover:text-black transition-colors">{settings.email.en}</a>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Form) */}
          <div className="bg-white p-6 md:p-10 flex flex-col justify-center">
            <h1 className="text-4xl font-extrabold text-orouba-blue mb-2">{locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}</h1>
            <p className="text-orouba-blue font-bold text-lg mb-8">
              {locale === 'ar' ? 'املأ النموذج وسيقوم فريقنا بالرد عليك.' : 'Fill up the form and our team will get back to you.'}
            </p>
            <ContactForms locale={locale as "ar"|"en"} />
          </div>

        </div>
      </div>
    </div>
  );
}
