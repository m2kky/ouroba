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
    const descriptionAr = formData.get("descriptionAr") as string || "";
    const descriptionEn = formData.get("descriptionEn") as string || "";
    const colorBrand = formData.get("colorBrand") as string || "#ffffff";
    const colorHover = formData.get("colorHover") as string || "#eeeeee";
    const imageFile = formData.get("image") as File | null;
    const imageMainFile = formData.get("imageMain") as File | null;

    if (!nameAr || !nameEn) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingBrand = await prisma.brand.findUnique({ where: { id: params.id } });
    if (!existingBrand) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let imageUrl = existingBrand.image;
    if (imageFile && imageFile.size > 0) {
      if (existingBrand.image) await deleteFile(existingBrand.image);
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imageUrl = await uploadFile(buffer, imageFile.name, "brands");
    }

    let imageMainUrl = existingBrand.imageMain;
    if (imageMainFile && imageMainFile.size > 0) {
      if (existingBrand.imageMain) await deleteFile(existingBrand.imageMain);
      const buffer = Buffer.from(await imageMainFile.arrayBuffer());
      imageMainUrl = await uploadFile(buffer, imageMainFile.name, "brands");
    }

    const brand = await prisma.brand.update({
      where: { id: params.id },
      data: {
        nameAr,
        nameEn,
        descriptionAr,
        descriptionEn,
        colorBrand,
        colorHover,
        image: imageUrl,
        imageMain: imageMainUrl,
      },
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.error("Error updating brand:", error);
    return NextResponse.json({ error: "Failed to update brand" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existingBrand = await prisma.brand.findUnique({ where: { id: params.id } });
    if (!existingBrand) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (existingBrand.image) await deleteFile(existingBrand.image);
    if (existingBrand.imageMain) await deleteFile(existingBrand.imageMain);

    await prisma.brand.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
  }
}
