import { revalidatePath } from "next/cache";
import { getAdminContext, requireStaff } from "@/lib/admin-auth";
import { str } from "@/lib/admin-actions-util";
import type { ContactMessage } from "@/lib/types";

async function toggleRead(formData: FormData) {
  "use server";
  const { supabase } = await requireStaff({ admin: true });
  await supabase.from("contact_messages").update({ read: str(formData, "read") === "true" }).eq("id", str(formData, "id"));
  revalidatePath("/admin/messages");
}

export default async function MessagesPage() {
  const { supabase } = await requireStaff({ admin: true });
  const { lang, dict } = await getAdminContext();
  const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(200);
  const messages = (data ?? []) as ContactMessage[];
  const fmt = new Intl.DateTimeFormat(lang === "es" ? "es" : "en-US", { dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-extrabold text-navy">{dict.messages.title}</h1>
      {messages.length === 0 ? (
        <p className="mt-10 rounded-2xl bg-white p-10 text-center text-muted ring-1 ring-line">{dict.common.empty}</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {messages.map((m) => (
            <li key={m.id} className={`rounded-2xl bg-white p-5 ring-1 ${m.read ? "ring-line" : "ring-2 ring-blue"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-navy">
                    {!m.read && <span className="mr-2 rounded-full bg-sun px-2 py-0.5 text-xs">{dict.messages.unread}</span>}
                    {m.name} · <a href={`mailto:${m.email}`} className="font-normal text-link hover:underline">{m.email}</a>
                    {m.phone && <span className="font-normal text-muted"> · {m.phone}</span>}
                  </p>
                  <p className="text-sm text-muted">
                    {fmt.format(new Date(m.created_at))} · {m.reason} · {m.locale?.toUpperCase()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a href={`mailto:${m.email}?subject=${encodeURIComponent("CareWays Collaborative")}`} className="rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-line hover:bg-sky-50">
                    {dict.messages.reply}
                  </a>
                  <form action={toggleRead}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="read" value={String(!m.read)} />
                    <button className="rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-line hover:bg-sky-50">
                      {m.read ? dict.messages.markUnread : dict.messages.markRead}
                    </button>
                  </form>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-line text-ink">{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
