const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('d:/Codes_Projects/oruba rep/orouba_new/src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Match import ImageName from '.../path/to/image.png';
  const regex = /import\s+([a-zA-Z0-9_]+)\s+from\s+['"]([^'"]+\.(png|jpe?g|svg|gif|webp))['"];?/g;
  
  if (regex.test(content)) {
    content = content.replace(regex, "const $1 = '/missing-image.png'; // replaced missing $2");
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, content);
  }
});
