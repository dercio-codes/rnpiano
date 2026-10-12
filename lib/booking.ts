export const EVENT_TYPES = [
  "Club night",
  "Festival",
  "Private party",
  "Wedding",
  "Corporate event",
  "Other",
] as const;

export const PERFORMANCE_TYPES = ["DJ Set", "Live Band"] as const;

export const MESSAGE_MAX = 1000;

export type BookingField =
  | "name"
  | "email"
  | "phone"
  | "performance"
  | "eventName"
  | "eventType"
  | "date"
  | "venue"
  | "guests"
  | "message";

export type BookingValues = Record<BookingField, string>;
export type BookingErrors = Partial<Record<BookingField, string>>;

export const EMPTY_VALUES: BookingValues = {
  name: "",
  email: "",
  phone: "",
  performance: "",
  eventName: "",
  eventType: "",
  date: "",
  venue: "",
  guests: "",
  message: "",
};

export function readValues(formData: FormData): BookingValues {
  const values = { ...EMPTY_VALUES };
  for (const key of Object.keys(values) as BookingField[]) {
    const raw = formData.get(key);
    values[key] = typeof raw === "string" ? raw.trim() : "";
  }
  return values;
}

export function validateBooking(
  v: BookingValues,
  today = new Date(),
): BookingErrors {
  const errors: BookingErrors = {};

  if (!v.name) errors.name = "Please tell us your name.";
  else if (v.name.length > 100) errors.name = "That name is too long.";

  if (!v.email) errors.email = "We need an email to reply to.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email))
    errors.email = "That email doesn't look right.";

  if (v.phone && !/^[+()\d\s-]{7,20}$/.test(v.phone))
    errors.phone = "Use digits, spaces, + or - only.";

  if (!(PERFORMANCE_TYPES as readonly string[]).includes(v.performance))
    errors.performance = "Choose a DJ set or a live band.";

  if (!v.eventName) errors.eventName = "Give the event a name.";
  else if (v.eventName.length > 100) errors.eventName = "Keep the name under 100 characters.";

  if (!(EVENT_TYPES as readonly string[]).includes(v.eventType))
    errors.eventType = "Pick the kind of event.";

  if (!v.date) errors.date = "When is the event?";
  else {
    const d = new Date(`${v.date}T00:00:00`);
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);
    if (Number.isNaN(d.getTime())) errors.date = "That date isn't valid.";
    else if (d < startOfToday) errors.date = "The date must be today or later.";
  }

  if (!v.venue) errors.venue = "Where is it happening?";
  else if (v.venue.length > 150) errors.venue = "That's too long.";

  if (v.guests) {
    const n = Number(v.guests);
    if (!Number.isInteger(n) || n < 1 || n > 100000)
      errors.guests = "Enter a whole number of guests.";
  }

  if (!v.message) errors.message = "Tell us a bit about the night.";
  else if (v.message.length > MESSAGE_MAX)
    errors.message = `Keep it under ${MESSAGE_MAX} characters.`;

  return errors;
}
