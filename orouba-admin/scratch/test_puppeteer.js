const puppeteer = require('puppeteer');

async function scrapeProduct() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const url = 'https://oroubafoods.com/en/product/27/Molokhia-Leaves';
  console.log(`Navigating to ${url}...`);
  
  await page.goto(url, { waitUntil: 'networkidle2' });
  
  // Extract color, description, and related recipes
  const data = await page.evaluate(() => {
    // Description: might be in a p tag inside a specific container
    const descEl = document.querySelector('p.text-muted, .product-description, .description p');
    const description = descEl ? descEl.innerText.trim() : '';

    // Color: look for inline styles on the main container or specific classes
    let color = '#ffffff';
    // Let's try to find an element with an inline style setting background-color
    const els = document.querySelectorAll('[style*="background-color"], [style*="background"]');
    for (const el of els) {
      if (el.style.backgroundColor && el.style.backgroundColor !== 'rgb(255, 255, 255)' && el.style.backgroundColor !== 'transparent') {
        color = el.style.backgroundColor;
        break;
      }
    }
    
    // Related recipes
    const recipes = [];
    const recipeLinks = document.querySelectorAll('a[href*="/recipe/"]');
    recipeLinks.forEach(link => {
      recipes.push(link.href);
    });

    return { description, color, recipes };
  });

  console.log('Scraped Data:', data);
  await browser.close();
}

scrapeProduct().catch(console.error);
