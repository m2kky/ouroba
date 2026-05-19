import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadFile } from "@/lib/upload";

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}

export async function POST(req: Request) {
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

    let videoLink = formData.get("videoLink") as string || null;
    let videoLinkEn = formData.get("videoLinkEn") as string || null;
    let smallVideo = formData.get("smallVideo") as string || null;
    let smallVideoEn = formData.get("smallVideoEn") as string || null;

    if (!titleAr || !titleEn) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const processUpload = async (key: string) => {
      const file = formData.get(key) as File | null;
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        return await uploadFile(buffer, file.name, "banners");
      }
      return null;
    };

    const image = await processUpload("image");
    const imageEn = await processUpload("imageEn");
    const smallImg = await processUpload("smallImg");
    const smallImgEn = await processUpload("smallImgEn");

    const uploadedVideoLink = await processUpload("videoFile");
    if (uploadedVideoLink) videoLink = uploadedVideoLink;

    const uploadedVideoLinkEn = await processUpload("videoFileEn");
    if (uploadedVideoLinkEn) videoLinkEn = uploadedVideoLinkEn;

    const uploadedSmallVideo = await processUpload("smallVideoFile");
    if (uploadedSmallVideo) smallVideo = uploadedSmallVideo;

    const uploadedSmallVideoEn = await processUpload("smallVideoFileEn");
    if (uploadedSmallVideoEn) smallVideoEn = uploadedSmallVideoEn;

    const banner = await prisma.banner.create({
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
    console.error("Error creating banner:", error);
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}
