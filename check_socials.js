const fs = require('fs');
const sql = fs.readFileSync('campcod3_eloroba.sql', 'utf8');
const rx = /CREATE TABLE `socials`(.*?);/gs;
const match = rx.exec(sql);
if (match) {
    console.log(match[0]);
} else {
    console.log("No socials table found");
}
