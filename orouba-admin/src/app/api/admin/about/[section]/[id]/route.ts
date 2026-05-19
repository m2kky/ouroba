import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadFile, deleteFile } from "@/lib/upload";

const sectionToModel: Record<string, string> = {
  certificates: "certificate",
  standards: "standard",
  values: "value",
  "why-choose-us": "whyChooseUs",
  buildings: "building",
  features: "feature",
  "production-steps": "productionStep",
  "section-texts": "sectionText"
};

export async function PUT(req: Request, { params }: { params: Promise<{ section: string, id: string }> }) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const modelName = sectionToModel[resolvedParams.section];
  if (!modelName) return NextResponse.json({ error: "Invalid section" }, { status: 400 });

  try {
    const existing = await (prisma as any)[modelName].findUnique({ where: { id: resolvedParams.id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const formData = await req.formData();
    
    const data: any = {};
    const titleAr = formData.get("titleAr") as string;
    const titleEn = formData.get("titleEn") as string;
    const descriptionAr = formData.get("descriptionAr") as string;
    const descriptionEn = formData.get("descriptionEn") as string;
    const textAr = formData.get("textAr") as string;
    const textEn = formData.get("textEn") as string;
    const number = formData.get("number") as string;
    const isHidden = formData.get("isHidden") === "true";

    if (titleAr !== null) data.titleAr = titleAr;
    if (titleEn !== null) data.titleEn = titleEn;
    if (descriptionAr !== null) data.descriptionAr = descriptionAr;
    if (descriptionEn !== null) data.descriptionEn = descriptionEn;
    if (textAr !== null) data.textAr = textAr;
    if (textEn !== null) data.textEn = textEn;
    if (number) data.number = parseInt(number, 10);
    data.isHidden = isHidden;

    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      if (existing.image) await deleteFile(existing.image);
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      data.image = await uploadFile(buffer, imageFile.name, `about-${resolvedParams.section}`);
    }

    const item = await (prisma as any)[modelName].update({
      where: { id: resolvedParams.id },
      data
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error(`Error updating ${resolvedParams.section}:`, error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ section: string, id: string }> }) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const modelName = sectionToModel[resolvedParams.section];
  if (!modelName) return NextResponse.json({ error: "Invalid section" }, { status: 400 });

  try {
    const existing = await (prisma as any)[modelName].findUnique({ where: { id: resolvedParams.id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (existing.image) await deleteFile(existing.image);

    await (prisma as any)[modelName].delete({ where: { id: resolvedParams.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting ${resolvedParams.section}:`, error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
