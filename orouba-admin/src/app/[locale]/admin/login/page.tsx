"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Image from "next/image";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("from") || "/admin";
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      } else if (res?.url) {
        router.push(res.url);
        router.refresh();
      }
    } catch (err) {
      setError("حدث خطأ ما، يرجى المحاولة مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl border border-gray-100 relative z-10 mx-4">
      <div className="flex justify-center mb-6">
        <Image
          src="/orouba_logo_transparent.png"
          alt="Orouba Logo"
          width={150}
          height={150}
          className="object-contain drop-shadow-md"
        />
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold text-orouba-blue mb-2">لوحة التحكم</h2>
        <p className="text-gray-500">تسجيل الدخول لإدارة موقع العروبة</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 mt-8">
        {error && (
          <div className="p-4 bg-red-50 border-r-4 border-red-500 text-red-700 text-sm rounded text-right">
            {error}
          </div>
        )}

        <div className="space-y-2 text-right">
          <label className="text-sm font-semibold text-gray-700 block">البريد الإلكتروني</label>
          <input
            name="email"
            type="email"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orouba-blue focus:ring-2 focus:ring-orouba-blue/20 outline-none transition-all text-right"
            placeholder="admin@valueims.com"
            dir="ltr"
          />
        </div>

        <div className="space-y-2 text-right">
          <label className="text-sm font-semibold text-gray-700 block">كلمة المرور</label>
          <input
            name="password"
            type="password"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orouba-blue focus:ring-2 focus:ring-orouba-blue/20 outline-none transition-all text-right"
            placeholder="••••••••"
            dir="ltr"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-6 text-white font-bold text-lg bg-gradient-to-r from-orouba-blue to-orouba-blue/90 hover:from-orouba-yellow hover:to-orouba-yellow/90 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
             <span className="flex items-center justify-center gap-2">
               جاري تسجيل الدخول...
               <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
             </span>
          ) : (
            "تسجيل الدخول"
          )}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden" dir="rtl">
      {/* Decorative Background */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orouba-yellow/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-orouba-blue/10 rounded-full blur-3xl" />
      
      <Suspense fallback={<div>جاري التحميل...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
