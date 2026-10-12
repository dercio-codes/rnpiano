"use client";

import { useActionState } from "react";
import { submitBooking, type BookingState } from "@/app/actions";
import {
  EMPTY_VALUES,
  EVENT_TYPES,
  MESSAGE_MAX,
  PERFORMANCE_TYPES,
  type BookingField,
} from "@/lib/booking";

const initialState: BookingState = { ok: false, errors: {}, values: EMPTY_VALUES };

export default function BookingForm() {
  const [state, formAction, pending] = useActionState(submitBooking, initialState);
  const { errors, values } = state;

  const err = (f: BookingField) =>
    errors[f] ? (
      <span className="field-error" id={`${f}-error`}>
        {errors[f]}
      </span>
    ) : null;
  const a11y = (f: BookingField) => ({
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": errors[f] ? `${f}-error` : undefined,
  });

  return (
    <form className="booking" action={formAction} noValidate>
      <div className="status" role="status" aria-live="polite">
        {state.ok && (
          <p className="success">
            Thank you. Your request is in and RNPiano will get back to you soon.
          </p>
        )}
      </div>

      <div className="field-row">
        <label className="field">
          <span>Name</span>
          <input name="name" autoComplete="name" defaultValue={values.name} required {...a11y("name")} />
          {err("name")}
        </label>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" defaultValue={values.email} required {...a11y("email")} />
          {err("email")}
        </label>
      </div>

      <fieldset className="field choice" {...a11y("performance")}>
        <legend>What would you like to book?</legend>
        <div className="choice-options">
          {PERFORMANCE_TYPES.map((t) => (
            <label key={t} className="choice-opt">
              <input type="radio" name="performance" value={t} defaultChecked={values.performance === t} required />
              <span>{t}</span>
            </label>
          ))}
        </div>
        {err("performance")}
      </fieldset>

      <label className="field">
        <span>Event name</span>
        <input name="eventName" autoComplete="off" placeholder="e.g. Thandi & Sipho's Wedding" maxLength={100} defaultValue={values.eventName} required {...a11y("eventName")} />
        {err("eventName")}
      </label>

      <div className="field-row">
        <label className="field">
          <span>Phone / WhatsApp <em>(optional)</em></span>
          <input name="phone" type="tel" autoComplete="tel" defaultValue={values.phone} {...a11y("phone")} />
          {err("phone")}
        </label>
        <label className="field">
          <span>Event type</span>
          <select name="eventType" defaultValue={values.eventType} required {...a11y("eventType")}>
            <option value="" disabled>Select…</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {err("eventType")}
        </label>
      </div>

      <div className="field-row">
        <label className="field">
          <span>Event date</span>
          <input name="date" type="date" defaultValue={values.date} required {...a11y("date")} />
          {err("date")}
        </label>
        <label className="field">
          <span>Expected guests <em>(optional)</em></span>
          <input name="guests" type="number" inputMode="numeric" min={1} defaultValue={values.guests} {...a11y("guests")} />
          {err("guests")}
        </label>
      </div>

      <label className="field">
        <span>Venue &amp; city</span>
        <input name="venue" autoComplete="off" defaultValue={values.venue} required {...a11y("venue")} />
        {err("venue")}
      </label>

      <label className="field">
        <span>Tell us about the night</span>
        <textarea name="message" rows={5} maxLength={MESSAGE_MAX} defaultValue={values.message} required {...a11y("message")} />
        {err("message")}
      </label>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div className="hp" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <button className="btn" type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send booking request"}
      </button>
    </form>
  );
}
