import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale, SiteSettings } from "@/lib/types";
import { Heart, SocialIcon } from "./icons";
import { NewsletterForm } from "./NewsletterForm";

/**
 * Night footer (Direction A). Link groups follow the current careways.world
 * footer — (Who we are · What we do · How we do it · Our team) and
 * (The need · Donate · Contact) — plus Blog and Newsletter, now in the menu.
 */
export async function Footer({ settings }: { settings: SiteSettings }) {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const locale = (await getLocale()) as Locale;
  const tagline = locale === "es" ? settings.tagline_es || settings.tagline_en : settings.tagline_en;

  const groups = [
    {
      id: "f-about",
      title: t("about"),
      links: [
        { href: "/about", label: nav("whoWeAre") },
        { href: "/what-we-do", label: nav("whatWeDo") },
        { href: "/how-we-do-it", label: nav("howWeDoIt") },
        { href: "/team", label: nav("team") },
      ],
    },
    {
      id: "f-help",
      title: t("help"),
      links: [
        { href: "/the-need", label: nav("theNeed") },
        { href: "/donate", label: nav("donate") },
        { href: "/contact", label: nav("contact") },
      ],
    },
    {
      id: "f-news",
      title: t("resources"),
      links: [
        { href: "/blog", label: nav("blog") },
        { href: "/newsletters", label: nav("newsletter") },
        { href: "/newsletters#archive", label: t("pdfArchive") },
      ],
    },
  ];

  const socials = (
    [
      { name: "Facebook", url: settings.facebook_url },
      { name: "Instagram", url: settings.instagram_url },
      { name: "YouTube", url: settings.youtube_url },
    ] as const
  ).filter((s) => s.url);

  const linkClass =
    "inline-flex min-h-9 items-center text-[0.95rem] text-sky-light/90 transition-colors hover:text-aqua focus-visible:outline-aqua";

  return (
    <footer className="cw-night cw-grain relative overflow-hidden">
      {/* soft horizon light */}
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[120%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(133_240_212/0.12),transparent)]" />
      <div className="relative z-[2] mx-auto max-w-7xl px-5 pb-10 pt-16 sm:px-6 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr_1.4fr]">
          <div className="flex flex-col gap-6">
            <Link href="/" aria-label={nav("homeAria")} className="inline-flex self-start rounded-sm focus-visible:outline-aqua">
              <Image src="/images/site/logo-full-color.png" alt="CareWays Collaborative" width={1366} height={342} sizes="180px" className="h-10 w-auto brightness-0 invert" />
            </Link>
            <p className="max-w-sm leading-relaxed text-sky-light/90">{tagline}</p>
            {socials.length > 0 && (
              <ul className="flex gap-2">
                {socials.map((s) => (
                  <li key={s.name}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.08] ring-1 ring-white/15 transition-colors hover:bg-white/15 hover:text-aqua focus-visible:outline-aqua"
                    >
                      <span className="sr-only">{t("follow", { network: s.name })}</span>
                      <SocialIcon network={s.name} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {groups.map((g) => (
              <nav key={g.id} aria-labelledby={g.id}>
                <h2 id={g.id} className="cw-eyebrow text-aqua">
                  {g.title}
                </h2>
                <ul className="mt-5 flex flex-col gap-1">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className={linkClass}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="cw-glass-dark rounded-[20px] p-6">
            <h2 className="cw-display text-2xl leading-snug">{t("stayUpdated")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-sky-light/90">{t("newsletterIntro")}</p>
            <div className="mt-5">
              <NewsletterForm tone="dark" />
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-white/10 pt-8 text-sm text-sky-light/85 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-1.5">
            <p>{t("rights", { year: new Date().getFullYear() })}</p>
            <p>{t("nonprofit")}</p>
            <address className="not-italic">{settings.postal_address.split("\n").join(" · ")}</address>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <ul className="flex flex-wrap gap-x-5 gap-y-1">
              <li><Link href="/privacy-policy" className={linkClass}>{t("privacy")}</Link></li>
              <li><Link href="/terms-of-service" className={linkClass}>{t("terms")}</Link></li>
              <li><Link href="/disclaimer" className={linkClass}>{t("disclaimer")}</Link></li>
              <li><Link href="/cookie-policy" className={linkClass}>{t("cookies")}</Link></li>
            </ul>
            <p className="inline-flex items-center gap-1.5">
              {t.rich("madeWith", {
                heart: () => (
                  <>
                    <Heart size={14} className="text-aqua" />
                    <span className="sr-only">{t("love")}</span>
                  </>
                ),
              })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
