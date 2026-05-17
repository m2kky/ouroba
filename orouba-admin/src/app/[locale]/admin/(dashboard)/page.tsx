import { prisma } from "@/lib/prisma";
import { 
  Users, 
  Store, 
  Package, 
  ChefHat, 
  MessageSquare,
  Briefcase,
  Handshake,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { getAdminDictionary } from "@/dictionaries/admin";

async function getStats() {
  const [
    brandsCount,
    productsCount,
    recipesCount,
    contactsCount,
    careersCount,
    collaboratesCount,
  ] = await Promise.all([
    prisma.brand.count(),
    prisma.product.count(),
    prisma.recipe.count(),
    prisma.contactRequest.count(),
    prisma.careerRequest.count(),
    prisma.collaborateRequest.count(),
  ]);

  return {
    brandsCount,
    productsCount,
    recipesCount,
    contactsCount,
    careersCount,
    collaboratesCount,
  };
}

export default async function AdminDashboardPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const locale = params.locale;
  const dict = await getAdminDictionary(locale);
  const t = (ar: string, en: string) => locale === 'ar' ? ar : en;
  const stats = await getStats();

  const statCards = [
    { title: dict.sidebar.brands, value: stats.brandsCount, icon: Store, color: "bg-blue-500", href: `/${locale}/admin/brands` },
    { title: dict.sidebar.products, value: stats.productsCount, icon: Package, color: "bg-indigo-500", href: `/${locale}/admin/products` },
    { title: dict.sidebar.recipes, value: stats.recipesCount, icon: ChefHat, color: "bg-emerald-500", href: `/${locale}/admin/recipes` },
    { title: dict.sidebar.contacts, value: stats.contactsCount, icon: MessageSquare, color: "bg-amber-500", href: `/${locale}/admin/contacts` },
    { title: dict.sidebar.careers, value: stats.careersCount, icon: Briefcase, color: "bg-rose-500", href: `/${locale}/admin/careers` },
    { title: dict.sidebar.collaborates, value: stats.collaboratesCount, icon: Handshake, color: "bg-purple-500", href: `/${locale}/admin/collaborates` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{dict.sidebar.dashboard}</h1>
        <p className="text-gray-500 mt-1">{t("إحصائيات وبيانات منصة العروبة", "Orouba Platform Statistics and Data")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl text-white ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
              </div>
              <div className="flex items-end justify-between mt-auto">
                <h4 className="text-gray-600 font-medium">{stat.title}</h4>
                <Link 
                  href={stat.href} 
                  className="flex items-center text-sm text-orouba-blue font-semibold hover:underline gap-1"
                >
                  {t("إدارة", "Manage")} <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t("مرحباً بك في لوحة تحكم العروبة", "Welcome to Orouba Dashboard")}</h2>
        <p className="text-gray-600 leading-relaxed text-justify">
          {t("هذه اللوحة تتيح لك التحكم الكامل في محتوى المنصة. استخدم القائمة الجانبية للتنقل بين الأقسام المختلفة. يمكنك إدارة المنتجات، البراندات، والوصفات، بالإضافة إلى متابعة طلبات التواصل والتوظيف الواردة من المستخدمين.", "This dashboard allows you to fully control the platform content. Use the sidebar to navigate between different sections. You can manage products, brands, and recipes, as well as track incoming contact and career requests from users.")}
        </p>
      </div>
    </div>
  );
}
