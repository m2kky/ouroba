import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const steps = await prisma.recipeStep.findMany({
      where: { recipeId: params.id },
      orderBy: { id: "asc" } // Assuming steps are added in order. If they have order/number, sort by that.
    });
    return NextResponse.json(steps);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch steps" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { steps } = await req.json();

    if (!Array.isArray(steps)) {
      return NextResponse.json({ error: "Invalid steps data" }, { status: 400 });
    }

    // Bulk update: delete all existing and create new ones
    await prisma.$transaction([
      prisma.recipeStep.deleteMany({ where: { recipeId: params.id } }),
      prisma.recipeStep.createMany({
        data: steps.map((step: any) => ({
          recipeId: params.id,
          stepAr: step.stepAr,
          stepEn: step.stepEn,
        }))
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating recipe steps:", error);
    return NextResponse.json({ error: "Failed to update steps" }, { status: 500 });
  }
}
