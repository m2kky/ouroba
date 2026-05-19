import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { nameAr, nameEn, number, isHidden, brandId } = data;

    if (!nameAr || !nameEn) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const type = await prisma.productType.update({
      where: { id: params.id },
      data: {
        nameAr,
        nameEn,
        number: number !== undefined ? parseInt(number, 10) : 999,
        isHidden: isHidden === true,
        brandId: brandId || null
      }
    });

    return NextResponse.json(type);
  } catch (error) {
    console.error("Error updating product type:", error);
    return NextResponse.json({ error: "Failed to update type" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.productType.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product type:", error);
    return NextResponse.json({ error: "Failed to delete type" }, { status: 500 });
  }
}
