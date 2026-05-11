import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadFile, deleteFile } from "@/lib/upload";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const nameAr = formData.get("nameAr") as string;
    const nameEn = formData.get("nameEn") as string;
    const brandId = formData.get("brandId") as string;
    const descriptionAr = formData.get("descriptionAr") as string || "";
    const descriptionEn = formData.get("descriptionEn") as string || "";
    const isHidden = formData.get("isHidden") === "true";
    const imageFile = formData.get("image") as File | null;
    const imageEnFile = formData.get("imageEn") as File | null;

    if (!nameAr || !nameEn || !brandId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingCategory = await prisma.category.findUnique({ where: { id: params.id } });
    if (!existingCategory) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let imageUrl = existingCategory.image;
    if (imageFile && imageFile.size > 0) {
      if (existingCategory.image) await deleteFile(existingCategory.image);
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imageUrl = await uploadFile(buffer, imageFile.name, "categories");
    }

    let imageEnUrl = existingCategory.imageEn;
    if (imageEnFile && imageEnFile.size > 0) {
      if (existingCategory.imageEn) await deleteFile(existingCategory.imageEn);
      const buffer = Buffer.from(await imageEnFile.arrayBuffer());
      imageEnUrl = await uploadFile(buffer, imageEnFile.name, "categories");
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        nameAr,
        nameEn,
        descriptionAr,
        descriptionEn,
        brandId,
        isHidden,
        image: imageUrl,
        imageEn: imageEnUrl,
      },
      include: { brand: true },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existingCategory = await prisma.category.findUnique({ where: { id: params.id } });
    if (!existingCategory) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (existingCategory.image) await deleteFile(existingCategory.image);
    if (existingCategory.imageEn) await deleteFile(existingCategory.imageEn);

    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
