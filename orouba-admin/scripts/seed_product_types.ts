import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Syncing Product Types (CategoryTypes) with exact production mappings and order...')

  // Define the types and their associations based on production site analysis
  const types = [
    {
      id: '14',
      titleAr: 'الفواكة المجمدة',
      titleEn: 'Frozen Fruits',
      descriptionAr: 'يتم اختيار الفواكة الطازجة وتجهيزها، ثم تخضع للتجميد السريع للاحتفاظ بخصائصها وقيمتها الغذائية.',
      descriptionEn: 'Fresh fruits are selected and processed, then subjected to quick freezing to keep their nutrition values and attributes',
      image: 'https://camp-coding.site/eloroba/storage/app/images/RjhwfXqz0lYRg5WcJappDYbVqw7GxoGFpV5l7vk2.png',
      number: 1,
      categories: [
        { categoryId: '5', brandLogo: '/farida.png' },   // Farida -> Frozen Fruits (7, 5)
        { categoryId: '11', brandLogo: '/basma.png' }   // Basma -> Frozen Vegetables & Fruits (5, 11)
      ]
    },
    {
      id: '15',
      titleAr: 'النصف مقلي',
      titleEn: 'Pre-Fried',
      descriptionAr: 'لدينا أصناف الفلافل الشهيرة الخاصة بنا، بالإضافة إلى وصفاتنا الأصلية من البطاطس النصف مقلية مع مكونات مختلفة وزهرات القرنبيط المتبلة النصف مقلية.',
      descriptionEn: 'We have our famous Falafel types, in addition to our original recipes of pre-fried potatoes with different ingredients and pre-fried cauliflower florets',
      image: 'https://camp-coding.site/eloroba/storage/app/images/GTqYDNVWPuIlNYMzniHuxRmdwslPpj0W9bjhRGAI.png',
      number: 2,
      categories: [
        { categoryId: '6', brandLogo: '/farida.png' },   // Farida -> Frozen Falafel (7, 6)
        { categoryId: '14', brandLogo: '/basma.png' }   // Basma -> Frozen Pre-Fried Bites (5, 14)
      ]
    },
    {
      id: '1',
      titleAr: 'الخضروات المجمدة',
      titleEn: 'Frozen Vegetables',
      descriptionAr: 'يتم اختيار جميع خضرواتنا بعناية. تخضع الخضروات لعملية الفحص والاختيار، ثم يتم غسلها ومعالجتها ومرورها بالتجميد السريع، ولدينا مجموعة متنوعة من الأصناف لتلبية الاحتياجات المختلفة.',
      descriptionEn: 'All our vegetables are carefully selected. They undergo inspection and selection process, then the vegetables are washed, processed and subjected to quick freezing, We have a large variety of types to serve different needs',
      image: 'https://camp-coding.site/eloroba/storage/app/images/icIeuiVnOAuVtHTPzWDN8D16X8aLOQ7wpGZoRIOD.png',
      number: 3,
      categories: [
        { categoryId: '4', brandLogo: '/farida.png' },   // Farida -> Frozen Vegetables (7, 4)
        { categoryId: '11', brandLogo: '/basma.png' }   // Basma -> Frozen Vegetables & Fruits (5, 11)
      ]
    },
    {
      id: '2',
      titleAr: 'البقوليات والحبوب المجمدة',
      titleEn: 'Frozen Beans & Grains',
      descriptionAr: 'يتم اختيار البقوليات والحبوب، وتجهيزها وسلقها لتكون سريعة الطهى ، وهناك العديد من الأصناف جاهزة للأكل مباشرة . بعض المنتجات تستغرق حوالي 10 دقائق من الطهى وذلك لتوفير الوقت والجهد.',
      descriptionEn: 'Our beans & grains are selected, soaked or boiled to save time and effort, Many of which are ready to eat and some take around 10 minutes of heating',
      image: 'https://camp-coding.site/eloroba/storage/app/images/ZjhabQ8AqbF7N3nAMyekLu1DqzOfnJ6dW9tuxoor.png',
      number: 4,
      categories: [
        { categoryId: '7', brandLogo: '/farida.png' },   // Farida -> Frozen Beans & Grains (7, 7)
        { categoryId: '13', brandLogo: '/basma.png' }   // Basma -> Frozen Beans & Grains (5, 13)
      ]
    }
  ]

  for (const t of types) {
    await prisma.categoryType.upsert({
      where: { id: t.id },
      update: {
        titleAr: t.titleAr,
        titleEn: t.titleEn,
        descriptionAr: t.descriptionAr,
        descriptionEn: t.descriptionEn,
        image: t.image,
        number: t.number,
        isHidden: false,
      },
      create: {
        id: t.id,
        titleAr: t.titleAr,
        titleEn: t.titleEn,
        descriptionAr: t.descriptionAr,
        descriptionEn: t.descriptionEn,
        image: t.image,
        number: t.number,
        isHidden: false,
      }
    })

    // Delete existing category links for this type
    await prisma.categoryTypeCategory.deleteMany({
      where: { categoryTypeId: t.id }
    })

    // Create new links
    for (const cat of t.categories) {
      const category = await prisma.category.findUnique({ where: { id: cat.categoryId } })
      if (category) {
        await prisma.categoryTypeCategory.create({
          data: {
            categoryId: cat.categoryId,
            categoryTypeId: t.id,
            image: cat.brandLogo,
          }
        })
      } else {
        console.warn(`Category with ID ${cat.categoryId} not found!`)
      }
    }
  }

  console.log('Product Type sync completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
