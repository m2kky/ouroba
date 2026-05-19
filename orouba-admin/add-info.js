const fs = require('fs');
const path = require('path');

const dashboardDir = path.join(__dirname, 'src', 'app', '[locale]', 'admin', '(dashboard)');

const pageDescriptions = {
  'brands': 'إضافة وإدارة العلامات التجارية التي تملكها الشركة (مثل: العروبة، الخ). ترتبط بأقسام المنتجات والأنواع.',
  'categories': 'تصنيف المنتجات تحت علامة تجارية معينة لسهولة التصفح داخل الموقع. ترتبط بالعلامة التجارية والمنتجات.',
  'products': 'إدخال البيانات التفصيلية للمنتج (الاسم، الوصف، اللون، الترتيب). تظهر في صفحات عرض المنتجات وتفاصيلها.',
  'types': 'تصنيف أكثر دقة للمنتج داخل العلامة التجارية (مثل: عصائر، معلبات، إلخ) وتستخدم في فلاتر البحث.',
  'recipes': 'إنشاء وإدارة الوصفات وطرق الطبخ شاملة النصوص، مقاطع الفيديو، والصور. ترتبط بالمكونات والخطوات.',
  'foods': 'الأطعمة والمكونات المستخدمة في إعداد الوصفة. تظهر داخل صفحة تفاصيل الوصفة في قسم "المكونات".',
  'banners': 'إدارة اللافتات الدعائية (البانرات) والصور والفيديوهات الكبيرة التي تظهر أعلى الصفحة الرئيسية أو الصفحات الداخلية.',
  'certificates': 'إدارة وعرض شهادات الأيزو والجودة والمعايير التي تلتزم بها الشركة والتي تظهر غالباً في صفحة "من نحن".',
  'standards': 'نصوص وصور تعبر عن معايير الجودة التي تلتزم بها الشركة.',
  'values': 'النصوص التي تعبر عن رؤية الشركة وقيمها والتي تظهر في صفحة "من نحن" والصفحة الرئيسية.',
  'why-us': 'إدارة قسم "لماذا تختارنا" وأسباب تفضيل منتجات الشركة.',
  'buildings': 'توثيق وإظهار مباني الشركة ومصانعها والبنية التحتية.',
  'features': 'إدارة مميزات الشركة والمصانع وخطوط الإنتاج.',
  'contacts': 'صندوق الوارد لرسائل الزوار الواردة من صفحة "اتصل بنا". (مخصصة للإدارة)',
  'careers': 'طلبات التوظيف والسير الذاتية المقدمة من صفحة "الوظائف". (مخصصة لقسم الموارد البشرية)',
  'collaborates': 'طلبات الوكالات، التوزيع، أو الشراكات التجارية الواردة من صفحة "شركاء النجاح".',
  'popups': 'إنشاء وتصميم النوافذ المنبثقة (Popups) الإعلانية أو التنبيهات التي تظهر للمستخدم بناءً على شروط.',
  'settings': 'التحكم في الإعدادات العامة والثابتة للموقع (أرقام التواصل، السوشيال ميديا، وروابط الواتساب).',
  'continents': 'إدارة تواجد الشركة ومناطق التصدير وتوزيعها حسب القارات والدول.',
  'chat-menu': 'إدارة قائمة التنقل الآلية التي تظهر عند الضغط على أيقونة المساعدة (Chatbot) أسفل الشاشة.',
  'about': 'نصوص وصور قسم "من نحن" التعريفية وتاريخ الشركة.',
  'team': 'إدارة بيانات وصور فريق العمل أو الإدارة العليا للشركة.'
};

function processFile(filePath, description) {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('AdminPageInfo')) {
    console.log(`Skipping ${filePath}, already has AdminPageInfo`);
    return;
  }
  
  // Add import
  const importStatement = `import AdminPageInfo from "@/components/admin/AdminPageInfo";\n`;
  if (content.startsWith('"use client";')) {
    content = content.replace('"use client";', `"use client";\n${importStatement}`);
  } else {
    content = importStatement + content;
  }
  
  // Insert component
  const componentTag = `\n      <AdminPageInfo description="${description}" />\n`;
  // Usually the wrapper is <div className="space-y-6">
  content = content.replace('<div className="space-y-6">', `<div className="space-y-6">${componentTag}`);
  // Or sometimes it's just <div className="p-6"> or similar, but looking at brands and products it's space-y-6
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

const dirs = fs.readdirSync(dashboardDir);

for (const dir of dirs) {
  const fullPath = path.join(dashboardDir, dir, 'page.tsx');
  const description = pageDescriptions[dir];
  if (description && fs.existsSync(fullPath)) {
    processFile(fullPath, description);
  }
}

// Special case for subdirectories like recipes/categories
const recipesCategoriesPath = path.join(dashboardDir, 'recipes', 'categories', 'page.tsx');
if (fs.existsSync(recipesCategoriesPath)) {
  processFile(recipesCategoriesPath, 'تصنيف الوصفات إلى أقسام (مثل: حلويات، أطباق رئيسية) لسهولة فلترتها.');
}
