/* Builds the Google Calendar link and .ics file for a booking.

   Neither of these sends anything on its own — see README. The Google link
   opens a prefilled event the student still has to save and send. */

import { TZ, MEETING_HOURS } from "../constants.js";
import { toCalendarStamp } from "./time.js";
import { whereText } from "./slots.js";

/**
 * @typedef {object} Booking
 * @property {object} member    the board member being booked
 * @property {object} slot      the weekly window it came from
 * @property {string} date      "YYYY-MM-DD"
 * @property {number} startHour decimal hour
 * @property {string} name      student's name
 * @property {string} email     student's email
 * @property {string} topic     optional agenda note
 */

const eventTitle = ({ member, name }) =>
  `ALPFA office hours: ${member.name}${name ? " & " + name : ""}`;

const eventDetails = ({ member, name, email, topic }) =>
  [
    name ? `Member: ${name}${email ? ` (${email})` : ""}` : "",
    topic ? `Topic: ${topic}` : "",
    member.zoom ? `Zoom: ${member.zoom}` : "",
    "Booked via the ALPFA Board Office Hours page.",
  ]
    .filter(Boolean)
    .join("\n");

/**
 * Calendar location. When the member has a Zoom room the URL goes in the
 * location field too, so it is one tap from the calendar entry.
 */
const eventLocation = ({ member, slot }) =>
  member.zoom ? `${whereText(slot.where)} — ${member.zoom}` : whereText(slot.where);

/** Prefilled Google Calendar event-creation URL. */
export function googleCalendarUrl(booking) {
  const { member, date, startHour, email } = booking;
  const start = toCalendarStamp(date, startHour);
  const end = toCalendarStamp(date, startHour + MEETING_HOURS);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventTitle(booking),
    dates: `${start}/${end}`,
    ctz: TZ,
    details: eventDetails(booking),
    location: eventLocation(booking),
  });

  const guests = [member.email, email].filter(Boolean);
  if (guests.length) params.set("add", guests.join(","));

  return `https://calendar.google.com/calendar/render?${params}`;
}

/** RFC 5545 text, escaped per spec. */
const icsEscape = (value) =>
  String(value)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");

/** A downloadable .ics data URI for the booking. */
export function icsDataUri(booking) {
  const { member, date, startHour, name, email } = booking;
  const start = toCalendarStamp(date, startHour);
  const end = toCalendarStamp(date, startHour + MEETING_HOURS);
  const uid = `${start}-${member.name.replace(/\W/g, "")}@alpfa-officehours`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ALPFA Board Office Hours//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTART;TZID=${TZ}:${start}`,
    `DTEND;TZID=${TZ}:${end}`,
    `SUMMARY:${icsEscape(eventTitle(booking))}`,
    `LOCATION:${icsEscape(eventLocation(booking))}`,
    `DESCRIPTION:${icsEscape(eventDetails(booking))}`,
    ...(member.zoom ? [`URL:${member.zoom}`] : []),
    ...(member.email
      ? [`ATTENDEE;CN=${icsEscape(member.name)}:mailto:${member.email}`]
      : []),
    ...(email
      ? [`ATTENDEE;CN=${icsEscape(name || email)}:mailto:${email}`]
      : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
}
