const fs = require('fs');
const sql = fs.readFileSync('campcod3_eloroba.sql', 'utf8');

console.log("=== social_parents ===");
const rxP = /INSERT INTO `social_parents`(.*?);/gs;
let matchP;
while ((matchP = rxP.exec(sql)) !== null) {
    console.log(matchP[0].substring(0, 1000));
}

console.log("\n=== socials ===");
const rxS = /INSERT INTO `socials`(.*?);/gs;
let matchS;
while ((matchS = rxS.exec(sql)) !== null) {
    console.log(matchS[0].substring(0, 1000));
}
