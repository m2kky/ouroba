"use server";
import { db } from "@/db";
import { contacts } from "@/db/schema";
import crypto from "crypto";

export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const typeInquiry = formData.get("type_inqury") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !phone || !message) {
      return { status: "faild", message: "All fields are required" };
    }

    await db.insert(contacts).values({
      id: crypto.randomUUID(),
      name,
      email,
      phone,
      typeInquiry: typeInquiry || "pls",
      message,
    });

    return { status: "success" };
  } catch (error) {
    console.error("Error saving contact:", error);
    return { status: "faild", message: "An error occurred while sending the message" };
  }
}
