const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, 'downloaded_official_images');

async function processImages() {
  if (!fs.existsSync(dir)) {
    console.log('Folder downloaded_official_images does not exist.');
    return;
  }

  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    // Only process PNG and JPG/JPEG files
    if (/\.(png|jpe?g)$/i.test(file)) {
      const filePath = path.join(dir, file);
      // Create a new filename with .webp extension
      const newFilename = file.replace(/\.(png|jpe?g)$/i, '.webp');
      const newFilePath = path.join(dir, newFilename);

      try {
        await sharp(filePath)
          .webp({ quality: 80 }) // 80% quality is a great balance between size and quality
          .toFile(newFilePath);
        
        console.log(`✅ Converted ${file} -> ${newFilename}`);
        
        // Optional: delete original to save space
        // fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`❌ Failed to convert ${file}:`, err.message);
      }
    }
  }
  
  console.log('🎉 All images have been converted to WebP format!');
  console.log('You can now upload the new .webp files to Cloudflare R2.');
}

processImages();
