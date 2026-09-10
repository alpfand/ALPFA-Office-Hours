import { useState } from "react";
import { initials, photoUrl } from "../lib/slots.js";
import "./Avatar.css";

/** Headshot for a board member, falling back to initials if it fails to load. */
export default function Avatar({ member }) {
  const [failed, setFailed] = useState(false);
  const src = photoUrl(member.photo);

  if (!src || failed) {
    return (
      <div className="avatar" aria-hidden="true">
        {initials(member.name)}
      </div>
    );
  }

  return (
    <img
      className="avatar"
      src={src}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
