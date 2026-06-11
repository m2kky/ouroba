const fs = require('fs');
const content = fs.readFileSync('campcod3_eloroba.sql', 'utf8');
const inserts = content.split('\n').filter(l => l.includes('INSERT INTO `cooks`') || l.includes('INSERT INTO `recipes`') || l.includes('INSERT INTO `cook_steps`') || l.includes('INSERT INTO `cook_ingredients`') || l.includes('INSERT INTO `food_cooks`') || l.includes('INSERT INTO `foods`'));
fs.writeFileSync('recipes_insert.sql', inserts.join('\n'));
console.log('Found inserts:', inserts.length);
