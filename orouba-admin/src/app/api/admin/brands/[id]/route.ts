import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadFile, deleteFile } from "@/lib/upload";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const formData = await req.formData();
    const nameAr = formData.get("nameAr") as string;
    const nameEn = formData.get("nameEn") as string;
    const descriptionAr = formData.get("descriptionAr") as string || "";
    const descriptionEn = formData.get("descriptionEn") as string || "";
    const brandTextAr = formData.get("brandTextAr") as string || null;
    const brandTextEn = formData.get("brandTextEn") as string || null;
    const colorBrand = formData.get("colorBrand") as string || "#ffffff";
    const colorHover = formData.get("colorHover") as string || "#eeeeee";
    const number = parseInt(formData.get("number") as string || "999", 10);
    const isHidden = formData.get("isHidden") === "on";
    const imageFile = formData.get("image") as File | null;
    const imageMainFile = formData.get("imageMain") as File | null;
    const videoFile = formData.get("videoFile") as File | null;
    const videoFileEn = formData.get("videoFileEn") as File | null;

    if (!nameAr || !nameEn) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingBrand = await prisma.brand.findUnique({ where: { id: resolvedParams.id } });
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

    const videoUrlInput = formData.get("videoUrl") as string | null;
    const videoUrlEnInput = formData.get("videoUrlEn") as string | null;

    let videoUrl = videoUrlInput === "" ? null : (videoUrlInput || existingBrand.videoUrl);
    if (videoFile && videoFile.size > 0) {
      if (existingBrand.videoUrl && !existingBrand.videoUrl.startsWith("http")) await deleteFile(existingBrand.videoUrl);
      const buffer = Buffer.from(await videoFile.arrayBuffer());
      videoUrl = await uploadFile(buffer, videoFile.name, "brands");
    }

    let videoUrlEn = videoUrlEnInput === "" ? null : (videoUrlEnInput || existingBrand.videoUrlEn);
    if (videoFileEn && videoFileEn.size > 0) {
      if (existingBrand.videoUrlEn && !existingBrand.videoUrlEn.startsWith("http")) await deleteFile(existingBrand.videoUrlEn);
      const buffer = Buffer.from(await videoFileEn.arrayBuffer());
      videoUrlEn = await uploadFile(buffer, videoFileEn.name, "brands");
    }

    const brand = await prisma.brand.update({
      where: { id: resolvedParams.id },
      data: {
        nameAr,
        nameEn,
        descriptionAr,
        descriptionEn,
        brandTextAr,
        brandTextEn,
        colorBrand,
        colorHover,
        number,
        isHidden,
        image: imageUrl,
        imageMain: imageMainUrl,
        videoUrl,
        videoUrlEn,
      },
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.error("Error updating brand:", error);
    return NextResponse.json({ error: "Failed to update brand" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const existingBrand = await prisma.brand.findUnique({ where: { id: resolvedParams.id } });
    if (!existingBrand) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (existingBrand.image) await deleteFile(existingBrand.image);
    if (existingBrand.imageMain) await deleteFile(existingBrand.imageMain);
    if (existingBrand.videoUrl) await deleteFile(existingBrand.videoUrl);
    if (existingBrand.videoUrlEn) await deleteFile(existingBrand.videoUrlEn);

    await prisma.brand.delete({ where: { id: resolvedParams.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
  }
}
