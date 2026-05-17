import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import TopNav from "@/components/admin/TopNav";
import { getAdminDictionary } from "@/dictionaries/admin";
import { AdminTranslationProvider } from "@/components/admin/AdminTranslationProvider";

export default async function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const session = await getServerSession(authOptions);
  
  const { locale } = await params;
  const currentLocale = ['en', 'ar'].includes(locale) ? locale : 'ar';
  const dict = getAdminDictionary(currentLocale);

  if (!session) {
    redirect(`/${currentLocale}/admin/login`);
  }

  return (
    <AdminTranslationProvider dict={dict} locale={currentLocale}>
      <div className="flex h-screen bg-gray-50 overflow-hidden" dir={currentLocale === 'en' ? 'ltr' : 'rtl'}>
        {/* Sidebar - fixed on the right or left based on dir */}
        <Sidebar userRole={(session.user as any)?.role} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav user={session.user} />
          
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminTranslationProvider>
  );
}
