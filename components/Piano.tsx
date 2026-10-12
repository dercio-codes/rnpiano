"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const START = 60; // C4
const END = 84; // C6
const END_COMPACT = 72; // C5, for phones
const BLACK = new Set([1, 3, 6, 8, 10]);

const KEYMAP: Record<string, number> = {
  a: 60, w: 61, s: 62, e: 63, d: 64, f: 65, t: 66, g: 67, y: 68,
  h: 69, u: 70, j: 71, k: 72, o: 73, l: 74, p: 75, ";": 76,
};

function buildKeys(end: number) {
  const notes = Array.from({ length: end - START + 1 }, (_, i) => {
    const midi = START + i;
    const pc = midi % 12;
    return { midi, label: `${NAMES[pc]}${Math.floor(midi / 12) - 1}`, black: BLACK.has(pc) };
  });
  const whites = notes.filter((n) => !n.black);
  const blacks = notes
    .filter((n) => n.black)
    .map((n) => ({ ...n, after: whites.filter((w) => w.midi < n.midi).length }));
  return { notes, whites, blacks };
}

export default function Piano() {
  const voices = useRef(new Map<number, () => void>());
  const [down, setDown] = useState<Set<number>>(new Set());
  const pointerDown = useRef(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const { whites, blacks } = buildKeys(compact ? END_COMPACT : END);

  const start = useCallback((midi: number) => {
    if (voices.current.has(midi)) return;
    voices.current.set(midi, () => {});
    setDown((s) => new Set(s).add(midi));
  }, []);

  const stop = useCallback((midi: number) => {
    voices.current.get(midi)?.();
    voices.current.delete(midi);
    setDown((s) => {
      const n = new Set(s);
      n.delete(midi);
      return n;
    });
  }, []);

  useEffect(() => {
    const kd = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const m = KEYMAP[e.key.toLowerCase()];
      if (m !== undefined) start(m);
    };
    const ku = (e: KeyboardEvent) => {
      const m = KEYMAP[e.key.toLowerCase()];
      if (m !== undefined) stop(m);
    };
    const pu = () => {
      pointerDown.current = false;
      [...voices.current.keys()].forEach(stop);
    };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    window.addEventListener("pointerup", pu);
    window.addEventListener("pointercancel", pu);
    const voicesMap = voices.current;
    return () => {
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
      window.removeEventListener("pointerup", pu);
      window.removeEventListener("pointercancel", pu);
      voicesMap.forEach((release) => release());
      voicesMap.clear();
    };
  }, [start, stop]);

  const handlers = (midi: number) => ({
    onPointerDown: (e: React.PointerEvent) => {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      pointerDown.current = true;
      start(midi);
    },
    onPointerEnter: () => pointerDown.current && start(midi),
    onPointerLeave: () => pointerDown.current && stop(midi),
  });

  const w = 100 / whites.length;

  return (
    <div className="piano-wrap">
      <div className="piano" role="group" aria-label="Piano keyboard (silent)">
        {whites.map((n) => (
          <button
            key={n.midi}
            type="button"
            aria-label={n.label}
            data-note={n.label}
            className={`key white${down.has(n.midi) ? " is-down" : ""}`}
            {...handlers(n.midi)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (!e.repeat) start(n.midi);
              }
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter" || e.key === " ") stop(n.midi);
            }}
          />
        ))}
        {blacks.map((n) => (
          <button
            key={n.midi}
            type="button"
            aria-label={n.label}
            data-note={n.label}
            className={`key black${down.has(n.midi) ? " is-down" : ""}`}
            style={{ left: `${n.after * w - w * 0.3}%`, width: `${w * 0.6}%` }}
            {...handlers(n.midi)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (!e.repeat) start(n.midi);
              }
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter" || e.key === " ") stop(n.midi);
            }}
          />
        ))}
      </div>
    </div>
  );
}
