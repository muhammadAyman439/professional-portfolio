import { NextResponse } from "next/server";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function handleError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        details: error.details,
      },
      { status: error.status }
    );
  }

  console.error(error);
  const message =
    error instanceof Error ? error.message : "Internal server error";
  return NextResponse.json({ error: message }, { status: 500 });
}

export function jsonResponse<T>(data: T, init?: ResponseInit) {
  // For 204 No Content, return empty response without body
  if (init?.status === 204) {
    return new NextResponse(null, { status: 204 });
  }
  return NextResponse.json(data, init);
}
