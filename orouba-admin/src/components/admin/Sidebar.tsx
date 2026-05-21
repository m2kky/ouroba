"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
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
  Users,
  Megaphone,
  MessagesSquare,
  Globe,
  ChevronDown,
  Layers,
  FileText
} from "lucide-react";
import { useAdminTranslation } from "@/components/admin/AdminTranslationProvider";

interface SidebarProps {
  userRole?: string;
}

function CollapsibleMenuGroup({ group, pathname, locale }: { group: any, pathname: string, locale: string }) {
  const isAnyItemActive = group.items.some((item: any) => 
    pathname === item.href || (item.href !== `/${locale}/admin` && pathname.startsWith(item.href))
  );
  
  const [isOpen, setIsOpen] = useState(isAnyItemActive || !group.collapsible);

  // Keep open if an item inside becomes active
  useEffect(() => {
    if (isAnyItemActive && group.collapsible) {
      setIsOpen(true);
    }
  }, [isAnyItemActive, group.collapsible]);

  return (
    <div className="mb-4">
      {group.collapsible ? (
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 hover:text-orouba-blue hover:bg-gray-50 rounded-lg uppercase tracking-wider mb-1 transition-colors"
        >
          <span>{group.title}</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      ) : (
        <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-2">
          {group.title}
        </h3>
      )}
      
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <ul className="space-y-1 overflow-hidden">
          {group.items.map((item: any) => {
            const isActive = pathname === item.href || (item.href !== `/${locale}/admin` && pathname.startsWith(item.href));
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
    </div>
  );
}

export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();
  const { dict, locale } = useAdminTranslation();

  const toggleLocale = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar';
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    window.location.href = newPath;
  };

  const menuGroups = [
    {
      title: dict.sidebar.dashboard,
      collapsible: false,
      items: [
        { name: dict.sidebar.dashboard, href: `/${locale}/admin`, icon: LayoutDashboard },
        { name: locale === 'ar' ? 'دليل الاستخدام' : 'User Guide', href: `/${locale}/admin/docs`, icon: HelpCircle },
      ]
    },
    {
      title: dict.sidebar.products,
      collapsible: true,
      items: [
        { name: dict.sidebar.brands, href: `/${locale}/admin/brands`, icon: Store },
        { name: dict.sidebar.categories, href: `/${locale}/admin/categories`, icon: Tags },
        { name: dict.sidebar.productTypes || "Product Types", href: `/${locale}/admin/category-types`, icon: Layers },
        { name: dict.sidebar.products, href: `/${locale}/admin/products`, icon: Package },
      ]
    },
    {
      title: dict.sidebar.recipes,
      collapsible: true,
      items: [
        { name: dict.sidebar.recipeCategories || "Recipe Categories", href: `/${locale}/admin/recipes/categories`, icon: BookOpen },
        { name: dict.sidebar.recipes, href: `/${locale}/admin/recipes`, icon: ChefHat },
        { name: dict.sidebar.foods, href: `/${locale}/admin/foods`, icon: ChefHat },
      ]
    },
    {
      title: dict.sidebar.aboutSection || "About Us Page",
      collapsible: true,
      items: [
        { name: dict.sidebar.values, href: `/${locale}/admin/about/values`, icon: Heart },
        { name: dict.sidebar.features, href: `/${locale}/admin/about/features`, icon: Star },
        { name: dict.sidebar.facilities, href: `/${locale}/admin/about/buildings`, icon: Building2 },
        { name: dict.sidebar.standards, href: `/${locale}/admin/about/standards`, icon: CheckCircle },
        { name: dict.sidebar.certificates, href: `/${locale}/admin/about/certificates`, icon: Award },
        { name: dict.sidebar.whyUs, href: `/${locale}/admin/about/why-choose-us`, icon: HelpCircle },
        { name: dict.sidebar.productionSteps || "Production Steps", href: `/${locale}/admin/about/production-steps`, icon: Layers },
        { name: dict.sidebar.sectionTexts || "Section Texts", href: `/${locale}/admin/about/section-texts`, icon: FileText },
      ]
    },
    {
      title: dict.sidebar.siteSection || "Global Site",
      collapsible: true,
      items: [
        { name: dict.sidebar.banners, href: `/${locale}/admin/banners`, icon: ImageIcon },
        { name: dict.sidebar.export, href: `/${locale}/admin/continents`, icon: Globe2 },
        { name: dict.sidebar.popups, href: `/${locale}/admin/popups`, icon: Megaphone },
        { name: dict.sidebar.chatMenu, href: `/${locale}/admin/chat-menu`, icon: MessagesSquare },
      ]
    },
    {
      title: dict.sidebar.requests,
      collapsible: true,
      items: [
        { name: dict.sidebar.collaborates, href: `/${locale}/admin/collaborates`, icon: Handshake },
        { name: dict.sidebar.careers, href: `/${locale}/admin/careers`, icon: Briefcase },
        { name: dict.sidebar.contacts, href: `/${locale}/admin/contacts`, icon: MessageSquare },
      ]
    },
    {
      title: dict.sidebar.settings,
      collapsible: false,
      items: [
        { name: dict.sidebar.settings, href: `/${locale}/admin/settings`, icon: Settings },
        ...(userRole === "ADMIN" ? [{ name: dict.sidebar.team, href: `/${locale}/admin/team`, icon: Users }] : []),
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
          <CollapsibleMenuGroup 
            key={idx} 
            group={group} 
            pathname={pathname} 
            locale={locale} 
          />
        ))}
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={toggleLocale}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors font-medium text-sm"
        >
          <Globe className="w-4 h-4 text-gray-500" />
          {dict.sidebar.language}
        </button>
      </div>
    </aside>
  );
}
