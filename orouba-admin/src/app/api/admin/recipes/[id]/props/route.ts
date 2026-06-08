import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { normalizeRecipeProperties, recipePropertiesForCreate } from "@/lib/recipe-properties";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const props = await prisma.recipeProperty.findMany({
      where: { recipeId: params.id },
      orderBy: { id: "asc" }
    });
    return NextResponse.json(normalizeRecipeProperties(props));
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch props" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { properties } = await req.json();

    if (!Array.isArray(properties)) {
      return NextResponse.json({ error: "Invalid properties data" }, { status: 400 });
    }

    const fixedProperties = recipePropertiesForCreate(properties, params.id);

    await prisma.$transaction([
      prisma.recipeProperty.deleteMany({ where: { recipeId: params.id } }),
      prisma.recipeProperty.createMany({
        data: fixedProperties
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating recipe properties:", error);
    return NextResponse.json({ error: "Failed to update properties" }, { status: 500 });
  }
}
