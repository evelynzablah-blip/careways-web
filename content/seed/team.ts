import type { TeamMember } from "@/lib/types";

/**
 * Team members as published on https://careways.world/team/ (Nov 2026).
 * English text is verbatim. Spanish text is a draft translation pending
 * review by CareWays.
 *
 * CONFIRMAR: Ashley Smith's role at CareWays is not stated on the current
 * site (only her outside affiliation is), so role_* is left empty.
 */
export const seedTeam: TeamMember[] = [
  {
    id: "seed-team-1",
    slug: "christopher-hartnick",
    name: "Dr. Christopher Hartnick",
    role_en: "Co-President, CareWays Collaborative",
    role_es: "Copresidente, CareWays Collaborative",
    affiliation_en: "Division Chief, Pediatric Otolaryngology, Massachusetts Eye and Ear",
    affiliation_es: "Jefe de División, Otorrinolaringología Pediátrica, Massachusetts Eye and Ear",
    bio_en:
      "Dr. Christopher Hartnick is the co-President of CareWays Collaborative and the Benjamin Harry Peikin Professor of Otolaryngology at Massachusetts Eye and Ear Infirmary and the Harvard Medical School. He is also the Director of the Pediatric Aerodigestive Center at the Massachusetts Eye and Ear Infirmary and the Massachusetts General Hospital for Children. He was the co-founder and co-director of Operation Airway from 2007 to the present and has participated in medical and surgical missions around the world.",
    bio_es:
      "El Dr. Christopher Hartnick es copresidente de CareWays Collaborative y profesor de Otorrinolaringología (cátedra Benjamin Harry Peikin) en Massachusetts Eye and Ear Infirmary y en la Facultad de Medicina de Harvard. También dirige el Centro Aerodigestivo Pediátrico de Massachusetts Eye and Ear Infirmary y de Massachusetts General Hospital for Children. Es cofundador y codirector de Operation Airway desde 2007 y ha participado en misiones médicas y quirúrgicas en todo el mundo.",
    photo_path: "/images/team/christopher-hartnick.jpg",
    sort_order: 1,
    visible: true,
  },
  {
    id: "seed-team-2",
    slug: "phoebe-yager",
    name: "Dr. Phoebe Yager",
    role_en: "Co-President, CareWays Collaborative",
    role_es: "Copresidenta, CareWays Collaborative",
    affiliation_en: "Chief of the Division of Pediatric Critical Care, MGB",
    affiliation_es: "Jefa de la División de Cuidados Intensivos Pediátricos, MGB",
    bio_en:
      "Dr. Phoebe Yager is a pediatric intensivist specializing in the care of critically ill and injured infants, children, and adolescents and the Co-president of CareWays Collaborative. She also serves as the Chief of the Division of Pediatric Critical Care Medicine at Massachusetts General Hospital. In 2007 Dr. Yager set out to make a difference and co-founded and co-directed Operation Airway, and now serves as the co-president of CareWays Collaborative with the goal of developing a more inclusive, friendly, and welcoming healthcare community around the world.",
    bio_es:
      "La Dra. Phoebe Yager es intensivista pediátrica, especializada en la atención de bebés, niños y adolescentes en estado crítico o con lesiones graves, y copresidenta de CareWays Collaborative. También es jefa de la División de Medicina de Cuidados Intensivos Pediátricos del Massachusetts General Hospital. En 2007 se propuso marcar una diferencia: cofundó y codirigió Operation Airway, y hoy es copresidenta de CareWays Collaborative con el objetivo de construir una comunidad de salud más inclusiva, cercana y acogedora en todo el mundo.",
    photo_path: "/images/team/phoebe-yager.jpg",
    sort_order: 2,
    visible: true,
  },
  {
    id: "seed-team-3",
    slug: "evelyn-zablah",
    name: "Evelyn Zablah",
    role_en: "Executive Director, CareWays Collaborative",
    role_es: "Directora Ejecutiva, CareWays Collaborative",
    affiliation_en: "Program Director, Benjamin Harry Peikin Foundation",
    affiliation_es: "Directora de Programas, Benjamin Harry Peikin Foundation",
    bio_en:
      "As program director of the Benjamin Harry Peikin Foundation, Evelyn has been instrumental in empowering our team to travel repeatedly to Latin America, learn from and teach the local care teams at numerous hospitals, and develop the framework of the vision that became CareWays Collaborative. Since CareWays was officially launched, Evelyn has worked simultaneously at both organizations – continuing her transformative program work at the Peikin Foundation while serving as the Inaugural Executive Director of CareWays Collaborative.",
    bio_es:
      "Como directora de programas de la Benjamin Harry Peikin Foundation, Evelyn ha sido clave para que nuestro equipo viaje una y otra vez a Latinoamérica, aprenda de los equipos de atención locales de numerosos hospitales y les enseñe, y desarrolle el marco de la visión que se convirtió en CareWays Collaborative. Desde el lanzamiento oficial de CareWays, Evelyn trabaja en ambas organizaciones a la vez: continúa su labor transformadora de programas en la Peikin Foundation mientras se desempeña como la primera Directora Ejecutiva de CareWays Collaborative.",
    photo_path: "/images/team/evelyn-zablah.jpg",
    sort_order: 3,
    visible: true,
  },
  {
    id: "seed-team-4",
    slug: "billy-parker",
    name: "Billy Parker",
    role_en: "Videographer, CareWays Collaborative",
    role_es: "Videógrafo, CareWays Collaborative",
    affiliation_en: null,
    affiliation_es: null,
    bio_en:
      "Billy Parker has been filming for CareWays missions to El Salvador, Dominican Republic, and Guatemala since 2019. His background is in television and crafting narratives for non-profits. He also taught filmmaking at Chelsea High School amid a population of students from around the world. This experience has been valuable in connecting him with young local volunteers and in helping craft the CareWays story.",
    bio_es:
      "Billy Parker filma las misiones de CareWays a El Salvador, República Dominicana y Guatemala desde 2019. Su trayectoria está en la televisión y en la creación de relatos para organizaciones sin fines de lucro. También enseñó cine en Chelsea High School, con estudiantes de todo el mundo. Esa experiencia le ha servido para conectar con jóvenes voluntarios locales y para ayudar a contar la historia de CareWays.",
    photo_path: "/images/team/billy-parker.jpg",
    sort_order: 4,
    visible: true,
  },
  {
    id: "seed-team-5",
    slug: "ashley-smith",
    name: "Ashley Smith",
    role_en: null,
    role_es: null,
    affiliation_en: "Vice President, Summit Partners Credit Advisors",
    affiliation_es: "Vicepresidenta, Summit Partners Credit Advisors",
    bio_en:
      "Ashley is a Vice President at Summit Partners Credit Advisors, the private credit affiliate of Summit Partners. Prior to Summit, Ashley worked at DDJ Capital Management, a high yield and bank loan investment manager and Pro Mujer, a nonprofit organization that provides financial inclusion, health and education programs to low-income women in Latin America. Ashley began her career in investment banking at Jefferies & Company and Moelis & Company.\n\nAshley holds an AB in economics and Spanish from Bowdoin College where she was a Sarah and James Bowdoin Scholar and an MBA from the Tuck School of Business at Dartmouth College where she was named an Edward Tuck Scholar and received the Julia Stell Award for leadership. She currently serves on the Massachusetts General Hospital for Children (MGHfC) Family Advisory Council, a committee that aims to improve healthcare delivery for the pediatric community at MGHfC. Ashley has twice run the Boston Marathon in support of Operation Airway to support pediatric airway patients outside of the US.\n\nAshley lives in the greater Boston area with her husband, two daughters, and her dog.",
    bio_es:
      "Ashley es vicepresidenta de Summit Partners Credit Advisors, la filial de crédito privado de Summit Partners. Antes trabajó en DDJ Capital Management, gestora de inversiones en alto rendimiento y préstamos bancarios, y en Pro Mujer, organización sin fines de lucro que ofrece programas de inclusión financiera, salud y educación a mujeres de bajos ingresos en Latinoamérica. Comenzó su carrera en banca de inversión en Jefferies & Company y Moelis & Company.\n\nTiene un AB en Economía y Español de Bowdoin College, donde fue Sarah and James Bowdoin Scholar, y un MBA de la Tuck School of Business de Dartmouth College, donde fue nombrada Edward Tuck Scholar y recibió el Julia Stell Award por su liderazgo. Forma parte del Family Advisory Council del Massachusetts General Hospital for Children (MGHfC), un comité que busca mejorar la atención a la comunidad pediátrica del hospital. Ha corrido dos veces el Maratón de Boston en apoyo de Operation Airway y de pacientes pediátricos con problemas de vía aérea fuera de EE. UU.\n\nAshley vive en el área de Boston con su esposo, sus dos hijas y su perro.",
    photo_path: "/images/team/ashley-smith.jpg",
    sort_order: 5,
    visible: true,
  },
  {
    id: "seed-team-6",
    slug: "kevin-mary-callans",
    name: "Kevin Mary Callans, B.S.N, R.N.",
    role_en: "Nursing Care Manager, CareWays Collaborative",
    role_es: "Coordinadora de Enfermería, CareWays Collaborative",
    affiliation_en: "Case Manager, MEE and MGHfC",
    affiliation_es: "Gestora de Casos, MEE y MGHfC",
    bio_en:
      "Kevin Mary Callans, B.S.N, R.N is currently a Case Manager at both MEE and MGHfC. Her work focuses on (1) the coordination of care between MEE and MGH (and between hospital and home) of infants and young children that have critical airway conditions, and (2) the associated educational and other support needs of their family members. Ms. Callans, over the course of the past ten years, has worked alongside parents of children with complex airway conditions to develop mentorship, caregiver education, video-teaching, and other programs that support nurses and families.\n\nMs. Callans is also the Director – Nursing Development, Operation Airway, a global health organization that cares for children in Latin American countries who cannot breathe or speak due to airway complications. She works collaboratively with nursing leadership and nurses to deliver video-teaching tools in Spanish that empower nurses to have a strong voice as members of a multi-disciplinary care team.",
    bio_es:
      "Kevin Mary Callans, B.S.N, R.N., es gestora de casos en MEE y en MGHfC. Su trabajo se centra en (1) la coordinación de la atención entre MEE y MGH (y entre el hospital y el hogar) de bebés y niños pequeños con afecciones críticas de la vía aérea, y (2) las necesidades educativas y de apoyo de sus familias. Durante los últimos diez años ha trabajado junto a padres de niños con afecciones complejas de la vía aérea para crear programas de mentoría, educación de cuidadores, enseñanza en video y otros que apoyan a enfermeras y familias.\n\nTambién es Directora de Desarrollo de Enfermería de Operation Airway, organización de salud global que atiende a niños de países latinoamericanos que no pueden respirar o hablar por complicaciones de la vía aérea. Trabaja junto con líderes de enfermería y enfermeras para ofrecer herramientas de enseñanza en video en español que les permiten tener una voz firme como integrantes de un equipo de atención multidisciplinario.",
    photo_path: "/images/team/kevin-mary-callans.jpg",
    sort_order: 6,
    visible: true,
  },
  {
    id: "seed-team-7",
    slug: "gabriela-salvador",
    name: "Dr. Gabriela Salvador",
    role_en: "Global Health Advisor to the Board, CareWays Collaborative",
    role_es: "Asesora de Salud Global de la Junta, CareWays Collaborative",
    affiliation_en: null,
    affiliation_es: null,
    bio_en:
      "Dr. Gabriela Salvador has more than 20 years of experience working in the public and private health sector as a medical doctor and as a leader and advisor of health social enterprises and global health initiatives. She has led the design and implementation of high impact health business models and programs targeting very low income women and children around the World. Gabriela is currently the CEO of Maternova Inc., a medical device and diagnostics marketplace that provides access to life saving innovations for women and newborns around the World. Through her career, Gabriela served in a variety of executive management positions at Americares, Grameen Foundation, Freedom from Hunger and Pro Mujer. As a medical doctor, she practiced Pediatric Ophthalmology in Argentina, the United States and Mexico.\n\nOriginally from Salta, Argentina, Dr. Salvador studied Medicine at the National University of Córdoba. She completed a Pediatric Ophthalmology Fellowship at Cedars Sinai Medical Center and the University of California, Irvine, and has a Master in Public Health from Harvard University.",
    bio_es:
      "La Dra. Gabriela Salvador tiene más de 20 años de experiencia en el sector de salud público y privado como médica y como líder y asesora de empresas sociales de salud e iniciativas de salud global. Ha liderado el diseño y la implementación de modelos de negocio y programas de salud de alto impacto dirigidos a mujeres y niños de muy bajos ingresos en todo el mundo. Actualmente es CEO de Maternova Inc., un marketplace de dispositivos médicos y diagnósticos que da acceso a innovaciones que salvan vidas de mujeres y recién nacidos en todo el mundo. A lo largo de su carrera ocupó diversos cargos ejecutivos en Americares, Grameen Foundation, Freedom from Hunger y Pro Mujer. Como médica, ejerció la Oftalmología Pediátrica en Argentina, Estados Unidos y México.\n\nOriunda de Salta, Argentina, estudió Medicina en la Universidad Nacional de Córdoba. Realizó un fellowship en Oftalmología Pediátrica en Cedars Sinai Medical Center y en la Universidad de California, Irvine, y tiene una Maestría en Salud Pública de la Universidad de Harvard.",
    photo_path: "/images/team/gabriela-salvador.jpg",
    sort_order: 7,
    visible: true,
  },
  {
    id: "seed-team-8",
    slug: "hilary-berkman",
    name: "Hilary Berkman",
    role_en: "Board Member, CareWays Collaborative",
    role_es: "Miembro de la Junta, CareWays Collaborative",
    affiliation_en: null,
    affiliation_es: null,
    bio_en:
      "Hilary is a senior finance and operations executive with 30 years of experience, including 22 years as CFO and Group Board Director at Candlewick Press, a leading international children’s book publisher. She also has over 20 years of experience as a non-profit board member helping to build organizational financial capability and excellence. Hilary holds a BA in economics from Carleton College and an MBA from the University of Chicago, Booth School of Business.",
    bio_es:
      "Hilary es ejecutiva sénior de finanzas y operaciones con 30 años de experiencia, incluidos 22 como CFO y directora de la junta del grupo en Candlewick Press, una destacada editorial internacional de libros infantiles. Además, lleva más de 20 años como integrante de juntas directivas de organizaciones sin fines de lucro, ayudando a construir capacidad y excelencia financiera. Tiene un BA en Economía de Carleton College y un MBA de la Booth School of Business de la Universidad de Chicago.",
    photo_path: "/images/team/hilary-berkman.jpg",
    sort_order: 8,
    visible: true,
  },
  {
    id: "seed-team-9",
    slug: "katie-small",
    name: "Katie Small",
    role_en: "Director of Development, CareWays Collaborative",
    role_es: "Directora de Desarrollo, CareWays Collaborative",
    affiliation_en: null,
    affiliation_es: null,
    bio_en:
      "Katie is a development professional with 38 years of experience including 25 years working at Wellesley College, followed by several years at Harvard Graduate School of Education, Buckingham Browne & Nichols School and most recently serving as the first director of development at The Boston House: Hope and Healing for Children with Cancer. Katie holds an AB from Dartmouth College.",
    bio_es:
      "Katie es profesional de desarrollo institucional con 38 años de experiencia, incluidos 25 en Wellesley College, seguidos de varios años en Harvard Graduate School of Education y Buckingham Browne & Nichols School, y más recientemente como primera directora de desarrollo de The Boston House: Hope and Healing for Children with Cancer. Tiene un AB de Dartmouth College.",
    photo_path: "/images/team/katie-small.jpg",
    sort_order: 9,
    visible: true,
  },
];
