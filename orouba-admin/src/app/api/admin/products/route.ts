import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadFile } from "@/lib/upload";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        categories: { include: { category: true } },
        images: true,
        type: true,
      },
      orderBy: { id: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
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
    const color = formData.get("color") as string || "#ffffff";
    const typeId = formData.get("typeId") as string || null;
    const categoryIds = formData.getAll("categoryIds") as string[];
    const isHidden = formData.get("isHidden") === "true";
    
    // Multiple images
    const imageFiles = formData.getAll("images") as File[];

    if (!nameAr || !nameEn) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Upload images
    const imageUrls: string[] = [];
    for (const file of imageFiles) {
      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const url = await uploadFile(buffer, file.name, "products");
        imageUrls.push(url);
      }
    }

    const product = await prisma.product.create({
      data: {
        nameAr,
        nameEn,
        descriptionAr,
        descriptionEn,
        color,
        isHidden,
        typeId: typeId || null,
        categories: {
          create: categoryIds.map(catId => ({ categoryId: catId }))
        },
        images: {
          create: imageUrls.map(url => ({ url }))
        }
      },
      include: {
        categories: { include: { category: true } },
        images: true,
        type: true,
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
