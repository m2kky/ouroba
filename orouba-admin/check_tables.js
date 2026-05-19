const fs = require('fs');
const content = fs.readFileSync('orouba_db_dump.sql', 'utf16le');
const tables = [];
const regex = /CREATE TABLE public\."([^"]+)"/g;
let match;
while ((match = regex.exec(content)) !== null) {
  tables.push(match[1]);
}
console.log('Tables in orouba_db_dump.sql:', tables);
