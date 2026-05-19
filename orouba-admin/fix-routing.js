const fs = require('fs');
const path = require('path');

const recipesDir = path.join(__dirname, 'src', 'app', 'api', 'admin', 'recipes');
const categoriesDir = path.join(recipesDir, 'categories');

// 1. Fix recipes/[recipeId] vs recipes/[id]
const recipeIdDir = path.join(recipesDir, '[recipeId]');
const idDir = path.join(recipesDir, '[id]');

if (fs.existsSync(recipeIdDir)) {
  console.log('Merging recipes/[recipeId] into recipes/[id]');
  
  if (!fs.existsSync(idDir)) {
    fs.mkdirSync(idDir, { recursive: true });
  }

  // Move props and steps
  ['props', 'steps'].forEach(folder => {
    const src = path.join(recipeIdDir, folder);
    const dest = path.join(idDir, folder);
    if (fs.existsSync(src)) {
      if (fs.existsSync(dest)) {
        fs.rmSync(dest, { recursive: true, force: true });
      }
      fs.renameSync(src, dest);
      
      // Update route.ts inside folder to use { params: { id: string } } and params.id
      const routeFile = path.join(dest, 'route.ts');
      if (fs.existsSync(routeFile)) {
        let content = fs.readFileSync(routeFile, 'utf8');
        content = content.replace(/\{ recipeId\: string \}/g, '{ id: string }');
        content = content.replace(/params\.recipeId/g, 'params.id');
        fs.writeFileSync(routeFile, content, 'utf8');
      }
    }
  });

  // Remove empty [recipeId]
  fs.rmSync(recipeIdDir, { recursive: true, force: true });
}

// 2. Fix recipes/categories/[categoryId] vs recipes/categories/[id]
const categoryIdDir = path.join(categoriesDir, '[categoryId]');
const catIdDir = path.join(categoriesDir, '[id]');

if (fs.existsSync(categoryIdDir)) {
  console.log('Merging recipes/categories/[categoryId] into recipes/categories/[id]');
  
  if (!fs.existsSync(catIdDir)) {
    fs.mkdirSync(catIdDir, { recursive: true });
  }

  // Move subcategories
  ['subcategories'].forEach(folder => {
    const src = path.join(categoryIdDir, folder);
    const dest = path.join(catIdDir, folder);
    if (fs.existsSync(src)) {
      if (fs.existsSync(dest)) {
        fs.rmSync(dest, { recursive: true, force: true });
      }
      fs.renameSync(src, dest);
      
      // Update route.ts to use id instead of categoryId
      const routeFile = path.join(dest, 'route.ts');
      if (fs.existsSync(routeFile)) {
        let content = fs.readFileSync(routeFile, 'utf8');
        content = content.replace(/\{ categoryId\: string \}/g, '{ id: string }');
        content = content.replace(/params\.categoryId/g, 'params.id');
        fs.writeFileSync(routeFile, content, 'utf8');
      }
    }
  });

  // Remove empty [categoryId]
  fs.rmSync(categoryIdDir, { recursive: true, force: true });
}

console.log('Routing conflicts fixed.');
