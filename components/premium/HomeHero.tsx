"use client";

import Image from "next/image";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowGlyph, buttonClass } from "./ui";
import { Link } from "@/i18n/navigation";
import { cx } from "@/components/site/ui";

/**
 * Full-screen hero with the CareWays intro film as a silent background.
 *
 * Loading strategy (fast first paint, light on phones):
 * 1. The poster frame (local JPG, `priority`) paints immediately with a slow
 *    Ken Burns drift — this is what phones and "reduce motion" users keep.
 * 2. On tablets/desktop with motion allowed and no data-saver, the muted
 *    YouTube player (privacy-enhanced domain) loads after the page is idle and
 *    cross-fades in only once it is actually playing, so no player chrome or
 *    black frame ever shows.
 * 3. A pause button stops the film and the drift (WCAG 2.2.2), and the film
 *    also pauses itself whenever the hero is off screen.
 */

type Labels = {
  kicker: string;
  title: string;
  lead: string;
  ctaMission: string;
  ctaGive: string;
  watch: string;
  pause: string;
  play: string;
  scroll: string;
};

export function HomeHero({ videoId, labels }: { videoId: string; labels: Labels }) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loadVideo, setLoadVideo] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);

  // Decide whether the film is worth loading on this device.
  useEffect(() => {
    if (reduce || !videoId) return;
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const slow = conn?.saveData || (conn?.effectiveType ? /(^|-)2g$/.test(conn.effectiveType) : false);
    if (!wide || slow) return;
    const start = () => setLoadVideo(true);
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 2500 });
    else setTimeout(start, 1200);
  }, [reduce, videoId]);

  const command = useCallback((func: "playVideo" | "pauseVideo") => {
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");
  }, []);

  // Listen to the player: reveal it only once it really plays.
  useEffect(() => {
    if (!loadVideo) return;
    const onMessage = (e: MessageEvent) => {
      try {
        if (!/(^|\.)youtube(-nocookie)?\.com$/.test(new URL(e.origin).hostname)) return;
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        const state = data?.info?.playerState ?? (data?.event === "onStateChange" ? data.info : undefined);
        if (state === 1) {
          // Muted autoplay can switch captions on; a background film shouldn't show them.
          iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "unloadModule", args: ["captions"] }), "*");
          iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "unloadModule", args: ["cc"] }), "*");
          setPlaying(true);
        }
      } catch {
        /* ignore non-JSON messages */
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [loadVideo]);

  const subscribe = () => {
    // Ask the player to stream its state to this page.
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: "cw-hero" }), "*");
  };

  // Pause the film while the hero is off screen (saves battery and CPU).
  useEffect(() => {
    if (!loadVideo || !sectionRef.current) return;
    const io = new IntersectionObserver(([entry]) => {
      if (paused) return;
      command(entry.isIntersecting ? "playVideo" : "pauseVideo");
    });
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, [loadVideo, paused, command]);

  const togglePause = () => {
    setPaused((p) => {
      command(p ? "playVideo" : "pauseVideo");
      return !p;
    });
  };

  // Depth: background, veil and content move at different speeds on scroll…
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const words = labels.title.split(" ");
  const src =
    `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}` +
    `&controls=0&disablekb=1&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&fs=0&cc_load_policy=0&enablejsapi=1`;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative isolate -mt-[88px] flex min-h-[100svh] flex-col overflow-hidden bg-night text-white"
    >
      {/* ── Background: poster + film ── */}
      <m.div aria-hidden style={{ y: reduce ? 0 : bgY }} className="absolute inset-0 -z-20">
        <div className={cx("absolute inset-0", !reduce && "cw-kenburns", paused && "is-paused")}>
          <Image
            src="/images/site/hero-video-poster.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[62%_center]"
          />
        </div>
        {loadVideo && (
          <iframe
            ref={iframeRef}
            src={src}
            title=""
            tabIndex={-1}
            aria-hidden
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={subscribe}
            className={cx(
              "pointer-events-none absolute left-1/2 top-1/2 h-[max(100%,56.25vw)] w-[max(100%,177.78svh)] -translate-x-1/2 -translate-y-1/2 scale-[1.18] border-0 transition-opacity duration-[1600ms]",
              playing ? "opacity-100" : "opacity-0",
            )}
          />
        )}
      </m.div>

      {/* ── Veil: natural transparency, denser only where the text sits ── */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {/* left-to-right: readable text column, faces stay luminous */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(11_31_58/0.78)_0%,rgb(11_31_58/0.55)_38%,rgb(11_31_58/0.18)_72%,rgb(11_31_58/0.08)_100%)] max-md:bg-[linear-gradient(180deg,rgb(11_31_58/0.35)_0%,rgb(11_31_58/0.55)_45%,rgb(11_31_58/0.82)_100%)]" />
        {/* soft floor so the page flows out of the hero */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night/70 to-transparent" />
        {/* aqua morning light, very low */}
        <div className="absolute -right-1/4 -top-1/4 h-[70%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(133_240_212/0.16),transparent)]" />
        <div className="cw-grain absolute inset-0" />
      </div>

      {/* ── Opening curtain ── */}
      <div aria-hidden className="cw-curtain absolute inset-0 z-20 bg-night" />

      {/* ── Content ── */}
      <m.div style={reduce ? undefined : { y: contentY, opacity: contentOpacity }} className="relative z-10 flex flex-1 items-end md:items-center">
        <div className="mx-auto w-full max-w-7xl px-5 pb-28 pt-40 sm:px-6 md:pb-24">
          <div className="max-w-3xl">
            <p className="cw-rise cw-eyebrow inline-flex items-center gap-3 text-aqua" style={{ animationDelay: "0.55s" }}>
              <span aria-hidden className="h-px w-8 bg-aqua/70" />
              {labels.kicker}
            </p>
            <h1
              id="hero-title"
              className="cw-display mt-6 text-balance text-[2.6rem] leading-[1.04] [text-shadow:0_2px_24px_rgb(11_31_58/0.35)] sm:text-[3.4rem] lg:text-[4.6rem]"
            >
              {words.map((w, i) => (
                <span key={`${w}-${i}`}>
                  <span className="cw-word" style={{ animationDelay: `${0.7 + i * 0.07}s` }}>
                    {w}
                  </span>
                  {i < words.length - 1 ? " " : null}
                </span>
              ))}
            </h1>
            <p
              className="cw-rise mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/[0.88] [text-shadow:0_1px_16px_rgb(11_31_58/0.4)]"
              style={{ animationDelay: `${0.9 + words.length * 0.07}s` }}
            >
              {labels.lead}
            </p>
            <div
              className="cw-rise mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
              style={{ animationDelay: `${1.05 + words.length * 0.07}s` }}
            >
              <Link href="/contact?reason=volunteer" className={buttonClass("glass", "lg", "w-full sm:w-auto")}>
                {labels.ctaMission}
                <ArrowGlyph />
              </Link>
              <Link href="/donate" className={buttonClass("donate", "lg", "w-full sm:w-auto")}>
                {labels.ctaGive}
              </Link>
            </div>
            <a
              href="#film"
              className="cw-rise mt-6 inline-flex min-h-11 items-center gap-2.5 rounded-full text-sm font-semibold text-white/85 transition-colors hover:text-white focus-visible:outline-aqua"
              style={{ animationDelay: `${1.2 + words.length * 0.07}s` }}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 backdrop-blur">
                <svg aria-hidden width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 4v16l13-8z" />
                </svg>
              </span>
              {labels.watch}
            </a>
          </div>
        </div>
      </m.div>

      {/* ── Bottom bar: scroll cue + film control ── */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="mx-auto flex max-w-7xl items-end justify-end px-5 pb-6 sm:px-6 md:justify-between md:pb-8">
          <a
            href="#impact-title"
            className="cw-rise group hidden flex-col items-center gap-2 rounded-full p-2 md:flex text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75 hover:text-white focus-visible:outline-aqua"
            style={{ animationDelay: "2.2s" }}
          >
            <span className="relative block h-12 w-px overflow-hidden bg-white/25">
              <span className="cw-scroll-cue absolute inset-x-0 top-0 h-1/3 bg-aqua" />
            </span>
            {labels.scroll}
          </a>
          <button
            type="button"
            onClick={togglePause}
            className="cw-rise inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/25 backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-aqua"
            style={{ animationDelay: "2.2s" }}
            aria-pressed={paused}
          >
            <span className="sr-only">{paused ? labels.play : labels.pause}</span>
            {paused ? (
              <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 4v16l13-8z" />
              </svg>
            ) : (
              <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
