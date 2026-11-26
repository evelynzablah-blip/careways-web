import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cx } from "./ui";

/**
 * CareWays design-system primitives for the public site, mirroring the
 * platform UI (button.tsx, section-heading, concentric-arcs, impact-band,
 * pillar/module cards and the course-catalog card). Mobile first: base
 * classes target phones; sm / md / lg add the larger layouts.
 */

/* ── Layout ─────────────────────────────────────────────── */

export function Wrap({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("mx-auto w-full max-w-7xl px-5 sm:px-6", className)}>{children}</div>;
}

/* ── Buttons ────────────────────────────────────────────── */

export type CwVariant = "primary" | "cta" | "outline" | "ghost";
export type CwSize = "sm" | "md" | "lg";

const variantClass: Record<CwVariant, string> = {
  // Gradient navy, white text
  primary: "bg-gradient-to-r from-primary-container to-primary text-white hover:opacity-90",
  // Amber with navy text (white on amber fails AA). Donate and conversion CTAs only.
  cta: "bg-amber font-bold text-primary hover:bg-amber-light",
  outline: "border-2 border-secondary text-primary-container hover:bg-surface-low",
  ghost: "text-primary hover:bg-surface-low",
};

const sizeClass: Record<CwSize, string> = {
  sm: "min-h-10 px-5 py-2 text-sm",
  md: "min-h-12 px-7 py-3 text-base",
  lg: "min-h-14 px-9 py-4 text-lg",
};

export function cwButton(variant: CwVariant = "primary", size: CwSize = "md", className?: string) {
  return cx(
    "inline-flex items-center justify-center gap-2 rounded-pill font-semibold transition-all duration-200",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-dark",
    "disabled:cursor-not-allowed disabled:opacity-50",
    variantClass[variant],
    sizeClass[size],
    className,
  );
}

export function CwButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: CwVariant; size?: CwSize }) {
  return <Link {...props} className={cwButton(variant, size, className)} />;
}

/* ── Typography ─────────────────────────────────────────── */

export function Eyebrow({
  children,
  tone = "light",
  rules = "left",
  className,
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  rules?: "left" | "both" | "none";
  className?: string;
}) {
  const color = tone === "dark" ? "text-mint-accent" : "text-sky-dark";
  const rule = (
    <span aria-hidden className={cx("hidden h-px w-8 sm:inline-block", tone === "dark" ? "bg-mint-accent" : "bg-sky-dark")} />
  );
  return (
    <p className={cx("cw-eyebrow inline-flex items-center gap-3", color, className)}>
      {rules !== "none" && rule}
      {children}
      {rules === "both" && rule}
    </p>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "light",
  className,
  children,
}: {
  id?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cx("flex max-w-3xl flex-col gap-5", align === "center" && "mx-auto items-center text-center", className)}>
      {eyebrow && (
        <Eyebrow tone={tone} rules={align === "center" ? "both" : "left"}>
          {eyebrow}
        </Eyebrow>
      )}
      <h2
        id={id}
        className={cx(
          "cw-display text-balance text-[2rem] leading-[1.12] md:text-[2.75rem]",
          tone === "dark" ? "text-white" : "text-primary",
        )}
      >
        {title}
      </h2>
      {lead && (
        <p className={cx("text-pretty text-lg leading-relaxed", tone === "dark" ? "text-sky-light/85" : "text-on-surface-variant")}>
          {lead}
        </p>
      )}
      {children}
    </div>
  );
}

/* ── Brand motifs ───────────────────────────────────────── */

/** Concentric arcs: decorative only, never carry information. */
export function ConcentricArcs({
  tone = "sky",
  rings = 6,
  animated = false,
  className,
}: {
  tone?: "sky" | "mint";
  rings?: number;
  animated?: boolean;
  className?: string;
}) {
  const stroke = tone === "mint" ? "var(--color-mint-accent)" : "var(--color-secondary)";
  return (
    <svg aria-hidden focusable="false" viewBox="0 0 400 400" className={cx("pointer-events-none overflow-visible", className)}>
      {Array.from({ length: rings }, (_, i) => (
        <circle
          key={i}
          cx="200"
          cy="200"
          r={26 + i * i * 3.6 + i * 22}
          fill="none"
          stroke={stroke}
          strokeWidth={i === 0 ? 2 : 1}
          opacity={Math.max(0.55 - i * 0.07, 0.06)}
          className={animated ? "cw-ring-pulse" : undefined}
          style={animated ? { animationDelay: `${i * 0.42}s` } : undefined}
        />
      ))}
      <circle cx="200" cy="200" r="7" fill={stroke} opacity={0.85} />
    </svg>
  );
}

export function ClinicalGrid({ className }: { className?: string }) {
  return <div aria-hidden className={cx("cw-grid-clinical pointer-events-none absolute inset-0", className)} />;
}

/* ── Impact band ────────────────────────────────────────── */

export function ImpactBand({
  titleId,
  title,
  value,
  label,
  source,
  context,
  footer,
}: {
  titleId: string;
  title: string;
  value: string;
  label: string;
  source?: ReactNode;
  context: Array<{ value: string; label: string }>;
  footer?: ReactNode;
}) {
  return (
    <section aria-labelledby={titleId} className="border-y border-outline-variant/40 bg-surface-low/50">
      <h2 id={titleId} className="sr-only">
        {title}
      </h2>
      <Wrap>
        {/* Stacked until xl: at 8rem the figure ("1.7 billion" / "1700 millones")
            needs ~820px, so two columns only fit from 1280px. */}
        <div className="grid items-end gap-6 py-14 md:gap-8 md:py-20 xl:grid-cols-[auto_minmax(0,1fr)] xl:gap-14">
          <p className="min-w-0 break-words font-sans text-[3.75rem] font-bold leading-[0.9] tracking-[-0.04em] text-primary tabular-nums sm:text-[5.5rem] lg:text-[8rem] lg:leading-[0.85]">
            {value}
          </p>
          <div>
            <p className="cw-display text-2xl leading-snug text-primary md:text-[2rem]">{label}</p>
            {source && <p className="mt-3 text-sm text-neutral">{source}</p>}
          </div>
        </div>
        <div className="flex flex-col gap-6 border-t border-outline-variant/40 py-8 sm:flex-row sm:flex-wrap sm:gap-x-12">
          {context.map((c) => (
            <div key={c.value} className="max-w-sm">
              <p className="text-2xl font-bold text-primary tabular-nums">{c.value}</p>
              <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">{c.label}</p>
            </div>
          ))}
          {footer && <div className="sm:ml-auto sm:self-end">{footer}</div>}
        </div>
      </Wrap>
    </section>
  );
}

/* ── Cards ──────────────────────────────────────────────── */

export function ModuleCard({
  eyebrow,
  title,
  children,
  className,
  headingLevel = "h3",
}: {
  eyebrow?: ReactNode;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <div className={cx("rounded-[20px] bg-white p-7 shadow-cw-card ring-1 ring-primary/[0.06] md:p-10", className)}>
      {eyebrow && <Eyebrow rules="none" className="gap-2">{eyebrow}</Eyebrow>}
      {title && <Heading className="cw-display mt-3 text-[1.6rem] leading-snug text-primary md:text-[1.85rem]">{title}</Heading>}
      {children}
    </div>
  );
}

export type BadgeTone = "ice" | "seafoam" | "navy95" | "amber";

/**
 * Tints from the official palette with navy text (AA at 11px).
 * [TABLA getCategoryStyle POR CONFIRMAR] — swap when the platform map is shared.
 */
const badgeTone: Record<BadgeTone, string> = {
  ice: "bg-ice text-primary",
  seafoam: "bg-seafoam text-primary",
  navy95: "bg-navy-95 text-primary",
  amber: "bg-amber-container text-primary",
};

export function Badge({ tone = "ice", children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span className={cx("inline-flex items-center self-start rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide", badgeTone[tone])}>
      {children}
    </span>
  );
}

/**
 * The "mother card" from the course catalog: 14px radius, navy-tinted
 * shadow, ice-blue ring, h-40 media, 11px badge, 17px title, 2-line excerpt,
 * xs metadata. The whole card is the link (stretched ::after).
 */
export function CatalogCard({
  href,
  title,
  badge,
  badgeTone: tone = "ice",
  excerpt,
  meta,
  image,
  media,
  mediaTone = "ice",
  footer,
}: {
  href: string;
  title: string;
  badge?: ReactNode;
  badgeTone?: BadgeTone;
  excerpt?: string | null;
  meta?: ReactNode;
  image?: { src: string; alt: string } | null;
  media?: ReactNode;
  mediaTone?: BadgeTone;
  footer?: ReactNode;
}) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[14px] bg-white shadow-cw-card ring-1 ring-ice/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-cw-card-hover motion-reduce:hover:translate-y-0">
      <div className={cx("relative flex h-40 w-full items-center justify-center overflow-hidden", badgeTone[mediaTone])}>
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
          />
        ) : (
          media
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {badge && <Badge tone={tone}>{badge}</Badge>}
        <h3 className="mt-3 text-[17px] font-bold leading-snug text-primary transition-colors group-hover:text-navy-light">
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {title}
          </Link>
        </h3>
        {excerpt && <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-on-surface-variant">{excerpt}</p>}
        {meta && <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral">{meta}</div>}
        {footer && <div className="mt-auto flex justify-end pt-5">{footer}</div>}
      </div>
      {/* Visible focus ring for the stretched link */}
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[14px] ring-sky-dark group-has-[a:focus-visible]:ring-2" />
    </article>
  );
}

/** Small document thumbnail used when a report has no cover photo. */
export function PdfThumb({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cx("flex h-[124px] w-24 flex-col gap-[5px] rounded bg-white p-2.5 shadow-cw-card", className)}>
      <i className="block h-2 w-[70%] rounded-sm bg-primary" />
      <i className="block h-[34px] rounded-sm bg-seafoam" />
      <i className="block h-1 rounded-sm bg-ice" />
      <i className="block h-1 rounded-sm bg-ice" />
      <i className="block h-1 w-[60%] rounded-sm bg-ice" />
      <i className="block h-1 rounded-sm bg-ice" />
    </div>
  );
}

/** Small pill that sits in a card footer (the card itself is the link). */
export function CardPill({ children }: { children: ReactNode }) {
  return (
    <span aria-hidden className="inline-flex items-center gap-1.5 rounded-pill bg-primary px-4 py-2 text-sm font-semibold text-white">
      {children}
    </span>
  );
}
