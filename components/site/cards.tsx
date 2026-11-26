import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { countryName, formatDate, localized, localizedList } from "@/lib/localize";
import { mediaUrl, reportPdfUrl } from "@/lib/storage";
import type { Locale, MissionReport, Post, TeamMember } from "@/lib/types";

export async function PostCard({ post, locale }: { post: Post; locale: Locale }) {
  const t = await getTranslations("blog");
  const title = localized(post, "title", locale).value;
  const excerpt = localized(post, "excerpt", locale).value;
  const img = mediaUrl(post.cover_image_path);
  return (
    <article className="relative flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] ring-1 ring-line">
      <div className="relative aspect-[16/10] bg-sky-50">
        {img ? (
          <Image src={img} alt={localized(post, "cover_alt", locale).value} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
        ) : (
          <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-sky to-mint" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700">
          {post.category && <span>{post.category}</span>}
          {post.country_codes?.map((c) => <span key={c}>· {countryName(c, locale)}</span>)}
        </div>
        <h3 className="mt-2 text-xl font-bold leading-snug text-navy">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 hover:underline">
            {title}
          </Link>
        </h3>
        {excerpt && <p className="mt-2 line-clamp-3 text-muted">{excerpt}</p>}
        <p className="mt-auto pt-4 text-sm text-muted">
          {post.author_name && <>{t("by", { author: post.author_name })} · </>}
          <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at, locale)}</time>
        </p>
      </div>
    </article>
  );
}

export async function ReportCard({ report, locale }: { report: MissionReport; locale: Locale }) {
  const t = await getTranslations("newsletters");
  const c = await getTranslations("common");
  const title = localized(report, "title", locale).value;
  const highlights = localizedList(report, "highlights", locale);
  const pdf = reportPdfUrl(report);
  return (
    <article className="relative flex flex-col rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-line">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-teal-700">
            <time dateTime={report.report_date}>{formatDate(report.report_date, locale)}</time>
            {report.date_note && <span className="text-muted"> · {t("dateNote")}</span>}
          </p>
          <h3 className="mt-1 text-xl font-bold text-navy">
            <Link href={`/newsletters/${report.slug}`} className="hover:underline">
              {title}
            </Link>
          </h3>
        </div>
        {report.issue_number != null && (
          <span aria-hidden className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sun text-lg font-extrabold text-navy-900">
            {report.issue_number}
          </span>
        )}
      </div>
      {report.country_codes?.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {report.country_codes.map((code) => (
            <li key={code} className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-navy">
              {countryName(code, locale)}
            </li>
          ))}
        </ul>
      )}
      {highlights.length > 0 && (
        <ul className="mt-4 space-y-1.5 text-[0.95rem] text-ink">
          {highlights.slice(0, 4).map((h) => (
            <li key={h} className="flex gap-2">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
              <span>{h}</span>
            </li>
          ))}
          {highlights.length > 4 && <li className="pl-3.5 text-muted">+{highlights.length - 4}</li>}
        </ul>
      )}
      <div className="mt-auto flex flex-wrap gap-3 pt-5">
        <Link href={`/newsletters/${report.slug}`} className="text-sm font-semibold text-link hover:underline">
          {c("readMore")} <span className="sr-only">— {title}</span>
        </Link>
        {pdf && (
          <a href={pdf} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-link hover:underline">
            {c("downloadPdf")} <span className="sr-only">— {title}</span>
          </a>
        )}
      </div>
    </article>
  );
}

export async function TeamCard({ member, locale }: { member: TeamMember; locale: Locale }) {
  const t = await getTranslations("team");
  const role = localized(member, "role", locale).value;
  const affiliation = localized(member, "affiliation", locale).value;
  const bio = localized(member, "bio", locale).value;
  const img = mediaUrl(member.photo_path);
  return (
    <article id={member.slug} className="flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] ring-1 ring-line">
      <div className="relative aspect-[11/12] bg-sky-50">
        {img && (
          <Image src={img} alt={member.name} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover object-top" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold text-navy">{member.name}</h3>
        {role && <p className="mt-1 font-semibold text-teal-700">{role}</p>}
        {affiliation && <p className="mt-1 text-sm text-muted">{affiliation}</p>}
        {bio && (
          <details className="group mt-4">
            <summary className="cursor-pointer list-none text-sm font-semibold text-link hover:underline [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">{t("readBio")}</span>
              <span className="hidden group-open:inline">{t("hideBio")}</span>
            </summary>
            <div className="mt-3 space-y-3 text-[0.95rem] leading-relaxed text-ink">
              {bio.split(/\n\n+/).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </details>
        )}
      </div>
    </article>
  );
}
