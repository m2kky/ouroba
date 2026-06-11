import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const newAr = "منذ أن بدأنا سنة ١٩٩٨ وحتى الآن، تعتبر منتجات العروبة الطبيعية والصحية عالية الجودة من أهم العناصر الأساسية والمفضلة في المطبخ المصري. إبتكاراتنا المستمرة تلهم الابداع فى الطهى حول العالم. شغفنا بالطعام وإيماننا بأنه وسيلة لجمع الأسرة والأصدقاء، جعلنا نحرص دائماً على تحويل الوجبات اليومية إلى تجارب ممتعة ونشر السعادة مع كل مذاق لذيذ. شاركنا في بث السعادة في مطبخك.";
    const newEn = "At Orouba, we're all about turning everyday meals into delightful experiences. Since 1998, we've been a beloved staple in Egyptian kitchens, cherished for our premium-quality, nutritious, and all-natural frozen food products. Our passion for food and commitment to quality inspires creativity in kitchens everywhere, bringing people together and spreading happiness with every delicious bite. Join us in making every meal a special memory.";

    // Update SiteSetting
    await prisma.siteSetting.updateMany({
        where: {
            valueAr: {
                contains: 'تأسست شركة'
            }
        },
        data: {
            valueAr: newAr,
            valueEn: newEn
        }
    });

    // Update SectionText
    await prisma.sectionText.updateMany({
        where: {
            textAr: {
                contains: 'تأسست شركة'
            }
        },
        data: {
            textAr: newAr,
            textEn: newEn
        }
    });

    console.log("Updated texts successfully.");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
