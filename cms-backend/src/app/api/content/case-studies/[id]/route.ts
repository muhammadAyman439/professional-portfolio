import { NextRequest } from "next/server";
import { deleteCaseStudy, updateCaseStudy } from "@/lib/content-store";
import { handleError, jsonResponse } from "@/lib/http";
import { parseValidation } from "@/lib/validation-helpers";
import { caseStudySchema } from "@/lib/validation";
import { assertAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await assertAdminRequest(request);
    const { id } = await params;
    const payload = parseValidation(caseStudySchema.partial(), await request.json());
    const updated = await updateCaseStudy(id, payload);
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
    await deleteCaseStudy(id);
    return jsonResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
