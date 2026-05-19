const fs = require('fs');
const path = require('path');

const dashboardDir = path.join(__dirname, 'src', 'app', '[locale]', 'admin', '(dashboard)');

const fixes = [
  { search: 'في قسم "المكونات"', replace: 'في قسم \'المكونات\'' },
  { search: 'صفحة "من نحن"', replace: 'صفحة \'من نحن\'' },
  { search: 'قسم "من نحن"', replace: 'قسم \'من نحن\'' },
  { search: 'قسم "لماذا تختارنا"', replace: 'قسم \'لماذا تختارنا\'' },
  { search: 'صفحة "اتصل بنا"', replace: 'صفحة \'اتصل بنا\'' },
  { search: 'صفحة "الوظائف"', replace: 'صفحة \'الوظائف\'' },
  { search: 'صفحة "شركاء النجاح"', replace: 'صفحة \'شركاء النجاح\'' }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (file === 'page.tsx') {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const fix of fixes) {
        if (content.includes(fix.search)) {
          content = content.replace(new RegExp(fix.search.replace(/["\\/.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'g'), fix.replace);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed quotes in ${fullPath}`);
      }
    }
  }
}

processDir(dashboardDir);
console.log("Done fixing quotes.");
