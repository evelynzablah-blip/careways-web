"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { cx } from "@/components/site/ui";
import type { AdminDict } from "@/lib/admin-i18n";
import type { Status } from "@/lib/types";

export const inputClass = "mt-1.5 w-full rounded-xl bg-white px-4 py-2.5 ring-1 ring-line focus:ring-2 focus:ring-blue";

export function Field({ label, hint, children, required }: { label: string; hint?: string; children: ReactNode; required?: boolean }) {
  return (
    <label className="block">
      <span className="font-semibold text-navy">
        {label}
        {required && <span className="text-red-700"> *</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-sm text-muted">{hint}</span>}
    </label>
  );
}

export function Card({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={cx("rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-line", className)}>
      {title && <h2 className="mb-4 text-lg font-bold text-navy">{title}</h2>}
      <div className="space-y-5">{children}</div>
    </section>
  );
}

/** English / Spanish tabs. Both panels stay in the DOM so all fields submit. */
export function LocaleTabs({ en, es, dict }: { en: ReactNode; es: ReactNode; dict: AdminDict }) {
  const [tab, setTab] = useState<"en" | "es">("en");
  return (
    <div>
      <div role="tablist" className="inline-flex rounded-full bg-sky-50 p-1">
        {(["en", "es"] as const).map((l) => (
          <button
            key={l}
            type="button"
            role="tab"
            aria-selected={tab === l}
            onClick={() => setTab(l)}
            className={cx("rounded-full px-4 py-1.5 text-sm font-semibold", tab === l ? "bg-white text-navy shadow-sm" : "text-muted")}
          >
            {l === "en" ? dict.common.english : dict.common.spanish}
          </button>
        ))}
      </div>
      {tab === "es" && <p className="mt-2 text-sm text-muted">{dict.common.spanishHint}</p>}
      <div className="mt-5 space-y-5" hidden={tab !== "en"}>
        {en}
      </div>
      <div className="mt-5 space-y-5" hidden={tab !== "es"} lang="es">
        {es}
      </div>
    </div>
  );
}

export function StatusBadge({ status, dict }: { status: Status; dict: AdminDict }) {
  return (
    <span
      className={cx(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold",
        status === "published" ? "bg-mint text-teal-700" : "bg-sun/70 text-navy-900",
      )}
    >
      {status === "published" ? dict.common.published : dict.common.draft}
    </span>
  );
}

export type SaveState = { ok?: boolean; error?: string; id?: string; status?: Status; intent?: string; at?: number };

/**
 * Sticky action bar: Save draft / Preview / Publish (or Move to draft).
 * Preview opens a tab synchronously on click (so pop-up blockers allow it),
 * then points it at the preview URL once the save finishes.
 */
export function SaveBar({
  dict,
  status,
  state,
  previewPath,
  onSaved,
}: {
  dict: AdminDict;
  status: Status | null;
  state: SaveState;
  previewPath: (id: string) => string;
  onSaved?: (id: string) => void;
}) {
  const { pending } = useFormStatus();
  const previewWindow = useRef<Window | null>(null);

  useEffect(() => {
    if (!state.at) return;
    if (state.ok && state.id) {
      if (state.intent === "preview" && previewWindow.current) {
        previewWindow.current.location.href = previewPath(state.id);
      }
      onSaved?.(state.id);
    } else if (previewWindow.current) {
      previewWindow.current.close();
    }
    previewWindow.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.at]);

  const btn = "rounded-full px-5 py-2.5 font-semibold disabled:opacity-60";
  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-8 border-t border-line bg-white/95 px-4 py-4 backdrop-blur sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
      <div className="flex flex-wrap items-center gap-3">
        {status && <StatusBadge status={status} dict={dict} />}
        <button type="submit" name="intent" value="save" disabled={pending} className={cx(btn, "text-navy ring-1 ring-line hover:bg-sky-50")}>
          {status === "published" ? dict.common.update : dict.common.saveDraft}
        </button>
        <button
          type="submit"
          name="intent"
          value="preview"
          disabled={pending}
          onClick={() => {
            previewWindow.current = window.open("about:blank", "_blank");
          }}
          className={cx(btn, "text-navy ring-1 ring-line hover:bg-sky-50")}
        >
          👁 {dict.common.preview}
        </button>
        {status === "published" ? (
          <button type="submit" name="intent" value="unpublish" disabled={pending} className={cx(btn, "text-navy ring-1 ring-line hover:bg-sun/50")}>
            {dict.common.unpublish}
          </button>
        ) : (
          <button type="submit" name="intent" value="publish" disabled={pending} className={cx(btn, "bg-navy text-white hover:bg-navy-700")}>
            {dict.common.publish}
          </button>
        )}
        <span role="status" aria-live="polite" className="text-sm">
          {pending ? "…" : state.ok ? <span className="text-teal-700">{dict.common.saved}</span> : state.error ? <span className="text-red-700">{dict.common.error}: {state.error}</span> : null}
        </span>
      </div>
    </div>
  );
}

/** Simple save bar for non-publishable records (team, partners, map, settings). */
export function SimpleSaveBar({ dict, state }: { dict: AdminDict; state: SaveState }) {
  const { pending } = useFormStatus();
  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-8 border-t border-line bg-white/95 px-4 py-4 backdrop-blur sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className="rounded-full bg-navy px-6 py-2.5 font-semibold text-white hover:bg-navy-700 disabled:opacity-60">
          {dict.common.save}
        </button>
        <span role="status" aria-live="polite" className="text-sm">
          {pending ? "…" : state.ok ? <span className="text-teal-700">{dict.common.saved}</span> : state.error ? <span className="text-red-700">{dict.common.error}: {state.error}</span> : null}
        </span>
      </div>
    </div>
  );
}

export function CountryCheckboxes({
  options,
  selected,
  dict,
}: {
  options: Array<{ code: string; label: string }>;
  selected: string[];
  dict: AdminDict;
}) {
  return (
    <fieldset>
      <legend className="font-semibold text-navy">{dict.common.countries}</legend>
      <p className="text-sm text-muted">{dict.common.countriesHint}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.code} className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-sm has-[:checked]:bg-navy has-[:checked]:text-white">
            <input type="checkbox" name="country_codes" value={o.code} defaultChecked={selected.includes(o.code)} className="sr-only" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
