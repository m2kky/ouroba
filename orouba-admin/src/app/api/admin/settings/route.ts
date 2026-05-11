import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany({
      orderBy: { key: "asc" },
    });
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const settingsArray = body.settings as { key: string; valueEn: string; valueAr: string; description?: string }[];

    if (!Array.isArray(settingsArray)) {
      return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
    }

    const updatedSettings = [];

    for (const setting of settingsArray) {
      const updated = await prisma.siteSetting.upsert({
        where: { key: setting.key },
        update: {
          valueEn: setting.valueEn,
          valueAr: setting.valueAr,
          description: setting.description,
        },
        create: {
          key: setting.key,
          valueEn: setting.valueEn,
          valueAr: setting.valueAr,
          description: setting.description,
        },
      });
      updatedSettings.push(updated);
    }

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
