import fs from 'fs';

function parseSqlInserts(sql: string, tableName: string) {
    const regex = new RegExp(`INSERT INTO \`${tableName}\` \\(.*?\\) VALUES\\s*([\\s\\S]*?);`, 'g');
    const matches = [];
    let match;
    while ((match = regex.exec(sql)) !== null) {
        const valuesStr = match[1];
        // We need to parse tuples (val1, 'val2', ...), (...)
        // A naive split by "),(" won't work perfectly if strings contain "),("
        // But let's try a simple state machine to extract tuples
        let inString = false;
        let escape = false;
        let tupleStart = -1;
        let tuples = [];
        
        for (let i = 0; i < valuesStr.length; i++) {
            const c = valuesStr[i];
            if (escape) {
                escape = false;
                continue;
            }
            if (c === '\\') {
                escape = true;
                continue;
            }
            if (c === "'") {
                inString = !inString;
                continue;
            }
            if (!inString) {
                if (c === '(') {
                    tupleStart = i;
                } else if (c === ')') {
                    if (tupleStart !== -1) {
                        tuples.push(valuesStr.substring(tupleStart + 1, i));
                        tupleStart = -1;
                    }
                }
            }
        }
        
        for (const t of tuples) {
            // naive split by comma outside quotes
            const fields = [];
            let fStart = 0;
            let inS = false;
            let esc = false;
            for (let j = 0; j < t.length; j++) {
                const char = t[j];
                if (esc) { esc = false; continue; }
                if (char === '\\') { esc = true; continue; }
                if (char === "'") { inS = !inS; continue; }
                if (!inS && char === ',') {
                    fields.push(t.substring(fStart, j).trim());
                    fStart = j + 1;
                }
            }
            fields.push(t.substring(fStart).trim());
            matches.push(fields.map(f => {
                if (f.startsWith("'") && f.endsWith("'")) {
                    return f.substring(1, f.length - 1).replace(/\\'/g, "'").replace(/\\\\/g, "\\").replace(/\\n/g, "\n");
                }
                return f;
            }));
        }
    }
    return matches;
}

const sql = fs.readFileSync('campcod3_eloroba.sql', 'utf8');

const cooks = parseSqlInserts(sql, 'cooks');
const foodSteps = parseSqlInserts(sql, 'food_steps');

console.log(`Parsed ${cooks.length} cooks and ${foodSteps.length} food_steps.`);

const strawberryCake = cooks.find(c => c[1] === 'كيك الفراولة' || c[2] === 'Strawberry Cake');
if (strawberryCake) {
    console.log("Found Strawberry Cake:", strawberryCake[2]);
    const cookId = strawberryCake[0];
    const steps = foodSteps.find(s => s[3] === cookId);
    if (steps) {
        console.log("Steps AR:", steps[1].substring(0, 100));
    }
}
