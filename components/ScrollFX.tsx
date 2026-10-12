"use client";

import { useEffect } from "react";

/**
 * Page-wide scroll behaviour: progress bar, compact nav, active section link,
 * reveal-on-scroll, and magnetic buttons. Renders only the progress bar.
 */
export default function ScrollFX() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = document.querySelector<HTMLElement>(".nav");
    const bar = document.querySelector<HTMLElement>(".progress");
    let raf = 0;

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = root.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        bar?.style.setProperty("--progress", p.toFixed(4));
        nav?.classList.toggle("is-scrolled", window.scrollY > 24);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // active section link
    const links = new Map<string, HTMLAnchorElement>();
    document
      .querySelectorAll<HTMLAnchorElement>('.nav nav a[href^="#"]')
      .forEach((a) => links.set(a.getAttribute("href")!.slice(1), a));
    const sections = [...links.keys()]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const a = links.get(e.target.id);
          if (!a) return;
          if (e.isIntersecting) {
            links.forEach((l) => l.removeAttribute("aria-current"));
            a.setAttribute("aria-current", "true");
          } else if (a.getAttribute("aria-current")) {
            a.removeAttribute("aria-current");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => spy.observe(s));

    // reveal on scroll: replays in both directions, entering from the side you scroll toward
    root.classList.add("fx");
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const reveal = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) {
            el.dataset.reveal = "in";
          } else {
            el.dataset.reveal = e.boundingClientRect.top < 0 ? "above" : "below";
          }
        });
      },
      { rootMargin: "-6% 0px -10% 0px", threshold: [0, 0.12] },
    );
    targets.forEach((t) => {
      t.dataset.reveal = "below";
      reveal.observe(t);
    });

    // magnetic buttons (mouse only)
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let magnet: HTMLElement | null = null;
    const move = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>(".btn");
      if (magnet && magnet !== el) {
        magnet.style.removeProperty("--mx");
        magnet.style.removeProperty("--my");
      }
      magnet = el;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width - 0.5) * 10}px`);
      el.style.setProperty("--my", `${((e.clientY - r.top) / r.height - 0.5) * 8}px`);
    };
    if (fine && !reduce) document.addEventListener("pointermove", move);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
      spy.disconnect();
      reveal.disconnect();
      root.classList.remove("fx");
    };
  }, []);

  return <div className="progress" aria-hidden="true" />;
}
