const https = require('https');

https.get('https://oroubafoods.com/about/whoWeAre/ar', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const regex = /<img[^>]+src="([^"]+)"/g;
    const urls = [];
    let match;
    while ((match = regex.exec(data)) !== null) {
      urls.push(match[1]);
    }
    console.log(JSON.stringify(urls, null, 2));
  });
}).on('error', err => console.error(err));
