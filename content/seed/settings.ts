import type { SiteSettings } from "@/lib/types";

/**
 * Default site settings. Admins can override every value in /admin/settings
 * (stored in the site_settings table). Environment variables take precedence
 * for GIVEWP_DONATION_URL and CONTACT_TO_EMAIL.
 */
export const defaultSettings: SiteSettings = {
  // Published tagline from the current home page; replace with [TAGLINE OFICIAL] when approved.
  tagline_en:
    "Working to measurably improve outcomes for our pediatric patients and their families in under-resourced countries around the world.",
  tagline_es:
    "Trabajamos para mejorar de forma medible los resultados de nuestros pacientes pediátricos y sus familias en países con pocos recursos de todo el mundo.",
  facebook_url: "https://www.facebook.com/careways.world/",
  instagram_url: "https://www.instagram.com/careways.world/",
  // Official channel (author of the intro film Yw5WECmIzVc, per YouTube oEmbed).
  youtube_url: "https://www.youtube.com/@CareWaysworld",
  // Standalone view of the live GiveWP form (id 2395) on the current WordPress site.
  givewp_url: "https://careways.world/?givewp-route=donation-form-view&form-id=2395",
  contact_to_email: "", // [CORREO DE DESTINO]
  postal_address: "CareWays Collaborative\nPO Box 313\n277 Boston Post Road\nWayland, MA 01778",
  home_video_id: "Yw5WECmIzVc",
  donate_video_id: "jKvKPzQlChE",
};

export const supplyDonationPdf = {
  path: "resources/supply-donation.pdf",
  source_url: "https://careways.world/wp-content/uploads/2022/10/Supply-Donation.pdf",
};
