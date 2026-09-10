import { TABS } from "../constants.js";
import "./Tabs.css";

export default function Tabs({ active, onChange, children }) {
  return (
    <nav className="tabs" role="tablist">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          id={`tab-${tab.id}`}
          aria-selected={active === tab.id}
          aria-controls={`view-${tab.id}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
      {children}
    </nav>
  );
}
