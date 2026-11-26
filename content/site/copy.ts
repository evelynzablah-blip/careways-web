/**
 * Institutional page copy migrated from careways.world (Nov 2026).
 *
 * - English is verbatim from the live site; only the layout and headings
 *   were reorganized so pages are scannable.
 * - Spanish is a DRAFT translation and has not been reviewed yet
 *   (ES_REVIEWED = false). CareWays must validate it before launch.
 * - No figures or claims were added. Numbers are the ones already published.
 */
import type { Locale } from "@/lib/types";

export const ES_REVIEWED = false;

type Section = { id: string; title: string; body: string[] };
export type Area = {
  id: string;
  title: string;
  summary: string;
  body: string[];
  list?: string[];
  after?: string[];
  listIntro2?: string;
  list2?: string[];
};

const en = {
  home: {
    heroTitle: "Almost two billion children around the world lack access to surgical care.",
    heroBody:
      "It’s time we change that. But, while surgery is important, it is not enough. We aim to transform the entire culture of care – the post-surgical protocols, resources, and team – to ensure that kids make it out of the operating room and make it safely home.",
    introTitle: "CareWays Collaborative",
    introBody:
      "Working to measurably improve outcomes for our pediatric patients and their families in under-resourced countries around the world.",
    pillars: [
      {
        title: "An Initiative to Save Young Lives",
        body: "Providing local access to life-saving pediatric surgery and care for some of the world’s most vulnerable children.",
        href: "/what-we-do",
        cta: "Learn more about what we do",
        image: "/images/site/surgery-team.png",
      },
      {
        title: "A Disruptive Model of Care",
        body: "Not a medical mission, but a cooperative model of care.",
        href: "/how-we-do-it",
        cta: "Learn more about our model",
        image: "/images/site/boy-with-truck-1.png",
      },
      {
        title: "A Global Pediatric Health Initiative",
        body: "Partnering with providers around the world on some of the most intractable medical challenges.",
        href: "/what-we-do#network",
        cta: "Learn more about our network",
        image: "/images/site/nurse-and-patient-in-pink.png",
      },
      {
        title: "An Aching Need",
        body: "The number of children that die each year from a lack of surgical care exceeds those that succumb to HIV, Tuberculosis, and Malaria combined.",
        href: "/the-need",
        cta: "Learn more about the need",
        image: "/images/site/the-ctuest-unicorn.png",
      },
    ],
    stats: [
      { value: "5 million+", label: "In 2020 more than 5 million children worldwide died before their 5th birthday." },
      { value: "1.7 billion", label: "As of 2017, approximately 1.7 billion children around the globe remain without access to surgical care." },
      { value: "14×", label: "As a result these children are 14 times more likely to die before reaching the age of 5 than their first-world peers." },
    ],
    join: [
      { title: "Volunteer", body: "Discover how your time and talent can help support and grow our work.", href: "/contact?reason=volunteer" },
      { title: "Donate", body: "Learn how your donation can help save young lives around the world.", href: "/donate" },
      { title: "Network", body: "Become part of our growing global collaborative.", href: "/contact?reason=medical-team" },
    ],
  },
  about: {
    definition:
      "CareWays Collaborative is a non-profit that works directly with healthcare systems in under-resourced countries to develop the best possible care for their patients: from home to hospital to home again.",
    mission:
      "Working to measurably improve outcomes for our pediatric patients and their families in under-resourced countries around the world.",
    facts: [
      { title: "Founded May 2021", body: "Formed by a group of Boston-based healthcare professionals who had completed several medical trips together." },
      { title: "501(c)(3) non-profit", body: "A tax-exempt organization doing business under the name CareWays Collaborative." },
      { title: "Born from Operation Airway", body: "The founders built on what they had learned in their Operation Airway program." },
      { title: "Home → hospital → home", body: "Care that follows the patient from home to hospital to home again." },
      { title: "Flattening the hierarchy", body: "All stakeholders—doctors, nurses, patients and families—work together as peers." },
      { title: "Progressive autonomy", body: "Local teams are trained step by step toward autonomy, mastery, and independence." },
    ],
    story: [
      {
        id: "origins",
        title: "How CareWays began",
        body: [
          "CareWays Collaborative, Inc. was formed in May 2021 when a group of Boston-based healthcare professionals, who had completed several medical trips together in the past, decided to create a new non-profit that could develop a revolutionary approach to care in under-resourced communities.",
          "Inspired by the medical teams in each of their host countries, these Massachusetts General Brigham (MGB) and Mass Eye & Ear (MEE) doctors and nurses developed an approach to medical care, practice, and training that deeply engaged and involved their hosts in the process.",
        ],
      },
      {
        id: "different",
        title: "Unlike more traditional missions",
        body: [
          "These doctors actively encouraged a process of “flattening the hierarchy” and “progressive autonomy” where all stakeholders—from doctors and nurses to patients and families—worked together as peers with the shared goal of returning healthy patients back home.",
        ],
      },
      {
        id: "scale",
        title: "Scaling what works",
        body: [
          "Having achieved reductions of mortality of five percent by training the physicians, nurses, and staff in one hospital in one country in one particular area of care, the team proposes to save exponentially more lives by scaling their collaboration across multiple hospitals, countries, care teams, and areas of care.",
          "The founders decided it was time to use what they had learned in their Operation Airways program to develop an independent organization (CareWays Collaborative) that could work directly with healthcare systems in under-resourced countries to develop the best possible care for their patients: From home to hospital to home again.",
        ],
      },
    ] as Section[],
    partnersIntro:
      "CareWays Collaborative is proud to partner with the countries below. Select a pin or a country to visit each hospital’s website and see related mission reports.",
  },
  whatWeDo: {
    lead: "CareWays Collaborative is building an international medical and educational community dedicated to continuously improving health outcomes for young, hospitalized patients.",
    intro:
      "Through the development of world-class surgical expertise and training, collaborative models of care, and innovative research and assessment programs, CareWays will support an interdependent global community of practitioners with the knowledge, resources, and technology they need to drastically improve care and outcomes for their patients and families.",
    areas: [
      {
        id: "medicine",
        title: "Medicine",
        summary: "Our approach to care is centered around a multidisciplinary team that is freely collaborating and communicating with all stakeholders to build effective and sustainable programs.",
        body: [
          "We start with the premise that a successful surgery is not just how the patient does on the operating room table, but whether the eventual outcome is a success: if the patient can get safely out of the hospital in a timely manner and safely; and if the patient can then experience meaningful positive changes in their day-to-day activities and functional status. To accomplish this requires a dynamic approach to care centered around the expertise of a multidisciplinary team comprised of surgeons, ICU physicians, anesthesiologists, nurses, respiratory therapists, and families all working together and communicating seamlessly to formulate and execute a clinical action plan.",
          "Our program also seeks to have a long-lasting cultural impact that stems from this teaching and partnering in clinical excellence. The goal is to demonstrate the power of flattening the hierarchy where surgeons, doctors, nurses, and respiratory therapists all have a voice that is heard with regard to a particular patient’s plan.",
        ],
      },
      {
        id: "education",
        title: "Education",
        summary: "We are building and curating an open-source knowledge base for hospitals, caregivers, patients, and their families.",
        body: [
          "The curriculum is designed around a multi-modal and hands-on process of training, practice, guided discovery, demonstration, simulation, traditional learning (print, videos, etc.) and assessment where the local teams are trained in a developmental and scaffolded fashion toward autonomy and independence. Guided by the principles of democratic education and inquiry-based learning, the curriculum is not a strict, pre-scripted educational process but a customized program that adapts to the local resources, teams, and their evolving needs. We call this approach Progressive Autonomy.",
        ],
        list: [
          "Surgical training",
          "Medical care training",
          "“Culture of Care” training",
          "Teamwork and communications",
          "Parent and family education",
        ],
        after: [
          "This methodology includes a combination of in-person teaching, remote assistance training, and QR codes with specific “on-demand” instruction to allow doctors, nurses, therapists, and parents to best learn – and put into practice – interventions in their own local settings.",
        ],
      },
      {
        id: "research",
        title: "Research",
        summary: "We are developing research and assessment programs to improve the effectiveness and impact of CareWays activities.",
        body: ["We are committed to developing research and assessment programs designed to gauge the effectiveness and impact of our activities in order to:"],
        list: [
          "Codify best practices in all aspects of medical care",
          "Publish and present findings",
          "Provide ongoing assessment of program effectiveness",
        ],
        listIntro2: "Our assessment protocols include:",
        list2: [
          "Pre- and post-curriculum educational assessments",
          "Pre- and post-qualitative structures interviews",
          "Pre- and post-assessment of adoption of educational and cultural enhancement checklists to ensure multi-disciplinary involvement and collaboration as well as highlighting critical clinical information necessary to optimize care for each patient",
          "Counting and recounting: understanding morbidity and pre- and post-intervention",
        ],
      },
      {
        id: "partnerships",
        title: "Partnerships",
        summary: "We are working with a variety of partners to develop collaborative approaches to some of the world’s most intractable medical challenges.",
        body: [
          "As part of our commitment to continuously support patients and provide them with the best care possible, CareWays plans to build off our on-going partnership with Massachusetts General Hospital and Mass. Eye and Ear to develop additional strategic partnerships with a variety of organizations that can promote our shared goals, including:",
        ],
        list: [
          "Hospitals",
          "Academia",
          "Corporations",
          "Medical Equipment Companies",
          "Pharmaceutical Industry",
          "Government Agencies",
          "International NGO’s",
          "Social Service Agencies",
          "Leadership and Organizational Effectiveness Experts",
        ],
      },
      {
        id: "network",
        title: "Network",
        summary: "Our long-term goal is to create a vibrant global network of pediatric medical teams operating under this new model and actively collaborating with each other around the world.",
        body: [
          "This network will stand at the core of our work to synchronize the development and deployment of our cutting-edge research, curriculum, and medical best practices to all CareWays team members. The Collaborative will be constantly growing and evolving; local healthcare teams will develop from student to teachers themselves to foster the development of the model’s practices elsewhere in their own country and in other countries around the world. The Collaborative will be managed centrally by the founding team in Boston, who will serve as a resource for members on surgical expertise and training, collaborative models of care, as well as research and assessment programs.",
          "This work will ensure the CareWays model remains at the forefront of innovation and best practices in global pediatric surgical and patient care.",
        ],
      },
    ] as Area[],
    outcomesTitle: "Our outcomes",
    // Values from the animated counters on careways.world/what-we-do (DOM order). CONFIRMAR / keep up to date.
    outcomes: [
      { value: 2, label: "Graduated programs" },
      { value: 4, label: "Active countries" },
      { value: 6, label: "Missions and counting" },
      { value: 14, label: "Patients brought to Boston, MA" },
      { value: 142, label: "Speech & swallowing sessions" },
      { value: 192, label: "Surgeries & procedures" },
      { value: 292, label: "Patients screened" },
    ],
  },
  howWeDoIt: {
    lead: "CareWays Collaborative subverts the traditional medical mission model by designing, executing, and supporting education and training programs in complete partnership with local medical teams.",
    sections: [
      {
        id: "learning",
        title: "Promoting a Collaborative Approach to Learning",
        image: "/images/site/learning.png",
        body: [
          "The CareWays curriculum addresses all aspects of pediatric care from diagnosis to surgery to intensive care and eventually home. Guided by the principle of progressive autonomy, CareWays teams deliver a multi-modal and hands-on education including training, practice, guided discovery, demonstration, and simulation, in a developmental and scaffolded fashion building toward autonomy, mastery, and independence.",
        ],
      },
      {
        id: "working",
        title: "Promoting a Collaborative Approach to Working",
        image: "/images/site/working.png",
        body: [
          "CareWays’ team of pediatric surgeons, intensive care specialists, nurses, respiratory therapists, and speech and language experts work side-by-side with local hospital practitioners to understand local needs and expertise, and to collaborate closely in the development and execution of the surgical plan.",
        ],
      },
      {
        id: "culture-of-care",
        title: "Focusing on the “Culture of Care”",
        image: "/images/site/collaborative-learning.jpg",
        body: [
          "Central to the success and uniqueness of the CareWays curriculum and approach is the focus on both the quality and culture of care that is delivered. Decisions around treatment and recovery plans and their execution are shared by all with equal voice, breaking down and flattening the traditional hierarchy and silos that exist in many surgical suites. CareWays Collaborative is extending these educational, communication, and cultural initiatives to the entire spectrum of care: from home to hospital, to home again.",
        ],
      },
      {
        id: "replicable",
        title: "Creating Replicable and Scalable Programs",
        image: "/images/site/surgery-team-camera.jpg",
        body: [
          "Critically, this approach develops and supports sustainable programs, where local pediatric healthcare teams adopt practices that will continue long after the CareWays team is no longer present.",
        ],
      },
    ],
    cta: "To learn more, contact us",
  },
  theNeed: {
    lead: "The World Health Organization has called for an end to the preventable deaths of newborns and children by 2030. CareWays Collaborative has created a proven and measurable path forward to achieve that visionary goal.",
    stats: [
      { value: "5 million+", label: "In 2020, more than 5 million children worldwide died before their 5th birthday." },
      { value: "2.6 million", label: "died before reaching their first month." },
      { value: "1.7 billion", label: "children around the globe remain without access to surgical care and as a result are 14 times more likely to die before reaching the age of 5 than their first-world peers." },
    ],
    quote1: {
      text: "If UN and WHO goals are to be met, then it is time to double down on the evidence that increasing pediatric surgical care in resource-limited settings is a good investment.",
      by: "Shiza Abbasi and Carrie Dolan, William & Mary",
    },
    gapTitle: "A surgical desert",
    gap: [
      "And yet only a fraction of international aid is spent on surgical care. In fact, less than 3% of the pediatric population in low-income countries and less than 8% in lower-middle-income countries have access to safe surgical care according to the Lancet Commission on Global Surgery Criteria. The World Health Organization’s Global Health Observatory has established a Strategic Development Goal to end preventable deaths of newborns and children under the age of 5 by 2030. And the United Nations, as one of its Millennium Development Goals, has reaffirmed its commitment to drastically reduce the preventable death rate for newborns and children under the age of 5.",
      "Filling this surgical desert and achieving the vital goals set by the UN, World Health Organization, and others will require a dramatic increase in pediatric surgeries, as well as training in surgical techniques, communication, team building, and the culture of care and safety.",
    ],
    gapStats: [
      { value: "< 3%", label: "of the pediatric population in low-income countries has access to safe surgical care (Lancet Commission on Global Surgery criteria)." },
      { value: "< 8%", label: "in lower-middle-income countries." },
    ],
    quote2: {
      text: "Well-supplied surgical teams from the US and other developed countries regularly swoop into low-income countries for two or three weeks at a time, often earning glowing reports in the media with powerful before and after photos. Their efforts are commendable. But they won’t close the “surgery gap.” Once they leave, the country is no better equipped to care for people who need surgery than before the visit.",
      by: "Sarah Greenberg, Seattle Children’s Hospital · Robert Riviello, Brigham and Women’s Hospital",
    },
    closing: [
      "Until recently, the vast majority of investment in pediatric surgery has historically focused on improving access to quality care as opposed to improving the quality, safety, ubiquity, and delivery of existing care. Foreign medical missions are common, but don’t focus on embedding the skills, safety programs, culture and measurement systems that are necessary to improve care locally.",
    ],
    closingStrong: "We aim to change that.",
    sourcesTitle: "Sources cited on this page",
    sources: [
      "Lancet Commission on Global Surgery",
      "World Health Organization – Global Health Observatory",
      "United Nations – Millennium Development Goals",
      "Shiza Abbasi and Carrie Dolan, William & Mary",
      "Sarah Greenberg (Seattle Children’s Hospital) and Robert Riviello (Brigham and Women’s Hospital)",
    ],
  },
  contact: {
    title: "We’d like to hear from you",
    questions: [
      "Do you have a question we didn’t answer?",
      "Would you like to sponsor a child, donate supplies, or contribute to a mission?",
      "Are you a medical team interested in becoming a member of the Collaborative?",
      "Interested in volunteering to help?",
      "Are you an organization interested in partnership opportunities?",
    ],
    cta: "Send us a message and we’ll get right back to you.",
    noSolicitations: "*No solicitations please",
  },
  donate: {
    lead: "CareWays Collaborative counts on our medical volunteers and generous donors and sponsors like you to continue providing pediatric care in under-resourced communities around the world. Thank you!",
    supportTitle: "With your support we can",
    support: [
      "Save the lives of more children.",
      "Welcome new medical teams to the collaborative.",
      "Create innovative new medical and teamwork approaches.",
      "Develop cutting-edge research programs.",
      "Most importantly, help underserved patients and families get the care they need.",
    ],
    mailTitle: "Donate by mail",
    mailIntro: "To contribute by mail, please make the check payable to:",
    taxNote:
      "We are a 501(c)(3) tax exempt organization doing business under the name CareWays Collaborative. Your donation is tax deductible within the guidelines of U.S. law. You will receive a receipt upon successful completion of your donation. No goods or services are provided in consideration for this gift, unless otherwise noted.",
    supportersTitle: "We are very grateful for the substantial support provided by:",
  },
};

const es: typeof en = {
  home: {
    heroTitle: "Casi dos mil millones de niños en el mundo no tienen acceso a atención quirúrgica.",
    heroBody:
      "Es hora de cambiarlo. Pero, aunque la cirugía es importante, no basta. Queremos transformar toda la cultura del cuidado —los protocolos posquirúrgicos, los recursos y el equipo— para que los niños salgan del quirófano y vuelvan a casa sanos y salvos.",
    introTitle: "CareWays Collaborative",
    introBody:
      "Trabajamos para mejorar de forma medible los resultados de nuestros pacientes pediátricos y sus familias en países con pocos recursos de todo el mundo.",
    pillars: [
      {
        title: "Una iniciativa para salvar vidas jóvenes",
        body: "Acercamos la cirugía y la atención pediátricas que salvan vidas a algunos de los niños más vulnerables del mundo, en sus propios países.",
        href: "/what-we-do",
        cta: "Conoce lo que hacemos",
        image: "/images/site/surgery-team.png",
      },
      {
        title: "Un modelo de atención disruptivo",
        body: "No es una misión médica, sino un modelo cooperativo de atención.",
        href: "/how-we-do-it",
        cta: "Conoce nuestro modelo",
        image: "/images/site/boy-with-truck-1.png",
      },
      {
        title: "Una iniciativa global de salud pediátrica",
        body: "Nos aliamos con profesionales de todo el mundo frente a algunos de los desafíos médicos más difíciles.",
        href: "/what-we-do#network",
        cta: "Conoce nuestra red",
        image: "/images/site/nurse-and-patient-in-pink.png",
      },
      {
        title: "Una necesidad urgente",
        body: "Cada año mueren más niños por falta de atención quirúrgica que por VIH, tuberculosis y malaria juntos.",
        href: "/the-need",
        cta: "Conoce la necesidad",
        image: "/images/site/the-ctuest-unicorn.png",
      },
    ],
    stats: [
      { value: "Más de 5 millones", label: "En 2020, más de 5 millones de niños en el mundo murieron antes de cumplir 5 años." },
      { value: "1700 millones", label: "En 2017, cerca de 1700 millones de niños en el mundo seguían sin acceso a atención quirúrgica." },
      { value: "14×", label: "Por ello, estos niños tienen 14 veces más probabilidades de morir antes de los 5 años que sus pares de países desarrollados." },
    ],
    join: [
      { title: "Voluntariado", body: "Descubre cómo tu tiempo y tu talento pueden apoyar y hacer crecer nuestro trabajo.", href: "/contact?reason=volunteer" },
      { title: "Donar", body: "Conoce cómo tu donación puede ayudar a salvar vidas jóvenes en todo el mundo.", href: "/donate" },
      { title: "Red", body: "Forma parte de nuestra creciente colaboración global.", href: "/contact?reason=medical-team" },
    ],
  },
  about: {
    definition:
      "CareWays Collaborative es una organización sin fines de lucro que trabaja directamente con los sistemas de salud de países con pocos recursos para ofrecer la mejor atención posible a sus pacientes: del hogar al hospital y de vuelta al hogar.",
    mission:
      "Trabajamos para mejorar de forma medible los resultados de nuestros pacientes pediátricos y sus familias en países con pocos recursos de todo el mundo.",
    facts: [
      { title: "Fundada en mayo de 2021", body: "Creada por un grupo de profesionales de la salud de Boston que ya habían hecho varios viajes médicos juntos." },
      { title: "Organización 501(c)(3)", body: "Organización exenta de impuestos que opera con el nombre CareWays Collaborative." },
      { title: "Nacida de Operation Airway", body: "Los fundadores partieron de lo aprendido en su programa Operation Airway." },
      { title: "Hogar → hospital → hogar", body: "Una atención que acompaña al paciente del hogar al hospital y de vuelta al hogar." },
      { title: "Aplanar la jerarquía", body: "Todos —médicos, enfermeras, pacientes y familias— trabajan juntos como pares." },
      { title: "Autonomía progresiva", body: "Los equipos locales se forman paso a paso hacia la autonomía, el dominio y la independencia." },
    ],
    story: [
      {
        id: "origins",
        title: "Cómo nació CareWays",
        body: [
          "CareWays Collaborative, Inc. se fundó en mayo de 2021, cuando un grupo de profesionales de la salud de Boston, que ya habían realizado varios viajes médicos juntos, decidió crear una nueva organización sin fines de lucro capaz de desarrollar un enfoque revolucionario de la atención en comunidades con pocos recursos.",
          "Inspirados por los equipos médicos de cada país anfitrión, estos médicos y enfermeras de Massachusetts General Brigham (MGB) y Mass Eye & Ear (MEE) desarrollaron un enfoque de atención, práctica y formación médica que involucraba profundamente a sus anfitriones en el proceso.",
        ],
      },
      {
        id: "different",
        title: "A diferencia de las misiones tradicionales",
        body: [
          "Estos médicos impulsaron activamente un proceso de «aplanar la jerarquía» y de «autonomía progresiva», en el que todos los participantes —desde médicos y enfermeras hasta pacientes y familias— trabajaban juntos como pares, con el objetivo común de que los pacientes volvieran sanos a casa.",
        ],
      },
      {
        id: "scale",
        title: "Escalar lo que funciona",
        body: [
          "Tras lograr una reducción de la mortalidad del cinco por ciento formando a médicos, enfermeras y personal de un hospital, en un país y en un área de atención concreta, el equipo se propone salvar exponencialmente más vidas extendiendo su colaboración a varios hospitales, países, equipos y áreas de atención.",
          "Los fundadores decidieron que era momento de aprovechar lo aprendido en su programa Operation Airway para crear una organización independiente (CareWays Collaborative) que pudiera trabajar directamente con los sistemas de salud de países con pocos recursos para ofrecer la mejor atención posible a sus pacientes: del hogar al hospital y de vuelta al hogar.",
        ],
      },
    ],
    partnersIntro:
      "CareWays Collaborative se enorgullece de trabajar con los países de abajo. Selecciona un pin o un país para visitar el sitio de cada hospital y ver los reportes de misión relacionados.",
  },
  whatWeDo: {
    lead: "CareWays Collaborative construye una comunidad médica y educativa internacional dedicada a mejorar continuamente los resultados de salud de pacientes jóvenes hospitalizados.",
    intro:
      "Mediante el desarrollo de experiencia y formación quirúrgica de primer nivel, modelos colaborativos de atención y programas innovadores de investigación y evaluación, CareWays apoyará a una comunidad global e interdependiente de profesionales con el conocimiento, los recursos y la tecnología que necesitan para mejorar drásticamente la atención y los resultados de sus pacientes y familias.",
    areas: [
      {
        id: "medicine",
        title: "Medicina",
        summary: "Nuestra forma de atender gira en torno a un equipo multidisciplinario que colabora y se comunica libremente con todos los involucrados para crear programas eficaces y sostenibles.",
        body: [
          "Partimos de la premisa de que una cirugía exitosa no depende solo de cómo le va al paciente en la mesa de operaciones, sino de que el resultado final sea un éxito: que el paciente pueda salir del hospital de forma segura y a tiempo, y que luego experimente cambios positivos y significativos en su vida diaria y su estado funcional. Lograrlo exige una atención dinámica centrada en la experiencia de un equipo multidisciplinario de cirujanos, intensivistas, anestesiólogos, enfermeras, terapeutas respiratorios y familias que trabajan juntos y se comunican sin fricciones para formular y ejecutar un plan de acción clínico.",
          "Nuestro programa también busca un impacto cultural duradero que nace de esta enseñanza y de la alianza en la excelencia clínica. El objetivo es demostrar el poder de aplanar la jerarquía: cirujanos, médicos, enfermeras y terapeutas respiratorios tienen una voz que se escucha en el plan de cada paciente.",
        ],
      },
      {
        id: "education",
        title: "Educación",
        summary: "Construimos y curamos una base de conocimiento abierta para hospitales, cuidadores, pacientes y sus familias.",
        body: [
          "El currículo se basa en un proceso multimodal y práctico de formación, práctica, descubrimiento guiado, demostración, simulación, aprendizaje tradicional (impresos, videos, etc.) y evaluación, en el que los equipos locales se forman de manera progresiva y acompañada hacia la autonomía y la independencia. Guiado por los principios de la educación democrática y el aprendizaje basado en la indagación, el currículo no es un proceso rígido y preestablecido, sino un programa a medida que se adapta a los recursos locales, a los equipos y a sus necesidades cambiantes. A este enfoque lo llamamos Autonomía Progresiva.",
        ],
        list: [
          "Formación quirúrgica",
          "Formación en atención médica",
          "Formación en «Cultura del Cuidado»",
          "Trabajo en equipo y comunicación",
          "Educación para padres y familias",
        ],
        after: [
          "La metodología combina enseñanza presencial, formación con asistencia remota y códigos QR con instrucciones específicas «a demanda», para que médicos, enfermeras, terapeutas y padres aprendan —y apliquen— intervenciones en su propio entorno.",
        ],
      },
      {
        id: "research",
        title: "Investigación",
        summary: "Desarrollamos programas de investigación y evaluación para mejorar la eficacia y el impacto de las actividades de CareWays.",
        body: ["Nos comprometemos a desarrollar programas de investigación y evaluación que midan la eficacia y el impacto de nuestras actividades para:"],
        list: [
          "Codificar buenas prácticas en todos los aspectos de la atención médica",
          "Publicar y presentar resultados",
          "Evaluar de forma continua la eficacia del programa",
        ],
        listIntro2: "Nuestros protocolos de evaluación incluyen:",
        list2: [
          "Evaluaciones educativas antes y después del currículo",
          "Entrevistas cualitativas estructuradas antes y después",
          "Evaluación, antes y después, de la adopción de listas de verificación educativas y culturales que aseguran la participación y colaboración multidisciplinaria y destacan la información clínica crítica para optimizar la atención de cada paciente",
          "Contar y recontar: entender la morbilidad antes y después de la intervención",
        ],
      },
      {
        id: "partnerships",
        title: "Alianzas",
        summary: "Trabajamos con diversos aliados para desarrollar enfoques colaborativos frente a algunos de los desafíos médicos más difíciles del mundo.",
        body: [
          "Como parte de nuestro compromiso de apoyar continuamente a los pacientes y ofrecerles la mejor atención posible, CareWays planea apoyarse en su alianza vigente con Massachusetts General Hospital y Mass. Eye and Ear para desarrollar nuevas alianzas estratégicas con organizaciones que impulsen nuestros objetivos comunes, entre ellas:",
        ],
        list: [
          "Hospitales",
          "Academia",
          "Empresas",
          "Empresas de equipos médicos",
          "Industria farmacéutica",
          "Agencias gubernamentales",
          "ONG internacionales",
          "Agencias de servicios sociales",
          "Expertos en liderazgo y eficacia organizacional",
        ],
      },
      {
        id: "network",
        title: "Red",
        summary: "Nuestra meta a largo plazo es crear una red global y dinámica de equipos médicos pediátricos que trabajen con este nuevo modelo y colaboren activamente entre sí en todo el mundo.",
        body: [
          "Esta red será el núcleo de nuestro trabajo para sincronizar el desarrollo y la difusión de nuestra investigación de vanguardia, nuestro currículo y nuestras buenas prácticas médicas entre todos los miembros de CareWays. La Collaborative crecerá y evolucionará constantemente; los equipos de salud locales pasarán de alumnos a docentes para impulsar las prácticas del modelo en otras partes de su país y en otros países del mundo. La Collaborative estará gestionada de forma central por el equipo fundador en Boston, que servirá de recurso a los miembros en experiencia y formación quirúrgica, modelos colaborativos de atención y programas de investigación y evaluación.",
          "Este trabajo garantizará que el modelo CareWays siga a la vanguardia de la innovación y las buenas prácticas en cirugía y atención pediátrica global.",
        ],
      },
    ],
    outcomesTitle: "Nuestros resultados",
    outcomes: [
      { value: 2, label: "Programas graduados" },
      { value: 4, label: "Países activos" },
      { value: 6, label: "Misiones y contando" },
      { value: 14, label: "Pacientes trasladados a Boston, MA" },
      { value: 142, label: "Sesiones de habla y deglución" },
      { value: 192, label: "Cirugías y procedimientos" },
      { value: 292, label: "Pacientes evaluados" },
    ],
  },
  howWeDoIt: {
    lead: "CareWays Collaborative transforma el modelo tradicional de misión médica: diseña, ejecuta y acompaña programas de educación y formación en plena alianza con los equipos médicos locales.",
    sections: [
      {
        id: "learning",
        title: "Un enfoque colaborativo del aprendizaje",
        image: "/images/site/learning.png",
        body: [
          "El currículo de CareWays abarca todos los aspectos de la atención pediátrica: del diagnóstico a la cirugía, de los cuidados intensivos al regreso a casa. Guiados por el principio de autonomía progresiva, los equipos de CareWays ofrecen una educación multimodal y práctica —formación, práctica, descubrimiento guiado, demostración y simulación— de forma progresiva y acompañada, hacia la autonomía, el dominio y la independencia.",
        ],
      },
      {
        id: "working",
        title: "Un enfoque colaborativo del trabajo",
        image: "/images/site/working.png",
        body: [
          "El equipo de CareWays —cirujanos pediátricos, especialistas en cuidados intensivos, enfermeras, terapeutas respiratorios y especialistas en habla y lenguaje— trabaja codo a codo con los profesionales del hospital local para entender las necesidades y la experiencia locales y colaborar de cerca en el desarrollo y la ejecución del plan quirúrgico.",
        ],
      },
      {
        id: "culture-of-care",
        title: "La «Cultura del Cuidado» en el centro",
        image: "/images/site/collaborative-learning.jpg",
        body: [
          "La clave del éxito y de la singularidad del currículo y del enfoque de CareWays es su atención tanto a la calidad como a la cultura del cuidado. Las decisiones sobre los planes de tratamiento y recuperación, y su ejecución, se comparten entre todos con la misma voz, rompiendo y aplanando la jerarquía tradicional y los compartimentos estancos de muchos quirófanos. CareWays Collaborative extiende estas iniciativas educativas, de comunicación y culturales a todo el ciclo de atención: del hogar al hospital y de vuelta al hogar.",
        ],
      },
      {
        id: "replicable",
        title: "Programas replicables y escalables",
        image: "/images/site/surgery-team-camera.jpg",
        body: [
          "Algo fundamental: este enfoque crea y sostiene programas duraderos, en los que los equipos pediátricos locales adoptan prácticas que continúan mucho después de que el equipo de CareWays se ha ido.",
        ],
      },
    ],
    cta: "Para saber más, escríbenos",
  },
  theNeed: {
    lead: "La Organización Mundial de la Salud ha pedido poner fin a las muertes evitables de recién nacidos y niños para 2030. CareWays Collaborative ha creado un camino probado y medible para alcanzar esa meta visionaria.",
    stats: [
      { value: "Más de 5 millones", label: "En 2020, más de 5 millones de niños en el mundo murieron antes de cumplir 5 años." },
      { value: "2,6 millones", label: "murieron antes de cumplir su primer mes." },
      { value: "1700 millones", label: "de niños en el mundo siguen sin acceso a atención quirúrgica y, por ello, tienen 14 veces más probabilidades de morir antes de los 5 años que sus pares de países desarrollados." },
    ],
    quote1: {
      text: "Si se quieren cumplir las metas de la ONU y la OMS, es hora de redoblar la apuesta por la evidencia de que aumentar la atención quirúrgica pediátrica en entornos con pocos recursos es una buena inversión.",
      by: "Shiza Abbasi y Carrie Dolan, William & Mary",
    },
    gapTitle: "Un desierto quirúrgico",
    gap: [
      "Sin embargo, solo una fracción de la ayuda internacional se destina a la atención quirúrgica. De hecho, menos del 3 % de la población pediátrica en países de ingresos bajos y menos del 8 % en países de ingresos medianos bajos tiene acceso a atención quirúrgica segura, según los criterios de la Lancet Commission on Global Surgery. El Observatorio Mundial de la Salud de la Organización Mundial de la Salud fijó un Objetivo de Desarrollo Sostenible para acabar con las muertes evitables de recién nacidos y menores de 5 años para 2030. Y las Naciones Unidas, como parte de sus Objetivos de Desarrollo del Milenio, reafirmaron su compromiso de reducir drásticamente la tasa de muertes evitables de recién nacidos y menores de 5 años.",
      "Llenar este desierto quirúrgico y alcanzar las metas vitales de la ONU, la Organización Mundial de la Salud y otros exigirá un aumento drástico de las cirugías pediátricas, además de formación en técnicas quirúrgicas, comunicación, trabajo en equipo y cultura del cuidado y la seguridad.",
    ],
    gapStats: [
      { value: "< 3 %", label: "de la población pediátrica en países de ingresos bajos tiene acceso a atención quirúrgica segura (criterios de la Lancet Commission on Global Surgery)." },
      { value: "< 8 %", label: "en países de ingresos medianos bajos." },
    ],
    quote2: {
      text: "Equipos quirúrgicos bien abastecidos de EE. UU. y de otros países desarrollados llegan con frecuencia a países de ingresos bajos por dos o tres semanas, y suelen recibir elogios en los medios con impactantes fotos de antes y después. Su esfuerzo es encomiable. Pero no cerrará la «brecha quirúrgica». Cuando se van, el país no está mejor preparado para atender a quienes necesitan cirugía que antes de la visita.",
      by: "Sarah Greenberg, Seattle Children’s Hospital · Robert Riviello, Brigham and Women’s Hospital",
    },
    closing: [
      "Hasta hace poco, la gran mayoría de la inversión en cirugía pediátrica se había centrado en mejorar el acceso a una atención de calidad, más que en mejorar la calidad, la seguridad, la cobertura y la prestación de la atención existente. Las misiones médicas extranjeras son comunes, pero no se enfocan en arraigar las habilidades, los programas de seguridad, la cultura y los sistemas de medición necesarios para mejorar la atención a nivel local.",
    ],
    closingStrong: "Queremos cambiar eso.",
    sourcesTitle: "Fuentes citadas en esta página",
    sources: [
      "Lancet Commission on Global Surgery",
      "Organización Mundial de la Salud – Observatorio Mundial de la Salud",
      "Naciones Unidas – Objetivos de Desarrollo del Milenio",
      "Shiza Abbasi y Carrie Dolan, William & Mary",
      "Sarah Greenberg (Seattle Children’s Hospital) y Robert Riviello (Brigham and Women’s Hospital)",
    ],
  },
  contact: {
    title: "Queremos saber de ti",
    questions: [
      "¿Tienes una pregunta que no respondimos?",
      "¿Te gustaría apadrinar a un niño, donar insumos o contribuir a una misión?",
      "¿Eres un equipo médico interesado en unirte a la Collaborative?",
      "¿Te interesa ser voluntario o voluntaria?",
      "¿Eres una organización interesada en una alianza?",
    ],
    cta: "Escríbenos y te responderemos muy pronto.",
    noSolicitations: "*Por favor, sin solicitudes comerciales",
  },
  donate: {
    lead: "CareWays Collaborative cuenta con sus voluntarios médicos y con donantes y patrocinadores generosos como tú para seguir brindando atención pediátrica en comunidades con pocos recursos de todo el mundo. ¡Gracias!",
    supportTitle: "Con tu apoyo podemos",
    support: [
      "Salvar la vida de más niños.",
      "Dar la bienvenida a nuevos equipos médicos a la Collaborative.",
      "Crear nuevos enfoques innovadores de atención médica y trabajo en equipo.",
      "Desarrollar programas de investigación de vanguardia.",
      "Y sobre todo, ayudar a pacientes y familias desatendidos a recibir la atención que necesitan.",
    ],
    mailTitle: "Donar por correo postal",
    mailIntro: "Para donar por correo, emite el cheque a nombre de:",
    taxNote:
      "Somos una organización exenta de impuestos 501(c)(3) que opera con el nombre CareWays Collaborative. Tu donación es deducible de impuestos dentro de los límites de la ley de EE. UU. Recibirás un recibo al completar tu donación. No se entregan bienes ni servicios a cambio de esta donación, salvo que se indique lo contrario.",
    supportersTitle: "Agradecemos profundamente el apoyo sustancial de:",
  },
};

export type SiteCopy = typeof en;

export function getCopy(locale: Locale): SiteCopy {
  return locale === "es" ? es : en;
}
