const fs = require('fs');
const sql = fs.readFileSync('campcod3_eloroba.sql', 'utf8');

const target = 'كيس فانيليا';
const index = sql.indexOf(target);

if (index !== -1) {
  const start = Math.max(0, index - 200);
  const end = Math.min(sql.length, index + 200);
  console.log("Context:");
  console.log(sql.substring(start, end));
} else {
  console.log("Not found");
}
