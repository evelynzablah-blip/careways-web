"use client";

import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { saveReport } from "@/app/admin/(panel)/reports/actions";
import type { AdminDict, AdminLang } from "@/lib/admin-i18n";
import type { MissionReport } from "@/lib/types";
import { Card, CountryCheckboxes, Field, inputClass, LocaleTabs, SaveBar, type SaveState } from "./fields";
import { FileUpload } from "./FileUpload";
import { RichTextEditor } from "./RichTextEditor";

export function ReportForm({
  report,
  dict,
  lang,
  countries,
  defaultSeries,
}: {
  report: MissionReport | null;
  dict: AdminDict;
  lang: AdminLang;
  countries: Array<{ code: string; label: string }>;
  defaultSeries: string;
}) {
  const router = useRouter();
  const [state, action] = useActionState<SaveState, FormData>(saveReport, {});
  const f = dict.reports.fields;
  const id = state.id ?? report?.id ?? "";
  const status = state.status ?? report?.status ?? null;

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <Card>
          <LocaleTabs
            dict={dict}
            en={
              <>
                <Field label={f.title} required>
                  <input name="title_en" required defaultValue={report?.title_en ?? ""} className={`${inputClass} text-lg font-semibold`} />
                </Field>
                <Field label={f.excerpt}>
                  <textarea name="excerpt_en" rows={2} defaultValue={report?.excerpt_en ?? ""} className={inputClass} />
                </Field>
                <Field label={f.highlights} hint={f.highlightsHint}>
                  <textarea name="highlights_en" rows={6} defaultValue={(report?.highlights_en ?? []).join("\n")} className={inputClass} />
                </Field>
                <RichTextEditor name="body_en" label={f.body} defaultValue={report?.body_en} dict={dict} uploadFolder="reports" />
              </>
            }
            es={
              <>
                <Field label={f.title}>
                  <input name="title_es" defaultValue={report?.title_es ?? ""} className={`${inputClass} text-lg font-semibold`} />
                </Field>
                <Field label={f.excerpt}>
                  <textarea name="excerpt_es" rows={2} defaultValue={report?.excerpt_es ?? ""} className={inputClass} />
                </Field>
                <Field label={f.highlights} hint={f.highlightsHint}>
                  <textarea name="highlights_es" rows={6} defaultValue={(report?.highlights_es ?? []).join("\n")} className={inputClass} />
                </Field>
                <RichTextEditor name="body_es" label={f.body} defaultValue={report?.body_es} dict={dict} uploadFolder="reports" />
              </>
            }
          />
        </Card>

        <div className="space-y-6">
          <Card>
            <FileUpload name="pdf_path" bucket="documents" folder="newsletters" defaultPath={report?.pdf_path} label={f.pdf} hint={f.pdfHint} dict={dict} />
            <Field label={f.date} required>
              <input name="report_date" type="date" required defaultValue={report?.report_date ?? new Date().toISOString().slice(0, 10)} className={inputClass} />
            </Field>
            <Field label={f.dateNote}>
              <input name="date_note" defaultValue={report?.date_note ?? ""} className={inputClass} />
            </Field>
            <div className="grid grid-cols-[110px_1fr] gap-3">
              <Field label={f.issue}>
                <input name="issue_number" type="number" min={1} defaultValue={report?.issue_number ?? ""} className={inputClass} />
              </Field>
              <Field label={f.series}>
                <input name="series" defaultValue={report?.series ?? defaultSeries} className={inputClass} />
              </Field>
            </div>
            <CountryCheckboxes options={countries} selected={report?.country_codes ?? []} dict={dict} />
            <FileUpload name="cover_image_path" bucket="media" folder="reports" defaultPath={report?.cover_image_path} label={f.cover} dict={dict} />
            <Field label={dict.common.slug} hint={dict.common.slugHint}>
              <input name="slug" defaultValue={report?.slug ?? ""} pattern="[a-z0-9]+(-[a-z0-9]+)*" className={`${inputClass} font-mono text-sm`} />
            </Field>
          </Card>
        </div>
      </div>

      <SaveBar
        dict={dict}
        status={status}
        state={state}
        previewPath={(rid) => `/${lang}/preview/reports/${rid}`}
        onSaved={(rid) => {
          if (!report) router.replace(`/admin/reports/${rid}`);
        }}
      />
    </form>
  );
}
