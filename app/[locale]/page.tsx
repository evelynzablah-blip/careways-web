import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HomeHero } from "@/components/premium/HomeHero";
import { CountUp, DrawLine, ParallaxLayer, Reveal, Stagger, StaggerItem } from "@/components/premium/motion";
import { ArrowGlyph, ButtonLink, Kicker } from "@/components/premium/ui";
import { Globe, Heart, Users } from "@/components/site/icons";
import { JsonLd } from "@/components/site/JsonLd";
import { YouTubeEmbed } from "@/components/site/YouTubeEmbed";
import { getCopy } from "@/content/site/copy";
import { Link } from "@/i18n/navigation";
import { getMapLocations, getPublishedPosts, getReports, getSettings } from "@/lib/data";
import { siteUrl } from "@/lib/env";
import { countryName, formatDate, localized } from "@/lib/localize";
import { pageMetadata } from "@/lib/seo";
import { mediaUrl } from "@/lib/storage";
import type { Locale } from "@/lib/types";
import { cx } from "@/components/site/ui";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const base = pageMetadata({
    locale,
    path: "/",
    title: t("metaTitle"),
    description: t("metaDescription"),
    image: "/images/site/hero-video-poster.jpg",
  });
  return { ...base, title: { absolute: t("metaTitle") } };
}

/** Splits a paragraph into sentences (keeps the punctuation). */
const sentences = (text: string) => text.split(/(?<=[.!?])\s+/);

const gallery = [
  { src: "/images/site/surgery-team-camera.jpg", en: "Surgeons and nurses gathered around an operating table while a teammate films the procedure", es: "Cirujanos y enfermeras alrededor de la mesa de operaciones mientras un compañero filma el procedimiento", span: "sm:col-span-2 sm:row-span-2" },
  { src: "/images/site/blue-hat-baby.jpg", en: "A mother holds her baby in a mint knitted hat", es: "Una madre sostiene a su bebé con un gorro tejido color menta", span: "" },
  { src: "/images/site/working.png", en: "A smiling group of local nurses and CareWays clinicians at a nursing station", es: "Un grupo sonriente de enfermeras locales y profesionales de CareWays en una estación de enfermería", span: "" },
  { src: "/images/site/learning.png", en: "A surgeon demonstrates an instrument to two colleagues in the operating room", es: "Un cirujano muestra un instrumento a dos colegas en el quirófano", span: "" },
  { src: "/images/site/collaborative-learning.jpg", en: "Two nurses review a chart together", es: "Dos enfermeras revisan juntas un expediente", span: "" },
];

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, nav, missions, news, copyAll, settings, reports, posts, locations] = await Promise.all([
    getTranslations("home"),
    getTranslations("nav"),
    getTranslations("missions"),
    getTranslations("newsletters"),
    Promise.resolve(getCopy(locale)),
    getSettings(),
    getReports(),
    getPublishedPosts(),
    getMapLocations(),
  ]);
  const copy = copyAll.home;
  const what = copyAll.whatWeDo;
  const need = copyAll.theNeed;

  const heroSentences = sentences(copy.heroBody);
  const heroLead = heroSentences.slice(0, 2).join(" ");
  const missionLead = heroSentences.slice(2).join(" ");

  const [childDeaths, noAccess, riskMultiplier] = copy.stats;

  // "4 active countries" is left out until CareWays confirms the country list.
  const outcomes = what.outcomes.filter((o) => o.value !== 4);

  // Mission reports grouped by year, oldest first (timeline).
  const byYear = new Map<string, typeof reports>();
  for (const r of [...reports].sort((a, b) => (a.report_date < b.report_date ? -1 : 1))) {
    const y = r.report_date.slice(0, 4);
    byYear.set(y, [...(byYear.get(y) ?? []), r]);
  }
  const reportCount = (code: string) => reports.filter((r) => r.country_codes?.includes(code)).length;

  const joinIcons = [Users, Heart, Globe];
  const joinCtas = [t("joinVolunteerCta"), nav("donate"), t("joinNetworkCta")];

  return (
    <>
      <HomeHero
        videoId={settings.home_video_id}
        labels={{
          kicker: t("heroEyebrow"),
          title: copy.heroTitle,
          lead: heroLead,
          ctaMission: t("ctaMission"),
          ctaGive: t("ctaGive"),
          watch: t("watchFilm"),
          pause: t("pauseVideo"),
          play: t("playVideo"),
          scroll: t("scrollHint"),
        }}
      />

      {/* ── The need, in one figure ── */}
      <section aria-labelledby="impact-title" className="cw-mist relative overflow-hidden">
        <h2 id="impact-title" className="sr-only">
          {t("impactTitle")}
        </h2>
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-28">
          <div className="grid items-end gap-10 xl:grid-cols-[auto_minmax(0,1fr)] xl:gap-16">
            <Reveal>
              <p className="min-w-0 break-words text-[3.75rem] font-bold leading-[0.9] tracking-[-0.045em] text-primary tabular-nums sm:text-[5.5rem] lg:text-[8rem] lg:leading-[0.85]">
                {noAccess.value}
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="cw-display text-2xl leading-snug text-primary md:text-[2rem]">{noAccess.label}</p>
              <p className="mt-4 text-sm text-neutral">
                {t.rich("impactSource", {
                  link: (chunks) => (
                    <Link href="/the-need" className="font-semibold text-sky-dark underline underline-offset-4 hover:text-primary">
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            </Reveal>
          </div>
          <Stagger className="mt-14 grid gap-5 border-t border-primary/10 pt-10 sm:grid-cols-2">
            {[childDeaths, riskMultiplier].map((s) => (
              <StaggerItem key={s.value} className="rounded-[20px] bg-white/70 p-6 shadow-e1 ring-1 ring-white backdrop-blur">
                <p className="text-3xl font-bold text-primary tabular-nums">{s.value}</p>
                <p className="mt-2 leading-relaxed text-on-surface-variant">{s.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Mission + four pillars ── */}
      <section aria-labelledby="mission-title" className="relative bg-frost py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <Reveal className="max-w-3xl">
            <Kicker>{t("missionEyebrow")}</Kicker>
            <h2 id="mission-title" className="cw-display mt-5 text-balance text-[2rem] leading-[1.12] text-primary md:text-[2.9rem]">
              {copy.introBody}
            </h2>
            {missionLead && <p className="mt-6 text-lg leading-relaxed text-on-surface-variant">{missionLead}</p>}
          </Reveal>
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {copy.pillars.map((p) => (
              <StaggerItem key={p.title} className="flex">
                <article className="cw-lift group relative flex w-full flex-col overflow-hidden rounded-[20px] bg-white ring-1 ring-primary/[0.06]">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={p.image}
                      alt=""
                      fill
                      sizes="(min-width:1024px) 300px, (min-width:640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.07] motion-reduce:group-hover:scale-100"
                    />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-night/25 to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="cw-display text-[1.4rem] leading-snug text-primary">{p.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-on-surface-variant">{p.body}</p>
                    <Link
                      href={p.href}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary after:absolute after:inset-0 after:content-['']"
                    >
                      {p.cta}
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        <ArrowGlyph />
                      </span>
                    </Link>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Outcomes (night) ── */}
      <section aria-labelledby="outcomes-title" className="cw-night cw-grain relative overflow-hidden py-20 md:py-28">
        <ParallaxLayer speed={0.25} className="pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px] opacity-40">
          <div aria-hidden className="h-full w-full rounded-full bg-[radial-gradient(closest-side,rgb(133_240_212/0.25),transparent)]" />
        </ParallaxLayer>
        <div className="relative z-[2] mx-auto max-w-7xl px-5 sm:px-6">
          <Reveal className="max-w-3xl">
            <Kicker tone="dark">{t("outcomesEyebrow")}</Kicker>
            <h2 id="outcomes-title" className="cw-display mt-5 text-[2rem] leading-[1.12] md:text-[2.9rem]">
              {what.outcomesTitle}
            </h2>
          </Reveal>
          <Stagger className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
            {outcomes.map((o) => (
              <StaggerItem key={o.label} className="cw-glow-edge rounded-[20px] bg-white/[0.04] p-5 shadow-halo sm:p-7">
                <CountUp value={o.value} className="block text-[2.6rem] font-bold leading-none tracking-[-0.03em] tabular-nums text-white sm:text-[3.4rem]" />
                <p className="mt-3 text-sm leading-snug text-sky-light/90 sm:text-base">{o.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mt-8 text-sm text-sky-light/80">
            <Link href="/what-we-do" className="underline underline-offset-4 hover:text-aqua">
              {t("outcomesNote")}
            </Link>
          </p>
        </div>
      </section>

      {/* ── Where we work + mission timeline ── */}
      <section aria-labelledby="where-title" className="relative bg-white py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          <div>
            <Reveal>
              <Kicker>{t("missionsEyebrow")}</Kicker>
              <h2 id="where-title" className="cw-display mt-5 text-[2rem] leading-[1.12] text-primary md:text-[2.9rem]">
                {t("mapTitle")}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-on-surface-variant">{t("mapBody")}</p>
            </Reveal>
            <Stagger className="mt-10 flex flex-col gap-3">
              {locations.map((loc) => (
                <StaggerItem key={loc.id}>
                  <Link
                    href={`/missions/${loc.slug}`}
                    className="cw-lift group flex min-h-[4.5rem] items-center gap-4 rounded-[20px] bg-white px-5 py-4 ring-1 ring-ice"
                  >
                    <span aria-hidden className="relative flex h-3 w-3 shrink-0">
                      <span className="absolute inset-0 animate-ping rounded-full bg-aqua/70 motion-reduce:animate-none" />
                      <span className="relative h-3 w-3 rounded-full bg-primary ring-2 ring-aqua" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="font-bold text-primary">
                        {locale === "es" ? loc.country_es : loc.country_en}
                        <span className="sr-only">: </span>
                      </span>
                      <span className="text-sm text-on-surface-variant">{loc.hospital_name}</span>
                    </span>
                    <span className="hidden text-xs text-neutral sm:block">{missions("related", { count: reportCount(loc.country_code) })}</span>
                    <span className="text-primary transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowGlyph />
                    </span>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <div>
            <Reveal>
              <Kicker>{t("timelineEyebrow")}</Kicker>
              <h3 id="timeline-title" className="cw-display mt-5 text-[1.75rem] leading-snug text-primary md:text-[2.2rem]">
                {t("timelineTitle")}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral">{news("archiveNote")}</p>
            </Reveal>
            <div className="relative mt-10 pl-8">
              <DrawLine className="absolute bottom-0 left-[7px] top-2 w-px bg-ice" />
              <ol className="flex flex-col gap-10">
                {[...byYear.entries()].map(([year, items]) => (
                  <li key={year} className="relative">
                    <span aria-hidden className="absolute -left-8 top-1.5 h-[15px] w-[15px] rounded-full bg-white ring-4 ring-aqua/40 shadow-e2">
                      <span className="absolute inset-[3px] rounded-full bg-primary" />
                    </span>
                    <Reveal>
                      <p className="text-2xl font-bold tabular-nums text-primary">{year}</p>
                    </Reveal>
                    <Stagger className="mt-4 grid gap-3 sm:grid-cols-2">
                      {items.map((r) => (
                        <StaggerItem key={r.id}>
                          <Link
                            href={`/newsletters/${r.slug}`}
                            className="cw-lift flex h-full flex-col gap-2 rounded-[16px] bg-frost p-4 ring-1 ring-ice"
                          >
                            <span className="flex items-center justify-between gap-3">
                              <span className="font-bold text-primary">{localized(r, "title", locale).value}</span>
                              <time dateTime={r.report_date} className="text-xs text-neutral">
                                {formatDate(r.report_date, locale, { month: "short", day: undefined })}
                              </time>
                            </span>
                            <span className="flex flex-wrap gap-1.5">
                              {(r.country_codes ?? []).map((c) => (
                                <span key={c} className="rounded-full bg-aqua-soft px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                                  {countryName(c, locale)}
                                </span>
                              ))}
                            </span>
                          </Link>
                        </StaggerItem>
                      ))}
                    </Stagger>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section aria-labelledby="gallery-title" className="cw-mist py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <Reveal className="max-w-3xl">
            <Kicker>{t("galleryEyebrow")}</Kicker>
            <h2 id="gallery-title" className="cw-display mt-5 text-[2rem] leading-[1.12] text-primary md:text-[2.9rem]">
              {t("galleryTitle")}
            </h2>
          </Reveal>
          <Stagger as="ul" className="mt-12 grid auto-rows-[220px] grid-cols-1 gap-4 sm:auto-rows-[240px] sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {gallery.map((g) => (
              <StaggerItem key={g.src} className={cx("group relative overflow-hidden rounded-[28px] shadow-e2", g.span, g.span && "lg:col-span-2")}>
                <Image
                  src={g.src}
                  alt={locale === "es" ? g.es : g.en}
                  fill
                  sizes="(min-width:1024px) 50vw, (min-width:640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1600ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.06] motion-reduce:group-hover:scale-100"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-night/35 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-40" />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Voices (quotes published on The Need) ── */}
      <section aria-labelledby="voices-title" className="cw-night cw-grain relative overflow-hidden py-20 md:py-28">
        <div className="relative z-[2] mx-auto max-w-7xl px-5 sm:px-6">
          <Reveal className="max-w-3xl">
            <Kicker tone="dark">{t("voicesEyebrow")}</Kicker>
            <h2 id="voices-title" className="cw-display mt-5 text-[2rem] leading-[1.12] md:text-[2.9rem]">
              {t("voicesTitle")}
            </h2>
          </Reveal>
          <Stagger as="div" className="mt-12 grid gap-6 lg:grid-cols-2">
            {[need.quote1, need.quote2].map((q) => (
              <StaggerItem as="div" key={q.by} className="cw-glass-dark cw-glow-edge flex h-full flex-col rounded-[28px] p-7 sm:p-9">
                <figure className="flex h-full flex-col">
                  <span aria-hidden className="cw-display text-6xl leading-none text-aqua/80">“</span>
                  <blockquote className="cw-display mt-2 flex-1 text-xl leading-relaxed text-white/95 sm:text-[1.4rem]">{q.text}</blockquote>
                  <figcaption className="mt-6 text-sm font-semibold text-sky-light">— {q.by}</figcaption>
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Latest articles (only when the blog has posts) ── */}
      {posts.length > 0 && (
        <section aria-labelledby="posts-title" className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-6">
            <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <Kicker>{t("latestEyebrow")}</Kicker>
                <h2 id="posts-title" className="cw-display mt-5 text-[2rem] leading-[1.12] text-primary md:text-[2.9rem]">
                  {t("latestTitle")}
                </h2>
              </div>
              <ButtonLink href="/blog" variant="outline" size="sm" arrow>
                {t("allArticles")}
              </ButtonLink>
            </Reveal>
            <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.slice(0, 3).map((p) => {
                const cover = mediaUrl(p.cover_image_path);
                return (
                  <StaggerItem key={p.id} className="flex">
                    <article className="cw-lift group relative flex w-full flex-col overflow-hidden rounded-[20px] bg-white ring-1 ring-primary/[0.06]">
                      <div className="relative aspect-[16/10] overflow-hidden bg-ice">
                        {cover && (
                          <Image src={cover} alt={localized(p, "cover_alt", locale).value} fill sizes="(min-width:1024px) 400px, 100vw" className="object-cover transition-transform duration-[1400ms] group-hover:scale-[1.06] motion-reduce:group-hover:scale-100" />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="text-lg font-bold leading-snug text-primary">
                          <Link href={`/blog/${p.slug}`} className="after:absolute after:inset-0">
                            {localized(p, "title", locale).value}
                          </Link>
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-on-surface-variant">{localized(p, "excerpt", locale).value}</p>
                      </div>
                    </article>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </section>
      )}

      {/* ── Join us ── */}
      <section aria-labelledby="join-title" className="cw-mist relative overflow-hidden py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <Reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <Kicker>{t("joinEyebrow")}</Kicker>
            <h2 id="join-title" className="cw-display mt-5 text-[2rem] leading-[1.12] text-primary md:text-[2.9rem]">
              {t("joinTitle")}
            </h2>
          </Reveal>
          <Stagger className="mt-12 grid gap-6 md:grid-cols-3">
            {copy.join.map((j, i) => {
              const Icon = joinIcons[i] ?? Users;
              const isDonate = j.href === "/donate";
              return (
                <StaggerItem key={j.title} className="flex">
                  <article className="cw-lift flex w-full flex-col rounded-[28px] bg-white p-8 ring-1 ring-primary/[0.06] md:p-10">
                    <span aria-hidden className={cx("flex h-12 w-12 items-center justify-center rounded-2xl", isDonate ? "bg-sunbeam text-night" : "bg-aqua-soft text-primary")}>
                      <Icon size={22} />
                    </span>
                    <h3 className="cw-display mt-6 text-[1.85rem] leading-snug text-primary">{j.title}</h3>
                    <p className="mt-3 flex-1 leading-relaxed text-on-surface-variant">{j.body}</p>
                    <ButtonLink href={j.href} variant={isDonate ? "donate" : "primary"} size="md" arrow className="mt-8 self-start">
                      {joinCtas[i]}
                    </ButtonLink>
                  </article>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* ── The film, with sound ── */}
      {settings.home_video_id && (
        <section id="film" aria-labelledby="film-title" className="cw-night cw-grain relative scroll-mt-24 overflow-hidden py-20 md:py-28">
          <div className="relative z-[2] mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <Reveal>
              <Kicker tone="dark">{t("videoEyebrow")}</Kicker>
              <h2 id="film-title" className="cw-display mt-5 text-[2rem] leading-[1.12] md:text-[2.9rem]">
                {t("videoTitle")}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-sky-light/90">{t("filmLead")}</p>
            </Reveal>
            <Reveal delay={0.1} className="text-sky-light">
              <YouTubeEmbed id={settings.home_video_id} title="CareWays Collaborative" />
            </Reveal>
          </div>
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": `${siteUrl}/#website`,
          url: `${siteUrl}/${locale}`,
          name: "CareWays Collaborative",
          description: t("metaDescription"),
          inLanguage: locale === "es" ? "es" : "en",
          publisher: { "@id": `${siteUrl}/#organization` },
        }}
      />
    </>
  );
}
