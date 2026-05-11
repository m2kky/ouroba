import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadFile, deleteFile } from "@/lib/upload";

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(brands);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 });
  }
}

export async function POST(req: Request) {
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

    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imageUrl = await uploadFile(buffer, imageFile.name, "brands");
    }

    let imageMainUrl = null;
    if (imageMainFile && imageMainFile.size > 0) {
      const buffer = Buffer.from(await imageMainFile.arrayBuffer());
      imageMainUrl = await uploadFile(buffer, imageMainFile.name, "brands");
    }

    const brand = await prisma.brand.create({
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
    console.error("Error creating brand:", error);
    return NextResponse.json({ error: "Failed to create brand" }, { status: 500 });
  }
}
