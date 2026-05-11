import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const steps = await prisma.productionStep.findMany({
      where: { isHidden: false },
      orderBy: { number: "asc" },
    });
    return apiSuccess(steps);
  } catch (error) {
    return apiError("Failed to fetch production steps", 500);
  }
}
