import { DAYS } from "../constants.js";
import { formatRange } from "../lib/time.js";
import Avatar from "./Avatar.jsx";
import "./MemberCard.css";

function Field({ label, value }) {
  return (
    <>
      <dt>{label}</dt>
      <dd className={value ? "" : "todo"}>{value || "to be added"}</dd>
    </>
  );
}

export default function MemberCard({ member, onBook }) {
  return (
    <article className="card">
      <div className="card__top">
        <Avatar member={member} />
        <div className="card__identity">
          <h3>{member.name}</h3>
          <p className="card__role">{member.role}</p>
          <p className="card__meta">
            {[member.year, member.country].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>


      <dl>
        <Field label="Major" value={member.major} />
        <Field label="Experience" value={member.internships} />
        <Field label="Interests" value={member.interests} />
      </dl>

      <ul className="card__hours">
        {member.slots.map((s) => (
          <li key={`${s.day}-${s.start}`}>
            <span className="card__day">{DAYS[s.day - 1].slice(0, 3)}</span>
            <span className="card__time">{formatRange(s.start, s.end)}</span>
            <span className="card__where">
              {s.where || "Location to be confirmed"}
            </span>
          </li>
        ))}
      </ul>

      <div className="card__actions">
        <button
          type="button"
          className="card__book"
          onClick={() => onBook(member)}
        >
          Book a time
        </button>
        <div className="card__links">
          {member.zoom && (
            <a
              className="card__zoom"
              href={member.zoom}
              target="_blank"
              rel="noopener noreferrer"
            >
              Zoom room
            </a>
          )}
          {member.linkedin && (
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          )}
          {member.email && <a href={`mailto:${member.email}`}>Email</a>}
        </div>
      </div>
    </article>
  );
}
