const fs = require('fs');
const sql = fs.readFileSync('campcod3_eloroba.sql', 'utf8');

const target = 'Strawberry Cake';
const index = sql.indexOf(target);

if (index !== -1) {
  // Grab a chunk of text around the match to see the context
  const start = Math.max(0, index - 2000);
  const end = Math.min(sql.length, index + 2000);
  console.log("Context:");
  console.log(sql.substring(start, end));
} else {
  console.log("Not found");
}
