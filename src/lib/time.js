/* Time helpers. Hours are 24h decimals in Eastern time (10.5 = 10:30 am). */

import { DATE_OPTIONS } from "../constants.js";

const pad = (n) => String(n).padStart(2, "0");

/** 13.5 -> "1:30 pm", 10 -> "10 am" */
export function formatHour(hour) {
  const h24 = Math.floor(hour);
  const minutes = Math.round((hour - h24) * 60);
  const suffix = h24 >= 12 ? "pm" : "am";
  const h12 = ((h24 + 11) % 12) + 1;
  return `${h12}${minutes ? ":" + pad(minutes) : ""} ${suffix}`;
}

/** "10 am – 11:30 am" */
export const formatRange = (start, end) =>
  `${formatHour(start)}–${formatHour(end)}`;

/** ("2026-09-14", 13.5) -> "20260914T133000" — local time, no Z. */
export function toCalendarStamp(isoDate, hour) {
  const [y, m, d] = isoDate.split("-");
  const h24 = Math.floor(hour);
  const minutes = Math.round((hour - h24) * 60);
  return `${y}${m}${d}T${pad(h24)}${pad(minutes)}00`;
}

/** "2026-09-14" for a Date, in the browser's local calendar days. */
export const toIsoDate = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/**
 * The next `count` dates falling on `day` (1 = Monday … 7 = Sunday).
 * Today is included only if the window has not already ended.
 *
 * @param {number} day      1 = Monday … 7 = Sunday
 * @param {number} endHour  decimal hour the window closes, used to skip today
 * @param {number} count    how many dates to return
 */
export function upcomingDates(day, endHour = 24, count = DATE_OPTIONS) {
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  // Date.getDay(): 0 = Sunday. Our days: 7 = Sunday.
  let offset = ((day % 7) - today.getDay() + 7) % 7;

  // If it is that day already but the window has closed, start next week.
  const hourNow = now.getHours() + now.getMinutes() / 60;
  if (offset === 0 && hourNow >= endHour) offset = 7;

  const dates = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + offset + 7 * i);
    dates.push(d);
  }
  return dates;
}

export const formatDateLabel = (date) =>
  date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });
