import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all chat menu items (admin)
export async function GET() {
  try {
    const items = await prisma.chatMenuItem.findMany({
      orderBy: { number: "asc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch chat menu items:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// POST create chat menu item
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const item = await prisma.chatMenuItem.create({
      data: {
        labelAr: body.labelAr || "",
        labelEn: body.labelEn || "",
        icon: body.icon || null,
        linkUrl: body.linkUrl || null,
        parentId: body.parentId || null,
        number: body.number ?? 999,
        isHidden: body.isHidden ?? false,
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Failed to create chat menu item:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
