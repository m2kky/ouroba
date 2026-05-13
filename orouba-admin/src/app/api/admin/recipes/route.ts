import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadFile } from "@/lib/upload";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const recipes = await prisma.recipe.findMany({
      include: {
        images: true,
        properties: true,
        steps: true,
        foods: { include: { food: true } },
        recommendedWith: { include: { product: true } },
      },
      orderBy: { id: "desc" },
    });
    return NextResponse.json(recipes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 });
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
    const descriptionAr = formData.get("descriptionAr") as string;
    const descriptionEn = formData.get("descriptionEn") as string;
    const videoLink = formData.get("videoLink") as string || null;
    const tagEn = formData.get("tagEn") as string || null;
    const tagAr = formData.get("tagAr") as string || null;
    const internalImageFile = formData.get("internalImage") as File | null;
    const isHidden = formData.get("isHidden") === "true";
    
    // Multiple images
    const imageFiles = formData.getAll("images") as File[];
    
    // Arrays sent as JSON strings
    const properties = JSON.parse(formData.get("properties") as string || "[]");
    const steps = JSON.parse(formData.get("steps") as string || "[]");
    const foodIds = JSON.parse(formData.get("foods") as string || "[]");
    const recommendedProductIds = JSON.parse(formData.get("recommendedWith") as string || "[]");

    if (!nameAr || !nameEn) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let internalImageUrl = null;
    if (internalImageFile && internalImageFile.size > 0) {
      const buffer = Buffer.from(await internalImageFile.arrayBuffer());
      internalImageUrl = await uploadFile(buffer, internalImageFile.name, "recipes");
    }

    const imageUrls: string[] = [];
    for (const file of imageFiles) {
      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const url = await uploadFile(buffer, file.name, "recipes");
        imageUrls.push(url);
      }
    }

    const recipe = await prisma.recipe.create({
      data: {
        nameAr,
        nameEn,
        descriptionAr,
        descriptionEn,
        videoLink,
        tagEn,
        tagAr,
        internalImage: internalImageUrl,
        isHidden,
        images: {
          create: imageUrls.map(url => ({ url }))
        },
        properties: {
          create: properties.map((prop: any) => ({
            icon: prop.icon || null,
            titleAr: prop.titleAr,
            titleEn: prop.titleEn,
            textAr: prop.textAr,
            textEn: prop.textEn,
          }))
        },
        steps: {
          create: steps.map((step: any) => ({
            stepAr: step.stepAr,
            stepEn: step.stepEn,
          }))
        },
        foods: {
          create: foodIds.map((fid: string) => ({ foodId: fid }))
        },
        recommendedWith: {
          create: recommendedProductIds.map((pid: string) => ({ productId: pid }))
        }
      },
      include: {
        images: true,
        properties: true,
        steps: true,
        foods: { include: { food: true } },
        recommendedWith: { include: { product: true } }
      }
    });

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json({ error: "Failed to create recipe" }, { status: 500 });
  }
}
