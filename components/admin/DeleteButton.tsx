"use client";

import type { AdminDict } from "@/lib/admin-i18n";

export function DeleteButton({ action, id, dict }: { action: (formData: FormData) => Promise<void>; id: string; dict: AdminDict }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(dict.common.confirmDelete)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="rounded-full px-4 py-2 text-sm font-semibold text-red-700 ring-1 ring-red-200 hover:bg-red-50">{dict.common.delete}</button>
    </form>
  );
}
