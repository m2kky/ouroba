const fs = require('fs');
const sql = fs.readFileSync('campcod3_eloroba.sql', 'utf8');
const rx = /INSERT INTO `cook_props`(.*?);/gs;
let match = rx.exec(sql);
if (match) {
    console.log(match[0].substring(0, 1000));
} else {
    console.log("No cook_props found");
}
