import "server-only";
import { revalidatePath } from "next/cache";
import type { Status } from "@/lib/types";

export function str(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export function optStr(formData: FormData, key: string): string | null {
  return str(formData, key) || null;
}

export function list(formData: FormData, key: string): string[] {
  return formData.getAll(key).filter((v): v is string => typeof v === "string" && v.trim() !== "");
}

export function lines(formData: FormData, key: string): string[] {
  return str(formData, key)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
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

/** Resolves the new status / published_at from the button that was pressed. */
export function resolvePublishing(
  intent: string,
  current: { status: Status; published_at: string | null } | null,
): { status: Status; published_at: string | null } {
  const status: Status =
    intent === "publish" ? "published" : intent === "unpublish" ? "draft" : (current?.status ?? "draft");
  const published_at = status === "published" ? (current?.published_at ?? new Date().toISOString()) : (current?.published_at ?? null);
  return { status, published_at };
}

/** Public pages are cached (ISR); refresh them all after any content change. */
export function revalidateSite() {
  revalidatePath("/", "layout");
}

export function friendlyDbError(message: string) {
  if (message.includes("duplicate key") && message.includes("slug")) return "slug (URL) already in use / dirección ya usada";
  if (message.includes("_slug_check")) return "slug: a-z, 0-9, -";
  if (message.includes("row-level security")) return "permission denied / sin permiso";
  return message;
}
