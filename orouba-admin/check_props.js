const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProps() {
  const props = await prisma.recipeProperty.findMany({ take: 10 });
  console.log(props);
}

checkProps()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
