"use client";

import { useActionState } from "react";
import { saveSettings } from "@/app/admin/(panel)/settings/actions";
import type { AdminDict } from "@/lib/admin-i18n";
import type { SiteSettings } from "@/lib/types";
import { Card, Field, inputClass, SimpleSaveBar, type SaveState } from "./fields";

const MULTILINE: Array<keyof SiteSettings> = ["tagline_en", "tagline_es", "postal_address"];

export function SettingsForm({ settings, dict }: { settings: SiteSettings; dict: AdminDict }) {
  const [state, action] = useActionState<SaveState, FormData>(saveSettings, {});
  const labels = dict.settings.fields;
  return (
    <form action={action}>
      <Card className="max-w-3xl">
        {(Object.keys(labels) as Array<keyof SiteSettings>).map((key) => (
          <Field key={key} label={labels[key]}>
            {MULTILINE.includes(key) ? (
              <textarea name={key} rows={key === "postal_address" ? 4 : 2} defaultValue={settings[key]} className={inputClass} />
            ) : (
              <input name={key} defaultValue={settings[key]} className={inputClass} />
            )}
          </Field>
        ))}
      </Card>
      <SimpleSaveBar dict={dict} state={state} />
    </form>
  );
}
