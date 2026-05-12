import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSiteData } from "@/lib/api-client";
import SmoothScroll from "@/components/layout/SmoothScroll";
import GlobalPopupManager from "@/components/ui/GlobalPopupManager";
import ChatWidget from "@/components/ui/ChatWidget";
import PageTransitionLoader from "@/components/ui/PageTransitionLoader";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'en' ? "Orouba Foods | Fresh Taste" : "العروبة للصناعات الغذائية | Orouba Foods",
    description: locale === 'en' 
      ? "Taste the fresh food with Orouba Food Industries products" 
      : "تذوق الطعم الطازج مع منتجات العروبة للصناعات الغذائية",
  };
}

export default async function PublicLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  // Fetch global site data for layout components
  let data = null;
  try {
    data = await getSiteData();
  } catch (error) {
    console.error("Failed to load site data for layout", error);
  }

  const settings = data?.settings || {};
  const brands = data?.brands || [];
  const socials = data?.socials || [];

  return (
    <SmoothScroll>
      <PageTransitionLoader />
      <Navbar settings={settings} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer settings={settings} socials={socials} brands={brands} />
      <GlobalPopupManager />
      <ChatWidget />
    </SmoothScroll>
  );
}
