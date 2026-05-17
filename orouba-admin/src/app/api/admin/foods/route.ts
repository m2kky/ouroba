import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadFile } from "@/lib/upload";

export async function GET() {
  try {
    const foods = await prisma.food.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(foods);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch foods" }, { status: 500 });
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
    const brandId = formData.get("brandId") as string || null;
    const isHidden = formData.get("isHidden") === "true";
    const imageFile = formData.get("image") as File | null;

    if (!nameAr || !nameEn) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imageUrl = await uploadFile(buffer, imageFile.name, "foods");
    }

    const food = await prisma.food.create({
      data: {
        nameAr,
        nameEn,
        brandId,
        isHidden,
        image: imageUrl,
      },
    });

    return NextResponse.json(food);
  } catch (error) {
    console.error("Error creating food:", error);
    return NextResponse.json({ error: "Failed to create food" }, { status: 500 });
  }
}
