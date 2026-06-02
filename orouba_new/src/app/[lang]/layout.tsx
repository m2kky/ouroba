import type { Metadata } from "next";
import 'bootstrap/dist/css/bootstrap.min.css';
import "rsuite/Loader/styles/index.css";
import "../globals.css";
import StoreProvider from "@/components/StoreProvider";
import Header from "@/layouts/header";
import Footer from "@/layouts/footer";

export const metadata: Metadata = {
  title: "Orouba Foods",
  description: "Orouba Foods Official Website",
};

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ar" }];
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;

  return (
    <html lang={lang} data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://oroubafoods.com/static/css/main.56115a45.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <StoreProvider initialLanguage={lang}>
          <div className="defaultLayout">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
