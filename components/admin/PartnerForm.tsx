"use client";

import { useActionState } from "react";
import { savePartner } from "@/app/admin/(panel)/partners/actions";
import type { AdminDict } from "@/lib/admin-i18n";
import type { Partner } from "@/lib/types";
import { Card, Field, inputClass, SimpleSaveBar, type SaveState } from "./fields";
import { FileUpload } from "./FileUpload";

export function PartnerForm({ partner, dict }: { partner: Partner | null; dict: AdminDict }) {
  const [state, action] = useActionState<SaveState, FormData>(savePartner, {});
  const f = dict.partners.fields;
  return (
    <form action={action}>
      <input type="hidden" name="id" value={state.id ?? partner?.id ?? ""} />
      <Card className="max-w-2xl">
        <Field label={f.name} required>
          <input name="name" required defaultValue={partner?.name ?? ""} className={inputClass} />
        </Field>
        <Field label={f.type}>
          <select name="type" defaultValue={partner?.type ?? "sponsor"} className={inputClass}>
            <option value="sponsor">{f.sponsor}</option>
            <option value="hospital">{f.hospital}</option>
          </select>
        </Field>
        <FileUpload name="logo_path" bucket="media" folder="partners" defaultPath={partner?.logo_path} label={f.logo} dict={dict} />
        <Field label={f.url}>
          <input name="url" type="url" defaultValue={partner?.url ?? ""} placeholder="https://" className={inputClass} />
        </Field>
        <label className="flex items-center gap-3 font-semibold text-navy">
          <input type="checkbox" name="visible" defaultChecked={partner?.visible ?? true} className="h-5 w-5" />
          {dict.common.visible}
        </label>
      </Card>
      <SimpleSaveBar dict={dict} state={state} />
    </form>
  );
}
