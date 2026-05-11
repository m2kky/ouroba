import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

// Certificates
export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({ where: { isHidden: false } });
    return apiSuccess(certificates);
  } catch (error) {
    return apiError("Failed to fetch certificates", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cert = await prisma.certificate.create({ data: body });
    return apiSuccess(cert, 201);
  } catch (error) {
    return apiError("Failed to create certificate", 500);
  }
}
