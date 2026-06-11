const fs = require('fs');
const sql = fs.readFileSync('campcod3_eloroba.sql', 'utf8');
const target = 'كيس فانيليا';
const index = sql.indexOf(target);
const textBefore = sql.substring(0, index);
const lastInsert = textBefore.lastIndexOf('INSERT INTO');
console.log(sql.substring(lastInsert, lastInsert + 100));
