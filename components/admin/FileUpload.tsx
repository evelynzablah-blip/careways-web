"use client";

import { useRef, useState } from "react";
import { cx } from "@/components/site/ui";
import type { AdminDict } from "@/lib/admin-i18n";
import { getBrowserClient } from "@/lib/supabase/browser";
import { mediaUrl, documentUrl } from "@/lib/storage";

const LIMITS = {
  media: { maxBytes: 10 * 1024 * 1024, accept: "image/jpeg,image/png,image/webp,image/gif,image/avif" },
  documents: { maxBytes: 50 * 1024 * 1024, accept: "application/pdf" },
} as const;

export type Bucket = keyof typeof LIMITS;

function safeName(name: string) {
  const dot = name.lastIndexOf(".");
  const base = (dot > 0 ? name.slice(0, dot) : name)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase() : "";
  return `${base || "file"}-${Date.now().toString(36)}${ext ? `.${ext}` : ""}`;
}

/** Uploads one file to Supabase Storage (RLS: active staff only) and records it in media_assets. */
export async function uploadFile(file: File, bucket: Bucket, folder: string): Promise<string> {
  const limits = LIMITS[bucket];
  if (file.size > limits.maxBytes) throw new Error("tooBig");
  if (!limits.accept.split(",").includes(file.type)) throw new Error("wrongType");
  const supabase = getBrowserClient();
  const path = `${folder}/${safeName(file.name)}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  await supabase.from("media_assets").insert({
    bucket,
    path,
    kind: bucket === "documents" ? "pdf" : "image",
    size_bytes: file.size,
    mime_type: file.type,
  });
  return path;
}

/**
 * Drag-and-drop single file field. Keeps the Storage path in a hidden input
 * named `name`, so it is saved with the surrounding form.
 */
export function FileUpload({
  name,
  bucket,
  folder,
  defaultPath,
  label,
  hint,
  dict,
}: {
  name: string;
  bucket: Bucket;
  folder: string;
  defaultPath?: string | null;
  label: string;
  hint?: string;
  dict: AdminDict;
}) {
  const [path, setPath] = useState(defaultPath ?? "");
  const [state, setState] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState("");
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const url = bucket === "media" ? mediaUrl(path) : documentUrl(path);

  async function handle(file?: File | null) {
    if (!file) return;
    setState("uploading");
    setError("");
    try {
      setPath(await uploadFile(file, bucket, folder));
      setState("idle");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg === "tooBig" ? dict.media.tooBig : msg === "wrongType" ? dict.media.wrongType : `${dict.media.failed}: ${msg}`);
      setState("error");
    }
  }

  return (
    <div>
      <p className="font-semibold text-navy">{label}</p>
      <input type="hidden" name={name} value={path} />
      {path && url ? (
        <div className="mt-2 flex flex-wrap items-center gap-4 rounded-2xl bg-sky-50 p-3">
          {bucket === "media" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-20 w-28 rounded-lg object-cover" />
          ) : (
            <a href={url} target="_blank" rel="noopener noreferrer" className="font-semibold text-link underline">
              📄 {path.split("/").pop()}
            </a>
          )}
          <button type="button" onClick={() => inputRef.current?.click()} className="rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-line hover:bg-white">
            {dict.media.replace}
          </button>
          <button type="button" onClick={() => setPath("")} className="rounded-full px-3 py-1.5 text-sm font-semibold text-red-700 ring-1 ring-line hover:bg-white">
            {dict.media.remove}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            handle(e.dataTransfer.files?.[0]);
          }}
          className={cx(
            "mt-2 flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 text-center",
            over ? "border-blue bg-sky-50" : "border-line bg-paper hover:bg-sky-50",
          )}
        >
          <span className="text-2xl" aria-hidden>
            {bucket === "media" ? "🖼" : "📄"}
          </span>
          <span className="mt-2 font-semibold text-navy">{state === "uploading" ? dict.media.uploading : dict.media.drop}</span>
          {hint && <span className="mt-1 text-sm text-muted">{hint}</span>}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={LIMITS[bucket].accept}
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          handle(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {state === "error" && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
