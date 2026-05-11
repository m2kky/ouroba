import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const categories = await prisma.recipeCategory.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Failed to fetch recipe categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { nameAr, nameEn } = await req.json();

    if (!nameAr || !nameEn) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const category = await prisma.recipeCategory.create({
      data: { nameAr, nameEn },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error creating recipe category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
