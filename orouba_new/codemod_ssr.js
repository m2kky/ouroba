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

  if (content.includes('localStorage.')) {
    content = content.replace(/localStorage\./g, "(typeof window !== 'undefined' ? localStorage : { getItem: ()=>null, setItem: ()=>{}, removeItem: ()=>{} }).");
    changed = true;
  }
  if (content.includes('sessionStorage.')) {
    content = content.replace(/sessionStorage\./g, "(typeof window !== 'undefined' ? sessionStorage : { getItem: ()=>null, setItem: ()=>{}, removeItem: ()=>{} }).");
    changed = true;
  }
  if (content.includes('window.location')) {
    content = content.replace(/window\.location/g, "(typeof window !== 'undefined' ? window.location : { href: '' })");
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, content);
  }
});
