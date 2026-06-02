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

  const replacePatterns = [
    { regex: /import\s+{([^}]*)}\s+from\s+['"]\.\.\/\.\.\/Axios\/base_url['"];?/g, replacement: "import { $1 } from '@/Axios/base_url';" },
    { regex: /import\s+{([^}]*)}\s+from\s+['"]\.\.\/Axios\/base_url['"];?/g, replacement: "import { $1 } from '@/Axios/base_url';" },
    { regex: /import\s+{([^}]*)}\s+from\s+['"]\.\.\/\.\.\/\.\.\/Axios\/base_url['"];?/g, replacement: "import { $1 } from '@/Axios/base_url';" },
    
    { regex: /import\s+{([^}]*)}\s+from\s+['"]\.\.\/\.\.\/Axios['"];?/g, replacement: "import { $1 } from '@/Axios';" },
    { regex: /import\s+{([^}]*)}\s+from\s+['"]\.\.\/Axios['"];?/g, replacement: "import { $1 } from '@/Axios';" },
    { regex: /import\s+{([^}]*)}\s+from\s+['"]\.\.\/\.\.\/\.\.\/Axios['"];?/g, replacement: "import { $1 } from '@/Axios';" },

    { regex: /import\s+{([^}]*)}\s+from\s+['"]\.\.\/\.\.\/consts['"];?/g, replacement: "import { $1 } from '@/consts';" },
    { regex: /import\s+{([^}]*)}\s+from\s+['"]\.\.\/consts['"];?/g, replacement: "import { $1 } from '@/consts';" },
    { regex: /import\s+{([^}]*)}\s+from\s+['"]\.\.\/\.\.\/\.\.\/consts['"];?/g, replacement: "import { $1 } from '@/consts';" },
  ];

  replacePatterns.forEach(pattern => {
    if (pattern.regex.test(content)) {
      content = content.replace(pattern.regex, pattern.replacement);
      changed = true;
    }
  });
  
  if (changed) {
    fs.writeFileSync(file, content);
  }
});
