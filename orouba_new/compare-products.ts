import postgres from 'postgres';
import * as fs from 'fs';

// Replace these with your actual database URLs or set them as environment variables
const OLD_DB_URL = process.env.OLD_DB_URL || 'postgresql://username:password@old_host:5432/old_db';
const NEW_DB_URL = process.env.NEW_DB_URL || 'postgresql://username:password@new_host:5432/new_db';

async function compareDatabases() {
  if (OLD_DB_URL.includes('old_host') || NEW_DB_URL.includes('new_host')) {
    console.warn('⚠️ Please provide actual database URLs either by modifying the script or setting OLD_DB_URL and NEW_DB_URL environment variables.');
    console.log('Example: OLD_DB_URL="postgres://..." NEW_DB_URL="postgres://..." npx tsx compare-products.ts\n');
  }

  const sqlOld = postgres(OLD_DB_URL);
  const sqlNew = postgres(NEW_DB_URL);

  try {
    console.log('Fetching products from old database...');
    const oldProducts = await sqlOld`SELECT id, "nameEn", "nameAr", "descriptionEn", "descriptionAr" FROM "Product"`;
    
    console.log('Fetching products from new database...');
    const newProducts = await sqlNew`SELECT id, "nameEn", "nameAr", "descriptionEn", "descriptionAr" FROM "Product"`;

    const newProductsMap = new Map();
    for (const p of newProducts) {
      newProductsMap.set(p.id, p);
    }

    let differencesCount = 0;
    const differences = [];

    console.log('\n--- Comparing Product Descriptions ---\n');

    for (const oldProd of oldProducts) {
      const newProd = newProductsMap.get(oldProd.id);

      if (!newProd) {
        differences.push({ id: oldProd.id, issue: 'Product missing in NEW database', name: oldProd.nameAr || oldProd.nameEn });
        continue;
      }

      let hasDiff = false;
      const diffObj: any = {
        id: oldProd.id,
        nameAr: oldProd.nameAr,
        nameEn: oldProd.nameEn,
      };

      if (oldProd.descriptionAr !== newProd.descriptionAr) {
        hasDiff = true;
        diffObj.descriptionAr = { old: oldProd.descriptionAr, new: newProd.descriptionAr };
      }

      if (oldProd.descriptionEn !== newProd.descriptionEn) {
        hasDiff = true;
        diffObj.descriptionEn = { old: oldProd.descriptionEn, new: newProd.descriptionEn };
      }

      if (hasDiff) {
        differencesCount++;
        differences.push(diffObj);
        console.log(`❌ Difference found in product: [${oldProd.id}] ${oldProd.nameAr} / ${oldProd.nameEn}`);
        if (diffObj.descriptionAr) {
          console.log(`   🔸 Arabic Description:`);
          console.log(`      Old: ${diffObj.descriptionAr.old}`);
          console.log(`      New: ${diffObj.descriptionAr.new}`);
        }
        if (diffObj.descriptionEn) {
          console.log(`   🔸 English Description:`);
          console.log(`      Old: ${diffObj.descriptionEn.old}`);
          console.log(`      New: ${diffObj.descriptionEn.new}`);
        }
        console.log('');
      }
    }

    console.log(`\n✅ Comparison complete! Found differences in ${differencesCount} products.`);
    
    // Optionally save to file
    fs.writeFileSync('product-differences.json', JSON.stringify(differences, null, 2));
    console.log('Saved detailed differences to product-differences.json');

  } catch (err) {
    console.error('Error during comparison:', err);
  } finally {
    await sqlOld.end();
    await sqlNew.end();
  }
}

compareDatabases();
