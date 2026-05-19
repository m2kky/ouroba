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
        categories: { include: { category: { include: { brand: true } } } }
      }
    });

    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    // Return the mapped categories instead of the link objects for easier consumption
    return NextResponse.json(product.categories.map(c => c.category));
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product categories" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const { categoryId } = await req.json();

    if (!categoryId) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const existingLink = await prisma.categoryProduct.findUnique({
      where: { categoryId_productId: { productId: resolvedParams.id, categoryId } }
    });

    if (existingLink) {
      return NextResponse.json({ error: "Category already linked" }, { status: 400 });
    }

    const newLink = await prisma.categoryProduct.create({
      data: {
        productId: resolvedParams.id,
        categoryId
      }
    });

    return NextResponse.json(newLink);
  } catch (error) {
    console.error("Error linking category to product:", error);
    return NextResponse.json({ error: "Failed to link category" }, { status: 500 });
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
    const categoryId = searchParams.get("categoryId");

    if (!categoryId) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    await prisma.categoryProduct.delete({
      where: { categoryId_productId: { productId: resolvedParams.id, categoryId } }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unlinking category from product:", error);
    return NextResponse.json({ error: "Failed to unlink category" }, { status: 500 });
  }
}
