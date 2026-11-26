"use client";

import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  animate,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Motion primitives (Framer Motion, lazy features → small bundle).
 * MotionConfig reducedMotion="user": when the visitor asked for less motion,
 * transforms are skipped and content simply appears in its final state.
 */
export const EASE = [0.22, 1, 0.36, 1] as const;

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.7, ease: EASE }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}

/** Fades + rises into place when it enters the viewport (once). */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "header";
}) {
  const Comp = m[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const staggerChild = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

/** Parent for choreographed lists: children appear one after another. */
export function Stagger({ children, className, as = "ul" }: { children: ReactNode; className?: string; as?: "ul" | "div" | "ol" }) {
  const Comp = m[as];
  return (
    <Comp className={className} variants={staggerParent} initial="hidden" whileInView="show" viewport={{ once: true, margin: "0px 0px -10% 0px" }}>
      {children}
    </Comp>
  );
}

export function StaggerItem({ children, className, as = "li" }: { children: ReactNode; className?: string; as?: "li" | "div" }) {
  const Comp = m[as];
  return (
    <Comp className={className} variants={staggerChild}>
      {children}
    </Comp>
  );
}

/**
 * Counts up to `value` when visible. The real number is always in the HTML
 * (for search engines and screen readers); only the visible digits animate.
 */
export function CountUp({ value, suffix = "", className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || reduce || started.current) return;
    started.current = true;
    setShown(0);
    const controls = animate(0, value, {
      duration: Math.min(1.6 + value / 400, 2.4),
      ease: EASE,
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden>
        {shown.toLocaleString("en-US")}
        {suffix}
      </span>
      <span className="sr-only">
        {value.toLocaleString("en-US")}
        {suffix}
      </span>
    </span>
  );
}

/** Moves its child at a different speed than the scroll (subtle parallax). */
export function ParallaxLayer({
  children,
  speed = 0.15,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-speed * 100}px`, `${speed * 100}px`]);
  return (
    <m.div ref={ref} style={{ y }} className={className}>
      {children}
    </m.div>
  );
}

/** Animated vertical line that draws itself as the section scrolls into view. */
export function DrawLine({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const scaleY: MotionValue<number> = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <div ref={ref} aria-hidden className={className}>
      <m.div style={{ scaleY, transformOrigin: "top" }} className="h-full w-full bg-gradient-to-b from-aqua via-secondary to-transparent" />
    </div>
  );
}
