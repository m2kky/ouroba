import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const types = await prisma.productType.findMany({
      orderBy: { id: "asc" },
      include: { brand: true } // Might need brand later
    });
    return NextResponse.json(types);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch types" }, { status: 500 });
  }
}

export async function POST(req: Request) {
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

    const type = await prisma.productType.create({
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
    console.error("Error creating product type:", error);
    return NextResponse.json({ error: "Failed to create type" }, { status: 500 });
  }
}
