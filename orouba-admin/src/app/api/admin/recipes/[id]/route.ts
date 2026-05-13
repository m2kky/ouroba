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
    const deletedImageIds = formData.getAll("deletedImageIds") as string[];
    
    // Arrays sent as JSON strings
    const properties = JSON.parse(formData.get("properties") as string || "[]");
    const steps = JSON.parse(formData.get("steps") as string || "[]");
    const foodIds = JSON.parse(formData.get("foods") as string || "[]");
    const recommendedProductIds = JSON.parse(formData.get("recommendedWith") as string || "[]");

    if (!nameAr || !nameEn) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingRecipe = await prisma.recipe.findUnique({ where: { id: params.id } });
    if (!existingRecipe) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let internalImageUrl = existingRecipe.internalImage;
    if (internalImageFile && internalImageFile.size > 0) {
      if (existingRecipe.internalImage) await deleteFile(existingRecipe.internalImage);
      const buffer = Buffer.from(await internalImageFile.arrayBuffer());
      internalImageUrl = await uploadFile(buffer, internalImageFile.name, "recipes");
    }

    // Handle deleted images
    if (deletedImageIds.length > 0) {
      const imagesToDelete = await prisma.recipeImage.findMany({
        where: { id: { in: deletedImageIds }, recipeId: params.id }
      });
      
      for (const img of imagesToDelete) {
        await deleteFile(img.url);
      }
      
      await prisma.recipeImage.deleteMany({
        where: { id: { in: deletedImageIds } }
      });
    }

    const imageUrls: string[] = [];
    for (const file of imageFiles) {
      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const url = await uploadFile(buffer, file.name, "recipes");
        imageUrls.push(url);
      }
    }

    const recipe = await prisma.recipe.update({
      where: { id: params.id },
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
          deleteMany: {},
          create: properties.map((prop: any) => ({
            icon: prop.icon || null,
            titleAr: prop.titleAr,
            titleEn: prop.titleEn,
            textAr: prop.textAr,
            textEn: prop.textEn,
          }))
        },
        steps: {
          deleteMany: {},
          create: steps.map((step: any) => ({
            stepAr: step.stepAr,
            stepEn: step.stepEn,
          }))
        },
        foods: {
          deleteMany: {},
          create: foodIds.map((fid: string) => ({ foodId: fid }))
        },
        recommendedWith: {
          deleteMany: {},
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
    console.error("Error updating recipe:", error);
    return NextResponse.json({ error: "Failed to update recipe" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existingRecipe = await prisma.recipe.findUnique({ 
      where: { id: params.id },
      include: { images: true }
    });
    if (!existingRecipe) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (existingRecipe.internalImage) await deleteFile(existingRecipe.internalImage);
    for (const img of existingRecipe.images) {
      await deleteFile(img.url);
    }

    await prisma.recipe.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return NextResponse.json({ error: "Failed to delete recipe" }, { status: 500 });
  }
}
