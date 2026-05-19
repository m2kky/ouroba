import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadFile } from "@/lib/upload";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const category = await prisma.recipeCategory.findUnique({
      where: { id: params.id },
      include: {
        foods: {
          include: { food: true }
        }
      }
    });

    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    // Return the mapped foods
    return NextResponse.json(category.foods.map(f => f.food));
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subcategories" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    // They can either send an existing foodId to link, OR send data to create a new Food and link it.
    const foodId = formData.get("foodId") as string;

    if (foodId) {
      // Just link existing
      const existingLink = await prisma.recipeCategoryFood.findUnique({
        where: { recipeCategoryId_foodId: { recipeCategoryId: params.id, foodId } }
      });
      if (existingLink) {
        return NextResponse.json({ error: "Subcategory already linked" }, { status: 400 });
      }
      const newLink = await prisma.recipeCategoryFood.create({
        data: { recipeCategoryId: params.id, foodId }
      });
      return NextResponse.json(newLink);
    } else {
      // Create new Food and link
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
        imageUrl = await uploadFile(buffer, imageFile.name, "foods");
      }

      // Create food and link in one transaction
      const food = await prisma.food.create({
        data: {
          nameAr,
          nameEn,
          number,
          isHidden,
          image: imageUrl,
          recipeCategories: {
            create: { recipeCategoryId: params.id }
          }
        }
      });

      return NextResponse.json(food);
    }
  } catch (error) {
    console.error("Error managing subcategory:", error);
    return NextResponse.json({ error: "Failed to manage subcategory" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const foodId = searchParams.get("foodId");

    if (!foodId) {
      return NextResponse.json({ error: "Food ID is required" }, { status: 400 });
    }

    await prisma.recipeCategoryFood.delete({
      where: { recipeCategoryId_foodId: { recipeCategoryId: params.id, foodId } }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unlinking subcategory:", error);
    return NextResponse.json({ error: "Failed to unlink subcategory" }, { status: 500 });
  }
}
