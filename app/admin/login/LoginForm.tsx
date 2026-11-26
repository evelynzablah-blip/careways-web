"use client";

import { useActionState, useState } from "react";
import type { AdminDict } from "@/lib/admin-i18n";
import { sendMagicLink, sendPasswordReset, signInWithPassword, type AuthState } from "../auth-actions";

const input = "mt-1.5 w-full rounded-xl bg-white px-4 py-3 ring-1 ring-line";
const primary = "w-full rounded-full bg-navy px-6 py-3 font-semibold text-white hover:bg-navy-700 disabled:opacity-60";
const secondary = "w-full rounded-full px-6 py-3 font-semibold text-navy ring-1 ring-line hover:bg-sky-50 disabled:opacity-60";

export function LoginForm({ dict, next }: { dict: AdminDict["auth"]; next: string }) {
  const [mode, setMode] = useState<"password" | "magic" | "reset">("password");
  const [pwState, pwAction, pwPending] = useActionState<AuthState, FormData>(signInWithPassword, {});
  const [mlState, mlAction, mlPending] = useActionState<AuthState, FormData>(sendMagicLink, {});
  const [rsState, rsAction, rsPending] = useActionState<AuthState, FormData>(sendPasswordReset, {});

  const message = (s: AuthState) =>
    s.message ? (
      <p role="status" className="rounded-lg bg-mint px-4 py-3 text-navy">
        {dict[s.message as keyof typeof dict]}
      </p>
    ) : s.error ? (
      <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-red-800">
        {s.error === "invalid" ? dict.invalid : dict.setupBody}
      </p>
    ) : null;

  return (
    <div className="space-y-5">
      {mode === "password" && (
        <form action={pwAction} className="space-y-4">
          <input type="hidden" name="next" value={next} />
          {message(pwState)}
          <label className="block">
            <span className="font-semibold text-navy">{dict.email}</span>
            <input name="email" type="email" autoComplete="email" required className={input} />
          </label>
          <label className="block">
            <span className="font-semibold text-navy">{dict.password}</span>
            <input name="password" type="password" autoComplete="current-password" required className={input} />
          </label>
          <button disabled={pwPending} className={primary}>
            {dict.login}
          </button>
        </form>
      )}

      {mode === "magic" && (
        <form action={mlAction} className="space-y-4">
          {message(mlState)}
          <label className="block">
            <span className="font-semibold text-navy">{dict.email}</span>
            <input name="email" type="email" autoComplete="email" required className={input} />
          </label>
          <button disabled={mlPending} className={primary}>
            {dict.magic}
          </button>
        </form>
      )}

      {mode === "reset" && (
        <form action={rsAction} className="space-y-4">
          {message(rsState)}
          <label className="block">
            <span className="font-semibold text-navy">{dict.email}</span>
            <input name="email" type="email" autoComplete="email" required className={input} />
          </label>
          <button disabled={rsPending} className={primary}>
            {dict.forgot}
          </button>
        </form>
      )}

      <div className="space-y-2 border-t border-line pt-5">
        {mode !== "password" && (
          <button type="button" onClick={() => setMode("password")} className={secondary}>
            {dict.login}
          </button>
        )}
        {mode !== "magic" && (
          <button type="button" onClick={() => setMode("magic")} className={secondary}>
            {dict.magic}
          </button>
        )}
        {mode !== "reset" && (
          <button type="button" onClick={() => setMode("reset")} className="w-full py-2 text-sm font-semibold text-link hover:underline">
            {dict.forgot}
          </button>
        )}
      </div>
    </div>
  );
}
