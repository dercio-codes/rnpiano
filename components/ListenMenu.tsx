"use client";

import { useEffect, useId, useRef, useState } from "react";
import { listenLinks } from "@/lib/catalog";

type Props = {
  title: string;
  apple?: string;
  variant?: "solid" | "ghost" | "text";
  label?: string;
};

export default function ListenMenu({ title, apple, variant = "text", label = "Listen now" }: Props) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        root.current?.querySelector<HTMLButtonElement>("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div className={`listen-menu ${variant}`} ref={root} data-open={open || undefined}>
      <button
        type="button"
        className={variant === "text" ? "listen-btn" : `btn ${variant === "ghost" ? "ghost" : ""}`}
        aria-expanded={open}
        aria-controls={id}
        aria-label={`${label}: ${title}`}
        onClick={() => setOpen((o) => !o)}
      >
        <svg className="play" viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
          <path d="M2 1.2v9.6L10.4 6z" fill="currentColor" />
        </svg>
        {label}
      </button>
      <ul id={id} className="menu" hidden={!open}>
        {listenLinks({ title, apple }).map((l) => (
          <li key={l.name}>
            <a href={l.href} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
              {l.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
