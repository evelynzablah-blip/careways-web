export type Locale = "en" | "es";
export type Status = "draft" | "published";

export interface Post {
  id: string;
  slug: string;
  title_en: string;
  title_es: string | null;
  excerpt_en: string | null;
  excerpt_es: string | null;
  /** Sanitized HTML produced by the admin rich-text editor. */
  body_en: string | null;
  body_es: string | null;
  cover_image_path: string | null;
  cover_alt_en: string | null;
  cover_alt_es: string | null;
  category: string | null;
  country_codes: string[];
  author_name: string | null;
  status: Status;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MissionReport {
  id: string;
  slug: string;
  issue_number: number | null;
  series: string | null;
  title_en: string;
  title_es: string | null;
  excerpt_en: string | null;
  excerpt_es: string | null;
  body_en: string | null;
  body_es: string | null;
  highlights_en: string[];
  highlights_es: string[];
  report_date: string;
  /** Free-text note shown next to the date, e.g. when the date is unconfirmed. */
  date_note: string | null;
  country_codes: string[];
  cover_image_path: string | null;
  /** Path inside the "documents" Storage bucket. */
  pdf_path: string | null;
  /** Original public URL the PDF was copied from (used only before migration). */
  source_url: string | null;
  status: Status;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  slug: string;
  name: string;
  role_en: string | null;
  role_es: string | null;
  affiliation_en: string | null;
  affiliation_es: string | null;
  bio_en: string | null;
  bio_es: string | null;
  photo_path: string | null;
  sort_order: number;
  visible: boolean;
}

export type PartnerType = "hospital" | "sponsor";

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  logo_path: string | null;
  url: string | null;
  sort_order: number;
  visible: boolean;
}

export interface MapLocation {
  id: string;
  slug: string;
  country_code: string;
  country_en: string;
  country_es: string;
  hospital_name: string;
  lat: number;
  lng: number;
  url: string | null;
  summary_en: string | null;
  summary_es: string | null;
  sort_order: number;
  visible: boolean;
}

export interface MediaAsset {
  id: string;
  bucket: string;
  path: string;
  kind: "image" | "pdf" | "other";
  alt_en: string | null;
  alt_es: string | null;
  size_bytes: number | null;
  mime_type: string | null;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  reason: string;
  message: string;
  locale: string | null;
  read: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: "admin" | "editor";
  active: boolean;
  created_at: string;
}

export interface SiteSettings {
  tagline_en: string;
  tagline_es: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  givewp_url: string;
  contact_to_email: string;
  postal_address: string;
  home_video_id: string;
  donate_video_id: string;
}
