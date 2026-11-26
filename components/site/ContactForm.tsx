"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRef, useState, type FormEvent } from "react";
import { CONTACT_REASONS } from "@/lib/contact";
import { cx } from "./ui";


/** Set NEXT_PUBLIC_CONTACT_PHONE_FIELD=true to show the optional phone field. */
const SHOW_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE_FIELD === "true";

export function ContactForm({ defaultReason }: { defaultReason?: string }) {
  const t = useTranslations("contact");
  const locale = useLocale();
  const startedAt = useRef(Date.now());
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const nextErrors = {
      name: !data.name?.trim(),
      email: !/^\S+@\S+\.\S+$/.test(data.email ?? ""),
      message: (data.message ?? "").trim().length < 5,
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale, elapsedMs: Date.now() - startedAt.current }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("done");
      form.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div role="status" className="rounded-[var(--radius-card)] bg-mint p-8 text-lg font-semibold text-navy">
        {t("success")}
      </div>
    );
  }

  const field = (invalid?: boolean) =>
    cx("mt-1.5 w-full rounded-xl bg-white px-4 py-3 ring-1", invalid ? "ring-2 ring-red-600" : "ring-line");

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {Object.values(errors).some(Boolean) && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-2 text-red-800">
          {t("invalid")}
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="font-semibold text-navy">{t("name")} *</span>
          <input name="name" autoComplete="name" required aria-invalid={errors.name || undefined} className={field(errors.name)} />
        </label>
        <label className="block">
          <span className="font-semibold text-navy">{t("email")} *</span>
          <input name="email" type="email" autoComplete="email" required aria-invalid={errors.email || undefined} className={field(errors.email)} />
        </label>
      </div>
      {SHOW_PHONE && (
        <label className="block">
          <span className="font-semibold text-navy">{t("phone")}</span>
          <input name="phone" type="tel" autoComplete="tel" className={field()} />
        </label>
      )}
      <label className="block">
        <span className="font-semibold text-navy">{t("reason")}</span>
        <select
          name="reason"
          defaultValue={CONTACT_REASONS.includes(defaultReason as never) ? defaultReason : "general"}
          className={field()}
        >
          {CONTACT_REASONS.map((r) => (
            <option key={r} value={r}>
              {t(`reasons.${r}`)}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="font-semibold text-navy">{t("message")} *</span>
        <textarea name="message" rows={6} required aria-invalid={errors.message || undefined} className={field(errors.message)} />
      </label>
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button
        type="submit"
        disabled={state === "sending"}
        className="rounded-full bg-navy px-7 py-3 font-semibold text-white hover:bg-navy-700 disabled:opacity-70"
      >
        {state === "sending" ? t("sending") : t("submit")}
      </button>
      {state === "error" && (
        <p role="alert" className="text-red-800">
          {t("error")}
        </p>
      )}
    </form>
  );
}
