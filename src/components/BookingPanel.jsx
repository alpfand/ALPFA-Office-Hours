import { useEffect, useMemo, useState } from "react";
import { DAYS, MEETING_HOURS } from "../constants.js";
import {
  formatHour,
  formatRange,
  upcomingDates,
  toIsoDate,
  formatDateLabel,
} from "../lib/time.js";
import { meetingStarts, whereText } from "../lib/slots.js";
import { googleCalendarUrl, icsDataUri } from "../lib/calendar.js";
import Avatar from "./Avatar.jsx";
import "./BookingPanel.css";

const EMPTY = { name: "", email: "", topic: "" };

/** Modal for turning a weekly window into a dated 30-minute booking. */
export default function BookingPanel({ slot, onClose }) {
  const member = slot.member;

  const dates = useMemo(
    () => upcomingDates(slot.day, slot.end),
    [slot.day, slot.end],
  );
  const starts = useMemo(() => meetingStarts(slot), [slot]);

  const [date, setDate] = useState(() => toIsoDate(dates[0]));
  const [startHour, setStartHour] = useState(starts[0]);
  const [form, setForm] = useState(EMPTY);

  // Reset whenever a different window is opened.
  useEffect(() => {
    setDate(toIsoDate(dates[0]));
    setStartHour(starts[0]);
    setForm(EMPTY);
  }, [dates, starts]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const booking = { member, slot, date, startHour, ...form };
  const ready = form.name.trim() && form.email.trim();

  return (
    <div
      className="scrim"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
      >
        <div className="panel__header">
          <Avatar member={member} />
          <div className="panel__identity">
            <h2 id="booking-title">{member.name}</h2>
            <p className="panel__role">{member.role}</p>
            <p className="panel__window">
              <strong>
                {DAYS[slot.day - 1]}s, {formatRange(slot.start, slot.end)}
              </strong>
              <span>{whereText(slot.where)}</span>
            </p>
            {member.zoom && (
              <a
                className="panel__zoom"
                href={member.zoom}
                target="_blank"
                rel="noopener noreferrer"
              >
                Join their Zoom room
              </a>
            )}
          </div>
          <button className="panel__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="panel__body">
          <div className="panel__row">
            <div>
              <label htmlFor="booking-date">Date</label>
              <select
                id="booking-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              >
                {dates.map((d) => (
                  <option key={toIsoDate(d)} value={toIsoDate(d)}>
                    {formatDateLabel(d)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="booking-start">Start time</label>
              <select
                id="booking-start"
                value={startHour}
                onChange={(e) => setStartHour(Number(e.target.value))}
              >
                {starts.map((h) => (
                  <option key={h} value={h}>
                    {formatHour(h)} – {formatHour(h + MEETING_HOURS)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="hint">Each meeting is 30 minutes.</p>

          <label htmlFor="booking-name">Your name</label>
          <input
            id="booking-name"
            value={form.name}
            onChange={set("name")}
            placeholder="e.g. Jordan Rivera"
            autoComplete="name"
          />

          <label htmlFor="booking-email">Your email</label>
          <input
            id="booking-email"
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="you@nd.edu"
            autoComplete="email"
          />
          <p className="hint">
            {member.email
              ? `The invite goes to ${member.email} and to you.`
              : `${member.name}'s email isn't on file yet — forward the invite to them.`}
          </p>

          <label htmlFor="booking-topic">
            What do you want to talk about? <span>(optional)</span>
          </label>
          <input
            id="booking-topic"
            value={form.topic}
            onChange={set("topic")}
            placeholder="Resume review, recruiting, club questions…"
          />

          <div className="panel__actions">
            <a
              className="btn"
              href={ready ? googleCalendarUrl(booking) : undefined}
              aria-disabled={!ready}
              target="_blank"
              rel="noopener noreferrer"
            >
              Add to Google Calendar
            </a>
            <a
              className="btn secondary"
              href={ready ? icsDataUri(booking) : undefined}
              aria-disabled={!ready}
              download="alpfa-office-hours.ics"
            >
              Download .ics
            </a>
          </div>

          {!ready && (
            <p className="hint panel__note">
              Add your name and email to book this time.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
