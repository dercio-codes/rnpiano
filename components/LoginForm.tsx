"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/login/actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form className="booking" action={formAction}>
      <div className="status" role="status" aria-live="polite">
        {state.error && <p className="field-error">{state.error}</p>}
      </div>
      <label className="field">
        <span>Username</span>
        <input name="username" autoComplete="username" required autoCapitalize="none" />
      </label>
      <label className="field">
        <span>Password</span>
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      <button className="btn" type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
