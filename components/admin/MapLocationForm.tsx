"use client";

import dynamic from "next/dynamic";
import { useActionState, useState } from "react";
import { saveMapLocation } from "@/app/admin/(panel)/map/actions";
import type { AdminDict } from "@/lib/admin-i18n";
import type { MapLocation } from "@/lib/types";
import { Card, Field, inputClass, LocaleTabs, SimpleSaveBar, type SaveState } from "./fields";

const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false, loading: () => <div className="h-80 rounded-xl bg-sky-50" /> });

export function MapLocationForm({ location, dict }: { location: MapLocation | null; dict: AdminDict }) {
  const [state, action] = useActionState<SaveState, FormData>(saveMapLocation, {});
  const [lat, setLat] = useState(location?.lat?.toString() ?? "");
  const [lng, setLng] = useState(location?.lng?.toString() ?? "");
  const f = dict.map.fields;

  return (
    <form action={action}>
      <input type="hidden" name="id" value={state.id ?? location?.id ?? ""} />
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
            <Field label={f.countryCode} required>
              <input name="country_code" required maxLength={2} defaultValue={location?.country_code ?? ""} className={`${inputClass} uppercase`} />
            </Field>
            <Field label={f.hospital} required>
              <input name="hospital_name" required defaultValue={location?.hospital_name ?? ""} className={inputClass} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={f.countryEn} required>
              <input name="country_en" required defaultValue={location?.country_en ?? ""} className={inputClass} />
            </Field>
            <Field label={f.countryEs}>
              <input name="country_es" defaultValue={location?.country_es ?? ""} className={inputClass} />
            </Field>
          </div>
          <Field label={f.url}>
            <input name="url" type="url" defaultValue={location?.url ?? ""} placeholder="https://" className={inputClass} />
          </Field>
          <LocaleTabs
            dict={dict}
            en={
              <Field label={f.summary}>
                <textarea name="summary_en" rows={3} defaultValue={location?.summary_en ?? ""} className={inputClass} />
              </Field>
            }
            es={
              <Field label={f.summary}>
                <textarea name="summary_es" rows={3} defaultValue={location?.summary_es ?? ""} className={inputClass} />
              </Field>
            }
          />
          <Field label={dict.common.slug} hint={dict.common.slugHint}>
            <input name="slug" defaultValue={location?.slug ?? ""} className={`${inputClass} font-mono text-sm`} />
          </Field>
          <label className="flex items-center gap-3 font-semibold text-navy">
            <input type="checkbox" name="visible" defaultChecked={location?.visible ?? true} className="h-5 w-5" />
            {dict.common.visible}
          </label>
        </Card>
        <Card>
          <p className="font-semibold text-navy">{f.pick}</p>
          <div className="relative z-0">
            <MapPicker
              lat={lat ? Number(lat) : null}
              lng={lng ? Number(lng) : null}
              onPick={(a, b) => {
                setLat(String(a));
                setLng(String(b));
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label={f.lat} required>
              <input name="lat" required inputMode="decimal" value={lat} onChange={(e) => setLat(e.target.value)} className={inputClass} />
            </Field>
            <Field label={f.lng} required>
              <input name="lng" required inputMode="decimal" value={lng} onChange={(e) => setLng(e.target.value)} className={inputClass} />
            </Field>
          </div>
        </Card>
      </div>
      <SimpleSaveBar dict={dict} state={state} />
    </form>
  );
}
