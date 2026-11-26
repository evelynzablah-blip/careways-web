import { getTranslations } from "next-intl/server";
import { ButtonLink, Container } from "@/components/site/ui";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <Container className="max-w-2xl py-24 text-center">
      <p className="text-6xl font-extrabold text-teal">404</p>
      <h1 className="mt-4 text-3xl font-extrabold text-navy">{t("title")}</h1>
      <p className="mt-3 text-lg text-muted">{t("body")}</p>
      <ButtonLink href="/" className="mt-8">
        {t("home")}
      </ButtonLink>
    </Container>
  );
}
