import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadFile, deleteFile } from "@/lib/upload";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const nameAr = formData.get("nameAr") as string;
    const nameEn = formData.get("nameEn") as string;
    const descriptionAr = formData.get("descriptionAr") as string || "";
    const descriptionEn = formData.get("descriptionEn") as string || "";
    const color = formData.get("color") as string || "#ffffff";
    const typeId = formData.get("typeId") as string || null;
    const number = parseInt(formData.get("number") as string || "999", 10);
    const isHidden = formData.get("isHidden") === "true";
    
    const imageFiles = formData.getAll("images") as File[];
    const deletedImageIds = formData.getAll("deletedImageIds") as string[];

    if (!nameAr || !nameEn) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Handle deleted images
    if (deletedImageIds.length > 0) {
      const imagesToDelete = await prisma.productImage.findMany({
        where: { id: { in: deletedImageIds }, productId: id }
      });
      
      for (const img of imagesToDelete) {
        await deleteFile(img.url);
      }
      
      await prisma.productImage.deleteMany({
        where: { id: { in: deletedImageIds } }
      });
    }

    // Upload new images
    const imageUrls: string[] = [];
    for (const file of imageFiles) {
      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const url = await uploadFile(buffer, file.name, "products");
        imageUrls.push(url);
      }
    }

    // Update product and relations
    const product = await prisma.product.update({
      where: { id },
      data: {
        nameAr,
        nameEn,
        descriptionAr,
        descriptionEn,
        color,
        isHidden,
        number,
        typeId: typeId || null,
        images: {
          create: imageUrls.map(url => ({ url }))
        }
      },
      include: {
        categories: { include: { category: true } },
        images: true,
        type: true,
        recommendedRecipes: { include: { recipe: true } },
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existingProduct = await prisma.product.findUnique({ 
      where: { id },
      include: { images: true }
    });
    if (!existingProduct) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Delete associated images from local storage
    for (const img of existingProduct.images) {
      await deleteFile(img.url);
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
