const LEGACY_ROUTES = {
  "/": "",
  "/about/whoWeAre": "/about",
  "/about/certifications": "/certifications",
  "/about/ProductType": "/product_types",
  "/Brands": "/brands",
  "/ExportCatalog": "/export_cat",
  ExportCatalog: "/export_cat",
  "/Reciepe": "/recipes",
  Reciepe: "/recipes",
  "/ContactUs": "/contactus",
  ContactUs: "/contactus",
  career: "/careers",
};

export const localizedPath = (path, language = "en") => {
  if (!path || path === "#") {
    return "#";
  }

  if (/^(https?:|mailto:|tel:)/i.test(path)) {
    return path;
  }

  const lang = language === "ar" ? "ar" : "en";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const route = LEGACY_ROUTES[path] ?? LEGACY_ROUTES[normalizedPath] ?? normalizedPath;

  if (route === "") {
    return `/${lang}`;
  }

  if (route === `/ar` || route.startsWith("/ar/") || route === `/en` || route.startsWith("/en/")) {
    return route;
  }

  return `/${lang}${route}`;
};
