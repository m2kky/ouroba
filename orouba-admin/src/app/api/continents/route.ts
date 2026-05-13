import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/continents — Public: read-only, with nested countries
export async function GET() {
  try {
    const continents = await prisma.continent.findMany({
      where: { isHidden: false },
      include: {
        countries: {
          where: { isHidden: false },
          orderBy: { nameEn: "asc" },
        },
      },
    });
    return apiSuccess(continents);
  } catch (error) {
    return apiError("Failed to fetch continents", 500);
  }
}

// POST /api/continents — Admin only
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return apiError("Unauthorized", 401);
  }

  try {
    const body = await request.json();
    const { countries, ...continentData } = body;

    const continent = await prisma.continent.create({
      data: {
        ...continentData,
        countries: countries?.length
          ? { create: countries.map((c: any) => ({ nameEn: c.nameEn, nameAr: c.nameAr })) }
          : undefined,
      },
      include: { countries: true },
    });
    return apiSuccess(continent, 201);
  } catch (error) {
    return apiError("Failed to create continent", 500);
  }
}
