import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const sql = fs.readFileSync('../campcod3_eloroba.sql', 'utf8');
    
    console.log("Parsing cooks...");
    const regexCooks = /\((\d+),\s*'((?:[^'\\]|\\.)*)',\s*'((?:[^'\\]|\\.)*)',\s*'((?:[^'\\]|\\.)*)',\s*'((?:[^'\\]|\\.)*)'/g;
    let match;
    const cooks = [];
    while ((match = regexCooks.exec(sql)) !== null) {
        cooks.push({
            id: match[1],
            nameAr: match[2].replace(/\\'/g, "'").replace(/\\\\/g, "\\").replace(/\\n/g, "\n").replace(/\\r/g, "\r"),
            nameEn: match[3].replace(/\\'/g, "'").replace(/\\\\/g, "\\").replace(/\\n/g, "\n").replace(/\\r/g, "\r"),
            descriptionAr: match[4].replace(/\\'/g, "'").replace(/\\\\/g, "\\").replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\"/g, '"'),
            descriptionEn: match[5].replace(/\\'/g, "'").replace(/\\\\/g, "\\").replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\"/g, '"')
        });
    }
    console.log(`Parsed ${cooks.length} cooks.`);
    
    console.log("Parsing food_steps...");
    const regexSteps = /\((\d+),\s*'((?:[^'\\]|\\.)*)',\s*'((?:[^'\\]|\\.)*)',\s*(\d+)/g;
    const foodSteps = [];
    while ((match = regexSteps.exec(sql)) !== null) {
        foodSteps.push({
            id: match[1],
            stepAr: match[2].replace(/\\'/g, "'").replace(/\\\\/g, "\\").replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\"/g, '"'),
            stepEn: match[3].replace(/\\'/g, "'").replace(/\\\\/g, "\\").replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\"/g, '"'),
            cookId: match[4]
        });
    }
    console.log(`Parsed ${foodSteps.length} food_steps.`);
    
    let updatedCount = 0;
    
    for (const cook of cooks) {
        if (!cook.nameEn || cook.nameEn === 'name_en') continue;
        
        // Find matching recipe in new DB
        const recipe = await prisma.recipe.findFirst({
            where: {
                OR: [
                    { nameEn: cook.nameEn },
                    { nameAr: cook.nameAr }
                ]
            }
        });
        
        if (recipe) {
            console.log(`Updating Recipe: ${cook.nameEn}`);
            updatedCount++;
            
            await prisma.recipe.update({
                where: { id: recipe.id },
                data: {
                    descriptionAr: cook.descriptionAr || '',
                    descriptionEn: cook.descriptionEn || ''
                }
            });
            
            // Now update the ingredients (food_steps)
            const steps = foodSteps.filter(s => s.cookId === cook.id);
            
            if (steps.length > 0) {
                // Delete existing steps
                await prisma.recipeStep.deleteMany({
                    where: { recipeId: recipe.id }
                });
                
                for (const step of steps) {
                    const stepArHtml = step.stepAr || '';
                    const stepEnHtml = step.stepEn || '';
                    
                    const extractLis = (html: string) => {
                        if (!html) return [];
                        const matches = html.match(/<li[^>]*>(.*?)<\/li>/g);
                        if (!matches) return [];
                        return matches.map((m: string) => m.replace(/<li[^>]*>/, '').replace(/<\/li>/, '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim());
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
