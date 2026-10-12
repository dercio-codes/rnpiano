import type { BookingValues } from "@/lib/booking";

export const STATUSES = ["New", "Quoted", "Confirmed", "Declined"] as const;
export type BookingStatus = (typeof STATUSES)[number];

export type BookingRecord = BookingValues & {
  id: string;
  createdAt: string;
  status: BookingStatus;
};

// Demo data in the same shape the booking form produces. Replace with real storage later.
export const DEMO_BOOKINGS: BookingRecord[] = [
  { id: "bk-001", createdAt: "2026-10-09", status: "New", name: "Thandi Mokoena", email: "thandi.m@example.com", phone: "+27 82 555 0142", performance: "DJ Set", eventName: "Mokoena Wedding Reception", eventType: "Wedding", date: "2026-12-12", venue: "Babylonstoren, Franschhoek", guests: "150", message: "Our reception needs amapiano with an R&B slow-down for the first dance. Dinner is at 6pm and we'd like music from 8pm until midnight." },
  { id: "bk-002", createdAt: "2026-10-08", status: "Quoted", name: "Kabelo Dlamini", email: "kabelo@clubnova.example.com", phone: "+27 71 555 0198", performance: "Live Band", eventName: "Destiny Night at Club Nova", eventType: "Club night", date: "2026-11-21", venue: "Club Nova, Braamfontein, Johannesburg", guests: "400", message: "Looking for the full live band for our Destiny-themed night. Two sets of 90 minutes, sound system provided by the venue." },
  { id: "bk-003", createdAt: "2026-10-05", status: "Confirmed", name: "Lerato Nkosi", email: "lerato.nkosi@example.com", phone: "", performance: "DJ Set", eventName: "Lerato's 30th Birthday", eventType: "Private party", date: "2026-10-31", venue: "Sandton, Johannesburg", guests: "60", message: "30th birthday at our home. Mostly amapiano, some 2000s R&B. Indoor and outdoor speakers are set up." },
  { id: "bk-004", createdAt: "2026-10-02", status: "New", name: "Pieter van Wyk", email: "pieter@summitevents.example.com", phone: "+27 83 555 0177", performance: "DJ Set", eventName: "Summit Logistics Year-End Function", eventType: "Corporate event", date: "2027-02-18", venue: "CTICC, Cape Town", guests: "800", message: "Year-end function for a logistics company. We need a 3-hour set after the awards ceremony." },
  { id: "bk-005", createdAt: "2026-09-28", status: "Declined", name: "Nomsa Zulu", email: "nomsa.z@example.com", phone: "+27 60 555 0123", performance: "Live Band", eventName: "Zulu Engagement Party", eventType: "Private party", date: "2026-10-17", venue: "Umhlanga, Durban", guests: "40", message: "Short notice engagement party, hoping the full band is free this Saturday." },
  { id: "bk-006", createdAt: "2026-09-24", status: "Quoted", name: "Sipho & Aisha Patel", email: "patel.wedding@example.com", phone: "+27 84 555 0166", performance: "Live Band", eventName: "Patel Wedding", eventType: "Wedding", date: "2027-04-03", venue: "Zimbali Estate, KwaZulu-Natal", guests: "220", message: "We'd love the live band for the ceremony and reception. Open to a DJ set for the late-night part." },
  { id: "bk-007", createdAt: "2026-09-19", status: "New", name: "Refilwe Sebola", email: "refilwe@sunsetfest.example.com", phone: "+27 72 555 0109", performance: "DJ Set", eventName: "Sunset Festival 2027", eventType: "Festival", date: "2027-01-09", venue: "Sunset Festival, Magaliesburg", guests: "2500", message: "Main-stage slot, 75 minutes around sunset. Travel and accommodation covered." },
  { id: "bk-008", createdAt: "2026-09-11", status: "Confirmed", name: "Andile Khumalo", email: "andile@example.com", phone: "+27 79 555 0155", performance: "DJ Set", eventName: "Destiny Listening Party", eventType: "Other", date: "2026-11-07", venue: "Maboneng, Johannesburg", guests: "", message: "Rooftop album listening party, background mixes for 4 hours." },
];
