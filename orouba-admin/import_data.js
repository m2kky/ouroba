const axios = require('axios');
const fs = require('fs');

const BASE_URL = 'https://camp-coding.site/eloroba/api';

async function importData() {
  console.log('Fetching brands...');
  const brandsRes = await axios.get(`${BASE_URL}/brands/get_for_user`);
  let brands = brandsRes.data.result;
  
  const finalBrands = [];
  
  for (const brand of brands) {
    console.log(`Fetching categories for brand ${brand.name_ar}...`);
    const catRes = await axios.get(`${BASE_URL}/brands/brand_categories/${brand.id}`);
    const categories = catRes.data.result || [];
    
    const finalCategories = [];
    for (const cat of categories) {
      console.log(`  Fetching products for category ${cat.name_ar}...`);
      const prodRes = await axios.get(`${BASE_URL}/categories/category_products/${cat.id}`);
      const products = prodRes.data.result || [];
      
      finalCategories.push({
        id: cat.id,
        nameAr: cat.name_ar,
        nameEn: cat.name_en,
        products: products.map(p => ({
          id: p.id,
          nameAr: p.name_ar,
          nameEn: p.name_en,
          images: p.images || []
        }))
      });
    }
    
    finalBrands.push({
      id: brand.id,
      nameAr: brand.name_ar,
      nameEn: brand.name_en,
      image: brand.image,
      categories: finalCategories
    });
  }
  
  fs.writeFileSync('original_data.json', JSON.stringify(finalBrands, null, 2));
  console.log('Successfully exported to original_data.json');
}

importData().catch(console.error);
