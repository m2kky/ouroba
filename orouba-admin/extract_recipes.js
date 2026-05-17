const fs = require('fs');

const sql = fs.readFileSync('orouba_db_dump_utf8_correct.sql', 'utf8');

// Find all INSERTS for recipes
const recipesMatch = sql.match(/INSERT INTO public\."Recipe" \("id", "nameEn", "nameAr".*?VALUES \((.*?)\);/g);
const recipes = recipesMatch ? recipesMatch.map(match => {
  return match;
}) : [];

fs.writeFileSync('recipes_extracted.json', JSON.stringify({
  recipes: recipes,
  count: recipes.length
}, null, 2));

console.log(`Extracted ${recipes.length} recipes.`);
