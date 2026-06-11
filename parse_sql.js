const fs = require('fs');

const sql = fs.readFileSync('recipes_insert.sql', 'utf8');
const cooksLine = sql.split('\n').find(l => l.startsWith('INSERT INTO `cooks`'));

if (!cooksLine) {
  console.log("No cooks line found");
  process.exit(1);
}

// Very simple regex to find the string values
// Note: This won't perfectly parse SQL but it might be enough to see Strawberry Cake
const c = cooksLine.match(/كيك الفراولة/g);
console.log("Found Arabic 'Strawberry Cake':", c ? c.length : 0);

// Let's find the values block containing 'كيك الفراولة'
const valuesMatches = cooksLine.match(/\([^)]*كيك الفراولة[^)]*\)/g);
if (valuesMatches) {
  valuesMatches.forEach(v => console.log(v));
} else {
  console.log("Values block not found for Strawberry Cake");
}

