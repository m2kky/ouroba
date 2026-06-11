import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function parseTableRows(sql: string, tableName: string) {
    const records = [];
    const searchString = `INSERT INTO \`${tableName}\``;
    
    let currentIndex = 0;
    while (true) {
        const startIdx = sql.indexOf(searchString, currentIndex);
        if (startIdx === -1) break;
        
        const endIdx = sql.indexOf(';', startIdx);
        if (endIdx === -1) break;
        
        const statement = sql.substring(startIdx, endIdx);
        currentIndex = endIdx + 1;
        
        const valuesIndex = statement.indexOf('VALUES');
        if (valuesIndex === -1) continue;
        
        const valuesStr = statement.substring(valuesIndex + 6);
        
        // Process the buffer
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
            records.push(fields.map(f => {
                if (f.startsWith("'") && f.endsWith("'")) {
                    return f.substring(1, f.length - 1).replace(/\\'/g, "'").replace(/\\\\/g, "\\").replace(/\\n/g, "\n").replace(/\\r/g, "\r");
                }
                return f === 'NULL' ? null : f;
            }));
        }
    }
    
    return records;
}

async function main() {
    const sql = fs.readFileSync('../campcod3_eloroba.sql', 'utf8');
    
    console.log("Parsing cooks...");
    const cooks = parseTableRows(sql, 'cooks');
    console.log(`Parsed ${cooks.length} cooks.`);
    
    console.log("Parsing food_steps (ingredients)...");
    const foodSteps = parseTableRows(sql, 'food_steps');
    console.log(`Parsed ${foodSteps.length} food_steps.`);
    
    let updatedCount = 0;
    
    for (const cook of cooks) {
        const oldId = cook[0];
        const nameAr = cook[1];
        const nameEn = cook[2];
        const descriptionAr = cook[3];
        const descriptionEn = cook[4];
        
        if (!nameEn || nameEn === 'name_en') continue; // skip header or empty
        
        // Find matching recipe in new DB
        const recipe = await prisma.recipe.findFirst({
            where: {
                OR: [
                    { nameEn: nameEn },
                    { nameAr: nameAr }
                ]
            }
        });
        
        if (recipe) {
            console.log(`Updating Recipe: ${nameEn}`);
            updatedCount++;
            
            await prisma.recipe.update({
                where: { id: recipe.id },
                data: {
                    descriptionAr: descriptionAr || '',
                    descriptionEn: descriptionEn || ''
                }
            });
            
            // Now update the ingredients (food_steps)
            const steps = foodSteps.filter(s => s[3] === oldId);
            
            if (steps.length > 0) {
                // Delete existing steps
                await prisma.recipeStep.deleteMany({
                    where: { recipeId: recipe.id }
                });
                
                for (const step of steps) {
                    const stepArHtml = step[1] || '';
                    const stepEnHtml = step[2] || '';
                    
                    const extractLis = (html: string) => {
                        if (!html) return [];
                        const matches = html.match(/<li[^>]*>(.*?)<\/li>/g);
                        if (!matches) return [];
                        return matches.map((m: string) => m.replace(/<li[^>]*>/, '').replace(/<\/li>/, '').replace(/<[^>]*>/g, '').trim());
                    };
                    
                    const arItems = extractLis(stepArHtml);
                    const enItems = extractLis(stepEnHtml);
                    
                    const count = Math.max(arItems.length, enItems.length);
                    
                    for (let i = 0; i < count; i++) {
                        const sAr = arItems[i] || '';
                        const sEn = enItems[i] || '';
                        
                        if (sAr || sEn) {
                            await prisma.recipeStep.create({
                                data: {
                                    recipeId: recipe.id,
                                    stepAr: sAr,
                                    stepEn: sEn
                                }
                            });
                        }
                    }
                }
            }
        }
    }
    console.log(`Total recipes updated: ${updatedCount}`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
