import Link from "next/link";

export default function Footer({ settings, socials, brands }: { settings?: any; socials?: any[]; brands?: any[] }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0b5493] text-white pt-16 mt-20 rounded-t-[40px] relative overflow-hidden">
        {/* Faint Background Shapes */}
        <div className="absolute right-20 top-20 opacity-5 pointer-events-none">
           <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 50C10 27.9086 27.9086 10 50 10C72.0914 10 90 27.9086 90 50C90 72.0914 72.0914 90 50 90C27.9086 90 10 72.0914 10 50Z" stroke="white" strokeWidth="2"/></svg>
        </div>
        <div className="absolute right-40 bottom-32 opacity-5 pointer-events-none">
           <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50 10L90 90H10L50 10Z" stroke="white" strokeWidth="2"/></svg>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12" dir="rtl">
            
            {/* Column 1: Logo */}
            <div className="flex flex-col items-start lg:items-center justify-start">
              <Link href="/" className="inline-block mt-4">
                <img 
                  src="https://oroubafoods.com/static/media/logo.c0b669f6b893b6ff3c5b.png" 
                  alt="Orouba Foods" 
                  className="w-44 h-44 object-contain" 
                />
              </Link>
            </div>

            {/* Column 2: Our Products */}
            <div className="text-center">
              <h3 className="text-xl font-bold mb-8 text-[#ffcc00] inline-block">منتجاتنا</h3>
              <ul className="space-y-6">
                <li><Link href="/brands" className="text-white hover:text-[#ffcc00] transition-colors text-lg font-medium">بسمة</Link></li>
                <li><Link href="/brands" className="text-white hover:text-[#ffcc00] transition-colors text-lg font-medium">فريدة</Link></li>
                <li><Link href="/brands" className="text-white hover:text-[#ffcc00] transition-colors text-lg font-medium">بابيتس</Link></li>
              </ul>
            </div>

            {/* Column 3: Quick Links */}
            <div className="text-center">
              <h3 className="text-xl font-bold mb-8 text-[#ffcc00] inline-block">روابط سريعة</h3>
              <ul className="space-y-6">
                <li><Link href="/about" className="text-white hover:text-[#ffcc00] transition-colors text-lg font-medium">من نحن</Link></li>
                <li><Link href="/brands" className="text-white hover:text-[#ffcc00] transition-colors text-lg font-medium">منتجاتنا</Link></li>
                <li><Link href="/recipes" className="text-white hover:text-[#ffcc00] transition-colors text-lg font-medium">وصفات</Link></li>
              </ul>
            </div>

            {/* Column 4: Contact Us */}
            <div className="text-right flex flex-col items-end">
              <h3 className="text-xl font-bold mb-8 text-[#ffcc00]">اتصل بنا</h3>
              <ul className="space-y-5 text-white flex flex-col items-end w-full">
                
                <li className="flex items-start gap-3 justify-end w-full">
                  <div className="text-right text-sm leading-relaxed max-w-[200px]">
                    مدينة العبور، بلوك 12008، قسم 5،<br />
                    القاهرة، عرب العبور 43، مدينة<br />
                    العبور، مصر
                  </div>
                  <span className="text-[#ffcc00] mt-1 text-xl">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </span>
                </li>

                <li className="flex items-center gap-3 justify-end w-full mt-2">
                  <span className="text-sm" dir="ltr">+20 22 4489 226</span>
                  <span className="text-[#ffcc00] text-xl">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </span>
                </li>

                <li className="flex items-center gap-3 justify-end w-full mt-2">
                  <span className="text-sm" dir="ltr">+20 22 4489 227</span>
                  <span className="text-[#ffcc00] text-xl">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                  </span>
                </li>

                <li className="flex items-center gap-3 justify-end w-full mt-2 mb-6">
                  <a href="mailto:oroubaemail@orouba-ajwa.com" className="text-sm hover:text-[#ffcc00] transition-colors">oroubaemail@orouba-ajwa.com</a>
                  <span className="text-[#ffcc00] text-xl">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </span>
                </li>

                {/* Social Media Links from image */}
                <li className="flex flex-col gap-3 justify-end w-full mt-4">
                  <div className="flex items-center justify-end gap-3">
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                         <span className="text-blue-600 text-xs font-bold">f</span>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                         <span className="text-pink-600 text-xs font-bold">📷</span>
                      </div>
                    </div>
                    <img src="https://camp-coding.site/eloroba/storage/app/images/yeaQYQUjSi9l9iThgxvahIGd8khBLpWoE6KbDznW.png" alt="Farida" className="w-12 h-12 object-contain bg-white rounded-md p-1" />
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                         <span className="text-blue-600 text-xs font-bold">f</span>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                         <span className="text-pink-600 text-xs font-bold">📷</span>
                      </div>
                    </div>
                    <img src="https://camp-coding.site/eloroba/storage/app/images/IUCTGnDAvK2nTDvkbXysdBfNmCrJgh9Z4OBRh0Xl.png" alt="Bap Bites" className="w-12 h-12 object-contain bg-white rounded-md p-1" />
                  </div>
                </li>

              </ul>
            </div>

          </div>

          {/* Bottom Bar: Copyright */}
          <div className="border-t border-[#1a6ba8] py-6 flex justify-center items-center">
            <div className="text-white text-lg font-medium text-center">
              جميع الحقوق محفوظة لدى © ٢٠٢٤ العروبة.
            </div>
          </div>
        </div>
      </footer>
  );
}
