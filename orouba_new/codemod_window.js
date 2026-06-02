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
      if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.tsx')) {
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

  if (content.includes('[window]')) {
    content = content.replace(/\[window\]/g, "[]");
    changed = true;
  }
  if (content.includes('window.removeEventListener')) {
    content = content.replace(/window\.removeEventListener/g, "(typeof window !== 'undefined' ? window : {removeEventListener: ()=>{}}).removeEventListener");
    changed = true;
  }
  if (content.includes('window.addEventListener')) {
    content = content.replace(/window\.addEventListener/g, "(typeof window !== 'undefined' ? window : {addEventListener: ()=>{}}).addEventListener");
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, content);
  }
});
