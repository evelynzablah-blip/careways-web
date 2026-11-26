import { InviteForm } from "@/components/admin/InviteForm";
import { getAdminContext, requireStaff } from "@/lib/admin-auth";
import type { Profile } from "@/lib/types";
import { updateUser } from "./actions";

export default async function UsersPage() {
  const { supabase, user } = await requireStaff({ admin: true });
  const { dict } = await getAdminContext();
  const { data } = await supabase.from("profiles").select("*").order("created_at");
  const profiles = (data ?? []) as Profile[];
  const u = dict.users;
  const small = "rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-line hover:bg-sky-50";

  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl font-extrabold text-navy">{u.title}</h1>
      <div className="mt-6">
        <InviteForm dict={dict} />
      </div>
      <ul className="mt-8 divide-y divide-line overflow-hidden rounded-2xl bg-white ring-1 ring-line">
        {profiles.map((p) => {
          const self = p.id === user.id;
          return (
            <li key={p.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-navy">
                  {p.full_name || p.email} {self && <span className="font-normal text-muted">{u.you}</span>}
                </p>
                <p className="truncate text-sm text-muted">
                  {p.email} · {p.role === "admin" ? u.admin : u.editor}
                </p>
              </div>
              <span className={p.active ? "rounded-full bg-mint px-2.5 py-0.5 text-xs font-bold text-teal-700" : "rounded-full bg-line px-2.5 py-0.5 text-xs font-bold text-muted"}>
                {p.active ? u.active : u.inactive}
              </span>
              {!self && (
                <div className="flex gap-2">
                  <form action={updateUser}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="role" value={p.role === "admin" ? "editor" : "admin"} />
                    <button className={small}>→ {p.role === "admin" ? u.editor : u.admin}</button>
                  </form>
                  <form action={updateUser}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="active" value={String(!p.active)} />
                    <button className={small}>{p.active ? u.deactivate : u.activate}</button>
                  </form>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
