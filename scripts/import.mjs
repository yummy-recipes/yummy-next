import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function getOrCreateCategory({ title, slug }) {
  const category = await prisma.category.findUnique({
    where: {
      slug
    }
  })

  if (category) {
    return category
  }

  console.log(`Creating category ${title}...`)

  return await prisma.category.create({
    data: {
      title,
      slug,
      recipes: undefined
    }
  })
}

async function main() {
  await getOrCreateCategory({
    title: 'Śniadaniowe',
    slug: 'sniadaniowe',
  })

  await getOrCreateCategory({
    title: 'Zupy',
    slug: 'zupy',
  })

  const obiady = await getOrCreateCategory({
    title: 'Obiady',
    slug: 'obiady',
  })

  await getOrCreateCategory({
    title: 'Desery',
    slug: 'desery',
  })

  await getOrCreateCategory({
    title: 'Koktajle',
    slug: 'koktajle',
  })

  // const results = await prisma.recipe.create({
  //   data: {
  //     title: 'Pancakes',
  //     slug: 'pancakes',
  //     headline: 'Pancakes',
  //     preparationTime: 15,
  //     categoryId: obiady.id,
  //     tags: undefined,
  //   }
  // })
  // console.log(results)
}

main()
