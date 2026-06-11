const fs = require('fs');
const sql = fs.readFileSync('campcod3_eloroba.sql', 'utf8');

const regexCooks = /\((\d+),\s*'((?:[^'\\]|\\.)*)',\s*'((?:[^'\\]|\\.)*)',\s*'((?:[^'\\]|\\.)*)',\s*'((?:[^'\\]|\\.)*)'/g;
let match;
let count = 0;
while ((match = regexCooks.exec(sql)) !== null) {
    if (match[3].includes('Strawberry Cake')) {
        console.log('Found:', match[3]);
        console.log('Ar:', match[2]);
        console.log('Desc En:', match[5].substring(0, 50));
    }
    count++;
}
console.log('Total cooks matched:', count);

const regexSteps = /\((\d+),\s*'((?:[^'\\]|\\.)*)',\s*'((?:[^'\\]|\\.)*)',\s*(\d+)/g;
count = 0;
while ((match = regexSteps.exec(sql)) !== null) {
    if (match[4] === '33') { // 33 is Strawberry Cake
        console.log('Step 33:', match[2].substring(0, 50));
    }
    count++;
}
console.log('Total steps matched:', count);
