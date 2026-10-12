import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionValue } from "@/lib/session";

/** Call from any admin page/action; redirects to /login without a valid session. */
export async function requireAdmin() {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifySessionValue(value))) redirect("/login");
}
