"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { cx } from "@/components/site/ui";
import type { AdminDict } from "@/lib/admin-i18n";
import { uploadFile } from "./FileUpload";

/** Multi-file drag-and-drop uploader for the media library. */
export function MediaUploader({ dict }: { dict: AdminDict }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [log, setLog] = useState<Array<{ name: string; status: string }>>([]);

  async function handle(files: FileList | null) {
    if (!files?.length) return;
    const list = Array.from(files);
    setLog(list.map((f) => ({ name: f.name, status: dict.media.uploading })));
    await Promise.all(
      list.map(async (file, i) => {
        const bucket = file.type === "application/pdf" ? "documents" : "media";
        let status: string = dict.media.uploaded;
        try {
          await uploadFile(file, bucket, bucket === "documents" ? "library" : "library");
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          status = msg === "tooBig" ? dict.media.tooBig : msg === "wrongType" ? dict.media.wrongType : `${dict.media.failed}: ${msg}`;
        }
        setLog((prev) => prev.map((row, j) => (j === i ? { ...row, status } : row)));
      }),
    );
    router.refresh();
  }

  return (
    <div>
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
          handle(e.dataTransfer.files);
        }}
        className={cx(
          "flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-12 text-center",
          over ? "border-blue bg-sky-50" : "border-line bg-white hover:bg-sky-50",
        )}
      >
        <span aria-hidden className="text-3xl">⬆️</span>
        <span className="mt-2 text-lg font-semibold text-navy">{dict.media.drop}</span>
        <span className="mt-1 text-sm text-muted">JPG · PNG · WebP · GIF (10 MB) · PDF (50 MB)</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif,application/pdf"
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          handle(e.target.files);
          e.target.value = "";
        }}
      />
      {log.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm" aria-live="polite">
          {log.map((l) => (
            <li key={l.name}>
              <span className="font-medium">{l.name}</span> — {l.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function CopyButton({ text, dict }: { text: string; dict: AdminDict }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-line hover:bg-sky-50"
    >
      {copied ? dict.common.copied : dict.common.copy}
    </button>
  );
}
