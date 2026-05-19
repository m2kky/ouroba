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
    const titleAr = formData.get("titleAr") as string;
    const titleEn = formData.get("titleEn") as string;
    const type = formData.get("type") as "image" | "video";
    const isHidden = formData.get("isHidden") === "true";

    let videoLink = formData.get("videoLink") as string || null;
    let videoLinkEn = formData.get("videoLinkEn") as string || null;
    let smallVideo = formData.get("smallVideo") as string || null;
    let smallVideoEn = formData.get("smallVideoEn") as string || null;

    if (!titleAr || !titleEn) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingBanner = await prisma.banner.findUnique({ where: { id: resolvedParams.id } });
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

    const uploadedVideoLink = await processUpload("videoFile", existingBanner.videoLink);
    if (uploadedVideoLink && uploadedVideoLink !== existingBanner.videoLink) videoLink = uploadedVideoLink;

    const uploadedVideoLinkEn = await processUpload("videoFileEn", existingBanner.videoLinkEn);
    if (uploadedVideoLinkEn && uploadedVideoLinkEn !== existingBanner.videoLinkEn) videoLinkEn = uploadedVideoLinkEn;

    const uploadedSmallVideo = await processUpload("smallVideoFile", existingBanner.smallVideo);
    if (uploadedSmallVideo && uploadedSmallVideo !== existingBanner.smallVideo) smallVideo = uploadedSmallVideo;

    const uploadedSmallVideoEn = await processUpload("smallVideoFileEn", existingBanner.smallVideoEn);
    if (uploadedSmallVideoEn && uploadedSmallVideoEn !== existingBanner.smallVideoEn) smallVideoEn = uploadedSmallVideoEn;

    const banner = await prisma.banner.update({
      where: { id: resolvedParams.id },
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

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const existingBanner = await prisma.banner.findUnique({ where: { id: resolvedParams.id } });
    if (!existingBanner) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Clean up files
    if (existingBanner.image) await deleteFile(existingBanner.image);
    if (existingBanner.imageEn) await deleteFile(existingBanner.imageEn);
    if (existingBanner.smallImg) await deleteFile(existingBanner.smallImg);
    if (existingBanner.smallImgEn) await deleteFile(existingBanner.smallImgEn);
    if (existingBanner.videoLink && existingBanner.videoLink.includes('pub-')) await deleteFile(existingBanner.videoLink);
    if (existingBanner.videoLinkEn && existingBanner.videoLinkEn.includes('pub-')) await deleteFile(existingBanner.videoLinkEn);
    if (existingBanner.smallVideo && existingBanner.smallVideo.includes('pub-')) await deleteFile(existingBanner.smallVideo);
    if (existingBanner.smallVideoEn && existingBanner.smallVideoEn.includes('pub-')) await deleteFile(existingBanner.smallVideoEn);

    await prisma.banner.delete({ where: { id: resolvedParams.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting banner:", error);
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
  }
}
