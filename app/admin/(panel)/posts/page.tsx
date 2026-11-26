import Link from "next/link";
import { StatusBadge } from "@/components/admin/fields";
import { getAdminContext, requireStaff } from "@/lib/admin-auth";
import { formatAdminDate } from "@/lib/admin-data";
import type { Post } from "@/lib/types";

export default async function PostsList() {
  const { supabase } = await requireStaff();
  const { lang, dict } = await getAdminContext();
  const { data } = await supabase
    .from("posts")
    .select("id, slug, title_en, title_es, status, updated_at, published_at, category")
    .order("updated_at", { ascending: false });
  const posts = (data ?? []) as Post[];

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-navy">{dict.posts.title}</h1>
        <Link href="/admin/posts/new" className="rounded-full bg-navy px-5 py-2.5 font-semibold text-white hover:bg-navy-700">
          + {dict.posts.newTitle}
        </Link>
      </div>
      {posts.length === 0 ? (
        <p className="mt-10 rounded-2xl bg-white p-10 text-center text-muted ring-1 ring-line">{dict.common.empty}</p>
      ) : (
        <ul className="mt-8 divide-y divide-line overflow-hidden rounded-2xl bg-white ring-1 ring-line">
          {posts.map((p) => (
            <li key={p.id}>
              <Link href={`/admin/posts/${p.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4 hover:bg-sky-50">
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-navy">{p.title_en}</span>
                  <span className="block text-sm text-muted">
                    {p.category ? `${p.category} · ` : ""}
                    {dict.common.updated}: {formatAdminDate(p.updated_at, lang)}
                    {!p.title_es && ` · ${dict.common.spanish}: —`}
                  </span>
                </span>
                <StatusBadge status={p.status} dict={dict} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
