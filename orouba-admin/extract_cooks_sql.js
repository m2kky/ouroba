const fs = require('fs');

const sql = fs.readFileSync('../campcod3_eloroba.sql', 'utf8');

// The SQL has INSERT INTO `cooks` (`id`, `name_ar`, `name_en`, `description_ar`, `description_en`, `hidden`, `created_at`, `updated_at`, `video_link`, `internal_image`, `number`) VALUES ...
const regex = /INSERT INTO `cooks` \([^)]+\) VALUES\s*(.*?);/gs;

let match;
const cooks = [];

while ((match = regex.exec(sql)) !== null) {
  const valuesStr = match[1];
  
  // A naive parser to split by `),(` or `), (` 
  // This might break if description has `),(` but let's try a regex for the tuples
  // Each tuple: (id, name_ar, name_en, desc_ar, desc_en, hidden, created, updated, video_link, internal_image, number)
  
  // Better approach: use a regex to capture strings
  const tupleRegex = /\((.*?)\)(?=(?:,\s*\(|\s*$))/g;
  let tupleMatch;
  while ((tupleMatch = tupleRegex.exec(valuesStr)) !== null) {
      const row = tupleMatch[1];
      // We can just split by comma if we are careful, or use a simple CSV parser
      // However, descriptions have HTML with commas.
      // Let's use a regex that matches string literals '...' or numbers/NULL
      const fieldRegex = /'(?:[^'\\]|\\.)*'|NULL|\d+/g;
      const fields = [];
      let f;
      while ((f = fieldRegex.exec(row)) !== null) {
          fields.push(f[0]);
      }
      
      if (fields.length >= 11) {
          const name_ar = fields[1] !== 'NULL' ? fields[1].slice(1, -1) : null;
          const name_en = fields[2] !== 'NULL' ? fields[2].slice(1, -1) : null;
          const video_link = fields[8] !== 'NULL' ? fields[8].slice(1, -1) : null;
          const internal_image = fields[9] !== 'NULL' ? fields[9].slice(1, -1) : null;
          
          cooks.push({
              name_ar,
              name_en,
              video_link,
              internal_image
          });
      }
  }
}

fs.writeFileSync('extracted_cooks.json', JSON.stringify(cooks, null, 2));
console.log(`Extracted ${cooks.length} cooks.`);
