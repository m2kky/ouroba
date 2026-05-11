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

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const statCards = [
    { title: "البراندات", value: stats.brandsCount, icon: Store, color: "bg-blue-500", href: "/admin/brands" },
    { title: "المنتجات", value: stats.productsCount, icon: Package, color: "bg-indigo-500", href: "/admin/products" },
    { title: "الوصفات", value: stats.recipesCount, icon: ChefHat, color: "bg-emerald-500", href: "/admin/recipes" },
    { title: "رسائل التواصل", value: stats.contactsCount, icon: MessageSquare, color: "bg-amber-500", href: "/admin/contacts" },
    { title: "طلبات التوظيف", value: stats.careersCount, icon: Briefcase, color: "bg-rose-500", href: "/admin/careers" },
    { title: "طلبات التعاون", value: stats.collaboratesCount, icon: Handshake, color: "bg-purple-500", href: "/admin/collaborates" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">نظرة عامة</h1>
        <p className="text-gray-500 mt-1">إحصائيات وبيانات منصة العروبة</p>
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
                  className="flex items-center text-sm text-orouba-blue font-semibold hover:underline"
                >
                  إدارة <ArrowUpRight className="w-4 h-4 mr-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">مرحباً بك في لوحة تحكم العروبة</h2>
        <p className="text-gray-600 leading-relaxed text-justify">
          هذه اللوحة تتيح لك التحكم الكامل في محتوى المنصة. استخدم القائمة الجانبية للتنقل بين الأقسام المختلفة. 
          يمكنك إدارة المنتجات، البراندات، والوصفات، بالإضافة إلى متابعة طلبات التواصل والتوظيف الواردة من المستخدمين.
        </p>
      </div>
    </div>
  );
}
