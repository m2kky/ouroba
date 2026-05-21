import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadFile } from "@/lib/upload";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileUrl = await uploadFile(buffer, file.name, folder);

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("Upload failed", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
