const puppeteer = require('puppeteer');
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

async function run() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const results = [];
  
  for (const item of urls) {
    console.log('Scraping', item.url);
    await page.goto(item.url, { waitUntil: 'networkidle2' });
    
    // Evaluate in browser context to get products
    const products = await page.evaluate(() => {
      const productElements = document.querySelectorAll('img[src*="camp-coding.site/eloroba/storage"]');
      const data = [];
      
      productElements.forEach(img => {
        // Find the closest container to extract title if possible
        // Usually, in a React app, there might be a sibling or parent text
        let container = img.closest('div');
        // Let's go up a few levels and find all text
        let title = '';
        if (container && container.parentElement) {
           title = container.parentElement.innerText.trim().split('\n')[0];
        }
        
        const src = img.src;
        // Ignore logo and empty
        if (src && !src.includes('logo')) {
          data.push({ img: src, title });
        }
      });
      
      return data;
    });
    
    // Remove duplicates based on image URL
    const uniqueProducts = [];
    const seen = new Set();
    for (const p of products) {
      if (!seen.has(p.img)) {
        seen.add(p.img);
        uniqueProducts.push(p);
      }
    }
    
    item.products = uniqueProducts;
    results.push(item);
  }
  
  fs.writeFileSync('scraped_products.json', JSON.stringify(results, null, 2));
  await browser.close();
  console.log('Done!');
}

run();
