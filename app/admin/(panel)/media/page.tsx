import { CopyButton, MediaUploader } from "@/components/admin/MediaUploader";
import { getAdminContext, requireStaff } from "@/lib/admin-auth";
import { documentUrl, mediaUrl } from "@/lib/storage";
import type { MediaAsset } from "@/lib/types";
import { deleteAsset, updateAlt } from "./actions";

export default async function MediaLibrary() {
  const { supabase, profile } = await requireStaff();
  const { dict } = await getAdminContext();
  const { data } = await supabase.from("media_assets").select("*").order("created_at", { ascending: false }).limit(200);
  const assets = (data ?? []) as MediaAsset[];
  const images = assets.filter((a) => a.bucket === "media");
  const pdfs = assets.filter((a) => a.bucket === "documents");

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-extrabold text-navy">{dict.media.title}</h1>
      <p className="mt-2 text-muted">{dict.media.intro}</p>
      <div className="mt-6">
        <MediaUploader dict={dict} />
      </div>

      <h2 className="mt-10 text-xl font-bold text-navy">{dict.media.images}</h2>
      {images.length === 0 ? (
        <p className="mt-3 text-muted">{dict.common.empty}</p>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((a) => {
            const url = mediaUrl(a.path) ?? "";
            return (
              <li key={a.id} className="overflow-hidden rounded-2xl bg-white ring-1 ring-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={a.alt_en ?? ""} className="aspect-[4/3] w-full object-cover" />
                <div className="space-y-2 p-3">
                  <p className="truncate text-xs text-muted" title={a.path}>
                    {a.path}
                  </p>
                  <form action={updateAlt} className="space-y-1.5">
                    <input type="hidden" name="id" value={a.id} />
                    <input name="alt_en" defaultValue={a.alt_en ?? ""} placeholder={`${dict.media.alt} — EN`} className="w-full rounded-lg px-2 py-1 text-sm ring-1 ring-line" />
                    <input name="alt_es" defaultValue={a.alt_es ?? ""} placeholder={`${dict.media.alt} — ES`} className="w-full rounded-lg px-2 py-1 text-sm ring-1 ring-line" />
                    <button className="rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-line hover:bg-sky-50">{dict.common.save}</button>
                  </form>
                  <div className="flex items-center gap-2">
                    <CopyButton text={url} dict={dict} />
                    {profile.role === "admin" && (
                      <form action={deleteAsset}>
                        <input type="hidden" name="id" value={a.id} />
                        <button className="rounded-full px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200 hover:bg-red-50">{dict.common.delete}</button>
                      </form>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <h2 className="mt-10 text-xl font-bold text-navy">{dict.media.pdfs}</h2>
      {pdfs.length === 0 ? (
        <p className="mt-3 text-muted">{dict.common.empty}</p>
      ) : (
        <ul className="mt-4 divide-y divide-line rounded-2xl bg-white ring-1 ring-line">
          {pdfs.map((a) => {
            const url = documentUrl(a.path) ?? "";
            return (
              <li key={a.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <a href={url} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1 truncate font-semibold text-link hover:underline">
                  📄 {a.path}
                </a>
                <span className="text-sm text-muted">{a.size_bytes ? `${(a.size_bytes / 1024 / 1024).toFixed(1)} MB` : ""}</span>
                <CopyButton text={url} dict={dict} />
                {profile.role === "admin" && (
                  <form action={deleteAsset}>
                    <input type="hidden" name="id" value={a.id} />
                    <button className="rounded-full px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200 hover:bg-red-50">{dict.common.delete}</button>
                  </form>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
