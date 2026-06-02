import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
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
      {
        source: "/:lang/about/whoWeAre",
        destination: "/:lang/about",
        permanent: true,
      },
      {
        source: "/:lang/about/certifications",
        destination: "/:lang/certifications",
        permanent: true,
      },
      {
        source: "/:lang/about/ProductType",
        destination: "/:lang/product_types",
        permanent: true,
      },
      {
        source: "/:lang/Brands",
        destination: "/:lang/brands",
        permanent: true,
      },
      {
        source: "/:lang/ExportCatalog",
        destination: "/:lang/export_cat",
        permanent: true,
      },
      {
        source: "/:lang/Reciepe",
        destination: "/:lang/recipes",
        permanent: true,
      },
      {
        source: "/:lang/ContactUs",
        destination: "/:lang/contactus",
        permanent: true,
      },
      {
        source: "/:lang/career",
        destination: "/:lang/careers",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
