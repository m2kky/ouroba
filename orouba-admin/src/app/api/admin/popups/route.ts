import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all popups (admin)
export async function GET() {
  try {
    const popups = await prisma.popup.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(popups);
  } catch (error) {
    console.error("Failed to fetch popups:", error);
    return NextResponse.json({ error: "Failed to fetch popups" }, { status: 500 });
  }
}

// POST create popup
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const popup = await prisma.popup.create({
      data: {
        internalName: body.internalName || "Untitled Popup",
        titleEn: body.titleEn || null,
        titleAr: body.titleAr || null,
        contentEn: body.contentEn || null,
        contentAr: body.contentAr || null,
        image: body.image || null,
        type: body.type || "MODAL",
        animation: body.animation || "FADE",
        backgroundColor: body.backgroundColor || "#ffffff",
        textColor: body.textColor || "#000000",
        overlayColor: body.overlayColor || "rgba(0,0,0,0.5)",
        borderRadius: body.borderRadius ?? 16,
        maxWidth: body.maxWidth ?? 500,
        buttons: body.buttons || null,
        trigger: body.trigger || "ON_LOAD",
        triggerValue: body.triggerValue ?? 0,
        conditions: body.conditions || null,
        isActive: body.isActive ?? false,
        priority: body.priority ?? 0,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
      },
    });

    return NextResponse.json(popup, { status: 201 });
  } catch (error) {
    console.error("Failed to create popup:", error);
    return NextResponse.json({ error: "Failed to create popup" }, { status: 500 });
  }
}
