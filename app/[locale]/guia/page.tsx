import Image from "next/image";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import { ArrowGlyph, ButtonLink, Kicker, Surface, buttonClass } from "@/components/premium/ui";
import { cx } from "@/components/site/ui";

/**
 * /guia — living style guide for Direction A ("Profundidad clínica").
 * Internal page: not linked from the menu and not indexed.
 */
export const metadata: Metadata = {
  title: "Guía del sistema de diseño",
  robots: { index: false, follow: false },
};

const palette: Array<{
  group: string;
  note: string;
  swatches: Array<{ name: string; token: string; hex: string; use: string; dark?: boolean }>;
}> = [
  {
    group: "Noche",
    note: "Fondos profundos del hero, del footer y de las secciones de impacto.",
    swatches: [
      { name: "Noche", token: "night", hex: "#0B1F3A", use: "Fondo principal oscuro · blanco encima 16.5:1", dark: true },
      { name: "Noche 2", token: "night-2", hex: "#102A4C", use: "Degradados y paneles", dark: true },
      { name: "Noche 3", token: "night-3", hex: "#16355E", use: "Bordes y separadores sobre noche", dark: true },
    ],
  },
  {
    group: "Marca",
    note: "El azul del logo: titulares, botones principales y enlaces.",
    swatches: [
      { name: "Azul marca", token: "primary", hex: "#1F406F", use: "Titulares, botón principal · 10.4:1 sobre blanco", dark: true },
      { name: "Azul marca 2", token: "primary-container", hex: "#274776", use: "Degradado del botón", dark: true },
      { name: "Azul claro", token: "navy-light", hex: "#405F90", use: "Hover de títulos", dark: true },
      { name: "Celeste oscuro", token: "sky-dark", hex: "#396D8D", use: "Etiquetas pequeñas y anillo de foco · 5.6:1", dark: true },
    ],
  },
  {
    group: "Luz",
    note: "La luz del sistema: brillos, halos y acentos sobre fondos oscuros.",
    swatches: [
      { name: "Aqua", token: "aqua", hex: "#85F0D4", use: "Acentos y brillos sobre noche · 12.1:1" },
      { name: "Aqua suave", token: "aqua-soft", hex: "#C9F9EC", use: "Fondos de éxito, etiquetas" },
      { name: "Celeste", token: "secondary", hex: "#86C0E7", use: "Bordes y arcos · nunca como texto sobre claro" },
      { name: "Celeste claro", token: "sky-light", hex: "#93CDF5", use: "Texto secundario sobre noche · 9.7:1" },
      { name: "Hielo", token: "ice", hex: "#D6EAF7", use: "Anillos de tarjetas, fondos activos" },
    ],
  },
  {
    group: "Donar",
    note: "El amarillo del logo. Se reserva solo para el botón de donar, para que siempre destaque.",
    swatches: [
      { name: "Sol", token: "sunbeam", hex: "#FFE266", use: "Botón Donar · texto noche encima 12.8:1" },
      { name: "Sol intenso", token: "sunbeam-deep", hex: "#F5CC2F", use: "Hover del botón Donar" },
    ],
  },
  {
    group: "Neutros",
    note: "Fondos claros y textos de lectura.",
    swatches: [
      { name: "Bruma", token: "mist", hex: "#EEF5FB", use: "Fondo claro con un toque de azul" },
      { name: "Escarcha", token: "frost", hex: "#F6FBFF", use: "Fondo general de página" },
      { name: "Texto", token: "on-surface", hex: "#1A1C1F", use: "Cuerpo de texto · 17.1:1", dark: true },
      { name: "Texto suave", token: "on-surface-variant", hex: "#46474A", use: "Bajadas y descripciones · 9.3:1", dark: true },
      { name: "Gris dato", token: "neutral", hex: "#6D6D71", use: "Fechas y metadatos · 5.2:1", dark: true },
    ],
  },
];

const spacing = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128];

export default async function GuiaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="pb-24">
      {/* ── Cover ── */}
      <section className="cw-night cw-grain relative -mt-[76px] overflow-hidden pb-20 pt-40 sm:-mt-[88px] sm:pt-44">
        <div className="relative z-[2] mx-auto max-w-7xl px-5 sm:px-6">
          <Kicker tone="dark">Fase 2 · Sistema de diseño</Kicker>
          <h1 className="cw-display mt-6 max-w-4xl text-balance text-[2.75rem] leading-[1.04] md:text-[4.5rem]">
            Profundidad clínica
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-sky-light/90">
            Azul marino nocturno, luz aqua y el amarillo del logo solo para donar. Esta página muestra cada pieza del
            sistema para que todo el sitio hable el mismo idioma visual.
          </p>
          <nav aria-label="Secciones de la guía" className="mt-10 flex flex-wrap gap-2">
            {[
              ["color", "Color"],
              ["tipografia", "Tipografía"],
              ["elevacion", "Elevación"],
              ["capas", "Capas y texturas"],
              ["botones", "Botones"],
              ["tarjetas", "Tarjetas"],
              ["espacio", "Espaciado y radios"],
              ["movimiento", "Movimiento"],
            ].map(([id, label]) => (
              <a key={id} href={`#${id}`} className={buttonClass("glass", "sm")}>
                {label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="mx-auto flex max-w-7xl flex-col gap-24 px-5 pt-20 sm:px-6">
        {/* ── Color ── */}
        <GuideSection id="color" kicker="1" title="Color" lead="Cada color tiene un trabajo. Los números (como 9.5:1) indican el contraste: arriba de 4.5:1 se lee bien para todas las personas.">
          <div className="flex flex-col gap-12">
            {palette.map((g) => (
              <div key={g.group}>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                  <h3 className="text-lg font-bold text-primary">{g.group}</h3>
                  <p className="text-sm text-on-surface-variant">{g.note}</p>
                </div>
                <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                  {g.swatches.map((s) => (
                    <li key={s.token} className="overflow-hidden rounded-[20px] bg-white shadow-e2 ring-1 ring-primary/[0.06]">
                      <div className="flex h-24 items-end p-3" style={{ background: s.hex }}>
                        <span className={cx("text-xs font-bold", s.dark ? "text-white" : "text-night")}>Aa</span>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-bold text-primary">{s.name}</p>
                        <p className="mt-0.5 font-mono text-[11px] text-neutral">
                          {s.hex} · {s.token}
                        </p>
                        <p className="mt-2 text-xs leading-snug text-on-surface-variant">{s.use}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </GuideSection>

        {/* ── Typography ── */}
        <GuideSection id="tipografia" kicker="2" title="Tipografía" lead="Dos voces: Newsreader (con serifas, editorial) para los titulares que emocionan; Public Sans (limpia) para leer, navegar y para todas las cifras.">
          <Surface className="divide-y divide-outline-variant/40 overflow-hidden">
            <TypeRow spec="Display · Newsreader 400 · 72 / 44 px · interlineado 1.04">
              <p className="cw-display text-[2.75rem] leading-[1.04] text-primary md:text-[4.5rem]">Every child, safely home</p>
            </TypeRow>
            <TypeRow spec="Titular de sección · Newsreader 400 · 44 / 32 px">
              <p className="cw-display text-[2rem] leading-[1.12] text-primary md:text-[2.75rem]">A surgical desert</p>
            </TypeRow>
            <TypeRow spec="Titular de tarjeta · Newsreader 400 · 28 px">
              <p className="cw-display text-[1.75rem] leading-snug text-primary">A Disruptive Model of Care</p>
            </TypeRow>
            <TypeRow spec="Cifra · Public Sans 700 · números alineados · nunca en serifa">
              <p className="text-[4.5rem] font-bold leading-[0.9] tracking-[-0.04em] text-primary tabular-nums md:text-[6rem]">1.7 billion</p>
            </TypeRow>
            <TypeRow spec="Bajada · Public Sans 400 · 18 px · interlineado 1.65">
              <p className="max-w-2xl text-lg leading-relaxed text-on-surface-variant">
                Working to measurably improve outcomes for our pediatric patients and their families in under-resourced
                countries around the world.
              </p>
            </TypeRow>
            <TypeRow spec="Cuerpo · Public Sans 400 · 16 px">
              <p className="max-w-2xl leading-relaxed text-on-surface">
                We start with the premise that a successful surgery is not just how the patient does on the operating room
                table, but whether the eventual outcome is a success.
              </p>
            </TypeRow>
            <TypeRow spec="Etiqueta · Public Sans 700 · 11 px · espaciado 0.16em">
              <Kicker>Our mission</Kicker>
            </TypeRow>
          </Surface>
        </GuideSection>

        {/* ── Elevation ── */}
        <GuideSection id="elevacion" kicker="3" title="Elevación" lead="Cuatro alturas. Las sombras son difusas, en capas y teñidas de azul de marca (nunca grises), para que los elementos parezcan flotar a distinta distancia.">
          <div className="cw-mist rounded-[28px] p-6 ring-1 ring-ice sm:p-10">
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {(
                [
                  ["e1", "Apoyado", "Etiquetas, campos"],
                  ["e2", "Tarjeta", "Estado normal de tarjetas y botones"],
                  ["e3", "Elevado", "Hover, elementos destacados"],
                  ["e4", "Flotante", "Menús, ventanas, tarjeta activa"],
                ] as const
              ).map(([lvl, name, use]) => (
                <li key={lvl}>
                  <Surface level={lvl} className="flex h-40 flex-col justify-between p-5">
                    <span className="font-mono text-xs text-neutral">shadow-{lvl}</span>
                    <div>
                      <p className="text-lg font-bold text-primary">{name}</p>
                      <p className="text-sm text-on-surface-variant">{use}</p>
                    </div>
                  </Surface>
                </li>
              ))}
            </ul>
          </div>
          <div className="cw-night mt-6 grid gap-6 rounded-[28px] p-6 sm:grid-cols-2 sm:p-10">
            <div className="rounded-[20px] bg-night-2 p-6 shadow-halo">
              <span className="font-mono text-xs text-sky-light/80">shadow-halo</span>
              <p className="mt-6 text-lg font-bold">Sobre fondo oscuro</p>
              <p className="text-sm text-sky-light/85">Una sombra sola no se ve en la noche: se acompaña de un halo aqua muy tenue.</p>
            </div>
            <div className="cw-glow-edge rounded-[20px] bg-night-2/60 p-6">
              <span className="font-mono text-xs text-sky-light/80">cw-glow-edge</span>
              <p className="mt-6 text-lg font-bold">Borde con brillo</p>
              <p className="text-sm text-sky-light/85">Un borde de 1 px que va de aqua a transparente, como luz que roza el canto.</p>
            </div>
          </div>
        </GuideSection>

        {/* ── Layers & textures ── */}
        <GuideSection id="capas" kicker="4" title="Capas y texturas" lead="Fotos con un velo de marca, vidrio esmerilado con moderación y un grano casi invisible que le quita lo digital a los fondos planos.">
          <div className="grid gap-6 lg:grid-cols-2">
            <figure className="relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-e3">
              <Image src="/images/site/surgery-team-camera.jpg" alt="Equipo de CareWays durante una misión" fill sizes="(min-width:1024px) 600px, 100vw" className="object-cover" />
              <div aria-hidden className="cw-photo-veil absolute inset-0" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                <span className="font-mono text-xs text-aqua">cw-photo-veil</span>
                <p className="cw-display mt-2 text-2xl leading-snug sm:text-3xl">Velo de marca sobre la foto</p>
                <p className="mt-1 text-sm text-white/85">Profundidad marino desde abajo, luz aqua arriba: el texto siempre se lee.</p>
              </figcaption>
            </figure>
            <figure className="relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-e3">
              <Image src="/images/site/collaborative-learning.jpg" alt="Sesión de aprendizaje colaborativo con equipos locales" fill sizes="(min-width:1024px) 600px, 100vw" className="object-cover" />
              <div aria-hidden className="absolute inset-0 bg-night/25" />
              <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
                <div className="cw-glass-dark rounded-[20px] p-5 text-white">
                  <span className="font-mono text-xs text-aqua">cw-glass-dark</span>
                  <p className="mt-1 font-bold">Vidrio esmerilado</p>
                  <p className="text-sm text-white/85">Deja ver la foto detrás, borrosa. Solo en el menú y en paneles sobre fotos.</p>
                </div>
              </div>
            </figure>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="cw-night flex h-44 flex-col justify-end rounded-[28px] p-6">
              <span className="font-mono text-xs text-aqua">cw-night · sin grano</span>
              <p className="text-sm text-sky-light/85">Fondo plano: se siente digital.</p>
            </div>
            <div className="cw-night cw-grain flex h-44 flex-col justify-end overflow-hidden rounded-[28px] p-6">
              <span className="relative z-[2] font-mono text-xs text-aqua">cw-night + cw-grain</span>
              <p className="relative z-[2] text-sm text-sky-light/85">Con grano leve (6 %): se siente como papel o película.</p>
            </div>
          </div>
          <div className="relative mt-6 overflow-hidden rounded-[28px]">
            <Image src="/images/site/surgery-team.png" alt="" fill sizes="100vw" className="object-cover" />
            <div className="relative flex min-h-56 items-center justify-center p-6">
              <div className="cw-glass max-w-md rounded-[20px] p-6 text-center">
                <span className="font-mono text-xs text-sky-dark">cw-glass</span>
                <p className="mt-1 font-bold text-primary">Vidrio claro</p>
                <p className="text-sm text-on-surface-variant">Así se verá el menú cuando la página se desplace sobre una foto.</p>
              </div>
            </div>
          </div>
        </GuideSection>

        {/* ── Buttons ── */}
        <GuideSection id="botones" kicker="5" title="Botones" lead="Al pasar el mouse, el botón sube 2 px, su sombra crece y la flecha avanza. Con el teclado aparece un anillo de foco visible. Todos miden al menos 44 px de alto para tocarlos fácil con el dedo.">
          <Surface className="flex flex-col gap-8 p-6 sm:p-10">
            <ButtonRow label="Donar · solo para donaciones">
              <ButtonLink href="/donate" variant="donate" size="lg" arrow>Donate</ButtonLink>
              <ButtonLink href="/donate" variant="donate" size="md">Donate</ButtonLink>
              <ButtonLink href="/donate" variant="donate" size="sm">Donate</ButtonLink>
            </ButtonRow>
            <ButtonRow label="Principal">
              <ButtonLink href="/contact" variant="primary" size="lg" arrow>Join the next mission</ButtonLink>
              <ButtonLink href="/about" variant="primary" size="md">Who we are</ButtonLink>
              <ButtonLink href="/about" variant="primary" size="sm">Learn more</ButtonLink>
            </ButtonRow>
            <ButtonRow label="Secundario y fantasma">
              <ButtonLink href="/what-we-do" variant="outline" size="md" arrow>What we do</ButtonLink>
              <ButtonLink href="/blog" variant="ghost" size="md">Read the blog</ButtonLink>
            </ButtonRow>
            <ButtonRow label="Estados: foco con teclado · deshabilitado">
              <span className={buttonClass("primary", "md", "outline-2 outline-offset-[3px] outline-sky-dark")}>Foco visible</span>
              <button type="button" disabled className={buttonClass("primary", "md")}>
                Deshabilitado
              </button>
            </ButtonRow>
          </Surface>
          <div className="cw-night cw-grain mt-6 overflow-hidden rounded-[28px] p-6 sm:p-10">
            <div className="relative z-[2] flex flex-col gap-6">
              <p className="cw-eyebrow text-aqua">Sobre fondo oscuro o foto</p>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/donate" variant="donate" size="lg" arrow>Donate</ButtonLink>
                <ButtonLink href="/contact" variant="glass" size="lg">Join the next mission</ButtonLink>
                <ButtonLink href="/about" variant="outline-light" size="lg">Who we are</ButtonLink>
              </div>
            </div>
          </div>
        </GuideSection>

        {/* ── Cards ── */}
        <GuideSection id="tarjetas" kicker="6" title="Tarjetas" lead="Pasa el mouse: la tarjeta sube, su sombra pasa de e2 a e4 y la foto se acerca despacio dentro de su marco redondeado.">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <li>
              <article className="cw-lift group relative flex h-full flex-col overflow-hidden rounded-[20px] bg-white ring-1 ring-primary/[0.06]">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src="/images/site/nurse-and-patient-in-pink.png" alt="Enfermera con una paciente" fill sizes="(min-width:1024px) 400px, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.06] motion-reduce:group-hover:scale-100" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="cw-eyebrow text-sky-dark">Tarjeta de contenido</p>
                  <h3 className="cw-display mt-3 text-2xl leading-snug text-primary">A Global Pediatric Health Initiative</h3>
                  <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">Partnering with providers around the world on some of the most intractable medical challenges.</p>
                  <a href="#tarjetas" className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-primary after:absolute after:inset-0">
                    Learn more <ArrowGlyph />
                  </a>
                </div>
              </article>
            </li>
            <li>
              <article className="cw-lift group relative flex h-full min-h-80 flex-col justify-end overflow-hidden rounded-[20px]">
                <Image src="/images/site/boy-with-truck-1.png" alt="Niño jugando con un camión de juguete" fill sizes="(min-width:1024px) 400px, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.06] motion-reduce:group-hover:scale-100" />
                <div aria-hidden className="cw-photo-veil absolute inset-0" />
                <div className="relative p-6 text-white">
                  <p className="cw-eyebrow text-aqua">Tarjeta sobre foto</p>
                  <h3 className="cw-display mt-3 text-2xl leading-snug">A Disruptive Model of Care</h3>
                  <p className="mt-2 text-sm text-white/85">Not a medical mission, but a cooperative model of care.</p>
                </div>
              </article>
            </li>
            <li>
              <article className="cw-night cw-glow-edge flex h-full min-h-80 flex-col justify-between rounded-[20px] p-6 shadow-e3">
                <p className="cw-eyebrow text-aqua">Tarjeta de cifra</p>
                <div>
                  <p className="text-[4rem] font-bold leading-[0.9] tracking-[-0.04em] tabular-nums">14×</p>
                  <p className="mt-3 text-sm leading-relaxed text-sky-light/90">
                    As a result these children are 14 times more likely to die before reaching the age of 5 than their first-world peers.
                  </p>
                </div>
              </article>
            </li>
          </ul>
        </GuideSection>

        {/* ── Spacing & radii ── */}
        <GuideSection id="espacio" kicker="7" title="Espaciado y radios" lead="Un ritmo fijo de espacios (de 4 en 4 al principio, luego más amplio) y esquinas redondeadas generosas. El aire entre elementos es lo que hace que algo se sienta caro.">
          <div className="grid gap-6 lg:grid-cols-2">
            <Surface className="p-6 sm:p-8">
              <ul className="flex flex-col gap-3">
                {spacing.map((s) => (
                  <li key={s} className="flex items-center gap-4">
                    <span className="w-14 font-mono text-xs text-neutral">{s}px</span>
                    <span className="min-w-0 flex-1">
                      <span className="block h-3 rounded-full bg-gradient-to-r from-aqua to-secondary" style={{ width: `${(s / 128) * 100}%` }} />
                    </span>
                  </li>
                ))}
              </ul>
            </Surface>
            <Surface className="grid grid-cols-2 gap-5 p-6 sm:grid-cols-3 sm:p-8">
              {(
                [
                  ["12px", "Campos pequeños", "rounded-xl"],
                  ["20px", "Tarjetas", "rounded-[20px]"],
                  ["28px", "Bloques y fotos", "rounded-[28px]"],
                  ["2rem", "Menú móvil", "rounded-[2rem]"],
                  ["Pastilla", "Botones, chips", "rounded-full"],
                  ["Círculo", "Íconos, avatares", "rounded-full aspect-square"],
                ] as const
              ).map(([v, use, cls]) => (
                <div key={v} className="flex flex-col items-center gap-2 text-center">
                  <span className={cx("h-16 w-full bg-ice shadow-e1", cls, cls.includes("aspect") && "w-16")} />
                  <span className="text-sm font-bold text-primary">{v}</span>
                  <span className="text-xs text-on-surface-variant">{use}</span>
                </div>
              ))}
            </Surface>
          </div>
        </GuideSection>

        {/* ── Motion ── */}
        <GuideSection id="movimiento" kicker="8" title="Movimiento" lead="Todo se mueve con la misma curva: arranca decidido y frena suave, como una puerta con amortiguador. Las animaciones de entrada llegan en la Fase 3 y la Fase 4.">
          <Surface className="grid gap-6 p-6 sm:grid-cols-3 sm:p-8">
            <MotionNote title="Curva" text="cubic-bezier(0.22, 1, 0.36, 1) para todo: botones, tarjetas, apariciones." />
            <MotionNote title="Duraciones" text="Botones 300 ms · tarjetas 450 ms · zoom de fotos 1.2 s · apariciones 700 ms con desfase de 80 ms." />
            <MotionNote title="Sin animaciones" text="Si la persona las desactivó en su teléfono o computadora, todo aparece en su lugar final, sin movimiento." />
          </Surface>
        </GuideSection>
      </div>
    </div>
  );
}

function GuideSection({ id, kicker, title, lead, children }: { id: string; kicker: string; title: string; lead: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-t`} className="scroll-mt-28">
      <div className="mb-10 flex max-w-3xl flex-col gap-4">
        <Kicker>{`${kicker} · ${title}`}</Kicker>
        <h2 id={`${id}-t`} className="cw-display text-[2rem] leading-[1.12] text-primary md:text-[2.75rem]">
          {title}
        </h2>
        <p className="text-lg leading-relaxed text-on-surface-variant">{lead}</p>
      </div>
      {children}
    </section>
  );
}

function TypeRow({ spec, children }: { spec: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 p-6 sm:p-8">
      <span className="font-mono text-xs text-neutral">{spec}</span>
      {children}
    </div>
  );
}

function ButtonRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-on-surface-variant">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

function MotionNote({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <p className="font-bold text-primary">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">{text}</p>
    </div>
  );
}
