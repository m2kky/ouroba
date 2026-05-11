import { NextResponse } from "next/server";

// Standard API response helpers
export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function apiPaginated<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}

// Parse pagination params from URL
export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") || "20"))
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

// Parse locale from URL or header
export function parseLocale(searchParams: URLSearchParams): "en" | "ar" {
  const lang = searchParams.get("lang") || "en";
  return lang === "ar" ? "ar" : "en";
}
