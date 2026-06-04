const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const uploadsDir = path.join(__dirname, 'public', 'uploads', 'images');
const readyDir = path.join(__dirname, 'downloaded_official_images', 'ready_to_upload');

async function process() {
  // Convert the manually downloaded .png in readyDir
  const wAy = path.join(readyDir, 'wAyRPeQNWO2V0bTsRk8tDHD2NxsesoXWWSXjqHi5.png');
  if (fs.existsSync(wAy)) {
    console.log('Converting wAyRPeQNWO2V0bTsRk8tDHD2NxsesoXWWSXjqHi5.png...');
    await sharp(wAy).webp({ quality: 80 }).toFile(path.join(readyDir, 'wAyRPeQNWO2V0bTsRk8tDHD2NxsesoXWWSXjqHi5.webp'));
    fs.unlinkSync(wAy);
  }

  // Convert all uploads/images to webp in readyDir
  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir);
    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      if (/\.(png|jpe?g)$/i.test(file)) {
        const newFilename = file.replace(/\.(png|jpe?g)$/i, '.webp');
        const newFilePath = path.join(readyDir, newFilename);
        if (!fs.existsSync(newFilePath)) {
          console.log(`Converting ${file} from uploads...`);
          try {
            await sharp(filePath).webp({ quality: 80 }).toFile(newFilePath);
          } catch (e) {
            console.error(`Error with ${file}:`, e.message);
          }
        }
      } else if (file.endsWith('.webp')) {
        // Just copy it
        const newFilePath = path.join(readyDir, file);
        if (!fs.existsSync(newFilePath)) {
          fs.copyFileSync(filePath, newFilePath);
        }
      }
    }
  }
}

process().then(() => console.log('Done!'));
