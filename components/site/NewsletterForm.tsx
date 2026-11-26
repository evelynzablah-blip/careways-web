"use client";

import { useLocale, useTranslations } from "next-intl";
import { useId, useState, type FormEvent } from "react";
import { buttonClass } from "@/components/premium/ui";
import { Check } from "./icons";
import { cx } from "./ui";

/**
 * Newsletter sign-up (name + email) with idle / sending / success / error.
 * tone="light": product inputs (rounded-xl, surface-container-high, white on focus).
 * tone="dark":  inverted inputs for navy sections (white/10, white/25 border).
 * Layout is mobile first: stacked, and side by side from `sm` when `inline`.
 */
export function NewsletterForm({
  tone = "dark",
  source = "footer",
  inline = false,
}: {
  tone?: "dark" | "light";
  source?: string;
  inline?: boolean;
}) {
  const t = useTranslations("newsletterForm");
  const locale = useLocale();
  const id = useId();
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setState("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale, source }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("done");
      form.reset();
    } catch {
      setState("error");
    }
  }

  const dark = tone === "dark";
  const input = cx(
    "min-h-12 w-full rounded-[2rem] px-4 py-3 text-base transition-colors",
    dark
      ? "border border-white/25 bg-white/10 text-white placeholder:text-white/70 focus-visible:outline-aqua"
      : "bg-white text-on-surface shadow-e1 ring-1 ring-ice placeholder:text-neutral focus:ring-2 focus:ring-secondary",
  );
  const label = cx("mb-1.5 block text-sm font-medium", dark ? "text-sky-light" : "text-on-surface-variant");

  if (state === "done") {
    return (
      <p
        role="status"
        className={cx(
          "flex items-center gap-2.5 rounded-[14px] p-4 font-semibold",
          dark ? "bg-white/10 text-white ring-1 ring-white/20" : "bg-success/10 text-success",
        )}
      >
        <Check size={18} className={dark ? "text-aqua" : undefined} />
        {t("success")}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative flex flex-col gap-3" aria-describedby={state === "error" ? `${id}-err` : undefined}>
      <div className={cx("grid gap-3", inline && "sm:grid-cols-2")}>
        <div>
          <label htmlFor={`${id}-name`} className={label}>
            {t("firstName")}
          </label>
          <input id={`${id}-name`} name="firstName" autoComplete="given-name" className={input} />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className={label}>
            {t("email")}
          </label>
          <input id={`${id}-email`} name="email" type="email" required autoComplete="email" inputMode="email" className={input} />
        </div>
      </div>
      {/* Honeypot: hidden from people, often filled by bots */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button type="submit" disabled={state === "sending"} aria-busy={state === "sending"} className={buttonClass(dark ? "aqua" : "primary", "md", "w-full sm:w-auto sm:self-start")}>
        {state === "sending" ? t("sending") : t("subscribe")}
      </button>
      {state === "error" && (
        <p id={`${id}-err`} role="alert" className={cx("text-sm", dark ? "text-amber-light" : "text-error")}>
          {t("error")}
        </p>
      )}
    </form>
  );
}
