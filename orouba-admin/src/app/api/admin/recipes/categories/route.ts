import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadFile } from "@/lib/upload";

export async function GET() {
  try {
    const categories = await prisma.recipeCategory.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Failed to fetch recipe categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
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

    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imageUrl = await uploadFile(buffer, imageFile.name, "recipe_categories");
    }

    const category = await prisma.recipeCategory.create({
      data: { nameAr, nameEn, number, isHidden, image: imageUrl },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error creating recipe category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
