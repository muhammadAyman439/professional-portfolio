import { NextRequest } from "next/server";
import { deleteFAQ, updateFAQ } from "@/lib/content-store";
import { handleError, jsonResponse } from "@/lib/http";
import { parseValidation } from "@/lib/validation-helpers";
import { faqSchema } from "@/lib/validation";
import { assertAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await assertAdminRequest(request);
    const { id } = await params;
    const payload = parseValidation(faqSchema.partial(), await request.json());
    const updated = await updateFAQ(id, payload);
    return jsonResponse(updated);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await assertAdminRequest(request);
    const { id } = await params;
    await deleteFAQ(id);
    return jsonResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
