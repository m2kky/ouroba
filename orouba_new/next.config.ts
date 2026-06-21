import type { NextConfig } from "next";

const permanentRedirect = (source: string, destination: string) => ({
  source,
  destination,
  permanent: true,
});

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      permanentRedirect("/:lang(en|ar)/about/whoWeAre", "/:lang/about"),
      permanentRedirect("/:lang(en|ar)/about/certifications", "/:lang/certifications"),
      permanentRedirect("/:lang(en|ar)/about/ProductType", "/:lang/product_types"),
      permanentRedirect("/:lang(en|ar)/ExportCatalog", "/:lang/export_cat"),
      permanentRedirect("/:lang(en|ar)/Reciepe", "/:lang/recipes"),
      permanentRedirect("/:lang(en|ar)/career", "/:lang/careers"),

      permanentRedirect("/about/whoWeAre/:lang(en|ar)", "/:lang/about"),
      permanentRedirect("/about/certifications/:lang(en|ar)", "/:lang/certifications"),
      permanentRedirect("/about/ProductType/:lang(en|ar)", "/:lang/product_types"),
      permanentRedirect("/Brands/:lang(en|ar)", "/:lang/brands"),
      permanentRedirect("/ExportCatalog/:lang(en|ar)", "/:lang/export_cat"),
      permanentRedirect("/Reciepe/:lang(en|ar)", "/:lang/recipes"),
      permanentRedirect("/ContactUs/:lang(en|ar)", "/:lang/contactus"),
      permanentRedirect("/contactus/:lang(en|ar)", "/:lang/contactus"),
      permanentRedirect("/career/:lang(en|ar)", "/:lang/careers"),
      permanentRedirect("/export/:lang(en|ar)", "/:lang/export"),

      permanentRedirect("/about/whoWeAre", "/ar/about"),
      permanentRedirect("/about/certifications", "/ar/certifications"),
      permanentRedirect("/about/ProductType", "/ar/product_types"),
      permanentRedirect("/Brands", "/ar/brands"),
      permanentRedirect("/ExportCatalog", "/ar/export_cat"),
      permanentRedirect("/Reciepe", "/ar/recipes"),
      permanentRedirect("/ContactUs", "/ar/contactus"),
      permanentRedirect("/contactus", "/ar/contactus"),
      permanentRedirect("/career", "/ar/careers"),
      permanentRedirect("/export", "/ar/export"),

      permanentRedirect("/brands/Basma/:lang(en|ar)", "/:lang/brands/5"),
      permanentRedirect("/brands/Farida/:lang(en|ar)", "/:lang/brands/7"),
      permanentRedirect("/brands/Bab%20Pites/:lang(en|ar)", "/:lang/brands/8"),
      permanentRedirect("/brands/Basma", "/ar/brands/5"),
      permanentRedirect("/brands/Farida", "/ar/brands/7"),
      permanentRedirect("/brands/Bab%20Pites", "/ar/brands/8"),
      permanentRedirect("/brands/:brandId(\\d+)/:lang(en|ar)", "/:lang/brands/:brandId"),
      permanentRedirect("/brands/:brandId(\\d+)", "/ar/brands/:brandId"),
      permanentRedirect("/Brands/:brandId(\\d+)/:lang(en|ar)", "/:lang/brands/:brandId"),
      permanentRedirect(
        "/Brands/:brandName/:brandId/:categoryId/:brandCategoryName/:lang(en|ar)",
        "/:lang/brands/:brandId/categories/:categoryId"
      ),
      permanentRedirect(
        "/brands/ProductType/ProductTypeCategory/:brandName/:id/:brandId/:categoryName/:categoryId/:lang(en|ar)",
        "/:lang/products/:id"
      ),
      permanentRedirect(
        "/recipe_details/:id/:recName/:recId/:foodName/:foodId/:lang(en|ar)",
        "/:lang/recipe_details/:id"
      ),
    ];
  },
};

export default nextConfig;
