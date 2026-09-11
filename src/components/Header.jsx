import { DRIVE_URL } from "../constants.js";
import Tabs from "./Tabs.jsx";
import "./Header.css";

const LEGEND = [
  { key: "inPerson", label: "In person" },
  { key: "zoom", label: "Zoom / virtual" },
  { key: "tbd", label: "Location TBC" },
];

const markUrl = `${import.meta.env.BASE_URL}alpfa-mark.png`;

export default function Header({ activeTab, onTabChange }) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__top">
          <img
            className="site-header__mark"
            src={markUrl}
            alt="ALPFA at the University of Notre Dame"
            width="88"
            height="73"
          />
          <div className="site-header__titles">
            <p className="eyebrow">University of Notre Dame</p>
            <h1>ALPFA Board Office Hours</h1>
            <p className="lede">
              Pick a board member, choose a 30 minute time inside their weekly
              window, and add it straight to your Google Calendar. The invite
              goes to both of you (all times EST).
            </p>
          </div>
        </div>

        <ul className="legend">
          {LEGEND.map((item) => (
            <li key={item.key} className={`legend__item legend--${item.key}`}>
              {item.label}
            </li>
          ))}
        </ul>

        <Tabs active={activeTab} onChange={onTabChange}>
          <a
            className="tabs__drive"
            href={DRIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Recruiting Resources
            <span aria-hidden="true">↗</span>
          </a>
        </Tabs>
      </div>
    </header>
  );
}
