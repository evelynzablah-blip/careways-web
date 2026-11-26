import type { Partner } from "@/lib/types";

/**
 * Supporters shown on https://careways.world/donate/ (Nov 2026), in the same
 * order. CONFIRMAR with CareWays which ones should stay visible.
 * Hospital partners are managed as map pins (see seed/map.ts).
 */
const sponsors: Array<[string, string]> = [
  ["Barbara and Amos Hostetter", "/images/supporters/barbara-and-amos-hostetter.png"],
  ["Anne Lovett and Steve Woodsum", "/images/supporters/anne-lovett-and-steve-woodsum.png"],
  ["Andrew Georgilis", "/images/supporters/andrew-georgilis.png"],
  ["McDermott Will & Emery", "/images/supporters/mcdermott-will-emery.png"],
  ["Red Sox Foundation", "/images/supporters/red-sox-foundation.png"],
  ["Supporting Strategies", "/images/supporters/supporting-strategies.png"],
  ["Atos", "/images/supporters/atos.jpg"],
  ["Bryan Medical", "/images/supporters/bryan-medical.png"],
  ["FIGS", "/images/supporters/figs.png"],
  ["Cardinal Brook Trust", "/images/supporters/cardinal-brook-trust.png"],
  ["Eloquest", "/images/supporters/eloquest.png"],
];

export const seedPartners: Partner[] = sponsors.map(([name, logo], i) => ({
  id: `seed-partner-${i + 1}`,
  name,
  type: "sponsor",
  logo_path: logo,
  url: null,
  sort_order: i + 1,
  visible: true,
}));
