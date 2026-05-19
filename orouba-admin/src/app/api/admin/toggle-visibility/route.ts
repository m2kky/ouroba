import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const allowedModels = [
  "brand",
  "categoryType",
  "category",
  "productType",
  "product",
  "categoryProduct",
  "recipeCategory",
  "recipe",
  "food",
  "banner",
  "certificate",
  "standard",
  "value",
  "whyChooseUs",
  "building",
  "feature",
  "productionStep",
  "sectionText",
  "social",
  "productSocial",
  "continent",
  "country",
  "chatMenuItem"
];

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { model, id, isHidden } = await req.json();

    if (!model || !id || typeof isHidden !== 'boolean') {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!allowedModels.includes(model)) {
      return NextResponse.json({ error: "Invalid model specified" }, { status: 400 });
    }

    // @ts-ignore - Dynamic model access
    const updatedRecord = await prisma[model].update({
      where: { id },
      data: { isHidden },
    });

    return NextResponse.json({ success: true, isHidden: updatedRecord.isHidden });
  } catch (error) {
    console.error(`Error toggling visibility for ${req.url}:`, error);
    return NextResponse.json({ error: "Failed to toggle visibility" }, { status: 500 });
  }
}
