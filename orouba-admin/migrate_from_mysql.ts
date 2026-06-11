import mysql from 'mysql2/promise';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'campcod3_eloroba'
        });
        console.log("Connected to MySQL with root!");
    } catch (e: any) {
        console.log("Failed with root, trying campcod3_eloroba user...");
        try {
            connection = await mysql.createConnection({
                host: '127.0.0.1',
                user: 'campcod3_eloroba',
                password: 'eloroba_market',
                database: 'campcod3_eloroba'
            });
            console.log("Connected to MySQL with campcod3_eloroba!");
        } catch (err: any) {
            console.error("Failed to connect to MySQL database:", err.message);
            return;
        }
    }
    
    // Fetch cooks
    const [cooksRowsResult] = await connection.execute('SELECT * FROM cooks');
    const cooksRows = cooksRowsResult as any[];
    console.log(`Fetched ${cooksRows.length} cooks.`);
    
    // Fetch food_steps
    const [stepsRowsResult] = await connection.execute('SELECT * FROM food_steps');
    const stepsRows = stepsRowsResult as any[];
    console.log(`Fetched ${stepsRows.length} food_steps.`);
    
    let updatedCount = 0;
    
    for (const cook of cooksRows) {
        const nameAr = cook.name_ar;
        const nameEn = cook.name_en;
        const descriptionAr = cook.description_ar;
        const descriptionEn = cook.description_en;
        
        if (!nameEn) continue;
        
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
            const steps = stepsRows.filter((s: any) => s.cook_id === cook.id);
            
            if (steps.length > 0) {
                // Delete existing steps
                await prisma.recipeStep.deleteMany({
                    where: { recipeId: recipe.id }
                });
                
                for (const step of steps) {
                    const stepArHtml = step.step_ar || '';
                    const stepEnHtml = step.step_en || '';
                    
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
    
    await connection.end();
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
