import { DAYS, DAY_START, DAY_END, HOUR_PX } from "../constants.js";
import { formatHour } from "../lib/time.js";
import { assignLanes, slotsForDay } from "../lib/slots.js";
import SlotButton from "./SlotButton.jsx";
import "./WeekGrid.css";

const GRID_HEIGHT = (DAY_END - DAY_START) * HOUR_PX;
const HOUR_LABELS = Array.from(
  { length: DAY_END - DAY_START + 1 },
  (_, i) => DAY_START + i,
);

/** 1 = Monday … 7 = Sunday, matching the `day` field in members.js. */
const todayIndex = () => ((new Date().getDay() + 6) % 7) + 1;

/** Weekdays always show; weekend days only when someone holds hours then. */
const visibleDays = (slots) =>
  [1, 2, 3, 4, 5, 6, 7].filter(
    (day) => day <= 5 || slotsForDay(slots, day).length > 0,
  );

function slotStyle(slot) {
  const width = 100 / slot.laneCount;
  return {
    top: (slot.start - DAY_START) * HOUR_PX + 2,
    height: (slot.end - slot.start) * HOUR_PX - 5,
    left: `calc(${slot.lane * width}% + 4px)`,
    right: `calc(${(slot.laneCount - 1 - slot.lane) * width}% + 4px)`,
  };
}

function DayColumn({ day, slots, isToday, onBook }) {
  return (
    <div className={`week__col${isToday ? " week__col--today" : ""}`}>
      {assignLanes(slotsForDay(slots, day)).map((slot) => (
        <SlotButton
          key={`${slot.memberIndex}-${slot.day}-${slot.start}`}
          slot={slot}
          variant="grid"
          style={slotStyle(slot)}
          onBook={onBook}
        />
      ))}
    </div>
  );
}

/** Desktop view: day columns with an hour ruler down the left. */
export default function WeekGrid({ slots, onBook }) {
  const today = todayIndex();
  const days = visibleDays(slots);

  const vars = {
    "--grid-height": `${GRID_HEIGHT}px`,
    "--hour": `${HOUR_PX}px`,
    gridTemplateColumns: `64px repeat(${days.length}, 1fr)`,
  };

  return (
    <div className="week" style={vars} aria-label="Weekly office hours">
      <div className="week__corner" />
      {days.map((day) => {
        const isToday = day === today;
        return (
          <div
            className={`week__dayhead${isToday ? " week__dayhead--today" : ""}`}
            key={day}
          >
            <span className="week__dayname">{DAYS[day - 1].slice(0, 3)}</span>
            {isToday && <span className="week__todaydot">Today</span>}
          </div>
        );
      })}

      <div className="week__times">
        {HOUR_LABELS.map((hour) => (
          <div key={hour} style={{ top: (hour - DAY_START) * HOUR_PX }}>
            {formatHour(hour)}
          </div>
        ))}
      </div>

      {days.map((day) => (
        <DayColumn
          key={day}
          day={day}
          slots={slots}
          isToday={day === today}
          onBook={onBook}
        />
      ))}
    </div>
  );
}
