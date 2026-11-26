import Link from "next/link";
import type { ReactNode } from "react";
import { move, toggleVisible } from "@/app/admin/(panel)/list-actions";
import type { AdminDict } from "@/lib/admin-i18n";

export type OrderedRow = { id: string; visible: boolean; title: string; subtitle?: string; thumb?: ReactNode };

/** List with move up/down and show/hide controls (server actions, no JS needed). */
export function OrderedList({
  rows,
  table,
  editHref,
  dict,
}: {
  rows: OrderedRow[];
  table: "team_members" | "partners" | "map_locations";
  editHref: (id: string) => string;
  dict: AdminDict;
}) {
  if (!rows.length) return <p className="mt-10 rounded-2xl bg-white p-10 text-center text-muted ring-1 ring-line">{dict.common.empty}</p>;
  const small = "rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-line hover:bg-sky-50 disabled:opacity-30";
  return (
    <ul className="mt-8 divide-y divide-line overflow-hidden rounded-2xl bg-white ring-1 ring-line">
      {rows.map((r, i) => (
        <li key={r.id} className="flex flex-wrap items-center gap-4 px-5 py-3">
          {r.thumb}
          <div className="min-w-0 flex-1">
            <Link href={editHref(r.id)} className="block truncate font-semibold text-navy hover:underline">
              {r.title}
            </Link>
            {r.subtitle && <p className="truncate text-sm text-muted">{r.subtitle}</p>}
          </div>
          <span className={r.visible ? "rounded-full bg-mint px-2.5 py-0.5 text-xs font-bold text-teal-700" : "rounded-full bg-line px-2.5 py-0.5 text-xs font-bold text-muted"}>
            {r.visible ? dict.common.visible : dict.common.hidden}
          </span>
          <div className="flex gap-1.5">
            <form action={move}>
              <input type="hidden" name="table" value={table} />
              <input type="hidden" name="id" value={r.id} />
              <input type="hidden" name="dir" value="up" />
              <button className={small} disabled={i === 0} aria-label={`${dict.common.moveUp}: ${r.title}`}>
                ↑
              </button>
            </form>
            <form action={move}>
              <input type="hidden" name="table" value={table} />
              <input type="hidden" name="id" value={r.id} />
              <input type="hidden" name="dir" value="down" />
              <button className={small} disabled={i === rows.length - 1} aria-label={`${dict.common.moveDown}: ${r.title}`}>
                ↓
              </button>
            </form>
            <form action={toggleVisible}>
              <input type="hidden" name="table" value={table} />
              <input type="hidden" name="id" value={r.id} />
              <input type="hidden" name="visible" value={String(!r.visible)} />
              <button className={small}>{r.visible ? dict.common.hide : dict.common.show}</button>
            </form>
            <Link href={editHref(r.id)} className={small}>
              {dict.common.edit}
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
