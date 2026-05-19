const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SOURCE_DIR = 'C:\\Users\\FT 2025\\Downloads\\eloroba\\eloroba\\storage\\app\\images';
const TARGET_DIR = path.join(__dirname, '..', 'processed_media');

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

const imagesToConvert = ['.jpg', '.jpeg', '.png', '.gif'];
const copyDirectly = ['.webp', '.mp4', '.svg', '.pdf'];

async function processMedia() {
  console.log('Starting Media Processing...');
  
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Source directory not found: ${SOURCE_DIR}`);
    return;
  }

  const files = fs.readdirSync(SOURCE_DIR);
  let convertedCount = 0;
  let copiedCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const sourcePath = path.join(SOURCE_DIR, file);
    const stats = fs.statSync(sourcePath);
    
    if (!stats.isFile()) continue;

    if (imagesToConvert.includes(ext)) {
      // Convert to webp
      const basename = path.basename(file, ext);
      const targetPath = path.join(TARGET_DIR, `${basename}.webp`);
      
      try {
        await sharp(sourcePath)
          .webp({ quality: 80, effort: 4 })
          .toFile(targetPath);
        convertedCount++;
        if (convertedCount % 100 === 0) console.log(`Converted ${convertedCount} images...`);
      } catch (err) {
        console.error(`Failed to convert ${file}:`, err.message);
        errorCount++;
      }
    } else if (copyDirectly.includes(ext)) {
      // Copy directly
      const targetPath = path.join(TARGET_DIR, file);
      try {
        fs.copyFileSync(sourcePath, targetPath);
        copiedCount++;
      } catch (err) {
        console.error(`Failed to copy ${file}:`, err.message);
        errorCount++;
      }
    } else {
      console.log(`Skipping unknown format: ${file}`);
    }
  }

  console.log('--- Processing Complete ---');
  console.log(`Converted to WebP: ${convertedCount}`);
  console.log(`Copied directly: ${copiedCount}`);
  console.log(`Errors: ${errorCount}`);
}

processMedia();
