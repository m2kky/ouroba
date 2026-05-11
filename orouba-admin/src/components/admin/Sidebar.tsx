"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { 
  LayoutDashboard, 
  Store, 
  Tags, 
  Package, 
  ChefHat, 
  BookOpen, 
  Image as ImageIcon, 
  Award, 
  CheckCircle, 
  Heart, 
  HelpCircle, 
  Building2, 
  Star, 
  Globe2, 
  Handshake, 
  Briefcase, 
  MessageSquare, 
  Settings,
  Users
} from "lucide-react";

interface SidebarProps {
  userRole?: string;
}

export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();

  const menuGroups = [
    {
      title: "الرئيسية",
      items: [
        { name: "الداشبورد", href: "/admin", icon: LayoutDashboard },
      ]
    },
    {
      title: "إدارة المنتجات",
      items: [
        { name: "البراندات", href: "/admin/brands", icon: Store },
        { name: "الأقسام", href: "/admin/categories", icon: Tags },
        { name: "المنتجات", href: "/admin/products", icon: Package },
      ]
    },
    {
      title: "إدارة الوصفات",
      items: [
        { name: "أقسام الوصفات", href: "/admin/recipes/categories", icon: BookOpen },
        { name: "الوصفات", href: "/admin/recipes", icon: ChefHat },
      ]
    },
    {
      title: "إدارة المحتوى",
      items: [
        { name: "البانرات", href: "/admin/banners", icon: ImageIcon },
        { name: "الشهادات", href: "/admin/certificates", icon: Award },
        { name: "المعايير", href: "/admin/standards", icon: CheckCircle },
        { name: "القيم", href: "/admin/values", icon: Heart },
        { name: "لماذا نحن", href: "/admin/why-us", icon: HelpCircle },
        { name: "مرافق المصنع", href: "/admin/buildings", icon: Building2 },
        { name: "المميزات", href: "/admin/features", icon: Star },
        { name: "مناطق التصدير", href: "/admin/continents", icon: Globe2 },
      ]
    },
    {
      title: "الطلبات والرسائل",
      items: [
        { name: "طلبات التعاون", href: "/admin/collaborates", icon: Handshake },
        { name: "طلبات التوظيف", href: "/admin/careers", icon: Briefcase },
        { name: "رسائل تواصل معنا", href: "/admin/contacts", icon: MessageSquare },
      ]
    },
    {
      title: "الإعدادات",
      items: [
        { name: "إعدادات الموقع", href: "/admin/settings", icon: Settings },
        // Only show Team to ADMINs
        ...(userRole === "ADMIN" ? [{ name: "فريق العمل", href: "/admin/team", icon: Users }] : []),
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white border-l border-gray-200 hidden md:flex flex-col h-full shadow-sm z-20">
      <div className="h-16 flex items-center justify-center border-b border-gray-100 px-4">
        <Link href="/admin">
          <Image
            src="/orouba_logo_transparent.png"
            alt="Orouba"
            width={100}
            height={40}
            className="h-10 w-auto object-contain"
          />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 hide-scrollbar">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {group.title}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                const Icon = item.icon;
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-orouba-blue text-white"
                          : "text-gray-600 hover:bg-gray-50 hover:text-orouba-blue"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? "text-orouba-yellow" : "text-gray-400"}`} />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
