const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('https://oroubafoods.com/ar', {waitUntil: 'networkidle2'});
  
  const data = await page.evaluate(() => {
    const rgb2hex = (rgb) => {
      if(!rgb) return rgb;
      const m = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if(!m) return rgb;
      return '#' + ('0' + parseInt(m[1], 10).toString(16)).slice(-2) +
                   ('0' + parseInt(m[2], 10).toString(16)).slice(-2) +
                   ('0' + parseInt(m[3], 10).toString(16)).slice(-2);
    };

    const navbar = document.querySelector('nav') || document.querySelector('header');
    let navData = {};
    if (navbar) {
      const st = window.getComputedStyle(navbar);
      navData = {
        bg: rgb2hex(st.backgroundColor),
        color: rgb2hex(st.color)
      };
      
      const links = Array.from(navbar.querySelectorAll('a'));
      navData.links = links.slice(0,5).map(l => {
        const s = window.getComputedStyle(l);
        return { text: l.innerText.trim(), color: rgb2hex(s.color), bg: rgb2hex(s.backgroundColor) };
      });
    }

    const btns = Array.from(document.querySelectorAll('a.btn, button.btn, button, a[class*="btn"]'));
    const btnData = btns.map(b => {
      const s = window.getComputedStyle(b);
      return {
        text: b.innerText.trim(),
        bg: rgb2hex(s.backgroundColor),
        color: rgb2hex(s.color)
      };
    }).filter(b => b.text && b.text.length > 0);
    
    return { navData, btnData };
  });
  
  fs.writeFileSync('site_colors.json', JSON.stringify(data, null, 2));
  console.log('Saved site_colors.json');
  await browser.close();
})();
