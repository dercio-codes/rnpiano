import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionValue } from "@/lib/session";

// Optimistic check only; pages re-verify via requireAdmin().
export async function proxy(request: NextRequest) {
  const ok = await verifySessionValue(request.cookies.get(SESSION_COOKIE)?.value);
  if (!ok) return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next();
}

export const config = { matcher: "/admin/:path*" };
