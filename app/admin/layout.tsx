import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { getAdminLang } from "@/lib/admin-auth";
import "../globals.css";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });

export const metadata: Metadata = {
  title: { default: "CareWays admin", template: "%s · CareWays admin" },
  robots: { index: false, follow: false },
};

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getAdminLang();
  return (
    <html lang={lang} className={figtree.variable}>
      <body className="min-h-dvh bg-paper antialiased">{children}</body>
    </html>
  );
}
