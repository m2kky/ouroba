import { NextRequest, NextResponse } from "next/server";
import { getDashboardBaseUrl } from "@/lib/dashboard-data";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const response = await fetch(new URL("/api/careers", getDashboardBaseUrl()), {
      method: "POST",
      body: formData,
    });
    const contentType = response.headers.get("content-type") || "application/json";
    const body = await response.text();

    return new NextResponse(body, {
      status: response.status,
      headers: {
        "content-type": contentType,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to submit career request" },
      { status: 500 }
    );
  }
}
