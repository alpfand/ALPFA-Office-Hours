import { DAYS } from "../constants.js";
import { formatRange } from "../lib/time.js";
import { slotKind, whereText } from "../lib/slots.js";
import "./SlotButton.css";

/**
 * One office-hours window. `variant` controls how much detail is shown:
 * "grid" sits inside the week columns, "agenda" is the stacked mobile list.
 */
export default function SlotButton({ slot, variant = "grid", style, onBook }) {
  const { member } = slot;
  const range = formatRange(slot.start, slot.end);
  const place = whereText(slot.where);
  const roomy = slot.end - slot.start >= 1;

  return (
    <button
      type="button"
      className={`slot slot--${slotKind(slot)} slot--${variant}`}
      style={style}
      onClick={() => onBook(slot)}
      aria-label={`Book time with ${member.name}, ${DAYS[slot.day - 1]}s ${range}, ${place}`}
    >
      <span className="slot__time">{range}</span>
      <span className="slot__name">{member.name}</span>
      {variant === "agenda" ? (
        <>
          <span className="slot__role">{member.role}</span>
          <span className="slot__where">{place}</span>
        </>
      ) : (
        roomy && <span className="slot__where">{place}</span>
      )}
    </button>
  );
}
