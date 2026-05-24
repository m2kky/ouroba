const fs = require('fs');
const https = require('https');
const path = require('path');

const recipes = JSON.parse(fs.readFileSync('recipes_to_download.json', 'utf8'));
const outputDir = path.join(__dirname, '..', 'recovered_recipe_images');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

async function main() {
    console.log(`Starting download for ${recipes.length} recipes...`);
    let downloaded = 0;
    
    for (const recipe of recipes) {
        if (!recipe.image_url) continue;
        
        // Clean name for filesystem
        let safeName = recipe.name_en.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        if (!safeName) safeName = 'recipe_' + Math.random().toString(36).substr(2, 5);
        
        const ext = path.extname(recipe.image_url) || '.jpg';
        const fileName = `${safeName}${ext}`;
        const destPath = path.join(outputDir, fileName);
        
        try {
            await downloadImage(recipe.image_url, destPath);
            console.log(`Downloaded: ${fileName}`);
            downloaded++;
        } catch (error) {
            console.error(`Failed to download ${fileName} from ${recipe.image_url}:`, error.message);
        }
    }
    
    console.log(`\nFinished! Successfully downloaded ${downloaded}/${recipes.length} images.`);
    console.log(`You can find them in: ${outputDir}`);
}

main();
