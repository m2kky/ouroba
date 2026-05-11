import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadFile, deleteFile } from "@/lib/upload";

export async function GET() {
  try {
    const standards = await prisma.standard.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(standards);
  } catch {
    return NextResponse.json({ error: "Failed to fetch standards" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const formData = await req.formData();
    const descriptionAr = formData.get("descriptionAr") as string;
    const descriptionEn = formData.get("descriptionEn") as string;
    const isHidden = formData.get("isHidden") === "true";
    const file = formData.get("image") as File | null;
    let image: string | null = null;
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      image = await uploadFile(buffer, file.name, "standards");
    }
    const standard = await prisma.standard.create({
      data: { descriptionAr, descriptionEn, image, isHidden },
    });
    return NextResponse.json(standard);
  } catch {
    return NextResponse.json({ error: "Failed to create standard" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const descriptionAr = formData.get("descriptionAr") as string;
    const descriptionEn = formData.get("descriptionEn") as string;
    const isHidden = formData.get("isHidden") === "true";
    const file = formData.get("image") as File | null;
    const existing = await prisma.standard.findUnique({ where: { id } });
    let image = existing?.image || null;
    if (file && file.size > 0) {
      if (existing?.image) await deleteFile(existing.image);
      const buffer = Buffer.from(await file.arrayBuffer());
      image = await uploadFile(buffer, file.name, "standards");
    }
    const standard = await prisma.standard.update({
      where: { id },
      data: { descriptionAr, descriptionEn, image, isHidden },
    });
    return NextResponse.json(standard);
  } catch {
    return NextResponse.json({ error: "Failed to update standard" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const existing = await prisma.standard.findUnique({ where: { id } });
    if (existing?.image) await deleteFile(existing.image);
    await prisma.standard.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
