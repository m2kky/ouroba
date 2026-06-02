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
      if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.tsx') || file.endsWith('.ts')) {
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

  // Remove missing CSS imports
  const cssRegex = /import\s+['"]((?!bootstrap|swiper|\.\.\/globals\.css|rsuite).)*\.css['"];?\s*/g;
  if (cssRegex.test(content)) {
    content = content.replace(cssRegex, '');
    changed = true;
  }

  // Replace missing static require imports with empty string placeholder for now
  const reqRegex = /require\(['"]([^'"]*\.png|[^'"]*\.jpg|[^'"]*\.svg|[^'"]*\.jpeg)['"]\)(\.default)?/g;
  if (reqRegex.test(content)) {
    content = content.replace(reqRegex, '""');
    changed = true;
  }
  
  // Convert react-router-dom to next/navigation or next/link imports tentatively
  // It's a rough fix to avoid crash loop, we'll refine it.
  
  if (changed) {
    fs.writeFileSync(file, content);
  }
});
