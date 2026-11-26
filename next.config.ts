import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/**
 * 301 redirects from the current WordPress URLs on careways.world to the new
 * routes, so links, bookmarks and search results keep working after the
 * domain cutover. Unprefixed paths go to the English version (the current
 * site is English only).
 */
const legacyPages: Array<[string, string]> = [
  ["/who-we-are", "/en/about"],
  ["/what-we-do", "/en/what-we-do"],
  ["/how-we-do-it", "/en/how-we-do-it"],
  ["/the-need", "/en/the-need"],
  ["/team", "/en/team"],
  ["/contact", "/en/contact"],
  ["/donate", "/en/donate"],
  ["/privacy-policy", "/en/privacy-policy"],
  ["/terms-of-service", "/en/terms-of-service"],
  ["/terms-and-conditions", "/en/terms-of-service"],
  ["/disclaimer", "/en/disclaimer"],
  ["/cookie-policy", "/en/cookie-policy"],
  // GiveWP / WordPress utility pages that no longer exist as content
  ["/donation-confirmation", "/en/donate"],
  ["/donation-failed", "/en/donate"],
  ["/donor-dashboard", "/en/donate"],
  ["/donation-test-page-123654", "/en/donate"],
  ["/thank-you", "/en"],
  ["/coming-soon", "/en"],
  // Default SiteGround post that is intentionally not migrated
  ["/wordpress-resources-at-siteground", "/en/blog"],
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  async redirects() {
    return [
      ...legacyPages.map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
      { source: "/donations/:path*", destination: "/en/donate", permanent: true },
      { source: "/feed", destination: "/en/blog", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
