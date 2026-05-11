import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadFile } from "@/lib/upload";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { brand: true },
      orderBy: { id: "desc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
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
    const brandId = formData.get("brandId") as string;
    const descriptionAr = formData.get("descriptionAr") as string || "";
    const descriptionEn = formData.get("descriptionEn") as string || "";
    const isHidden = formData.get("isHidden") === "true";
    const imageFile = formData.get("image") as File | null;
    const imageEnFile = formData.get("imageEn") as File | null;

    if (!nameAr || !nameEn || !brandId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imageUrl = await uploadFile(buffer, imageFile.name, "categories");
    }

    let imageEnUrl = null;
    if (imageEnFile && imageEnFile.size > 0) {
      const buffer = Buffer.from(await imageEnFile.arrayBuffer());
      imageEnUrl = await uploadFile(buffer, imageEnFile.name, "categories");
    }

    const category = await prisma.category.create({
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
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
