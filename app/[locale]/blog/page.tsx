import { getTranslations, setRequestLocale } from "next-intl/server";
import { PostCard } from "@/components/site/cards";
import { Container, PageHeader, Section, cx } from "@/components/site/ui";
import { Link } from "@/i18n/navigation";
import { searchPosts } from "@/lib/data";
import { countryName } from "@/lib/localize";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return pageMetadata({ locale, path: "/blog", title: t("title"), description: t("intro") });
}

type SearchParams = Promise<{ q?: string; category?: string; country?: string; page?: string }>;

export default async function BlogIndex({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: SearchParams;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const t = await getTranslations("blog");
  const result = await searchPosts({
    q: sp.q,
    category: sp.category,
    country: sp.country,
    page: Number(sp.page) || 1,
  });
  const hasFilters = Boolean(sp.q || sp.category || sp.country);

  const query = (patch: Record<string, string | undefined>) => {
    const next = { q: sp.q, category: sp.category, country: sp.country, ...patch };
    const qs = new URLSearchParams(Object.entries(next).filter(([, v]) => v) as [string, string][]).toString();
    return qs ? `/blog?${qs}` : "/blog";
  };

  return (
    <>
      <PageHeader eyebrow="CareWays" title={t("title")} lead={t("intro")} />
      <Section className="pt-2">
        <Container>
          <form role="search" className="flex flex-col gap-3 rounded-[var(--radius-card)] bg-paper p-4 ring-1 ring-line sm:flex-row sm:items-end" action="">
            <label className="flex-1">
              <span className="text-sm font-semibold text-navy">{t("search")}</span>
              <input
                type="search"
                name="q"
                defaultValue={sp.q}
                className="mt-1 w-full rounded-full bg-white px-4 py-2.5 ring-1 ring-line"
              />
            </label>
            {result.categories.length > 0 && (
              <label>
                <span className="text-sm font-semibold text-navy">{t("category")}</span>
                <select name="category" defaultValue={sp.category ?? ""} className="mt-1 block w-full rounded-full bg-white px-4 py-2.5 ring-1 ring-line">
                  <option value="">{t("all")}</option>
                  {result.categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {result.countries.length > 0 && (
              <label>
                <span className="text-sm font-semibold text-navy">{t("country")}</span>
                <select name="country" defaultValue={sp.country ?? ""} className="mt-1 block w-full rounded-full bg-white px-4 py-2.5 ring-1 ring-line">
                  <option value="">{t("all")}</option>
                  {result.countries.map((c) => (
                    <option key={c} value={c}>
                      {countryName(c, locale)}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <button type="submit" className="rounded-full bg-navy px-6 py-2.5 font-semibold text-white hover:bg-navy-700">
              {t("searchButton")}
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3" aria-live="polite">
            <p className="text-muted">{t("results", { count: result.total })}</p>
            {hasFilters && (
              <Link href="/blog" className="font-semibold text-link hover:underline">
                {t("clear")}
              </Link>
            )}
          </div>

          {result.posts.length ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {result.posts.map((p) => (
                <PostCard key={p.id} post={p} locale={locale} />
              ))}
            </div>
          ) : (
            <p className="mt-10 rounded-[var(--radius-card)] bg-sky-50 p-10 text-center text-lg text-navy">
              {hasFilters ? t("noResults") : t("empty")}
            </p>
          )}

          {result.totalPages > 1 && (
            <nav aria-label={t("pageOf", { page: result.page, total: result.totalPages })} className="mt-10 flex items-center justify-center gap-4">
              <Link
                href={query({ page: String(result.page - 1) })}
                aria-disabled={result.page <= 1}
                className={cx("rounded-full px-4 py-2 font-semibold ring-1 ring-line", result.page <= 1 && "pointer-events-none opacity-40")}
              >
                ← {t("prev")}
              </Link>
              <span className="text-muted">{t("pageOf", { page: result.page, total: result.totalPages })}</span>
              <Link
                href={query({ page: String(result.page + 1) })}
                aria-disabled={result.page >= result.totalPages}
                className={cx("rounded-full px-4 py-2 font-semibold ring-1 ring-line", result.page >= result.totalPages && "pointer-events-none opacity-40")}
              >
                {t("next")} →
              </Link>
            </nav>
          )}
        </Container>
      </Section>
    </>
  );
}
