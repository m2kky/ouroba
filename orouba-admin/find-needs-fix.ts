import fs from 'fs';

const data = JSON.parse(fs.readFileSync('recipes-to-fix.json', 'utf-8'));
const needsFix = [];

for (const r of data) {
  const text = r.descAr || '';
  // Usually ingredients are listed with "كوب", "ملعقة", "كيس", "جرام", or numbers.
  // If the text starts directly with HTML list tags like <ol> or <ul>, it usually implies it's just steps.
  if (text.trim().startsWith('<ol>') || text.trim().startsWith('<ul>') || text.includes('لوريم')) {
    needsFix.push(r);
  }
}

console.log(`Found ${needsFix.length} recipes needing ingredients.`);
fs.writeFileSync('needs-fix.json', JSON.stringify(needsFix, null, 2));
