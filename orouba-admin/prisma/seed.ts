import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.$transaction([
    prisma.recipeFood.deleteMany(),
    prisma.recipeCategoryFood.deleteMany(),
    prisma.recommendedRecipe.deleteMany(),
    prisma.recipeStep.deleteMany(),
    prisma.recipeProperty.deleteMany(),
    prisma.recipeImage.deleteMany(),
    prisma.recipe.deleteMany(),
    prisma.food.deleteMany(),
    prisma.recipeCategory.deleteMany(),
    prisma.categoryProduct.deleteMany(),
    prisma.productImage.deleteMany(),
    prisma.productSocial.deleteMany(),
    prisma.cartItem.deleteMany(),
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.product.deleteMany(),
    prisma.productType.deleteMany(),
    prisma.categoryTypeCategory.deleteMany(),
    prisma.category.deleteMany(),
    prisma.categoryType.deleteMany(),
    prisma.brand.deleteMany(),
    prisma.banner.deleteMany(),
    prisma.certificate.deleteMany(),
    prisma.standard.deleteMany(),
    prisma.value.deleteMany(),
    prisma.whyChooseUs.deleteMany(),
    prisma.building.deleteMany(),
    prisma.feature.deleteMany(),
    prisma.productionStep.deleteMany(),
    prisma.sectionText.deleteMany(),
    prisma.social.deleteMany(),
    prisma.socialParent.deleteMany(),
    prisma.country.deleteMany(),
    prisma.continent.deleteMany(),
    prisma.contactRequest.deleteMany(),
    prisma.careerRequest.deleteMany(),
    prisma.collaborateRequest.deleteMany(),
    prisma.siteSetting.deleteMany(),
    prisma.systemLog.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // ─── Admin ───
  const admin = await prisma.user.create({
    data: {
      email: "admin@oroubafoods.com",
      password: "$2b$12$EEUo6nYSbJElnVzVe8zVRetx0KVIzL4UCsWebsDEaXavrtyotXn9C", // bcrypt hash
      phone: "01276549343",
      name: "Admin",
      role: "ADMIN",
      permissions: ["*"],
    },
  });
  console.log("✅ Admin created");

  // ─── Import Original Data ───
  const fs = require('fs');
  const path = require('path');
  const dataPath = path.join(__dirname, '../original_data.json');
  let originalBrands = [];
  if (fs.existsSync(dataPath)) {
    originalBrands = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  }

  // ─── Product Types ───
  const typeFrozen = await prisma.productType.create({
    data: { nameEn: "Frozen", nameAr: "مجمد" },
  });
  const typeFresh = await prisma.productType.create({
    data: { nameEn: "Fresh", nameAr: "طازج" },
  });

  const categoryTypeDefault = await prisma.categoryType.create({
    data: {
      titleEn: "Products",
      titleAr: "المنتجات",
      descriptionEn: "All our products",
      descriptionAr: "كل منتجاتنا",
      image: "https://camp-coding.site/eloroba/storage/app/images/cooking-method.png",
      number: 1,
    },
  });

  console.log("✅ Category/Product Types created");

  for (const b of originalBrands) {
    const newBrand = await prisma.brand.create({
      data: {
        id: b.id.toString(), // The schema uses default CUID string
        nameAr: b.nameAr,
        nameEn: b.nameEn || b.nameAr,
        descriptionAr: "",
        descriptionEn: "",
        image: b.image || null,
        imageMain: b.image || null,
        colorBrand: "#ffffff",
        colorHover: "#eeeeee"
      }
    });

    for (const c of b.categories) {
      // Use first product image as category image if none
      let catImage = "";
      if (c.products && c.products.length > 0 && c.products[0].images && c.products[0].images.length > 0) {
        catImage = c.products[0].images[0].url;
      }

      const newCategory = await prisma.category.create({
        data: {
          id: c.id.toString(),
          nameAr: c.nameAr,
          nameEn: c.nameEn || c.nameAr,
          descriptionAr: "",
          descriptionEn: "",
          image: catImage,
          brandId: newBrand.id
        }
      });

      // Link to CategoryType
      await prisma.categoryTypeCategory.create({
        data: {
          categoryId: newCategory.id,
          categoryTypeId: categoryTypeDefault.id,
          image: catImage
        }
      });

      for (const p of c.products) {
        const newProduct = await prisma.product.create({
          data: {
            id: p.id.toString(),
            nameAr: p.nameAr,
            nameEn: p.nameEn || p.nameAr,
            descriptionAr: "",
            descriptionEn: "",
            color: "#ffffff",
            typeId: typeFrozen.id,
            images: {
              create: p.images.map((img: any) => ({ url: img.url }))
            },
            categories: {
              create: { categoryId: newCategory.id }
            }
          }
        });
      }
    }
  }

  console.log("✅ Brands, Categories, and Products created dynamically from original_data.json");

  // ─── Banners ───
  await prisma.banner.createMany({
    data: [
      {
        titleEn: "Orouba for Food Industry Co.",
        titleAr: "العروبة لصناعة الغذاء",
        type: "video",
        videoLink: "https://camp-coding.site/eloroba/storage/app/images/1.mp4",
        number: 1,
      },
      {
        titleEn: "Quality You Can Trust",
        titleAr: "جودة تثق بها",
        type: "image",
        image: "https://camp-coding.site/eloroba/storage/app/images/banner-2.png",
        number: 2,
      },
    ],
  });
  console.log("✅ Banners created (2)");

  // ─── Recipe Categories ───
  const recCat1 = await prisma.recipeCategory.create({
    data: { nameEn: "Main Dishes", nameAr: "أطباق رئيسية", number: 1 },
  });
  const recCat2 = await prisma.recipeCategory.create({
    data: { nameEn: "Appetizers", nameAr: "مقبلات", number: 2 },
  });
  console.log("✅ Recipe Categories created (2)");

  // ─── Recipes ───
  const recipe1 = await prisma.recipe.create({
    data: {
      nameEn: "Crispy Chicken Nuggets Recipe",
      nameAr: "وصفة ناجتس الدجاج المقرمش",
      descriptionEn: "Learn how to make the crispiest chicken nuggets at home.",
      descriptionAr: "تعلم كيف تصنع أكثر ناجتس الدجاج قرمشة في المنزل.",
      videoLink: "https://www.youtube.com/watch?v=example",
      internalImage: "https://camp-coding.site/eloroba/storage/app/images/recipe-nuggets.png",
      number: 1,
      properties: {
        create: [
          { titleEn: "Prep Time", titleAr: "وقت التحضير", textEn: "15 min", textAr: "15 دقيقة", icon: "⏱" },
          { titleEn: "Cook Time", titleAr: "وقت الطهي", textEn: "20 min", textAr: "20 دقيقة", icon: "🔥" },
          { titleEn: "Servings", titleAr: "الحصص", textEn: "4 servings", textAr: "4 حصص", icon: "🍽" },
        ],
      },
      steps: {
        create: [
          { stepEn: "Preheat oven to 200°C.", stepAr: "سخن الفرن على 200 درجة مئوية." },
          { stepEn: "Place nuggets on baking tray.", stepAr: "ضع الناجتس على صينية الخبز." },
          { stepEn: "Bake for 15-20 minutes until golden.", stepAr: "اخبز لمدة 15-20 دقيقة حتى يصبح ذهبياً." },
        ],
      },
      images: {
        create: [
          { url: "https://camp-coding.site/eloroba/storage/app/images/recipe-nuggets-1.png" },
        ],
      },
    },
  });

  // Link recipe to product
  const firstProduct = await prisma.product.findFirst();
  if (firstProduct) {
    await prisma.recommendedRecipe.create({
      data: { productId: firstProduct.id, recipeId: recipe1.id },
    });
  }
  console.log("✅ Recipes created (1)");

  // ─── Food Items ───
  const food1 = await prisma.food.create({
    data: { nameEn: "Chicken Nuggets", nameAr: "ناجتس دجاج", image: "https://camp-coding.site/eloroba/storage/app/images/nuggets-1.png", number: 1 },
  });
  const food2 = await prisma.food.create({
    data: { nameEn: "Flour", nameAr: "دقيق", number: 2 },
  });

  await prisma.recipeFood.create({ data: { recipeId: recipe1.id, foodId: food1.id } });
  await prisma.recipeCategoryFood.create({ data: { recipeCategoryId: recCat1.id, foodId: food1.id } });
  console.log("✅ Food items created (2)");

  // ─── Category Types ───
  await prisma.categoryType.create({
    data: {
      titleEn: "By Cooking Method",
      titleAr: "حسب طريقة الطهي",
      descriptionEn: "Browse products by cooking method",
      descriptionAr: "تصفح المنتجات حسب طريقة الطهي",
      image: "https://camp-coding.site/eloroba/storage/app/images/cooking-method.png",
      number: 1,
    },
  });
  console.log("✅ Category Types created (1)");

  // ─── Certificates ───
  await prisma.certificate.createMany({
    data: [
      { image: "https://camp-coding.site/eloroba/storage/app/images/cert-iso.png" },
      { image: "https://camp-coding.site/eloroba/storage/app/images/cert-halal.png" },
      { image: "https://camp-coding.site/eloroba/storage/app/images/cert-haccp.png" },
    ],
  });
  console.log("✅ Certificates created (3)");

  // ─── Standards ───
  await prisma.standard.createMany({
    data: [
      {
        descriptionEn: "ISO 22000 certified food safety management system.",
        descriptionAr: "نظام إدارة سلامة الغذاء معتمد بشهادة ISO 22000.",
        image: "https://camp-coding.site/eloroba/storage/app/images/standard-iso.png",
      },
      {
        descriptionEn: "HACCP compliant production lines.",
        descriptionAr: "خطوط إنتاج متوافقة مع نظام HACCP.",
        image: "https://camp-coding.site/eloroba/storage/app/images/standard-haccp.png",
      },
    ],
  });
  console.log("✅ Standards created (2)");

  // ─── Values ───
  await prisma.value.createMany({
    data: [
      { titleEn: "Quality", titleAr: "الجودة", descriptionEn: "We maintain the highest quality standards.", descriptionAr: "نحافظ على أعلى معايير الجودة.", image: "https://camp-coding.site/eloroba/storage/app/images/value-quality.png" },
      { titleEn: "Innovation", titleAr: "الابتكار", descriptionEn: "Continuous innovation in food production.", descriptionAr: "ابتكار مستمر في إنتاج الغذاء.", image: "https://camp-coding.site/eloroba/storage/app/images/value-innovation.png" },
      { titleEn: "Integrity", titleAr: "النزاهة", descriptionEn: "We operate with integrity and transparency.", descriptionAr: "نعمل بنزاهة وشفافية.", image: "https://camp-coding.site/eloroba/storage/app/images/value-integrity.png" },
    ],
  });
  console.log("✅ Values created (3)");

  // ─── Why Choose Us ───
  await prisma.whyChooseUs.createMany({
    data: [
      { descriptionEn: "Over 30 years of experience in food industry.", descriptionAr: "أكثر من 30 عاماً من الخبرة في صناعة الغذاء." },
      { descriptionEn: "Exported to over 40 countries worldwide.", descriptionAr: "نُصدّر لأكثر من 40 دولة حول العالم." },
      { descriptionEn: "State-of-the-art production facilities.", descriptionAr: "مرافق إنتاج بأحدث التقنيات." },
    ],
  });
  console.log("✅ WhyChooseUs created (3)");

  // ─── Buildings ───
  await prisma.building.createMany({
    data: [
      { titleEn: "Main Factory", titleAr: "المصنع الرئيسي", descriptionEn: "Our main production facility.", descriptionAr: "مرفق الإنتاج الرئيسي لدينا.", image: "https://camp-coding.site/eloroba/storage/app/images/building-main.png" },
      { titleEn: "Cold Storage", titleAr: "التخزين البارد", descriptionEn: "Advanced cold storage warehouses.", descriptionAr: "مستودعات تخزين بارد متطورة.", image: "https://camp-coding.site/eloroba/storage/app/images/building-cold.png" },
    ],
  });
  console.log("✅ Buildings created (2)");

  // ─── Features ───
  await prisma.feature.createMany({
    data: [
      { titleEn: "Automated Production", titleAr: "إنتاج آلي", descriptionEn: "Fully automated production lines.", descriptionAr: "خطوط إنتاج مؤتمتة بالكامل.", image: "https://camp-coding.site/eloroba/storage/app/images/feature-auto.png" },
      { titleEn: "Quality Control", titleAr: "مراقبة الجودة", descriptionEn: "Multi-stage quality control process.", descriptionAr: "عملية مراقبة جودة متعددة المراحل.", image: "https://camp-coding.site/eloroba/storage/app/images/feature-qc.png" },
    ],
  });
  console.log("✅ Features created (2)");

  // ─── Continents & Countries ───
  const africa = await prisma.continent.create({ data: { nameEn: "Africa", nameAr: "أفريقيا" } });
  const asia = await prisma.continent.create({ data: { nameEn: "Asia", nameAr: "آسيا" } });
  const europe = await prisma.continent.create({ data: { nameEn: "Europe", nameAr: "أوروبا" } });

  await prisma.country.createMany({
    data: [
      { nameEn: "Egypt", nameAr: "مصر", continentId: africa.id },
      { nameEn: "Libya", nameAr: "ليبيا", continentId: africa.id },
      { nameEn: "Saudi Arabia", nameAr: "المملكة العربية السعودية", continentId: asia.id },
      { nameEn: "UAE", nameAr: "الإمارات", continentId: asia.id },
      { nameEn: "Germany", nameAr: "ألمانيا", continentId: europe.id },
    ],
  });
  console.log("✅ Continents (3) & Countries (5) created");

  // ─── Production Steps ───
  await prisma.productionStep.createMany({
    data: [
      { textEn: "Raw material selection and inspection", textAr: "اختيار وفحص المواد الخام", number: 1, image: "https://camp-coding.site/eloroba/storage/app/images/step-1.png" },
      { textEn: "Processing and preparation", textAr: "المعالجة والتحضير", number: 2, image: "https://camp-coding.site/eloroba/storage/app/images/step-2.png" },
      { textEn: "Quality testing and packaging", textAr: "اختبار الجودة والتعبئة", number: 3, image: "https://camp-coding.site/eloroba/storage/app/images/step-3.png" },
    ],
  });
  console.log("✅ Production Steps created (3)");

  // ─── Site Settings ───
  await prisma.siteSetting.createMany({
    data: [
      { key: "site_title", valueEn: "Orouba Foods", valueAr: "العروبة للأغذية" },
      { key: "site_description", valueEn: "Leading food industry company", valueAr: "شركة رائدة في صناعة الغذاء" },
      { key: "phone", valueEn: "+20 123 456 7890", valueAr: "+20 123 456 7890" },
      { key: "email", valueEn: "info@oroubafoods.com", valueAr: "info@oroubafoods.com" },
      { key: "address", valueEn: "10th of Ramadan City, Egypt", valueAr: "مدينة العاشر من رمضان، مصر" },
      { key: "about_text", valueEn: "Orouba for Food Industry is one of the leading companies in the food manufacturing sector in Egypt and the Middle East.", valueAr: "العروبة لصناعة الغذاء هي إحدى الشركات الرائدة في قطاع التصنيع الغذائي في مصر والشرق الأوسط." },
    ],
  });
  console.log("✅ Site Settings created (6)");

  // ─── Socials ───
  await prisma.social.createMany({
    data: [
      { link: "https://facebook.com/oroubafoods", image: "https://camp-coding.site/eloroba/storage/app/images/facebook.png" },
      { link: "https://instagram.com/oroubafoods", image: "https://camp-coding.site/eloroba/storage/app/images/instagram.png" },
      { link: "https://youtube.com/oroubafoods", image: "https://camp-coding.site/eloroba/storage/app/images/youtube.png" },
    ],
  });
  console.log("✅ Socials created (3)");

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
