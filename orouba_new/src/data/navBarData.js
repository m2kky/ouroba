export const menus = [
    {
      label: "Home",
      label_ar: "الرئيسية",
      route: "/",
    },
    {
      label: "About Us",
      label_ar: "عن العروبة",
      route: "/about",

        items: [
          {
            label :"Who We Are",
            label_ar :"من نحن",
          route:"/about/whoWeAre"
          },
          {
            label: "Certificates",
            label_ar: "الشهادات",
            route: "/about/certifications",
          },
          {
            label: "Product Types",
            label_ar: "أصناف المنتجات",
            route: "/about/ProductType",
          },
        ],

    },
    {
      label: "Brands",
      label_ar: "المنتجات",
      route: "/Brands",

      items: [
        {
          label: "Basma",
          label_ar: "بسمة",
          route: "/brands/Basma",
        },
        {
          label: "Farida",
          label_ar: "فريدة",
          route: "/brands/Farida",
        },
        {
          label: "Bab Bites",
          label_ar: "باببيتس",
          route: "/brands/Bab Pites",
        },
      ],
    },

    {

      label: "Export",
      label_ar: "التصدير",
      route:"/export"
    },
    {
      label: "Recipes",
      label_ar: "الوصفات",
      route:"Reciepe"
    },
    {
      label: "Contact Us",
      label_ar: "اتصل بنا",
      route:"ContactUs"
    },
    {
      label: "Careers",
      label_ar: "وظائف",
      route:"career"
    },
  ];
