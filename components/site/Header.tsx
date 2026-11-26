"use client";

import Image from "next/image";
import { AnimatePresence, m } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { EASE } from "@/components/premium/motion";
import { Close, Menu } from "./icons";
import { cx } from "./ui";

const localeNames: Record<string, string> = { en: "English", es: "Español" };

/**
 * Main menu = the current careways.world menu, same order and names
 * (HOME · WHO WE ARE · WHAT WE DO · HOW WE DO IT · THE NEED · OUR TEAM · CONTACT),
 * plus Blog and Newsletter (requested by CareWays) before Contact.
 *
 * Over the home hero the bar is clear (white logo and links). Once the page
 * scrolls, it becomes frosted glass with a soft shadow. The active page is
 * marked by a pill that glides between links. < xl: menu button + animated sheet.
 */
export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const nav = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("whoWeAre") },
    { href: "/what-we-do", label: t("whatWeDo") },
    { href: "/how-we-do-it", label: t("howWeDoIt") },
    { href: "/the-need", label: t("theNeed") },
    { href: "/team", label: t("team") },
    { href: "/blog", label: t("blog") },
    { href: "/newsletters", label: t("newsletter") },
    { href: "/contact", label: t("contact") },
  ];

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));
  const overHero = pathname === "/" && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const mq = window.matchMedia("(min-width: 1280px)");
    const onMq = () => mq.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="pointer-events-none sticky top-0 z-50">
      <div className="mx-auto w-full max-w-7xl px-3 pt-3 sm:px-6 sm:pt-4">
        <div
          className={cx(
            "pointer-events-auto flex items-center justify-between gap-3 rounded-full py-2 pl-4 pr-2 transition-[background-color,box-shadow,border-color] duration-500 sm:py-3 sm:pl-6 sm:pr-3",
            overHero
              ? "border border-white/15 bg-white/[0.06] backdrop-blur-[6px]"
              : "cw-glass shadow-e3",
          )}
        >
          <Link href="/" className="flex shrink-0 items-center rounded-sm" aria-label={t("homeAria")}>
            <Image
              src="/images/site/logo-full-color.png"
              alt="CareWays Collaborative"
              width={1366}
              height={342}
              priority
              sizes="160px"
              className={cx("h-8 w-auto transition-[filter] duration-500 md:h-9", overHero && "brightness-0 invert")}
            />
          </Link>

          <nav aria-label={t("primary")} className="hidden xl:block">
            <ul className="flex items-center gap-0.5">
              {nav.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href} className="relative">
                    {active && (
                      <m.span
                        layoutId="nav-active"
                        aria-hidden
                        transition={{ type: "spring", stiffness: 420, damping: 36 }}
                        className={cx("absolute inset-0 rounded-full", overHero ? "bg-white/15 ring-1 ring-white/25" : "bg-ice/70 ring-1 ring-ice")}
                      />
                    )}
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cx(
                        "relative inline-flex min-h-10 items-center rounded-full px-3 text-sm transition-colors duration-300",
                        overHero
                          ? cx("text-white/85 hover:text-white focus-visible:outline-aqua", active && "font-semibold text-white")
                          : cx("hover:text-primary", active ? "font-semibold text-primary" : "font-medium text-on-surface-variant"),
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden xl:block">
              <LanguageToggle locale={locale} label={t("language")} tone={overHero ? "dark" : "light"} />
            </div>
            <button
              ref={buttonRef}
              type="button"
              className={cx(
                "inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors xl:hidden",
                overHero ? "text-white hover:bg-white/15 focus-visible:outline-aqua" : "text-primary hover:bg-surface-low",
              )}
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">{open ? t("close") : t("menu")}</span>
              {open ? <Close size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <m.div
              id={menuId}
              key="sheet"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.35, ease: EASE }}
              style={{ transformOrigin: "top center" }}
              className="cw-glass pointer-events-auto mt-2 max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain rounded-[2rem] p-4 shadow-e4 sm:p-6 xl:hidden"
            >
              <nav aria-label={t("primary")}>
                <m.ul
                  className="grid gap-1 sm:grid-cols-2"
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } } }}
                >
                  {nav.map((item) => (
                    <m.li
                      key={item.href}
                      variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } } }}
                    >
                      <Link
                        href={item.href}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className={cx(
                          "flex min-h-12 items-center rounded-2xl px-4 text-lg transition-colors hover:bg-ice/50",
                          isActive(item.href) ? "bg-ice/70 font-bold text-primary" : "font-medium text-on-surface",
                        )}
                      >
                        {item.label}
                      </Link>
                    </m.li>
                  ))}
                </m.ul>
              </nav>
              <div className="mt-4 flex justify-center border-t border-outline-variant/40 pt-4">
                <LanguageToggle locale={locale} label={t("language")} />
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

/** EN / ES segmented toggle. Keeps the current page. */
export function LanguageToggle({
  locale,
  label,
  tone = "light",
  className,
}: {
  locale: string;
  label: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <div
      role="group"
      aria-label={label}
      className={cx(
        "inline-flex rounded-full p-0.5 ring-1 transition-colors duration-500",
        tone === "dark" ? "bg-white/10 ring-white/20" : "bg-white ring-ice",
        className,
      )}
    >
      {routing.locales.map((l) => {
        const current = l === locale;
        const base = "inline-flex min-h-9 min-w-11 items-center justify-center rounded-full px-3 text-xs font-bold uppercase transition-colors";
        return current ? (
          <span key={l} aria-current="true" className={cx(base, tone === "dark" ? "bg-white text-primary" : "bg-primary text-white")}>
            <span aria-hidden>{l}</span>
            <span className="sr-only">{localeNames[l]}</span>
          </span>
        ) : (
          <Link
            key={l}
            href={pathname}
            locale={l}
            hrefLang={l}
            lang={l}
            className={cx(base, tone === "dark" ? "text-white/85 hover:text-white focus-visible:outline-aqua" : "text-on-surface-variant hover:text-primary")}
          >
            <span aria-hidden>{l}</span>
            <span className="sr-only">{localeNames[l]}</span>
          </Link>
        );
      })}
    </div>
  );
}
