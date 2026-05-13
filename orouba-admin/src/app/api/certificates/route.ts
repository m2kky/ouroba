import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/certificates — Public: read-only
export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({ where: { isHidden: false } });
    return apiSuccess(certificates);
  } catch (error) {
    return apiError("Failed to fetch certificates", 500);
  }
}

// POST /api/certificates — Admin only
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return apiError("Unauthorized", 401);
  }

  try {
    const body = await request.json();
    const cert = await prisma.certificate.create({ data: body });
    return apiSuccess(cert, 201);
  } catch (error) {
    return apiError("Failed to create certificate", 500);
  }
}
