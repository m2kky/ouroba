"use server";
import { db } from "@/db";
import { collaborates } from "@/db/schema";
import crypto from "crypto";

export async function submitCollaborateForm(formData: FormData) {
  try {
    const firstName = formData.get("f_name") as string;
    const lastName = formData.get("l_name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const position = formData.get("position") as string;
    const request = formData.get("request") as string;

    if (!firstName || !lastName || !email || !phone || !request) {
      return { status: "faild", message: "All fields are required except position" };
    }

    await db.insert(collaborates).values({
      id: crypto.randomUUID(),
      firstName,
      lastName,
      email,
      phone,
      position,
      request,
    });

    return { status: "success", message: "Submitted successfully!" };
  } catch (error) {
    console.error("Error saving collaborate:", error);
    return { status: "faild", message: "An error occurred while sending the message" };
  }
}
