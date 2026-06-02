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

  if (content.includes('react-router-dom')) {
    // Replace useNavigate
    if (content.includes('useNavigate')) {
      content = content.replace(/import\s+{[^}]*useNavigate[^}]*}\s+from\s+['"]react-router-dom['"];?/g, "import { useRouter } from 'next/navigation';");
      content = content.replace(/useNavigate\(\)/g, "useRouter()");
      content = content.replace(/const\s+navigate\s*=\s*useRouter\(\)/g, "const router = useRouter()");
      content = content.replace(/navigate\(/g, "router.push(");
    }
    
    // Replace Link
    if (content.includes('Link')) {
      content = content.replace(/import\s+{[^}]*Link[^}]*}\s+from\s+['"]react-router-dom['"];?/g, "import Link from 'next/link';");
      content = content.replace(/<Link([^>]*)to=/g, "<Link$1href=");
    }
    
    // Replace useLocation
    if (content.includes('useLocation')) {
      content = content.replace(/import\s+{[^}]*useLocation[^}]*}\s+from\s+['"]react-router-dom['"];?/g, "import { usePathname } from 'next/navigation';");
      content = content.replace(/useLocation\(\)/g, "({ pathname: usePathname() })"); 
    }

    // fallback removal of any other react-router-dom imports
    content = content.replace(/import\s+.*from\s+['"]react-router-dom['"];?/g, "");

    changed = true;
  }
  
  if (changed) {
    // Add "use client" if it uses hooks
    if (content.includes('useRouter(') || content.includes('usePathname(') || content.includes('useState(') || content.includes('useEffect(')) {
      if (!content.includes('"use client"')) {
        content = '"use client";\n' + content;
      }
    }
    fs.writeFileSync(file, content);
  }
});

// Second pass for use client
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('useState(') || content.includes('useEffect(') || content.includes('useDispatch(') || content.includes('useSelector(')) {
      if (!content.includes('"use client"')) {
        content = '"use client";\n' + content;
        fs.writeFileSync(file, content);
      }
  }
});
