const fs = require('fs');
const path = require('path');

const mapFiles = [
  'static/js/main.349cc576.js.map',
  'static/js/453.0797c66a.chunk.js.map'
];

const outDir = path.join(__dirname, 'extracted_frontend');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

mapFiles.forEach(mapFile => {
  const filePath = path.join(__dirname, mapFile);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${filePath} (not found)`);
    return;
  }

  console.log(`Extracting ${mapFile}...`);
  const rawData = fs.readFileSync(filePath);
  const mapData = JSON.parse(rawData);

  if (!mapData.sources || !mapData.sourcesContent) {
    console.log(`No sources or sourcesContent found in ${mapFile}`);
    return;
  }

  for (let i = 0; i < mapData.sources.length; i++) {
    let sourcePath = mapData.sources[i];
    let content = mapData.sourcesContent[i];

    if (!sourcePath || !content) continue;

    // Clean up webpack paths
    sourcePath = sourcePath.replace(/^webpack:\/\//, '');
    sourcePath = sourcePath.replace(/^\//, ''); // Remove leading slash
    sourcePath = sourcePath.replace(/^[a-zA-Z0-9_-]+\//, ''); // Often starts with project name

    // Ignore node_modules
    if (sourcePath.includes('node_modules')) continue;

    // Strip query strings from the filename
    const queryIndex = sourcePath.indexOf('?');
    if (queryIndex !== -1) {
      sourcePath = sourcePath.substring(0, queryIndex);
    }

    const fullOutPath = path.join(outDir, sourcePath);
    const fullOutDir = path.dirname(fullOutPath);

    fs.mkdirSync(fullOutDir, { recursive: true });
    fs.writeFileSync(fullOutPath, content);
    console.log(`Extracted: ${sourcePath}`);
  }
});

console.log('Extraction complete!');
