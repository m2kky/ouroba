import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const banner = await prisma.banner.update({ where: { id }, data: body });
    return apiSuccess(banner);
  } catch (error) {
    return apiError("Failed to update banner", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.banner.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  } catch (error) {
    return apiError("Failed to delete banner", 500);
  }
}
