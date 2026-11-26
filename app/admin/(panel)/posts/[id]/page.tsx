import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { PostForm } from "@/components/admin/PostForm";
import { getAdminContext, requireStaff } from "@/lib/admin-auth";
import { getCountryOptions } from "@/lib/admin-data";
import type { Post } from "@/lib/types";
import { deletePost } from "../actions";

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, profile } = await requireStaff();
  const { lang, dict } = await getAdminContext();
  const [{ data }, countries, { data: cats }] = await Promise.all([
    supabase.from("posts").select("*").eq("id", id).maybeSingle(),
    getCountryOptions(supabase, lang),
    supabase.from("posts").select("category").not("category", "is", null),
  ]);
  if (!data) notFound();
  const post = data as Post;
  const categories = [...new Set((cats ?? []).map((c) => c.category as string))].sort();

  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/posts" className="text-sm font-semibold text-link hover:underline">
            ← {dict.posts.title}
          </Link>
          <h1 className="mt-2 text-3xl font-extrabold text-navy">{dict.posts.editTitle}</h1>
        </div>
        <div className="flex items-center gap-3">
          {post.status === "published" && (
            <a href={`/${lang}/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-link hover:underline">
              {dict.nav.viewSite} ↗
            </a>
          )}
          {profile.role === "admin" && <DeleteButton action={deletePost} id={post.id} dict={dict} />}
        </div>
      </div>
      <div className="mt-6">
        <PostForm post={post} dict={dict} lang={lang} countries={countries} categories={categories} />
      </div>
    </div>
  );
}
