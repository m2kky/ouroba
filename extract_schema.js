const fs = require('fs');

const sql = fs.readFileSync('campcod3_eloroba.sql', 'utf8');
const tablesToFind = [
  'cook_props', 'cook_images', 'food', 'food_cooks', 'food_steps', 
  'product_images', 'recipe_foods', 'recommend_recipes', 'types', 
  'social_parents', 'category_type_categories', 'logs',
  'categories', 'category_types', 'category_products', 'products', 'cooks', 'recipes', 'standers', 'contiries'
];

let output = '';

tablesToFind.forEach(table => {
  const regex = new RegExp(`CREATE TABLE \\\`${table}\\\` \\([\\s\\S]*?\\) ENGINE=`, 'm');
  const match = sql.match(regex);
  if (match) {
    output += match[0] + '\n\n';
  } else {
    output += `Table ${table} not found\n\n`;
  }
});

fs.writeFileSync('schema_extract.txt', output);
console.log('Schema extracted to schema_extract.txt');
