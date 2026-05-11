import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";

// GET /api/socials
export async function GET() {
  try {
    const socials = await prisma.social.findMany({ where: { isHidden: false } });
    return apiSuccess(socials);
  } catch (error) {
    return apiError("Failed to fetch socials", 500);
  }
}
