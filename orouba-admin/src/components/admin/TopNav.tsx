"use client";

import { signOut } from "next-auth/react";
import { LogOut, Menu, UserCircle } from "lucide-react";

interface TopNavProps {
  user?: any;
}

import { useAdminTranslation } from "@/components/admin/AdminTranslationProvider";

export default function TopNav({ user }: TopNavProps) {
  const { dict, locale } = useAdminTranslation();
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 z-10">
      <div className="flex items-center">
        <button className="md:hidden text-gray-500 hover:text-gray-700 ml-4">
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-gray-800 hidden sm:block">
          {dict.sidebar.dashboard}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-3 ${locale === 'ar' ? 'pl-4 border-l' : 'pr-4 border-r'} border-gray-200`}>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 leading-none mb-1">{user?.name || (locale === 'ar' ? "مدير النظام" : "Administrator")}</p>
            <p className="text-xs text-gray-500 leading-none">{user?.role === "ADMIN" ? (locale === 'ar' ? "مدير عام" : "Admin") : (locale === 'ar' ? "محرر" : "Editor")}</p>
          </div>
          <UserCircle className="w-8 h-8 text-gray-400" />
        </div>

        <button
          onClick={() => signOut({ callbackUrl: `/${locale}/admin/login` })}
          className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:block font-medium">{dict.sidebar.logout}</span>
        </button>
      </div>
    </header>
  );
}
