import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadFile, deleteFile } from "@/lib/upload";

export async function GET() {
  try {
    const certs = await prisma.certificate.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(certs);
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const formData = await req.formData();
    const isHidden = formData.get("isHidden") === "true";
    const file = formData.get("image") as File | null;
    let image = "";
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      image = await uploadFile(buffer, file.name, "certificates");
    }
    if (!image) return NextResponse.json({ error: "Image required" }, { status: 400 });
    const cert = await prisma.certificate.create({ data: { image, isHidden } });
    return NextResponse.json(cert);
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const isHidden = formData.get("isHidden") === "true";
    const file = formData.get("image") as File | null;
    const existing = await prisma.certificate.findUnique({ where: { id } });
    let image = existing?.image || "";
    if (file && file.size > 0) {
      if (existing?.image) await deleteFile(existing.image);
      const buffer = Buffer.from(await file.arrayBuffer());
      image = await uploadFile(buffer, file.name, "certificates");
    }
    const cert = await prisma.certificate.update({ where: { id }, data: { image, isHidden } });
    return NextResponse.json(cert);
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const existing = await prisma.certificate.findUnique({ where: { id } });
    if (existing?.image) await deleteFile(existing.image);
    await prisma.certificate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
