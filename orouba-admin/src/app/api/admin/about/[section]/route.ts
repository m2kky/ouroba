import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadFile } from "@/lib/upload";

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

export async function GET(req: Request, { params }: { params: Promise<{ section: string }> }) {
  const resolvedParams = await params;
  const modelName = sectionToModel[resolvedParams.section];
  if (!modelName) return NextResponse.json({ error: "Invalid section" }, { status: 400 });

  try {
    const items = await (prisma as any)[modelName].findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ section: string }> }) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const modelName = sectionToModel[resolvedParams.section];
  if (!modelName) return NextResponse.json({ error: "Invalid section" }, { status: 400 });

  try {
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

    if (titleAr) data.titleAr = titleAr;
    if (titleEn) data.titleEn = titleEn;
    if (descriptionAr) data.descriptionAr = descriptionAr;
    if (descriptionEn) data.descriptionEn = descriptionEn;
    if (textAr) data.textAr = textAr;
    if (textEn) data.textEn = textEn;
    if (number) data.number = parseInt(number, 10);
    data.isHidden = isHidden;

    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      data.image = await uploadFile(buffer, imageFile.name, `about-${resolvedParams.section}`);
    }

    const item = await (prisma as any)[modelName].create({ data });
    return NextResponse.json(item);
  } catch (error) {
    console.error(`Error creating ${resolvedParams.section}:`, error);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}
