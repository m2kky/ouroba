import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadFile, deleteFile } from "@/lib/upload";

export async function GET() {
  try { return NextResponse.json(await prisma.value.findMany({ orderBy: { createdAt: "desc" } })); }
  catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const fd = await req.formData();
    const file = fd.get("image") as File | null;
    let image: string | null = null;
    if (file && file.size > 0) { image = await uploadFile(Buffer.from(await file.arrayBuffer()), file.name, "values"); }
    const item = await prisma.value.create({ data: { titleAr: fd.get("titleAr") as string, titleEn: fd.get("titleEn") as string, descriptionAr: fd.get("descriptionAr") as string || null, descriptionEn: fd.get("descriptionEn") as string || null, image, isHidden: fd.get("isHidden") === "true" } });
    return NextResponse.json(item);
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const fd = await req.formData();
    const id = fd.get("id") as string;
    const existing = await prisma.value.findUnique({ where: { id } });
    const file = fd.get("image") as File | null;
    let image = existing?.image || null;
    if (file && file.size > 0) { if (existing?.image) await deleteFile(existing.image); image = await uploadFile(Buffer.from(await file.arrayBuffer()), file.name, "values"); }
    const item = await prisma.value.update({ where: { id }, data: { titleAr: fd.get("titleAr") as string, titleEn: fd.get("titleEn") as string, descriptionAr: fd.get("descriptionAr") as string || null, descriptionEn: fd.get("descriptionEn") as string || null, image, isHidden: fd.get("isHidden") === "true" } });
    return NextResponse.json(item);
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const existing = await prisma.value.findUnique({ where: { id } });
    if (existing?.image) await deleteFile(existing.image);
    await prisma.value.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
