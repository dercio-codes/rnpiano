import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import BookingsAdmin from "@/components/admin/BookingsAdmin";
import { requireAdmin } from "@/lib/auth";
import { logout } from "@/app/login/actions";

export const metadata: Metadata = {
  title: "Booking requests",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

async function AdminGate({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}

export default function AdminBookingsPage() {
  return (
    <main className="adm">
      <header className="adm-head">
        <div>
          <p className="meta">RNPiano admin · demo data</p>
          <h1>Booking requests</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link className="btn ghost" href="/">View site</Link>
          <form action={logout}>
            <button className="btn ghost" type="submit">Log out</button>
          </form>
        </div>
      </header>
      <Suspense fallback={null}>
        <AdminGate>
          <BookingsAdmin />
        </AdminGate>
      </Suspense>
    </main>
  );
}
