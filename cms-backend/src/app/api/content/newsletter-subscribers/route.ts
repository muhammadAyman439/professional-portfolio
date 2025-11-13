import { NextRequest } from "next/server";
import { assertAdminRequest } from "@/lib/admin-auth";
import { getNewsletterSubscribers } from "@/lib/content-store";
import { handleError, jsonResponse } from "@/lib/http";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await assertAdminRequest(request);
    const subscribers = await getNewsletterSubscribers();
    return jsonResponse(subscribers);
  } catch (error) {
    return handleError(error);
  }
}

