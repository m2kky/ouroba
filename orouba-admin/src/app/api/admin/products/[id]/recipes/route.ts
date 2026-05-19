import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const product = await prisma.product.findUnique({
      where: { id: resolvedParams.id },
      include: {
        recommendedRecipes: { include: { recipe: true } }
      }
    });

    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    // Return the mapped recipes
    return NextResponse.json(product.recommendedRecipes.map(r => r.recipe));
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product recipes" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const { recipeId } = await req.json();

    if (!recipeId) {
      return NextResponse.json({ error: "Recipe ID is required" }, { status: 400 });
    }

    const existingLink = await prisma.recommendedRecipe.findUnique({
      where: { productId_recipeId: { productId: resolvedParams.id, recipeId } }
    });

    if (existingLink) {
      return NextResponse.json({ error: "Recipe already linked" }, { status: 400 });
    }

    const newLink = await prisma.recommendedRecipe.create({
      data: {
        productId: resolvedParams.id,
        recipeId
      }
    });

    return NextResponse.json(newLink);
  } catch (error) {
    console.error("Error linking recipe to product:", error);
    return NextResponse.json({ error: "Failed to link recipe" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const { searchParams } = new URL(req.url);
    const recipeId = searchParams.get("recipeId");

    if (!recipeId) {
      return NextResponse.json({ error: "Recipe ID is required" }, { status: 400 });
    }

    await prisma.recommendedRecipe.delete({
      where: { productId_recipeId: { productId: resolvedParams.id, recipeId } }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unlinking recipe from product:", error);
    return NextResponse.json({ error: "Failed to unlink recipe" }, { status: 500 });
  }
}
