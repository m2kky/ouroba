import * as fs from 'fs';

const data = JSON.parse(fs.readFileSync('extracted_recipes.json', 'utf-8'));

let md = `# Orouba Recipes / وصفات العروبة\n\n`;

function cleanHtml(html) {
  if (!html) return 'N/A / غير متوفر';
  let text = html
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li>/gi, '- ')
    .replace(/<[^>]+>/g, '') // remove remaining tags
    .replace(/\n\s*\n/g, '\n\n') // remove extra newlines
    .trim();
  return text || 'N/A / غير متوفر';
}

data.forEach((recipe, index) => {
  if (!recipe.nameAr && !recipe.nameEn) return;

  md += `## ${index + 1}. ${recipe.nameAr || 'بدون اسم'} / ${recipe.nameEn || 'No Name'}\n\n`;

  // Ingredients from relations (if any exist and are valid)
  const validIngredients = recipe.ingredients ? recipe.ingredients.filter(ing => ing.nameAr?.trim() || ing.nameEn?.trim()) : [];
  
  if (validIngredients.length > 0) {
    md += `### Ingredients / المكونات:\n`;
    validIngredients.forEach(ing => {
      md += `- ${ing.nameAr || ''} / ${ing.nameEn || ''}\n`;
    });
    md += `\n`;
  }

  const validSteps = recipe.steps ? recipe.steps.filter(s => s.stepAr?.trim() || s.stepEn?.trim()) : [];
  
  if (validSteps.length > 0) {
    md += `### Preparation Method / طريقة التحضير:\n`;
    validSteps.forEach((step, idx) => {
      md += `**Step / الخطوة ${idx + 1}:**\n`;
      md += `- AR: ${step.stepAr || 'N/A'}\n`;
      md += `- EN: ${step.stepEn || 'N/A'}\n\n`;
    });
  } 
  
  // If there are no valid steps, OR if there's a description, we should output the description because it usually contains the full recipe text
  if (recipe.descriptionAr || recipe.descriptionEn) {
    // If we didn't print steps or ingredients, or even if we did, the description has the full details
    if (validSteps.length === 0) {
      md += `### Details (Ingredients & Preparation) / التفاصيل (المكونات والتحضير):\n`;
    } else {
      md += `### Additional Details / تفاصيل إضافية:\n`;
    }
    
    md += `**Arabic / عربي:**\n`;
    md += `${cleanHtml(recipe.descriptionAr)}\n\n`;
    
    md += `**English / إنجليزي:**\n`;
    md += `${cleanHtml(recipe.descriptionEn)}\n\n`;
  }
  
  md += `---\n\n`;
});

fs.writeFileSync('C:\\Users\\FT 2025\\.gemini\\antigravity-ide\\brain\\0436d354-894c-441a-9d29-2fe2af3281a6\\Orouba_Recipes_AR_EN.md', md, 'utf-8');
console.log('Artifact regenerated.');
