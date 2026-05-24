const fs = require('fs');

const sql = fs.readFileSync('../campcod3_eloroba.sql', 'utf8');

// Find all occurrences of camp-coding.site/eloroba/storage/app/images in the cooks insert
const cooksInsertStart = sql.indexOf('INSERT INTO `cooks`');
const nextInsertStart = sql.indexOf('INSERT INTO', cooksInsertStart + 20);

const cooksSql = sql.substring(cooksInsertStart, nextInsertStart !== -1 ? nextInsertStart : sql.length);

const imageRegex = /https:\/\/camp-coding\.site\/eloroba\/storage\/app\/images\/[^'"\s]+\.(?:jpg|png|jpeg|webp)/g;
const imageUrls = [...new Set(cooksSql.match(imageRegex))];

console.log('Found', imageUrls.length, 'unique images in cooks table.');

fs.writeFileSync('cook_image_urls.json', JSON.stringify(imageUrls, null, 2));
