const fs = require('fs');

const sql = fs.readFileSync('../campcod3_eloroba.sql', 'utf8');
const cooksInsertStart = sql.indexOf('INSERT INTO `cooks`');
const nextInsertStart = sql.indexOf('INSERT INTO', cooksInsertStart + 20);
const cooksSql = sql.substring(cooksInsertStart, nextInsertStart !== -1 ? nextInsertStart : sql.length);

const recipes = [];
// More robust parsing: look for internal_image which is the second to last value.
// We can use a regex to match the pattern: `(id, 'name_ar', 'name_en', ..., 'video_link', 'internal_image', number)`
// In SQL, strings are escaped. Let's just find `name_en` and `internal_image` using a global match.
// Notice that name_en is the 3rd column, internal_image is the 10th.

// A regex that matches `(id, 'name_ar', 'name_en', `
const rowStartRegex = /\(\d+,\s*'((?:[^'\\]|\\.)*)',\s*'((?:[^'\\]|\\.)*)',/g;

let match;
while ((match = rowStartRegex.exec(cooksSql)) !== null) {
    const name_ar = match[1];
    const name_en = match[2];
    
    // Find the next image url after this start
    // Usually it's in the same row
    const restOfSql = cooksSql.substring(match.index);
    const imageMatch = restOfSql.match(/'(https:\/\/camp-coding\.site\/eloroba\/storage\/app\/images\/[^']+)'/);
    
    if (imageMatch) {
        recipes.push({
            name_en: name_en,
            name_ar: name_ar,
            image_url: imageMatch[1]
        });
    }
}

console.log(`Found ${recipes.length} recipes with images.`);
fs.writeFileSync('recipes_to_download.json', JSON.stringify(recipes, null, 2));
