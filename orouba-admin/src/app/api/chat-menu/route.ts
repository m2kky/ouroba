import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET active chat menu items (public)
export async function GET() {
  try {
    const items = await prisma.chatMenuItem.findMany({
      where: { isHidden: false },
      orderBy: { number: "asc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch chat menu:", error);
    return NextResponse.json([], { status: 200 });
  }
}
