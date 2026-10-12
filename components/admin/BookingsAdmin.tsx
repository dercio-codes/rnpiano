"use client";

import { useMemo, useState } from "react";
import { DEMO_BOOKINGS, STATUSES, type BookingRecord, type BookingStatus } from "@/lib/demo-bookings";
import { downloadIcs } from "@/lib/calendar";
import { formatDate } from "@/lib/invoice";
import InvoiceBuilder from "./InvoiceBuilder";

export default function BookingsAdmin() {
  const [bookings, setBookings] = useState<BookingRecord[]>(DEMO_BOOKINGS);
  const [filter, setFilter] = useState<BookingStatus | "All">("All");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter(
      (b) =>
        (filter === "All" || b.status === filter) &&
        (!q || `${b.eventName} ${b.name} ${b.venue} ${b.email}`.toLowerCase().includes(q)),
    );
  }, [bookings, filter, query]);

  const selected = bookings.find((b) => b.id === selectedId) ?? null;
  const setStatus = (id: string, status: BookingStatus) =>
    setBookings((all) => all.map((b) => (b.id === id ? { ...b, status } : b)));

  if (selected) {
    return (
      <div className="adm-detail">
        <button type="button" className="adm-link" onClick={() => setSelectedId(null)}>← All requests</button>
        <section className="adm-card">
          <div className="adm-detail-head">
            <h2>{selected.eventName}</h2>
            <label className="field adm-status"><span>Status</span>
              <select value={selected.status} onChange={(e) => setStatus(selected.id, e.target.value as BookingStatus)}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
          </div>
          <dl className="adm-facts">
            <div><dt>Client</dt><dd>{selected.name}</dd></div>
            <div><dt>Booking</dt><dd>{selected.performance} · {selected.eventType}</dd></div>
            <div><dt>Event date</dt><dd>{formatDate(selected.date)}</dd></div>
            <div><dt>Venue</dt><dd>{selected.venue}</dd></div>
            <div><dt>Guests</dt><dd>{selected.guests || "Not given"}</dd></div>
            <div><dt>Email</dt><dd><a href={`mailto:${selected.email}`}>{selected.email}</a></dd></div>
            <div><dt>Phone</dt><dd>{selected.phone || "Not given"}</dd></div>
            <div><dt>Received</dt><dd>{formatDate(selected.createdAt)}</dd></div>
          </dl>
          <h3>Message</h3>
          <p className="adm-message">{selected.message}</p>
          {selected.status === "Confirmed" && (
            <button type="button" className="btn ghost" onClick={() => downloadIcs(selected)}>
              Add to calendar
            </button>
          )}
        </section>
        <InvoiceBuilder key={selected.id} booking={selected} />
      </div>
    );
  }

  return (
    <div>
      <div className="adm-toolbar">
        <label className="field adm-search"><span>Search</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Event, name, venue or email" />
        </label>
        <div className="adm-tabs" role="group" aria-label="Filter by status">
          {(["All", ...STATUSES] as const).map((s) => (
            <button key={s} type="button" className={filter === s ? "on" : ""} aria-pressed={filter === s} onClick={() => setFilter(s)}>
              {s}
              <span>{s === "All" ? bookings.length : bookings.filter((b) => b.status === s).length}</span>
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="adm-empty">No requests match.</p>
      ) : (
        <ul className="adm-list">
          {visible.map((b) => (
            <li key={b.id}>
              <button type="button" onClick={() => setSelectedId(b.id)}>
                <span className="adm-who"><strong>{b.eventName}</strong><em>{b.name} · {b.venue}</em></span>
                <span className="adm-what">{b.performance} · {b.eventType}</span>
                <span className="adm-when">{formatDate(b.date)}</span>
                <span className={`adm-badge ${b.status.toLowerCase()}`}>{b.status}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
