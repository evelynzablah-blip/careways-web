import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { countryName, formatDate, localized } from "@/lib/localize";
import { sanitizeRichText } from "@/lib/sanitize";
import { mediaUrl } from "@/lib/storage";
import type { Locale, Post } from "@/lib/types";
import { PostCard } from "./cards";
import { NewsletterForm } from "./NewsletterForm";
import { ButtonLink, Container, FallbackNote } from "./ui";

/** Shared by the public article page and the admin preview. */
export async function ArticleView({ post, locale, related = [] }: { post: Post; locale: Locale; related?: Post[] }) {
  const t = await getTranslations("blog");
  const common = await getTranslations("common");
  const footer = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const title = localized(post, "title", locale);
  const body = localized(post, "body", locale);
  const img = mediaUrl(post.cover_image_path);

  return (
    <article>
      <header className="bg-gradient-to-b from-sky-50 to-white">
        <Container className="max-w-3xl py-12 sm:py-16">
          <Link href="/blog" className="text-sm font-semibold text-link hover:underline">
            ← {t("title")}
          </Link>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700">
            {post.category && <span>{post.category}</span>}
            {post.country_codes?.map((c) => <span key={c}>· {countryName(c, locale)}</span>)}
          </div>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-navy sm:text-5xl">{title.value}</h1>
          <p className="mt-5 text-muted">
            {post.author_name && <>{t("by", { author: post.author_name })} · </>}
            <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at ?? post.updated_at, locale)}</time>
          </p>
        </Container>
      </header>
      {img && (
        <Container className="max-w-4xl">
          <Image
            src={img}
            alt={localized(post, "cover_alt", locale).value}
            width={1200}
            height={700}
            priority
            className="aspect-[16/9] w-full rounded-[var(--radius-card)] object-cover"
          />
        </Container>
      )}
      <Container className="max-w-3xl py-12">
        <FallbackNote show={title.fallback || body.fallback}>{common("availableInEnglish")}</FallbackNote>
        <div className="prose-cw" dangerouslySetInnerHTML={{ __html: sanitizeRichText(body.value) }} />

        <aside className="mt-14 grid gap-6 rounded-[var(--radius-card)] bg-navy p-8 text-white sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <h2 className="text-2xl font-bold">{footer("stayUpdated")}</h2>
            <p className="mt-1 text-white/80">{footer("newsletterIntro")}</p>
            <div className="mt-4">
              <NewsletterForm tone="dark" source="article" />
            </div>
          </div>
          <ButtonLink href="/donate" variant="donate" className="self-start">
            {nav("donate")}
          </ButtonLink>
        </aside>
      </Container>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="bg-paper py-14">
          <Container>
            <h2 id="related-title" className="text-2xl font-extrabold text-navy">
              {t("related")}
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.id} post={p} locale={locale} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}
