/**
 * One-time content migration into Supabase.
 *
 *   npm run migrate            # insert what is missing, never overwrite edits
 *   npm run migrate -- --force # overwrite rows that already exist (by slug)
 *
 * 1. Uploads the historical newsletter PDFs (migration-assets/pdfs) and the
 *    supply donation PDF to the "documents" Storage bucket. Missing local
 *    files are downloaded from their original public URL first.
 * 2. Upserts team members, map pins, sponsors and mission reports from
 *    content/seed/*.ts (the same data the preview shows without Supabase).
 * 3. Inserts default site settings that do not exist yet.
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * (read from .env.local).
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { seedTeam } from "../content/seed/team";
import { seedMapLocations } from "../content/seed/map";
import { seedPartners } from "../content/seed/partners";
import { seedReports } from "../content/seed/reports";
import { defaultSettings, supplyDonationPdf } from "../content/seed/settings";

config({ path: ".env.local" });
config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}
const force = process.argv.includes("--force");
const db = createClient(url, key, { auth: { persistSession: false } });
const PDF_DIR = path.join(process.cwd(), "migration-assets", "pdfs");

function strip<T extends { id: string }>(row: T): Omit<T, "id"> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = row;
  return rest;
}

async function ensureLocal(file: string, sourceUrl: string) {
  const local = path.join(PDF_DIR, file);
  if (existsSync(local)) return local;
  console.log(`  ↓ downloading ${sourceUrl}`);
  const res = await fetch(sourceUrl);
  if (!res.ok) throw new Error(`Download failed (${res.status}) for ${sourceUrl}`);
  mkdirSync(PDF_DIR, { recursive: true });
  writeFileSync(local, Buffer.from(await res.arrayBuffer()));
  return local;
}

async function uploadPdf(storagePath: string, sourceUrl: string) {
  const file = path.basename(storagePath);
  const local = await ensureLocal(file, sourceUrl);
  const body = readFileSync(local);
  const { error } = await db.storage.from("documents").upload(storagePath, body, { contentType: "application/pdf", upsert: true });
  if (error) throw new Error(`Upload ${storagePath}: ${error.message}`);
  await db
    .from("media_assets")
    .upsert({ bucket: "documents", path: storagePath, kind: "pdf", size_bytes: body.length, mime_type: "application/pdf" }, { onConflict: "bucket,path" });
  console.log(`  ✓ ${storagePath} (${(body.length / 1024 / 1024).toFixed(1)} MB)`);
}

async function upsert(table: string, rows: object[], onConflict: string) {
  const { error, count } = await db.from(table).upsert(rows, { onConflict, ignoreDuplicates: !force, count: "exact" });
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`  ✓ ${table}: ${count ?? rows.length} row(s) ${force ? "upserted" : "inserted (existing kept)"}`);
}

async function main() {
  console.log("1/3 PDFs → Storage (documents)");
  for (const r of seedReports) {
    if (r.pdf_path && r.source_url) await uploadPdf(r.pdf_path, r.source_url);
  }
  await uploadPdf(supplyDonationPdf.path, supplyDonationPdf.source_url);

  console.log("2/3 Content rows");
  await upsert("team_members", seedTeam.map(strip), "slug");
  await upsert("map_locations", seedMapLocations.map(strip), "slug");
  await upsert("mission_reports", seedReports.map(strip), "slug");

  // partners has no natural unique key: insert only names that are missing.
  const { data: existing } = await db.from("partners").select("name");
  const have = new Set((existing ?? []).map((p) => p.name));
  const missing = seedPartners.filter((p) => !have.has(p.name)).map(strip);
  if (missing.length) {
    const { error } = await db.from("partners").insert(missing);
    if (error) throw new Error(`partners: ${error.message}`);
  }
  console.log(`  ✓ partners: ${missing.length} new`);

  console.log("3/3 Site settings (missing keys only)");
  const now = new Date().toISOString();
  await db
    .from("site_settings")
    .upsert(
      Object.entries(defaultSettings).map(([k, value]) => ({ key: k, value, updated_at: now })),
      { onConflict: "key", ignoreDuplicates: true },
    );
  console.log("  ✓ settings");

  console.log("\nDone. Next: create the first admin (see README → 'First admin').");
}

main().catch((err) => {
  console.error("\n✗ Migration failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
