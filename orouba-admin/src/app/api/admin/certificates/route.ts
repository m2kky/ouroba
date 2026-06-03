import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteFile, uploadFile } from "@/lib/upload";

type AdminSession = {
  user?: {
    role?: string;
  };
} | null;

async function assertAdmin() {
  const session = (await getServerSession(authOptions)) as AdminSession;
  return session?.user?.role === "ADMIN";
}

export async function GET() {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(certificates);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const isHidden = formData.get("isHidden") === "true";

    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json({ error: "Certificate image is required" }, { status: 400 });
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const image = await uploadFile(buffer, imageFile.name, "certificates");

    const certificate = await prisma.certificate.create({
      data: {
        image,
        isHidden,
      },
    });

    return NextResponse.json(certificate, { status: 201 });
  } catch (error) {
    console.error("Error creating certificate:", error);
    return NextResponse.json({ error: "Failed to create certificate" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const id = formData.get("id") as string | null;
    const imageFile = formData.get("image") as File | null;
    const isHidden = formData.get("isHidden") === "true";

    if (!id) {
      return NextResponse.json({ error: "Certificate id is required" }, { status: 400 });
    }

    const existing = await prisma.certificate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    const data: { image?: string; isHidden: boolean } = { isHidden };

    if (imageFile && imageFile.size > 0) {
      await deleteFile(existing.image);
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      data.image = await uploadFile(buffer, imageFile.name, "certificates");
    }

    const certificate = await prisma.certificate.update({
      where: { id },
      data,
    });

    return NextResponse.json(certificate);
  } catch (error) {
    console.error("Error updating certificate:", error);
    return NextResponse.json({ error: "Failed to update certificate" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Certificate id is required" }, { status: 400 });
    }

    const existing = await prisma.certificate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    await deleteFile(existing.image);
    await prisma.certificate.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting certificate:", error);
    return NextResponse.json({ error: "Failed to delete certificate" }, { status: 500 });
  }
}
