import { useMemo, useState } from "react";
import { MEMBERS } from "./data/members.js";
import { TABS } from "./constants.js";
import { flattenSlots } from "./lib/slots.js";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ScheduleView from "./components/ScheduleView.jsx";
import BoardGrid from "./components/BoardGrid.jsx";
import BookingPanel from "./components/BookingPanel.jsx";
import "./App.css";

const tabFromHash = () => {
  const id = window.location.hash.replace("#", "");
  return TABS.some((t) => t.id === id) ? id : TABS[0].id;
};

export default function App() {
  const [tab, setTab] = useState(tabFromHash);
  const [activeSlot, setActiveSlot] = useState(null);

  const slots = useMemo(() => flattenSlots(MEMBERS), []);

  const changeTab = (id) => {
    setTab(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  const bookSlot = (slot) => setActiveSlot(slot);
  const bookMember = (member) =>
    setActiveSlot(slots.find((s) => s.member === member));

  return (
    <>
      <Header activeTab={tab} onTabChange={changeTab} />

      <main className="site-main">
        <section
          id="view-schedule"
          role="tabpanel"
          aria-labelledby="tab-schedule"
          hidden={tab !== "schedule"}
        >
          <ScheduleView slots={slots} onBook={bookSlot} />
        </section>

        <section
          id="view-board"
          role="tabpanel"
          aria-labelledby="tab-board"
          hidden={tab !== "board"}
        >
          <BoardGrid members={MEMBERS} onBook={bookMember} />
        </section>
      </main>

      <Footer />

      {activeSlot && (
        <BookingPanel
          slot={activeSlot}
          onClose={() => setActiveSlot(null)}
        />
      )}
    </>
  );
}
