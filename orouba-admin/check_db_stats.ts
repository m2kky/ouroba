import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const brands = await prisma.brand.count();
  const products = await prisma.product.count();
  const recipes = await prisma.recipe.count();
  const recipeCategories = await prisma.recipeCategory.count();
  const foods = await prisma.food.count();
  const sectionTexts = await prisma.sectionText.count();
  const whyChooseUs = await prisma.whyChooseUs.count();
  const standards = await prisma.standard.count();
  const values = await prisma.value.count();

  console.log(`Brands: ${brands}`);
  console.log(`Products: ${products}`);
  console.log(`Recipes: ${recipes}`);
  console.log(`Recipe Categories: ${recipeCategories}`);
  console.log(`Foods: ${foods}`);
  console.log(`SectionTexts: ${sectionTexts}`);
  console.log(`WhyChooseUs: ${whyChooseUs}`);
  console.log(`Standards: ${standards}`);
  console.log(`Values: ${values}`);
}

main().finally(() => prisma.$disconnect());
