import { getAdminContext } from "@/lib/admin-auth";

export default async function SetupPage() {
  const { dict } = await getAdminContext();
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)] ring-1 ring-line">
        <h1 className="text-2xl font-extrabold text-navy">{dict.auth.setupTitle}</h1>
        <p className="mt-3 text-muted">{dict.auth.setupBody}</p>
        <pre className="mt-5 overflow-x-auto rounded-xl bg-navy-900 p-4 text-sm text-white">
{`NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>`}
        </pre>
      </div>
    </main>
  );
}
