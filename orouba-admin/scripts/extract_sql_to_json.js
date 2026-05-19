const fs = require('fs');
const path = require('path');

function parseSqlDump(filename) {
  let content;
  try {
    // Try UTF-16 first (since orouba_db_dump.sql failed with byte 0xff)
    content = fs.readFileSync(filename, 'utf16le');
    if (!content.includes('INSERT INTO')) {
      // Fallback to utf-8
      content = fs.readFileSync(filename, 'utf8');
    }
  } catch (err) {
    console.error('Error reading file', err);
    return;
  }

  const tables = {};
  
  // Find all INSERT INTO statements
  // Format usually: INSERT INTO `table_name` (`col1`, `col2`) VALUES ('val1', 'val2'), ...;
  // Or without columns: INSERT INTO `table_name` VALUES ('val1', 'val2');
  
  // A simpler way: parse line by line
  const lines = content.split('\n');
  let currentTable = null;
  let currentCols = null;

  // We will use a regex to match the start of an insert statement
  const insertRegex = /INSERT INTO `([^`]+)` \(([^)]+)\) VALUES/i;
  const insertNoColsRegex = /INSERT INTO `([^`]+)` VALUES/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith('INSERT INTO')) continue;

    let match = line.match(insertRegex);
    let tableName, colsStr;
    let valuesPart;
    
    if (match) {
      tableName = match[1];
      colsStr = match[2];
      valuesPart = line.substring(match[0].length).trim();
    } else {
      match = line.match(insertNoColsRegex);
      if (match) {
        tableName = match[1];
        valuesPart = line.substring(match[0].length).trim();
        // Without columns we can't easily map to JSON without schema, but we'll try to guess or just store as array
      } else {
        continue; // Unrecognized insert
      }
    }

    if (!tables[tableName]) tables[tableName] = [];

    // Simple parser for values
    // This is a naive parser. It assumes well-formed SQL.
    const cols = colsStr ? colsStr.split(',').map(c => c.replace(/`/g, '').trim()) : null;
    
    // Values part might span multiple lines if there are newlines in strings, but SQL dumps usually escape them.
    // Let's assume values are mostly on the same line for now, ending with ;
    
    // We will clean the values part
    if (valuesPart.endsWith(';')) valuesPart = valuesPart.slice(0, -1);
    
    // Split by '),('
    // This regex splits by comma but ignores commas inside quotes
    const rowsRaw = [];
    let currentRow = "";
    let inQuotes = false;
    let escape = false;

    for (let charIdx = 0; charIdx < valuesPart.length; charIdx++) {
      const char = valuesPart[charIdx];
      
      if (!inQuotes) {
        if (char === '(' && currentRow === "") continue; // Start of row
        if (char === ')' && (charIdx === valuesPart.length - 1 || valuesPart[charIdx+1] === ',' || valuesPart[charIdx+1] === ';')) {
          // End of row
          rowsRaw.push(currentRow);
          currentRow = "";
          charIdx++; // skip comma
          continue;
        }
        if (char === "'") inQuotes = true;
        currentRow += char;
      } else {
        if (escape) {
          currentRow += char;
          escape = false;
        } else if (char === '\\') {
          currentRow += char;
          escape = true;
        } else if (char === "'") {
          // Check for double quotes '' representing single quote in SQL
          if (valuesPart[charIdx+1] === "'") {
            currentRow += "'";
            charIdx++;
          } else {
            inQuotes = false;
            currentRow += char;
          }
        } else {
          currentRow += char;
        }
      }
    }

    // Now parse each row into columns
    for (const raw of rowsRaw) {
      const vals = [];
      let currentVal = "";
      let inStr = false;
      let esc = false;
      
      for (let c = 0; c < raw.length; c++) {
        const char = raw[c];
        if (!inStr) {
          if (char === ',') {
            vals.push(currentVal.trim());
            currentVal = "";
          } else if (char === "'") {
            inStr = true;
          } else {
            currentVal += char;
          }
        } else {
          if (esc) {
            currentVal += char;
            esc = false;
          } else if (char === '\\') {
            esc = true; // Wait, actually keep it to evaluate later
            currentVal += char;
          } else if (char === "'") {
            if (raw[c+1] === "'") {
              currentVal += "'";
              c++;
            } else {
              inStr = false;
            }
          } else {
            currentVal += char;
          }
        }
      }
      vals.push(currentVal.trim());

      // Clean values
      const cleanedVals = vals.map(v => {
        if (v.toUpperCase() === 'NULL') return null;
        if (v === "''") return "";
        return v; // already removed outer quotes in our logic above
      });

      if (cols) {
        const obj = {};
        cols.forEach((col, idx) => {
          obj[col] = cleanedVals[idx];
        });
        tables[tableName].push(obj);
      } else {
        tables[tableName].push(cleanedVals);
      }
    }
  }

  // Save each table to a JSON file
  const outDir = path.join(__dirname, 'legacy_data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  for (const [tableName, rows] of Object.entries(tables)) {
    fs.writeFileSync(path.join(outDir, `${tableName}.json`), JSON.stringify(rows, null, 2));
    console.log(`Extracted ${rows.length} rows into ${tableName}.json`);
  }
}

parseSqlDump(path.join(__dirname, '..', 'orouba_db_dump.sql'));
