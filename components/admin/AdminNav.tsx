"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cx } from "@/components/site/ui";

export type NavItem = { href: string; label: string; adminOnly?: boolean };

export function AdminNav({ items, footer }: { items: NavItem[]; footer: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const list = (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            onClick={() => setOpen(false)}
            aria-current={active(item.href) ? "page" : undefined}
            className={cx(
              "block rounded-xl px-3 py-2.5 font-medium",
              active(item.href) ? "bg-white text-navy shadow-sm" : "text-white/85 hover:bg-white/10 hover:text-white",
            )}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <div className="flex items-center justify-between bg-navy-900 px-4 py-3 text-white lg:hidden">
        <span className="font-bold">CareWays</span>
        <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)} className="rounded-lg px-3 py-1.5 ring-1 ring-white/30">
          ☰
        </button>
      </div>
      <aside
        className={cx(
          "bg-navy-900 px-4 py-6 text-white lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-64 lg:shrink-0 lg:flex-col",
          open ? "block" : "hidden lg:flex",
        )}
      >
        <p className="mb-6 hidden px-3 text-lg font-bold lg:block">CareWays</p>
        <nav aria-label="Admin" className="flex-1">
          {list}
        </nav>
        <div className="mt-6 space-y-2 border-t border-white/10 pt-4">{footer}</div>
      </aside>
    </>
  );
}
