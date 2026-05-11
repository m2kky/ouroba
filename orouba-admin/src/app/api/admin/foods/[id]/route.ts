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
    const isHidden = formData.get("isHidden") === "true";
    const imageFile = formData.get("image") as File | null;

    if (!nameAr || !nameEn) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingFood = await prisma.food.findUnique({ where: { id: params.id } });
    if (!existingFood) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let imageUrl = existingFood.image;
    if (imageFile && imageFile.size > 0) {
      if (existingFood.image) await deleteFile(existingFood.image);
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imageUrl = await uploadFile(buffer, imageFile.name, "foods");
    }

    const food = await prisma.food.update({
      where: { id: params.id },
      data: {
        nameAr,
        nameEn,
        isHidden,
        image: imageUrl,
      },
    });

    return NextResponse.json(food);
  } catch (error) {
    console.error("Error updating food:", error);
    return NextResponse.json({ error: "Failed to update food" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existingFood = await prisma.food.findUnique({ where: { id: params.id } });
    if (!existingFood) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (existingFood.image) await deleteFile(existingFood.image);

    await prisma.food.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting food:", error);
    return NextResponse.json({ error: "Failed to delete food" }, { status: 500 });
  }
}
