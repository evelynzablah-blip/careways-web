import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cx } from "@/components/site/ui";

/**
 * Direction A · "Profundidad clínica" — base building blocks.
 * Mobile first; every interactive element has a visible focus ring and a
 * hit area of at least 44px. Hover motion is disabled with reduced motion.
 */

/* ── Buttons ─────────────────────────────────────────────── */

export type ButtonVariant = "donate" | "primary" | "aqua" | "outline" | "glass" | "outline-light" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  // Logo yellow, night text (12.8:1). Only for Donate.
  donate:
    "bg-sunbeam text-night shadow-e2 hover:bg-sunbeam-deep hover:shadow-e3 focus-visible:outline-sunbeam",
  // Brand navy with a soft inner light.
  primary:
    "bg-gradient-to-b from-primary-container to-primary text-white shadow-e2 [box-shadow:inset_0_1px_0_rgb(255_255_255/0.14),var(--shadow-e2)] hover:shadow-e3 hover:brightness-110",
  // Solid light action on night grounds (aqua on night 12.1:1).
  aqua: "bg-aqua text-night shadow-halo hover:bg-aqua-soft focus-visible:outline-aqua",
  outline: "bg-white/60 text-primary ring-1 ring-inset ring-secondary hover:bg-white hover:ring-primary/40",
  // For night / photo backgrounds.
  glass: "cw-glass-dark text-white hover:bg-white/15 focus-visible:outline-aqua",
  "outline-light": "text-white ring-1 ring-inset ring-white/40 hover:bg-white/10 hover:ring-white/70 focus-visible:outline-aqua",
  ghost: "text-primary hover:bg-ice/60",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-11 px-5 text-sm",
  md: "min-h-12 px-7 text-base",
  lg: "min-h-14 px-8 text-[1.0625rem]",
};

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cx(
    "group/btn relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full font-semibold tracking-[-0.005em]",
    "transition-[transform,box-shadow,background-color,filter] duration-300 ease-[var(--ease-out-soft)]",
    "hover:-translate-y-0.5 active:translate-y-0 motion-reduce:hover:translate-y-0",
    "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-sky-dark",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

/** Arrow that slides forward on hover — the button's micro-interaction. */
export function ArrowGlyph() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover/btn:translate-x-1 motion-reduce:group-hover/btn:translate-x-0"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  arrow = false,
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize; arrow?: boolean }) {
  return (
    <Link {...props} className={buttonClass(variant, size, className)}>
      {children}
      {arrow && <ArrowGlyph />}
    </Link>
  );
}

/* ── Typography ──────────────────────────────────────────── */

export function Kicker({ children, tone = "light", className }: { children: ReactNode; tone?: "light" | "dark"; className?: string }) {
  return (
    <p className={cx("cw-eyebrow inline-flex items-center gap-3", tone === "dark" ? "text-aqua" : "text-sky-dark", className)}>
      <span aria-hidden className={cx("h-px w-8", tone === "dark" ? "bg-aqua/70" : "bg-sky-dark")} />
      {children}
    </p>
  );
}

/* ── Surfaces & cards ────────────────────────────────────── */

export type Elevation = "e1" | "e2" | "e3" | "e4";

const elevation: Record<Elevation, string> = {
  e1: "shadow-e1",
  e2: "shadow-e2",
  e3: "shadow-e3",
  e4: "shadow-e4",
};

/** A white surface at a given height. */
export function Surface({
  level = "e2",
  className,
  children,
}: {
  level?: Elevation;
  className?: string;
  children: ReactNode;
}) {
  return <div className={cx("rounded-[20px] bg-white ring-1 ring-primary/[0.06]", elevation[level], className)}>{children}</div>;
}
