const fs = require('fs');
const path = require('path');

const dashboardDir = path.join(__dirname, 'src', 'app', '[locale]', 'admin', '(dashboard)');

const pageDescriptions = {
  'brands': "إضافة وإدارة العلامات التجارية التي تملكها الشركة (مثل: العروبة، الخ). ترتبط بأقسام المنتجات والأنواع.",
  'categories': "تصنيف المنتجات تحت علامة تجارية معينة لسهولة التصفح داخل الموقع. ترتبط بالعلامة التجارية والمنتجات.",
  'products': "إدخال البيانات التفصيلية للمنتج (الاسم، الوصف، اللون، الترتيب). تظهر في صفحات عرض المنتجات وتفاصيلها.",
  'types': "تصنيف أكثر دقة للمنتج داخل العلامة التجارية (مثل: عصائر، معلبات، إلخ) وتستخدم في فلاتر البحث.",
  'recipes': "إنشاء وإدارة الوصفات وطرق الطبخ شاملة النصوص، مقاطع الفيديو، والصور. ترتبط بالمكونات والخطوات.",
  'foods': "الأطعمة والمكونات المستخدمة في إعداد الوصفة. تظهر داخل صفحة تفاصيل الوصفة في قسم 'المكونات'.",
  'banners': "إدارة اللافتات الدعائية (البانرات) والصور والفيديوهات الكبيرة التي تظهر أعلى الصفحة الرئيسية أو الصفحات الداخلية.",
  'certificates': "إدارة وعرض شهادات الأيزو والجودة والمعايير التي تلتزم بها الشركة والتي تظهر غالباً في صفحة 'من نحن'.",
  'standards': "نصوص وصور تعبر عن معايير الجودة التي تلتزم بها الشركة.",
  'values': "النصوص التي تعبر عن رؤية الشركة وقيمها والتي تظهر في صفحة 'من نحن' والصفحة الرئيسية.",
  'why-us': "إدارة قسم 'لماذا تختارنا' وأسباب تفضيل منتجات الشركة.",
  'buildings': "توثيق وإظهار مباني الشركة ومصانعها والبنية التحتية.",
  'features': "إدارة مميزات الشركة والمصانع وخطوط الإنتاج.",
  'contacts': "صندوق الوارد لرسائل الزوار الواردة من صفحة 'اتصل بنا'. (مخصصة للإدارة)",
  'careers': "طلبات التوظيف والسير الذاتية المقدمة من صفحة 'الوظائف'. (مخصصة لقسم الموارد البشرية)",
  'collaborates': "طلبات الوكالات، التوزيع، أو الشراكات التجارية الواردة من صفحة 'شركاء النجاح'.",
  'popups': "إنشاء وتصميم النوافذ المنبثقة (Popups) الإعلانية أو التنبيهات التي تظهر للمستخدم بناءً على شروط.",
  'settings': "التحكم في الإعدادات العامة والثابتة للموقع (أرقام التواصل، السوشيال ميديا، وروابط الواتساب).",
  'continents': "إدارة تواجد الشركة ومناطق التصدير وتوزيعها حسب القارات والدول.",
  'chat-menu': "إدارة قائمة التنقل الآلية التي تظهر عند الضغط على أيقونة المساعدة (Chatbot) أسفل الشاشة.",
  'about': "نصوص وصور قسم 'من نحن' التعريفية وتاريخ الشركة.",
  'team': "إدارة بيانات وصور فريق العمل أو الإدارة العليا للشركة."
};

function fixFile(filePath, dir) {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  const safeDescription = pageDescriptions[dir];
  if(safeDescription) {
    const lines = content.split('\\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('<AdminPageInfo')) {
        lines[i] = "      <AdminPageInfo description={\\"" + safeDescription + "\\"} />";
      }
    }
    content = lines.join('\\n');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Fixed " + filePath);
}

const dirs = fs.readdirSync(dashboardDir);

for (const dir of dirs) {
  const fullPath = path.join(dashboardDir, dir, 'page.tsx');
  if (fs.existsSync(fullPath)) {
    fixFile(fullPath, dir);
  }
}

// Special case
const recipesCategoriesPath = path.join(dashboardDir, 'recipes', 'categories', 'page.tsx');
if (fs.existsSync(recipesCategoriesPath)) {
  let content = fs.readFileSync(recipesCategoriesPath, 'utf8');
  const lines = content.split('\\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<AdminPageInfo')) {
      lines[i] = "      <AdminPageInfo description=\\"تصنيف الوصفات إلى أقسام (مثل: حلويات، أطباق رئيسية) لسهولة فلترتها.\\" />";
    }
  }
  fs.writeFileSync(recipesCategoriesPath, lines.join('\\n'), 'utf8');
}
