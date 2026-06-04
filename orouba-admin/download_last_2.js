const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const newDir = path.join(__dirname, 'downloaded_official_images', 'missing_files_to_upload');
if (!fs.existsSync(newDir)) {
  fs.mkdirSync(newDir, { recursive: true });
}

const mapUrl = 'https://camp-coding.site/eloroba/storage/app/images/9GWFp84wGE40aoJaGczEwt15qAjnjKtjAlQvqKNz.jpg';
const whoWeAreUrl = 'https://camp-coding.site/eloroba/storage/app/images/ZHVQeLXeXFxqfGf27Yd4yiETR1EmFh2Tij1rUudu.png';

async function downloadAndConvert(url, webpFilename) {
  const destTemp = path.join(__dirname, path.basename(url));
  const destWebp = path.join(newDir, webpFilename);

  console.log(`Downloading: ${url}`);
  await new Promise((resolve) => {
    const file = fs.createWriteStream(destTemp);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve());
      });
    }).on('error', (err) => {
      fs.unlinkSync(destTemp);
      console.error(err);
      resolve();
    });
  });

  if (fs.existsSync(destTemp)) {
    console.log(`Converting to ${webpFilename}`);
    await sharp(destTemp).webp({ quality: 80 }).toFile(destWebp);
    fs.unlinkSync(destTemp); // delete temp
  }
}

async function main() {
  await downloadAndConvert(mapUrl, '9GWFp84wGE40aoJaGczEwt15qAjnjKtjAlQvqKNz.webp');
  await downloadAndConvert(whoWeAreUrl, 'ZHVQeLXeXFxqfGf27Yd4yiETR1EmFh2Tij1rUudu.webp');
  console.log('Done!');
}

main();
