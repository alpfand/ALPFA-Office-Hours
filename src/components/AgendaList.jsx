import { DAYS } from "../constants.js";
import { slotsForDay } from "../lib/slots.js";
import SlotButton from "./SlotButton.jsx";
import "./AgendaList.css";

const todayIndex = () => ((new Date().getDay() + 6) % 7) + 1;

/** Mobile view: office hours stacked day by day. */
export default function AgendaList({ slots, onBook }) {
  const today = todayIndex();

  return (
    <div className="agenda">
      {DAYS.map((dayName, i) => {
        const items = slotsForDay(slots, i + 1).sort(
          (a, b) => a.start - b.start,
        );
        if (!items.length) return null;

        return (
          <section className="agenda__day" key={dayName}>
            <h2>
              {dayName}
              {i + 1 === today && (
                <span className="agenda__today">Today</span>
              )}
            </h2>
            {items.map((slot) => (
              <SlotButton
                key={`${slot.memberIndex}-${slot.start}`}
                slot={slot}
                variant="agenda"
                onBook={onBook}
              />
            ))}
          </section>
        );
      })}
    </div>
  );
}
