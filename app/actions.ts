"use server";

import {
  EMPTY_VALUES,
  readValues,
  validateBooking,
  type BookingErrors,
  type BookingValues,
} from "@/lib/booking";

export type BookingState = {
  ok: boolean;
  errors: BookingErrors;
  values: BookingValues;
};

export async function submitBooking(
  _prev: BookingState,
  formData: FormData,
): Promise<BookingState> {
  // Honeypot: real visitors never see or fill this field.
  if (formData.get("website")) {
    return { ok: true, errors: {}, values: EMPTY_VALUES };
  }

  const values = readValues(formData);
  const errors = validateBooking(values);
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors, values };
  }

  // TODO: deliver the request (email / database). For now it is only logged.
  console.log("[booking request]", values);

  return { ok: true, errors: {}, values: EMPTY_VALUES };
}
