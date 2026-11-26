"use client";

import { useActionState } from "react";
import { saveTeamMember } from "@/app/admin/(panel)/team/actions";
import type { AdminDict } from "@/lib/admin-i18n";
import type { TeamMember } from "@/lib/types";
import { Card, Field, inputClass, LocaleTabs, SimpleSaveBar, type SaveState } from "./fields";
import { FileUpload } from "./FileUpload";

export function TeamForm({ member, dict }: { member: TeamMember | null; dict: AdminDict }) {
  const [state, action] = useActionState<SaveState, FormData>(saveTeamMember, {});
  const f = dict.team.fields;
  return (
    <form action={action}>
      <input type="hidden" name="id" value={state.id ?? member?.id ?? ""} />
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <Card>
          <Field label={f.name} required>
            <input name="name" required defaultValue={member?.name ?? ""} className={`${inputClass} text-lg font-semibold`} />
          </Field>
          <LocaleTabs
            dict={dict}
            en={
              <>
                <Field label={f.role}>
                  <input name="role_en" defaultValue={member?.role_en ?? ""} placeholder={f.rolePlaceholder} className={inputClass} />
                </Field>
                <Field label={f.affiliation}>
                  <input name="affiliation_en" defaultValue={member?.affiliation_en ?? ""} className={inputClass} />
                </Field>
                <Field label={f.bio}>
                  <textarea name="bio_en" rows={10} defaultValue={member?.bio_en ?? ""} className={inputClass} />
                </Field>
              </>
            }
            es={
              <>
                <Field label={f.role}>
                  <input name="role_es" defaultValue={member?.role_es ?? ""} placeholder={f.rolePlaceholder} className={inputClass} />
                </Field>
                <Field label={f.affiliation}>
                  <input name="affiliation_es" defaultValue={member?.affiliation_es ?? ""} className={inputClass} />
                </Field>
                <Field label={f.bio}>
                  <textarea name="bio_es" rows={10} defaultValue={member?.bio_es ?? ""} className={inputClass} />
                </Field>
              </>
            }
          />
        </Card>
        <Card>
          <FileUpload name="photo_path" bucket="media" folder="team" defaultPath={member?.photo_path} label={f.photo} dict={dict} />
          <label className="flex items-center gap-3 font-semibold text-navy">
            <input type="checkbox" name="visible" defaultChecked={member?.visible ?? true} className="h-5 w-5" />
            {dict.common.visible}
          </label>
        </Card>
      </div>
      <SimpleSaveBar dict={dict} state={state} />
    </form>
  );
}
