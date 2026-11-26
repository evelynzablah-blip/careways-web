"use client";

import { useActionState } from "react";
import { inviteUser } from "@/app/admin/(panel)/users/actions";
import type { AdminDict } from "@/lib/admin-i18n";
import { Field, inputClass, type SaveState } from "./fields";

export function InviteForm({ dict }: { dict: AdminDict }) {
  const [state, action, pending] = useActionState<SaveState, FormData>(inviteUser, {});
  const u = dict.users;
  return (
    <form action={action} className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-line">
      <h2 className="text-lg font-bold text-navy">{u.invite}</h2>
      <p className="text-sm text-muted">{u.inviteHint}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr_160px_auto] sm:items-end">
        <Field label={u.email} required>
          <input name="email" type="email" required className={inputClass} />
        </Field>
        <Field label={u.name}>
          <input name="full_name" className={inputClass} />
        </Field>
        <Field label={u.role}>
          <select name="role" defaultValue="editor" className={inputClass}>
            <option value="editor">{u.editor}</option>
            <option value="admin">{u.admin}</option>
          </select>
        </Field>
        <button disabled={pending} className="rounded-full bg-navy px-5 py-2.5 font-semibold text-white hover:bg-navy-700 disabled:opacity-60">
          {u.invite}
        </button>
      </div>
      <p role="status" className="mt-3 text-sm">
        {state.ok && <span className="text-teal-700">{u.invited}</span>}
        {state.error && <span className="text-red-700">{state.error === "SUPABASE_SERVICE_ROLE_KEY" ? u.serviceMissing : `${dict.common.error}: ${state.error}`}</span>}
      </p>
    </form>
  );
}
