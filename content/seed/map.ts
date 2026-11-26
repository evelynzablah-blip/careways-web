import type { MapLocation } from "@/lib/types";

/**
 * Partner hospitals from the current careways.world map
 * ("CareWays Collaborative Map 05.09.23").
 *
 * Coordinates are approximate city-level positions chosen for this seed; the
 * old plugin's exact pin positions were not exported. Adjust them in
 * /admin/map if needed.
 */
export const mapCenter = { lat: 9.54, lng: -79.42, zoom: 4 } as const;

export const seedMapLocations: MapLocation[] = [
  {
    id: "seed-map-sv",
    slug: "el-salvador",
    country_code: "SV",
    country_en: "El Salvador",
    country_es: "El Salvador",
    hospital_name: "Hospital Nacional de Niños Benjamin Bloom",
    lat: 13.7065,
    lng: -89.2105,
    url: "https://www.facebook.com/hospitalbloom/",
    summary_en: null,
    summary_es: null,
    sort_order: 1,
    visible: true,
  },
  {
    id: "seed-map-do",
    slug: "dominican-republic",
    country_code: "DO",
    country_en: "Dominican Republic",
    country_es: "República Dominicana",
    hospital_name: "Hospital Robert Reid Cabral",
    lat: 18.4577,
    lng: -69.9305,
    url: "https://www.hirrc.gov.do/",
    summary_en: null,
    summary_es: null,
    sort_order: 2,
    visible: true,
  },
  {
    id: "seed-map-gt",
    slug: "guatemala",
    country_code: "GT",
    country_en: "Guatemala",
    country_es: "Guatemala",
    hospital_name: "Hospital San Juan de Dios",
    lat: 14.6413,
    lng: -90.5215,
    url: "https://www.hospitalsanjuandediosguatemala.com/",
    summary_en: null,
    summary_es: null,
    sort_order: 3,
    visible: true,
  },
  {
    id: "seed-map-co",
    slug: "colombia",
    country_code: "CO",
    country_en: "Colombia",
    country_es: "Colombia",
    hospital_name: "Hospital Infantil Napoleón Franco Pareja «Casa del Niño»",
    lat: 10.4012,
    lng: -75.5146,
    url: "http://lacasadelnino.org/site/index.html",
    summary_en: null,
    summary_es: null,
    sort_order: 4,
    visible: true,
  },
  {
    id: "seed-map-ec",
    slug: "ecuador",
    country_code: "EC",
    country_en: "Ecuador",
    country_es: "Ecuador",
    hospital_name: "Hospital de los Valles",
    lat: -0.1985,
    lng: -78.4335,
    url: "https://www.hospitaldelosvalles.com/",
    summary_en: null,
    summary_es: null,
    sort_order: 5,
    visible: true,
  },
];
