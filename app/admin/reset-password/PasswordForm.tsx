"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { AdminDict } from "@/lib/admin-i18n";
import { setNewPassword, type AuthState } from "../auth-actions";

export function PasswordForm({ dict }: { dict: AdminDict }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(setNewPassword, {});
  if (state.ok) {
    return (
      <div className="space-y-4">
        <p role="status" className="rounded-lg bg-mint px-4 py-3 text-navy">
          {dict.auth.passwordSaved}
        </p>
        <Link href="/admin" className="block w-full rounded-full bg-navy px-6 py-3 text-center font-semibold text-white">
          {dict.nav.dashboard} →
        </Link>
      </div>
    );
  }
  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-red-800">
          {state.error === "passwordRule" ? dict.auth.passwordRule : state.error}
        </p>
      )}
      <label className="block">
        <span className="font-semibold text-navy">{dict.auth.newPassword}</span>
        <input name="password" type="password" minLength={10} required autoComplete="new-password" className="mt-1.5 w-full rounded-xl bg-white px-4 py-3 ring-1 ring-line" />
        <span className="mt-1 block text-sm text-muted">{dict.auth.passwordRule}</span>
      </label>
      <button disabled={pending} className="w-full rounded-full bg-navy px-6 py-3 font-semibold text-white hover:bg-navy-700 disabled:opacity-60">
        {dict.auth.setPassword}
      </button>
    </form>
  );
}
