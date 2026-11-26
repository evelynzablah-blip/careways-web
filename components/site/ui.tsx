import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function Section({
  id,
  className,
  children,
  tone = "white",
  labelledBy,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
  tone?: "white" | "paper" | "sky" | "navy" | "mint";
  labelledBy?: string;
}) {
  const tones = {
    white: "bg-white",
    paper: "bg-paper",
    sky: "bg-sky-50",
    mint: "bg-mint/50",
    navy: "bg-navy text-white",
  };
  return (
    <section id={id} aria-labelledby={labelledBy} className={cx("py-16 sm:py-20", tones[tone], className)}>
      {children}
    </section>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx("text-sm font-semibold uppercase tracking-[0.14em] text-teal-700", className)}>{children}</p>
  );
}

type Variant = "primary" | "donate" | "outline" | "ghost" | "light";

const variants: Record<Variant, string> = {
  primary: "bg-navy text-white hover:bg-navy-700",
  donate: "bg-sun text-navy-900 hover:bg-sun-500",
  outline: "border-2 border-navy text-navy hover:bg-navy hover:text-white",
  ghost: "text-link hover:text-navy underline-offset-4 hover:underline",
  light: "bg-white text-navy hover:bg-sky",
};

export function buttonClass(variant: Variant = "primary", className?: string) {
  return cx(
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[0.95rem] font-semibold transition-colors",
    variants[variant],
    className,
  );
}

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link {...props} className={buttonClass(variant, className)} />;
}

export function ExternalButton({
  variant = "primary",
  className,
  children,
  ...props
}: ComponentProps<"a"> & { variant?: Variant }) {
  return (
    <a {...props} className={buttonClass(variant, className)}>
      {children}
    </a>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-sky-50 to-white">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-mint/70 blur-3xl" />
      <Container className="relative py-14 sm:py-20">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-navy sm:text-5xl">
          {title}
        </h1>
        {lead && <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted sm:text-xl">{lead}</p>}
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </Container>
    </header>
  );
}

export function StatCard({ value, label, tone = "white" }: { value: string; label: string; tone?: "white" | "navy" }) {
  return (
    <div
      className={cx(
        "rounded-[var(--radius-card)] p-6",
        tone === "navy" ? "bg-white/10 ring-1 ring-white/20" : "bg-white shadow-[var(--shadow-card)] ring-1 ring-line",
      )}
    >
      <p className={cx("text-4xl font-extrabold tracking-tight", tone === "navy" ? "text-sun" : "text-navy")}>{value}</p>
      <p className={cx("mt-3 leading-relaxed", tone === "navy" ? "text-white/90" : "text-muted")}>{label}</p>
    </div>
  );
}

export function SideIndex({ title, items }: { title: string; items: Array<{ id: string; label: string }> }) {
  return (
    <nav aria-label={title} className="lg:sticky lg:top-28">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{title}</p>
      <ul className="mt-3 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible">
        {items.map((item) => (
          <li key={item.id} className="shrink-0">
            <a
              href={`#${item.id}`}
              className="block rounded-full bg-sky-50 px-4 py-2 text-sm font-medium text-navy hover:bg-sky lg:rounded-lg lg:bg-transparent lg:px-3"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function FallbackNote({ show, children }: { show: boolean; children: ReactNode }) {
  if (!show) return null;
  return (
    <p className="mb-6 rounded-lg bg-sun/60 px-4 py-2 text-sm text-navy-900" lang="es">
      {children}
    </p>
  );
}
