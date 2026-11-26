import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/admin-auth";
import { getServerClient } from "@/lib/supabase/server";
import { PasswordForm } from "./PasswordForm";

export default async function ResetPasswordPage() {
  const supabase = await getServerClient();
  if (!supabase) redirect("/admin/setup");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { dict } = await getAdminContext();

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)] ring-1 ring-line">
        <h1 className="text-2xl font-extrabold text-navy">{dict.auth.newPassword}</h1>
        <p className="mt-1 text-muted">{user.email}</p>
        <div className="mt-6">
          <PasswordForm dict={dict} />
        </div>
      </div>
    </main>
  );
}
