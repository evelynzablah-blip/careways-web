import Link from "next/link";
import { PostForm } from "@/components/admin/PostForm";
import { getAdminContext, requireStaff } from "@/lib/admin-auth";
import { getCountryOptions } from "@/lib/admin-data";

export default async function NewPost() {
  const { supabase } = await requireStaff();
  const { lang, dict } = await getAdminContext();
  const [countries, { data: cats }] = await Promise.all([
    getCountryOptions(supabase, lang),
    supabase.from("posts").select("category").not("category", "is", null),
  ]);
  const categories = [...new Set((cats ?? []).map((c) => c.category as string))].sort();

  return (
    <div className="max-w-6xl">
      <Link href="/admin/posts" className="text-sm font-semibold text-link hover:underline">
        ← {dict.posts.title}
      </Link>
      <h1 className="mt-2 mb-6 text-3xl font-extrabold text-navy">{dict.posts.newTitle}</h1>
      <PostForm post={null} dict={dict} lang={lang} countries={countries} categories={categories} />
    </div>
  );
}
