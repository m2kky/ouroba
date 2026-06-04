const fs = require('fs');
const path = require('path');
const https = require('https');

const downloadDir = path.join(__dirname, 'downloaded_official_images', 'ready_to_upload');
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

const urls = [
  'https://camp-coding.site/eloroba/storage/app/images/wAyRPeQNWO2V0bTsRk8tDHD2NxsesoXWWSXjqHi5.png',
  'https://camp-coding.site/eloroba/storage/app/images/9GWFp84wGE40aoJaGczEwt15qAjnjKtjAlQvqKNz.png',
  'https://camp-coding.site/eloroba/storage/app/images/yaDeQPeAbx9rXc1VrhlsVXAtHfcEAsqUCH8ifzk3.mp4',
  'https://camp-coding.site/eloroba/storage/app/images/2ACCr5zYZdX2UP5fEK30Kd8Jcs0hYXCGSSqgndxG.mp4',
  'https://camp-coding.site/eloroba/storage/app/images/SZzjLGH7CJNvqRkaCBKfPz9AwL88wok3VELoGFTr.mp4'
];

async function download() {
  for (const url of urls) {
    const filename = path.basename(url);
    const dest = path.join(downloadDir, filename);
    
    console.log(`Downloading: ${url}`);
    
    await new Promise((resolve) => {
      const file = fs.createWriteStream(dest);
      https.get(url, (response) => {
        if (response.statusCode !== 200) {
          console.error(`Failed to download ${url}: HTTP ${response.statusCode}`);
          resolve();
          return;
        }
        response.pipe(file);
        file.on('finish', () => {
          file.close(() => resolve());
        });
      }).on('error', (err) => {
        fs.unlink(dest, () => {});
        console.error(`Error downloading ${url}:`, err.message);
        resolve();
      });
    });
  }
}

download();
