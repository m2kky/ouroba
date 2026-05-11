const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const urls = [
  // Farida
  { brand: '7', category: '4', name: 'الخضروات المجمدة', url: 'https://oroubafoods.com/Brands/%D9%81%D8%B1%D9%8A%D8%AF%D8%A9/7/4/%D8%A7%D9%84%D8%AE%D8%B6%D8%B1%D9%88%D8%A7%D8%AA%20%D8%A7%D9%84%D9%85%D8%AC%D9%85%D8%AF%D8%A9/ar' },
  { brand: '7', category: '5', name: 'الفواكه المجمدة', url: 'https://oroubafoods.com/Brands/%D9%81%D8%B1%D9%8A%D8%AF%D8%A9/7/5/%D8%A7%D9%84%D9%81%D9%88%D8%A7%D9%83%D9%87%20%D8%A7%D9%84%D9%85%D8%AC%D9%85%D8%AF%D8%A9/ar' },
  { brand: '7', category: '6', name: 'فلافل مجمدة', url: 'https://oroubafoods.com/Brands/%D9%81%D8%B1%D9%8A%D8%AF%D8%A9/7/6/%D9%81%D9%84%D8%A7%D9%81%D9%84%20%D9%85%D8%AC%D9%85%D8%AF%D8%A9/ar?q=4' },
  { brand: '7', category: '7', name: 'بقوليات وحبوب مجمدة', url: 'https://oroubafoods.com/Brands/%D9%81%D8%B1%D9%8A%D8%AF%D8%A9/7/7/%D8%A8%D9%82%D9%88%D9%84%D9%8A%D8%A7%D8%AA%20%D9%88%D8%AD%D8%A8%D9%88%D8%A8%20%D9%85%D8%AC%D9%85%D8%AF%D8%A9/ar' },
  // Basma
  { brand: '5', category: '11', name: 'الخضار والفواكه المجمدة', url: 'https://oroubafoods.com/Brands/%D8%A8%D8%B3%D9%85%D8%A9/5/11/%D8%A7%D9%84%D8%AE%D8%B6%D8%A7%D8%B1%20%D9%88%D8%A7%D9%84%D9%81%D9%88%D8%A7%D9%83%D9%87%20%D8%A7%D9%84%D9%85%D8%AC%D9%85%D8%AF%D8%A9/ar' },
  { brand: '5', category: '13', name: 'بقوليات وحبوب مجمدة', url: 'https://oroubafoods.com/Brands/%D8%A8%D8%B3%D9%85%D8%A9/5/13/%D8%A8%D9%82%D9%88%D9%84%D9%8A%D8%A7%D8%AA%20%D9%88%D8%AD%D8%A8%D9%88%D8%A8%20%D9%85%D8%AC%D9%85%D8%AF%D8%A9/ar' },
  { brand: '5', category: '12', name: 'فلافل مجمدة', url: 'https://oroubafoods.com/Brands/%D8%A8%D8%B3%D9%85%D8%A9/5/12/%D9%81%D9%84%D8%A7%D9%81%D9%84%20%D9%85%D8%AC%D9%85%D8%AF%D8%A9/ar' },
  { brand: '5', category: '14', name: 'باببيتس', url: 'https://oroubafoods.com/Brands/%D8%A8%D8%B3%D9%85%D8%A9/5/14/%D8%A8%D8%A7%D8%A8%D8%A8%D9%8A%D8%AA%D8%B3/ar?q=11' }
];

async function scrape() {
  let result = [];
  
  for (let item of urls) {
    try {
      console.log('Scraping', item.url);
      const res = await axios.get(item.url);
      const $ = cheerio.load(res.data);
      
      let products = [];
      // Need to find products. Let's look for images or cards
      // The site probably has product cards. We can just pull all images inside something that looks like a product list
      // Let's grab script tags that might contain next.js or laravel livewire state, or just raw HTML cards
      
      // Let's try to find common product card classes or elements
      $('.card, .product-card, div.product, a[href*="/product/"]').each((i, el) => {
        const img = $(el).find('img').attr('src');
        const title = $(el).find('h2, h3, .title, .name').text().trim();
        const link = $(el).attr('href') || $(el).find('a').attr('href');
        if (img || title) {
          products.push({ img, title, link });
        }
      });
      
      // If we didn't find standard cards, let's just grab all images and texts that are grouped
      if (products.length === 0) {
        $('img').each((i, el) => {
          const src = $(el).attr('src');
          const alt = $(el).attr('alt') || '';
          if (src && src.includes('storage') && !src.includes('logo')) {
            products.push({ img: src, title: alt });
          }
        });
      }
      
      // Filter out duplicate images
      const uniqueProducts = [];
      const seen = new Set();
      for (const p of products) {
        if (!seen.has(p.img)) {
          seen.add(p.img);
          uniqueProducts.push(p);
        }
      }
      
      item.products = uniqueProducts;
      result.push(item);
    } catch (e) {
      console.error('Failed', item.url, e.message);
    }
  }
  
  fs.writeFileSync('scraped_products.json', JSON.stringify(result, null, 2));
  console.log('Done!');
}

scrape();
