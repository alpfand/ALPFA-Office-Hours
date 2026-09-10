import WeekGrid from "./WeekGrid.jsx";
import AgendaList from "./AgendaList.jsx";
import "./ScheduleView.css";

/** Week grid on desktop, stacked agenda on narrow screens (CSS decides which). */
export default function ScheduleView({ slots, onBook }) {
  return (
    <>
      <div className="schedule__week">
        <WeekGrid slots={slots} onBook={onBook} />
      </div>
      <div className="schedule__agenda">
        <AgendaList slots={slots} onBook={onBook} />
      </div>
    </>
  );
}
