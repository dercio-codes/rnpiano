import type { BookingRecord } from "@/lib/demo-bookings";
import { SITE, SITE_URL } from "@/lib/site";

export const VAT_RATE = 0.15;

// Fill these in to have them appear on the invoice; empty values are left out.
export const BUSINESS = {
  name: "RNPiano",
  trading: "DJ ShadzO",
  lines: [
    SITE_URL.replace(/^https?:\/\//, ""),
    `Instagram @${SITE.social.instagram.split("/").filter(Boolean).pop()}`,
  ],
  email: "",
  bank: [] as string[],
};

export type LineItem = { id: string; description: string; qty: number; unitPrice: number };

export type InvoiceDraft = {
  number: string;
  issueDate: string;
  dueDate: string;
  items: LineItem[];
  vat: boolean;
  depositPct: number;
  notes: string;
};

export type Totals = { subtotal: number; vat: number; total: number; deposit: number; balance: number };

const cents = (n: number) => Math.round(n * 100);

export function computeTotals(items: LineItem[], vat: boolean, depositPct: number): Totals {
  const subtotal = items.reduce((sum, i) => sum + cents(i.qty * i.unitPrice), 0);
  const vatC = vat ? Math.round(subtotal * VAT_RATE) : 0;
  const total = subtotal + vatC;
  const pct = Math.min(100, Math.max(0, depositPct || 0));
  const deposit = Math.round((total * pct) / 100);
  return {
    subtotal: subtotal / 100,
    vat: vatC / 100,
    total: total / 100,
    deposit: deposit / 100,
    balance: (total - deposit) / 100,
  };
}

// Plain "R 12 345.67" so the PDF's built-in font renders it reliably.
export function formatZar(n: number): string {
  const [int, dec] = Math.abs(n).toFixed(2).split(".");
  return `${n < 0 ? "-" : ""}R ${int.replace(/\B(?=(\d{3})+(?!\d))/g, " ")}.${dec}`;
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });
}

const addDays = (iso: string, days: number) => {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

// "Event Name - 12 December 2026", used for the invoice and calendar event.
export const eventTitle = (b: BookingRecord) => `${b.eventName} - ${formatDate(b.date)}`;

// Strip characters that aren't allowed in file names.
export const safeFilename = (s: string) => s.replace(/[\\/:*?"<>|]+/g, "").replace(/\s+/g, " ").trim();

export function draftFor(b: BookingRecord, today = new Date()): InvoiceDraft {
  const issueDate = today.toISOString().slice(0, 10);
  const seq = b.id.replace(/\D/g, "").padStart(3, "0");
  return {
    number: `RNP-${issueDate.slice(0, 4)}-${seq}`,
    issueDate,
    dueDate: addDays(issueDate, 14),
    items: [
      {
        id: "item-1",
        description: `${b.eventName} – ${b.performance}, ${b.venue}`,
        qty: 1,
        unitPrice: 0,
      },
    ],
    vat: false,
    depositPct: 50,
    notes: "A deposit secures the date. The balance is due before the event.",
  };
}
