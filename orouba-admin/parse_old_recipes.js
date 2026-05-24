const fs = require('fs');
const path = require('path');

const sql = fs.readFileSync('../campcod3_eloroba.sql', 'utf8');
const cooksInsertStart = sql.indexOf('INSERT INTO `cooks`');
const nextInsertStart = sql.indexOf('INSERT INTO', cooksInsertStart + 20);
const cooksSql = sql.substring(cooksInsertStart, nextInsertStart !== -1 ? nextInsertStart : sql.length);

const recipesMap = {};

// We can extract each tuple
// Tuple starts with '(' and ends with ')' but values can contain ')'
// Since we only care about name_en and the URLs, we can use regex to find them.
// Format is roughly: (id, 'name_ar', 'name_en', 'desc_ar', 'desc_en', hidden, 'created', 'updated', 'video_link', 'internal_image', number)

const tupleRegex = /\(\d+,\s*'([^']*)',\s*'([^']*)',(.*?),\s*'([^']*)',\s*'([^']*)',\s*\d+\)/g;

let match;
let count = 0;
// We'll iterate manually because descriptions have commas and quotes
// Let's use a simpler approach: split by `\n(` to get rows
const rows = cooksSql.split(/\n\s*\(/);
for (let i = 1; i < rows.length; i++) { // Skip the first element which is the INSERT INTO part
    const rowStr = '(' + rows[i];
    // Find name_ar, name_en which are the 2nd and 3rd elements
    // The safest way is to evaluate it as an array if we replace NULL with null and remove the trailing ), or );
    // Actually, we can just extract all string literals
    const strings = [];
    const stringRegex = /'((?:[^'\\]|\\.)*)'/g;
    let sMatch;
    while ((sMatch = stringRegex.exec(rowStr)) !== null) {
        strings.push(sMatch[1]);
    }
    
    // In our schema: (id, name_ar, name_en, desc_ar, desc_en, hidden, created, updated, video_link, internal_image, number)
    // Strings would be: 
    // 0: name_ar
    // 1: name_en
    // 2: desc_ar
    // 3: desc_en
    // 4: created_at
    // 5: updated_at
    // 6: video_link
    // 7: internal_image
    
    if (strings.length >= 8) {
        const name_en = strings[1];
        const video_link = strings[6];
        const internal_image = strings[7];
        
        recipesMap[name_en] = {
            video_link: video_link,
            internal_image: internal_image
        };
        count++;
    }
}

console.log(`Parsed ${count} recipes from old DB.`);
fs.writeFileSync('parsed_old_recipes.json', JSON.stringify(recipesMap, null, 2));
