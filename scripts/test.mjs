import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const recipes = await prisma.recipe.findMany({
    include: {
      category: true,
    },
  });

  console.log(recipes);
}

main();
