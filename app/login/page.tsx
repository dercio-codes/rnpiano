import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function LoginPage() {
  return (
    <main className="adm" style={{ maxWidth: 420, margin: "0 auto" }}>
      <header className="adm-head">
        <div>
          <p className="meta">RNPiano admin</p>
          <h1>Sign in</h1>
        </div>
      </header>
      <LoginForm />
    </main>
  );
}
