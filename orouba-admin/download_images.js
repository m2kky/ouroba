const fs = require('fs');
const path = require('path');
const https = require('https');

const imageUrls = [
  // Hero Image
  'https://camp-coding.site/eloroba/storage/app/images/pZHaEck6Myx1R5XKJTICq0AZFn15lMRTC6kT1Yp0.png',
  
  // Features / Icons
  'https://camp-coding.site/eloroba/storage/app/images/0e9Yy5j3FdbU0DFTOXTWgrIeSaDRtunarfPxFmPh.png',
  'https://camp-coding.site/eloroba/storage/app/images/vGmUdMMJnlqBDY7kiOhfibwQDMUjWlG019c6Z7hZ.png',
  'https://camp-coding.site/eloroba/storage/app/images/4d4nAa9sK4dB1xOtha56c8VIpjO3sxyWxfJtv3n6.png',
  'https://camp-coding.site/eloroba/storage/app/images/YFrh6569OO6wE3mYThl0q1bb7L5zJqDOhoViwi71.png',
  'https://camp-coding.site/eloroba/storage/app/images/dcqw4l4DMEZsoL3P4rLPzBqJPGRIstkT5BdxiabT.png',
  
  // Production Steps Images
  'https://camp-coding.site/eloroba/storage/app/images/5tz9Goi65jI0n7knjNHANWIqZFSsTprXkUjtQk2n.jpg',
  'https://camp-coding.site/eloroba/storage/app/images/ME5PsY3BANJYZ2lXAeWT3EvMyEayD7JXEDe3MTLs.jpg',
  
  // Footer Logo
  'https://oroubafoods.com/static/media/footer_logo.ddae0bf40dad21fa904a.png'
];

const downloadDir = path.join(__dirname, 'downloaded_official_images');
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir);
}

imageUrls.forEach((url, index) => {
  const filename = path.basename(url);
  const dest = path.join(downloadDir, filename);
  const file = fs.createWriteStream(dest);
  
  https.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(() => {
        console.log('Downloaded:', filename);
      });
    });
  }).on('error', function(err) {
    fs.unlink(dest, () => {});
    console.error('Error downloading:', url, err.message);
  });
});
