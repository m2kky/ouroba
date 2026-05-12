import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT update
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const item = await prisma.chatMenuItem.update({
      where: { id },
      data: {
        labelAr: body.labelAr,
        labelEn: body.labelEn,
        icon: body.icon,
        linkUrl: body.linkUrl,
        parentId: body.parentId,
        number: body.number,
        isHidden: body.isHidden,
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error("Failed to update chat menu item:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Delete sub-items first
    await prisma.chatMenuItem.deleteMany({ where: { parentId: id } });
    await prisma.chatMenuItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete chat menu item:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
