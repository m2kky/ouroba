const axios = require('axios');
const cheerio = require('cheerio');

async function testScrape() {
  const url = 'https://oroubafoods.com/en/product/27/Molokhia-Leaves';
  try {
    console.log(`Fetching ${url}...`);
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    
    // Attempt to find description
    const desc = $('.product-description, p').text().substring(0, 200);
    console.log('Description sample:', desc);
    
    // Attempt to find color (often inline styles or specific classes)
    const bgElement = $('[style*="background-color"], [style*="background"]');
    if (bgElement.length > 0) {
      console.log('Found background color style:', bgElement.attr('style'));
    } else {
      console.log('No inline background-color found.');
    }
  } catch (error) {
    console.error('Error fetching:', error.message);
  }
}

testScrape();
