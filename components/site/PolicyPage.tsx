import { getTranslations } from "next-intl/server";
import { sanitizePolicy } from "@/lib/sanitize";
import type { Locale } from "@/lib/types";
import { Container, FallbackNote, PageHeader } from "./ui";

/**
 * Legal policies are maintained in Termageddon (as on careways.world today).
 * The HTML is fetched server-side, sanitized and cached for a day, so the
 * text stays in sync with the provider without client-side scripts.
 *
 * CONFIRMAR: update the policies in Termageddon for the new stack
 * (Vercel, Supabase, newsletter provider, analytics) before launch.
 */
export const POLICY_KEYS = {
  privacy: "VFRVeFFYSkljR1o2VjNScksxRTlQUT09",
  terms: "V25STFowRkNka1ZRVVhGTlMwRTlQUT09",
  disclaimer: "VEV0bU1FeHZaV0pITjJSdE0xRTlQUT09",
  cookies: "UnpsWGFGRlhXbUZpVlRWb09GRTlQUT09",
} as const;

async function fetchPolicy(key: string): Promise<string | null> {
  try {
    const res = await fetch(`https://app.termageddon.com/api/policy/${key}`, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    return sanitizePolicy(await res.text());
  } catch {
    return null;
  }
}

export async function PolicyPage({ policy, title, locale }: { policy: keyof typeof POLICY_KEYS; title: string; locale: Locale }) {
  const t = await getTranslations("legal");
  const common = await getTranslations("common");
  const key = POLICY_KEYS[policy];
  const html = await fetchPolicy(key);

  return (
    <>
      <PageHeader title={title} />
      <Container className="max-w-3xl pb-20">
        <FallbackNote show={locale !== "en"}>{common("availableInEnglish")}</FallbackNote>
        {html ? (
          <div className="policy-cw" lang="en" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <p className="text-muted">
            {t("fallback")}{" "}
            <a href={`https://app.termageddon.com/api/policy/${key}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-link underline">
              {t("openPolicy")}
            </a>
          </p>
        )}
      </Container>
    </>
  );
}
