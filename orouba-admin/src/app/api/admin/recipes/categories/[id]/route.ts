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
    const number = parseInt(formData.get("number") as string || "999", 10);
    const isHidden = formData.get("isHidden") === "true";
    const imageFile = formData.get("image") as File | null;

    if (!nameAr || !nameEn) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingCategory = await prisma.recipeCategory.findUnique({ where: { id: params.id } });
    if (!existingCategory) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let imageUrl = existingCategory.image;
    if (imageFile && imageFile.size > 0) {
      if (existingCategory.image) await deleteFile(existingCategory.image);
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imageUrl = await uploadFile(buffer, imageFile.name, "recipe_categories");
    }

    const category = await prisma.recipeCategory.update({
      where: { id: params.id },
      data: { nameAr, nameEn, number, isHidden, image: imageUrl },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating recipe category:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existingCategory = await prisma.recipeCategory.findUnique({ where: { id: params.id } });
    if (!existingCategory) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (existingCategory.image) await deleteFile(existingCategory.image);

    await prisma.recipeCategory.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting recipe category:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
