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
  const ctxRef = useRef<AudioContext | null>(null);
  const voices = useRef(new Map<number, () => void>());
  const [down, setDown] = useState<Set<number>>(new Set());
  const [last, setLast] = useState<string | null>(null);
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
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = (ctxRef.current ??= new AC());
    if (ctx.state === "suspended") void ctx.resume();

    const now = ctx.currentTime;
    const freq = 440 * Math.pow(2, (midi - 69) / 12);
    const master = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(5200, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 1.2);
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.32, now + 0.008);
    master.gain.exponentialRampToValueAtTime(0.12, now + 0.4);
    master.gain.exponentialRampToValueAtTime(0.03, now + 2.4);
    filter.connect(master).connect(ctx.destination);

    // soft electric-piano tone: fundamental, octave, and a short bell partial
    const parts: [OscillatorType, number, number][] = [
      ["sine", 1, 1],
      ["triangle", 2, 0.35],
      ["sine", 4.01, 0.12],
    ];
    const oscs = parts.map(([type, mult, level]) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = freq * mult;
      g.gain.value = level;
      if (mult > 3) g.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      o.connect(g).connect(filter);
      o.start(now);
      return o;
    });

    voices.current.set(midi, () => {
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), t);
      master.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
      oscs.forEach((o) => o.stop(t + 0.5));
    });

    setDown((s) => new Set(s).add(midi));
    setLast(`${NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`);
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
      void ctxRef.current?.close();
      ctxRef.current = null;
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
      <div className="piano" role="group" aria-label="Playable piano keyboard">
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
      <p className="piano-hint" aria-live="polite">
        {last ? `Playing ${last}` : "Tap the keys, or play with A to ; on your keyboard"}
      </p>
    </div>
  );
}
