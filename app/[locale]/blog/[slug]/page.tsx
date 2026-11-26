import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ArticleView } from "@/components/site/ArticleView";
import { JsonLd } from "@/components/site/JsonLd";
import { getPostBySlug, getPublishedPosts } from "@/lib/data";
import { siteUrl } from "@/lib/env";
import { localized } from "@/lib/localize";
import { pageMetadata } from "@/lib/seo";
import { mediaUrl } from "@/lib/storage";
import type { Locale } from "@/lib/types";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return pageMetadata({
    locale,
    path: `/blog/${slug}`,
    title: localized(post, "title", locale as Locale).value,
    description: localized(post, "excerpt", locale as Locale).value || undefined,
    image: mediaUrl(post.cover_image_path),
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const all = await getPublishedPosts();
  const related = all
    .filter((p) => p.id !== post.id)
    .map((p) => ({
      p,
      score:
        (p.category && p.category === post.category ? 2 : 0) +
        p.country_codes.filter((c) => post.country_codes.includes(c)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.p);

  const img = mediaUrl(post.cover_image_path);

  return (
    <>
      <ArticleView post={post} locale={locale} related={related} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: localized(post, "title", locale).value,
          description: localized(post, "excerpt", locale).value || undefined,
          datePublished: post.published_at,
          dateModified: post.updated_at,
          author: post.author_name ? { "@type": "Person", name: post.author_name } : undefined,
          image: img ? (img.startsWith("http") ? img : `${siteUrl}${img}`) : undefined,
          publisher: { "@type": "Organization", name: "CareWays Collaborative" },
          mainEntityOfPage: `${siteUrl}/${locale}/blog/${post.slug}`,
          inLanguage: locale,
        }}
      />
    </>
  );
}
