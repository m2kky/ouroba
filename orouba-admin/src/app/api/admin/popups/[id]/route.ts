import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single popup
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const popup = await prisma.popup.findUnique({ where: { id } });
    if (!popup) {
      return NextResponse.json({ error: "Popup not found" }, { status: 404 });
    }
    return NextResponse.json(popup);
  } catch (error) {
    console.error("Failed to fetch popup:", error);
    return NextResponse.json({ error: "Failed to fetch popup" }, { status: 500 });
  }
}

// PUT update popup
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const popup = await prisma.popup.update({
      where: { id },
      data: {
        internalName: body.internalName,
        titleEn: body.titleEn,
        titleAr: body.titleAr,
        contentEn: body.contentEn,
        contentAr: body.contentAr,
        image: body.image,
        type: body.type,
        animation: body.animation,
        backgroundColor: body.backgroundColor,
        textColor: body.textColor,
        overlayColor: body.overlayColor,
        borderRadius: body.borderRadius,
        maxWidth: body.maxWidth,
        buttons: body.buttons,
        trigger: body.trigger,
        triggerValue: body.triggerValue,
        conditions: body.conditions,
        isActive: body.isActive,
        priority: body.priority,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
      },
    });

    return NextResponse.json(popup);
  } catch (error) {
    console.error("Failed to update popup:", error);
    return NextResponse.json({ error: "Failed to update popup" }, { status: 500 });
  }
}

// DELETE popup
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.popup.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete popup:", error);
    return NextResponse.json({ error: "Failed to delete popup" }, { status: 500 });
  }
}
