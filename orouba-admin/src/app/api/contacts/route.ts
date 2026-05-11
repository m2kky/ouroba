import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

// POST /api/contacts — Submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email) {
      return apiError("name and email are required");
    }

    const contact = await prisma.contactRequest.create({
      data: { name, email, phone, message },
    });
    return apiSuccess(contact, 201);
  } catch (error) {
    return apiError("Failed to submit contact", 500);
  }
}

// GET /api/contacts — Admin: list all contacts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status");

    const where: any = {};
    if (status) where.status = status;

    const contacts = await prisma.contactRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return apiSuccess(contacts);
  } catch (error) {
    return apiError("Failed to fetch contacts", 500);
  }
}
