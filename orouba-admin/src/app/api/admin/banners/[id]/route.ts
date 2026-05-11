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
    const titleAr = formData.get("titleAr") as string;
    const titleEn = formData.get("titleEn") as string;
    const type = formData.get("type") as "image" | "video";
    const isHidden = formData.get("isHidden") === "true";

    const videoLink = formData.get("videoLink") as string || null;
    const videoLinkEn = formData.get("videoLinkEn") as string || null;
    const smallVideo = formData.get("smallVideo") as string || null;
    const smallVideoEn = formData.get("smallVideoEn") as string || null;

    if (!titleAr || !titleEn) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingBanner = await prisma.banner.findUnique({ where: { id: params.id } });
    if (!existingBanner) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const processUpload = async (key: string, existingUrl: string | null) => {
      const file = formData.get(key) as File | null;
      if (file && file.size > 0) {
        if (existingUrl) await deleteFile(existingUrl);
        const buffer = Buffer.from(await file.arrayBuffer());
        return await uploadFile(buffer, file.name, "banners");
      }
      return existingUrl; // Keep existing if no new file
    };

    const image = await processUpload("image", existingBanner.image);
    const imageEn = await processUpload("imageEn", existingBanner.imageEn);
    const smallImg = await processUpload("smallImg", existingBanner.smallImg);
    const smallImgEn = await processUpload("smallImgEn", existingBanner.smallImgEn);

    const banner = await prisma.banner.update({
      where: { id: params.id },
      data: {
        titleAr,
        titleEn,
        type,
        isHidden,
        image,
        imageEn,
        smallImg,
        smallImgEn,
        videoLink,
        videoLinkEn,
        smallVideo,
        smallVideoEn,
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error("Error updating banner:", error);
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existingBanner = await prisma.banner.findUnique({ where: { id: params.id } });
    if (!existingBanner) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Clean up files
    if (existingBanner.image) await deleteFile(existingBanner.image);
    if (existingBanner.imageEn) await deleteFile(existingBanner.imageEn);
    if (existingBanner.smallImg) await deleteFile(existingBanner.smallImg);
    if (existingBanner.smallImgEn) await deleteFile(existingBanner.smallImgEn);

    await prisma.banner.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting banner:", error);
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
  }
}
