"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type SectionProps = React.ComponentProps<"section">;

export type Testimonial = {
  quote: string;
  highlight: string;
  author: string;
  role?: string;
  avatar?: React.ReactNode;
};

export type HighlightTestimonialSectionProps = {
  testimonials: Testimonial[];
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  interval?: number;
  promote?: boolean;
  eyebrow?: React.ReactNode;
  sweepDuration?: number;
  highlightClassName?: string;
  className?: string;
  ref?: SectionProps["ref"];
};

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

function useReducedMotion() {
  const [reduced, setReduced] = React.useState(true);
  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reduced;
}

function splitQuote(quote: string, highlight: string) {
  const at = highlight ? quote.toLowerCase().indexOf(highlight.toLowerCase()) : -1;
  if (at < 0) return { before: quote, phrase: "", after: "" };
  return { before: quote.slice(0, at), phrase: quote.slice(at, at + highlight.length), after: quote.slice(at + highlight.length) };
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export function HighlightTestimonialSection({
  testimonials,
  index,
  defaultIndex = 0,
  onIndexChange,
  interval = 0,
  promote = true,
  eyebrow = "Why teams switch",
  sweepDuration = 700,
  highlightClassName = "",
  className = "",
  ref,
}: HighlightTestimonialSectionProps) {
  const reduced = useReducedMotion();
  const count = testimonials.length;
  const [localIndex, setLocalIndex] = React.useState(defaultIndex);
  const current = count ? Math.min(count - 1, Math.max(0, index ?? localIndex)) : 0;
  const item = testimonials[current];
  const [paused, setPaused] = React.useState(false);
  const [phase, setPhase] = React.useState("idle" as "idle" | "sweeping" | "promoted");
  const quoteRef = React.useRef(null as HTMLQuoteElement | null);
  const markRef = React.useRef(null as HTMLElement | null);
  const headlineRef = React.useRef(null as HTMLHeadingElement | null);
  const animations = React.useRef([] as Animation[]);
  const timer = React.useRef(0);
  const mounted = React.useRef(false);

  const go = React.useCallback((next: number) => {
    if (!count) return;
    const wrapped = ((next % count) + count) % count;
    if (index === undefined) setLocalIndex(wrapped);
    onIndexChange?.(wrapped);
  }, [count, index, onIndexChange]);

  React.useLayoutEffect(() => {
    for (const animation of animations.current) animation.cancel();
    animations.current = [];
    window.clearTimeout(timer.current);
    const quote = quoteRef.current;
    const mark = markRef.current;
    const headline = headlineRef.current;
    if (!quote) return;
    const first = !mounted.current;
    mounted.current = true;
    if (reduced || typeof quote.animate !== "function") { setPhase("promoted"); return; }
    setPhase("sweeping");
    if (!first) animations.current.push(quote.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 360, easing: EASE }));
    if (mark) {
      animations.current.push(mark.animate([{ backgroundSize: "0% 100%" }, { backgroundSize: "100% 100%" }], { duration: sweepDuration, delay: first ? 400 : 300, easing: EASE, fill: "both" }));
    }
    if (headline && promote) {
      const promoteAt = (first ? 400 : 300) + sweepDuration - 120;
      headline.style.opacity = "0";
      timer.current = window.setTimeout(() => {
        const from = (mark ?? quote).getBoundingClientRect();
        const to = headline.getBoundingClientRect();
        headline.style.opacity = "";
        const sx = Math.min(1.4, Math.max(0.5, from.width / Math.max(1, to.width)));
        const sy = Math.min(1.4, Math.max(0.5, from.height / Math.max(1, to.height)));
        animations.current.push(headline.animate([
          { transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${sx}, ${sy})`, opacity: 0.4 },
          { transform: "translate(0, 0) scale(1, 1)", opacity: 1 },
        ], { duration: 520, easing: EASE }));
        setPhase("promoted");
      }, promoteAt);
    } else {
      timer.current = window.setTimeout(() => setPhase("promoted"), (first ? 400 : 300) + sweepDuration);
    }
    return () => { window.clearTimeout(timer.current); };
  }, [current, reduced]);

  React.useEffect(() => {
    if (!interval || paused || count < 2 || reduced) return;
    const id = window.setInterval(() => go(current + 1), interval);
    return () => window.clearInterval(id);
  }, [interval, paused, count, current, go, reduced]);

  React.useEffect(() => () => { for (const animation of animations.current) animation.cancel(); window.clearTimeout(timer.current); }, []);

  if (!item) return null;
  const parts = splitQuote(item.quote, item.highlight);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") { event.preventDefault(); go(current + 1); }
    else if (event.key === "ArrowLeft") { event.preventDefault(); go(current - 1); }
  };

  return (
    <section
      ref={ref}
      data-slot="highlight-testimonial-section"
      data-index={current}
      data-phase={phase}
      aria-roledescription="carousel"
      aria-label="Customer testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false); }}
      className={`w-full ${className}`}
    >
      <div className="mb-5 min-h-[4.5rem]">
        {eyebrow && <p data-eyebrow className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">{eyebrow}</p>}
        {promote && (
          <h2 ref={headlineRef} key={current} data-promoted className="origin-top-left text-[22px] font-semibold leading-tight tracking-tight will-change-transform" aria-live="polite">
            “{parts.phrase || item.quote}”
          </h2>
        )}
      </div>
      <figure data-card className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <blockquote ref={quoteRef} key={`q-${current}`} data-quote className="text-[15px] leading-relaxed text-card-foreground">
          {parts.before}
          {parts.phrase && (
            <mark
              ref={markRef}
              data-highlight
              className={`rounded-sm bg-transparent bg-linear-to-r from-chart-4/50 to-chart-4/50 bg-left bg-no-repeat px-0.5 text-foreground [background-size:0%_100%] dark:from-chart-2/35 dark:to-chart-2/35 ${highlightClassName}`}
            >
              {parts.phrase}
            </mark>
          )}
          {parts.after}
        </blockquote>
        <figcaption className="mt-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {typeof item.avatar === "string" ? <img src={item.avatar} alt="" className="size-9 rounded-full object-cover" /> : item.avatar ?? <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-chart-2/15 font-mono text-xs font-semibold">{initials(item.author)}</span>}
            <div className="min-w-0"><p data-author className="truncate text-sm font-medium">{item.author}</p>{item.role && <p className="truncate text-xs text-muted-foreground">{item.role}</p>}</div>
          </div>
          <div className="flex items-center gap-2">
            <div role="group" aria-label="Choose a testimonial" onKeyDown={onKeyDown} className="flex items-center gap-1.5">
              {testimonials.map((entry, i) => (
                <button key={entry.author + i} type="button" data-dot={i} aria-label={`Show testimonial ${i + 1} of ${count}`} aria-pressed={i === current} onClick={() => go(i)} className={`h-1.5 rounded-full outline-none transition-[width,background-color] duration-300 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card ${i === current ? "w-5 bg-chart-2" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"}`} />
              ))}
            </div>
            <button type="button" data-prev aria-label="Previous testimonial" onClick={() => go(current - 1)} className="inline-flex size-7 items-center justify-center rounded-full border border-border text-muted-foreground outline-none transition-colors motion-reduce:transition-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"><ArrowLeft className="size-3.5" aria-hidden="true" /></button>
            <button type="button" data-next aria-label="Next testimonial" onClick={() => go(current + 1)} className="inline-flex size-7 items-center justify-center rounded-full border border-border text-muted-foreground outline-none transition-colors motion-reduce:transition-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"><ArrowRight className="size-3.5" aria-hidden="true" /></button>
          </div>
        </figcaption>
      </figure>
    </section>
  );
}

export default HighlightTestimonialSection;
