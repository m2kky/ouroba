import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const productTypes = await prisma.productType.findMany({
      where: { isHidden: false },
      include: { _count: { select: { products: true } } },
    });
    return apiSuccess(productTypes);
  } catch (error) {
    return apiError("Failed to fetch product types", 500);
  }
}
