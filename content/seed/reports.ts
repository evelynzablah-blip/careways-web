import type { MissionReport } from "@/lib/types";

/**
 * Historical newsletters / mission reports (Issues 1–9), as listed on
 * https://www.operationairway.com/newsletters/ (Nov 2026). Highlights are the
 * published table of contents of each issue. Country tags come from those
 * headlines.
 *
 * The PDFs live in migration-assets/pdfs and are uploaded to the "documents"
 * Storage bucket by scripts/migrate-content.ts. `source_url` is used only as
 * a fallback before that migration has run.
 */
const SERIES = "Operation Airway Newsletter";
const OA = "https://www.operationairway.com/wp-content/uploads";

type SeedIssue = {
  n: number;
  date: string;
  dateNote?: string;
  countries: string[];
  file: string;
  source: string;
  en: string[];
  es: string[];
};

const issues: SeedIssue[] = [
  {
    n: 1,
    date: "2018-08-16",
    countries: ["DO", "US"],
    file: "issue-1-2018-08-16.pdf",
    source: `${OA}/2020/04/Issue-1_August-16-2018.pdf`,
    en: [
      "Patients in Boston",
      "Introduction to our Curriculum",
      "Our Upcoming Mission to the Dominican Republic",
      "Welcome to our Interns",
      "Telemedicine",
    ],
    es: [
      "Pacientes en Boston",
      "Presentación de nuestro currículo",
      "Nuestra próxima misión a República Dominicana",
      "Bienvenida a nuestros pasantes",
      "Telemedicina",
    ],
  },
  {
    n: 2,
    date: "2018-11-11",
    countries: ["DO"],
    file: "issue-2-2018-11-11.pdf",
    source: `${OA}/2020/04/Issue-2_November-11-2018.pdf`,
    en: [
      "Our Mission to Santo Domingo",
      "Mission Stats",
      "Meet Cheryl Hersh, Speech Pathologist",
      "Meet Candy, OA Patient",
      "Meet Briana Peck, Child-Life Specialist",
      "Mission Report Links",
    ],
    es: [
      "Nuestra misión a Santo Domingo",
      "Cifras de la misión",
      "Conoce a Cheryl Hersh, patóloga del habla",
      "Conoce a Candy, paciente de OA",
      "Conoce a Briana Peck, especialista Child-Life",
      "Enlaces a reportes de la misión",
    ],
  },
  {
    n: 3,
    date: "2018-12-21",
    countries: ["SV", "DO"],
    file: "issue-3-2018-12-21.pdf",
    source: `${OA}/2020/04/Issue-3_December-21-2018.pdf`,
    en: [
      "Review of our 2018 Missions to El Salvador and Dominican Republic",
      "Bench to Bedside Project 1",
      "Bench to Bedside Project 2",
      "Advanced JRRP: Clinical Care and Partnership",
      "Partnering with Shriners Hospital",
    ],
    es: [
      "Repaso de nuestras misiones de 2018 a El Salvador y República Dominicana",
      "Proyecto «Bench to Bedside» 1",
      "Proyecto «Bench to Bedside» 2",
      "JRRP avanzada: atención clínica y alianza",
      "Alianza con Shriners Hospital",
    ],
  },
  {
    n: 4,
    date: "2019-02-09",
    countries: ["SV"],
    file: "issue-4-2019-02-09.pdf",
    source: `${OA}/2020/04/Issue-4_February-9-2019.pdf`,
    en: [
      "Overview of our 3rd mission to El Salvador",
      "Meet Our Patients: Brigeit, Ulises, Scarleth",
      "Our Expanding Curriculum",
      "The Peikin Foundation Comes to El Salvador",
      "The First Video Swallow Study at the Bloom Hospital",
    ],
    es: [
      "Resumen de nuestra 3.ª misión a El Salvador",
      "Conoce a nuestros pacientes: Brigeit, Ulises, Scarleth",
      "Nuestro currículo crece",
      "La Peikin Foundation llega a El Salvador",
      "El primer estudio de deglución por video en el Hospital Bloom",
    ],
  },
  {
    n: 5,
    date: "2019-05-24",
    countries: ["US"],
    file: "issue-5-2019-05-24.pdf",
    source: `${OA}/2020/04/Issue-5_May-24-2019.pdf`,
    en: [
      "Global Healthcare Comes Back to Boston",
      "Helping to Repair Subglottic Stenosis in Boston and Abroad!",
      "International Collaboration with Novartis",
      "Meet Mark Peikin, Team Member and Supporter of Operation Airway",
    ],
    es: [
      "La salud global vuelve a Boston",
      "Ayudando a reparar la estenosis subglótica en Boston y en el exterior",
      "Colaboración internacional con Novartis",
      "Conoce a Mark Peikin, miembro del equipo y benefactor de Operation Airway",
    ],
  },
  {
    n: 6,
    date: "2019-11-12",
    countries: ["DO"],
    file: "issue-6-2019-11-12.pdf",
    source: `${OA}/2020/04/Issue-6_November-12-2019.pdf`,
    en: [
      "Santo Domingo Mission Overview",
      "Mission Stats",
      "Daibelis and Her Birthday Wish",
      "Meet Dr. Dan Ryan",
      "First-Ever Nerve Reinnervation Surgery in the Dominican Republic",
      "Meet some of our Volunteers",
      "Meet Kevin Callans, Nurse Case Manager",
      "Avastin Treatment for RRP",
    ],
    es: [
      "Resumen de la misión a Santo Domingo",
      "Cifras de la misión",
      "Daibelis y su deseo de cumpleaños",
      "Conoce al Dr. Dan Ryan",
      "Primera cirugía de reinervación nerviosa en República Dominicana",
      "Conoce a algunos de nuestros voluntarios",
      "Conoce a Kevin Callans, enfermera gestora de casos",
      "Tratamiento con Avastin para la PRR",
    ],
  },
  {
    n: 7,
    date: "2020-02-06",
    countries: ["SV"],
    file: "issue-7-2020-02-06.pdf",
    source: `${OA}/2020/04/Issue-7_February-6-2020.pdf`,
    en: [
      "El Salvador Mission Overview and Stats",
      "Meet Several of our Volunteers and Patients",
      "Alleviating Papilloma Stigma",
      "The Gift of a Surgical Kit",
      "Endotracheal Tube Study",
      "Nurses Teaching Nurses",
      "Links to Online Mission Reports",
    ],
    es: [
      "Resumen y cifras de la misión a El Salvador",
      "Conoce a varios de nuestros voluntarios y pacientes",
      "Aliviar el estigma del papiloma",
      "El regalo de un kit quirúrgico",
      "Estudio sobre el tubo endotraqueal",
      "Enfermeras que enseñan a enfermeras",
      "Enlaces a reportes de misión en línea",
    ],
  },
  {
    n: 8,
    date: "2020-10-14",
    dateNote: "CONFIRMAR: the website says October 14, 2020; the PDF file name says October 4, 2020.",
    countries: ["CO"],
    file: "issue-8-2020-10.pdf",
    source: `${OA}/2021/11/Issue-8_October-4-2020.pdf`,
    en: [
      "Video Conferences",
      "New Cartoon Video Series",
      "Launching Our New Website",
      "Key Dates for 2020",
      "Storage Space Secured",
      "10 Year Outcomes Published",
      "ENT Nursing Conference",
      "New Colombia Mission",
      "Spotlight on Junior Ambassadors",
    ],
    es: [
      "Videoconferencias",
      "Nueva serie de videos animados",
      "Lanzamos nuestro nuevo sitio web",
      "Fechas clave de 2020",
      "Conseguimos espacio de almacenamiento",
      "Publicados los resultados a 10 años",
      "Congreso de enfermería ORL",
      "Nueva misión a Colombia",
      "Destacado: Embajadores Juveniles",
    ],
  },
  {
    n: 9,
    date: "2021-10-26",
    countries: ["SV", "DO"],
    file: "issue-9-2021-10-26.pdf",
    source: `${OA}/2021/11/OA-Oct-2021-Newsletter.pdf`,
    en: [
      "The Dowling Family T-Shirt Drive",
      "Ashley Conti Smith’s Marathon Run",
      "Simulation Program in El Salvador",
      "Dominican Republic Avastin Program",
      "Spotlight on Team Members Billy and Susanne",
      "A Thank You to Rob Knapp",
    ],
    es: [
      "La campaña de camisetas de la familia Dowling",
      "La maratón de Ashley Conti Smith",
      "Programa de simulación en El Salvador",
      "Programa de Avastin en República Dominicana",
      "Destacado: Billy y Susanne, del equipo",
      "Gracias a Rob Knapp",
    ],
  },
];

export const seedReports: MissionReport[] = issues
  .map((i) => ({
    id: `seed-report-${i.n}`,
    slug: `issue-${i.n}`,
    issue_number: i.n,
    series: SERIES,
    title_en: `Issue ${i.n}`,
    title_es: `Número ${i.n}`,
    excerpt_en: i.en.slice(0, 2).join(" · "),
    excerpt_es: i.es.slice(0, 2).join(" · "),
    body_en: null,
    body_es: null,
    highlights_en: i.en,
    highlights_es: i.es,
    report_date: i.date,
    date_note: i.dateNote ?? null,
    country_codes: i.countries,
    cover_image_path: null,
    pdf_path: `newsletters/${i.file}`,
    source_url: i.source,
    status: "published" as const,
    published_at: `${i.date}T12:00:00Z`,
    created_at: `${i.date}T12:00:00Z`,
    updated_at: `${i.date}T12:00:00Z`,
  }))
  .sort((a, b) => b.report_date.localeCompare(a.report_date));
