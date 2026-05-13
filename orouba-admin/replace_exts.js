const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function findFiles(dir, filter, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findFiles(filePath, filter, fileList);
    } else if (filter(filePath)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const tsxFiles = findFiles(srcDir, (f) => f.endsWith('.tsx') || f.endsWith('.ts'));

let changedFiles = 0;

tsxFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let originalContent = content;

  // Replace hardcoded image links with .webp if they point to the R2 dev server
  content = content.replace(/(https:\/\/pub-0aa6a0d8dfd847389f78cd7e6b6b93bf\.r2\.dev\/[^"']+)\.(png|jpe?g)/gi, '$1.webp');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf-8');
    changedFiles++;
    console.log(`Updated: ${file}`);
  }
});

console.log(`Finished updating extensions in ${changedFiles} files.`);
