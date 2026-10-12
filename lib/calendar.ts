import type { BookingRecord } from "@/lib/demo-bookings";
import { eventTitle, safeFilename } from "@/lib/invoice";

const esc = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");

// RFC 5545: lines are limited to 75 octets; continuation lines start with a space.
function fold(line: string): string {
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const bytes = enc.encode(line);
  if (bytes.length <= 75) return line;
  const parts: string[] = [];
  let start = 0;
  let limit = 75;
  while (start < bytes.length) {
    let end = Math.min(start + limit, bytes.length);
    // Don't split inside a multi-byte UTF-8 character.
    while (end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--;
    parts.push(dec.decode(bytes.slice(start, end)));
    start = end;
    limit = 74;
  }
  return parts.join("\r\n ");
}

const compact = (iso: string) => iso.replace(/-/g, "");

function nextDay(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

// All-day event on the booking date, since bookings store a date but no time.
export function bookingToIcs(b: BookingRecord, now = new Date()): string {
  const description = [
    `Booking: ${b.performance} · ${b.eventType}`,
    `Client: ${b.name}`,
    `Email: ${b.email}`,
    ...(b.phone ? [`Phone: ${b.phone}`] : []),
    ...(b.guests ? [`Guests: ${b.guests}`] : []),
    "",
    b.message,
  ].join("\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RNPiano//Bookings//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${b.id}@rnpiano.com`,
    `DTSTAMP:${now.toISOString().replace(/[-:]|\.\d{3}/g, "")}`,
    `DTSTART;VALUE=DATE:${compact(b.date)}`,
    `DTEND;VALUE=DATE:${compact(nextDay(b.date))}`,
    `SUMMARY:${esc(eventTitle(b))}`,
    `LOCATION:${esc(b.venue)}`,
    `DESCRIPTION:${esc(description)}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${esc(`Tomorrow: ${b.eventName} at ${b.venue}`)}`,
    "TRIGGER:-P1D",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

export function downloadIcs(b: BookingRecord) {
  const blob = new Blob([bookingToIcs(b)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${safeFilename(eventTitle(b))}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
