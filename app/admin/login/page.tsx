import Image from "next/image";
import { getAdminContext } from "@/lib/admin-auth";
import { signOut } from "../auth-actions";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; inactive?: string }> }) {
  const { next, inactive } = await searchParams;
  const { dict } = await getAdminContext();

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)] ring-1 ring-line">
        <Image src="/images/site/logo-full-color.png" alt="CareWays Collaborative" width={200} height={50} className="h-10 w-auto" priority />
        <h1 className="mt-6 text-2xl font-extrabold text-navy">{dict.auth.title}</h1>
        {inactive ? (
          <div className="mt-6 space-y-4">
            <p role="alert" className="rounded-lg bg-sun/70 px-4 py-3 text-navy-900">
              {dict.auth.inactive}
            </p>
            <form action={signOut}>
              <button className="w-full rounded-full px-6 py-3 font-semibold text-navy ring-1 ring-line hover:bg-sky-50">
                {dict.nav.logout}
              </button>
            </form>
          </div>
        ) : (
          <div className="mt-6">
            <LoginForm dict={dict.auth} next={next?.startsWith("/admin") ? next : "/admin"} />
          </div>
        )}
      </div>
    </main>
  );
}
