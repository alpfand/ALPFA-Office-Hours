import { DRIVE_URL } from "../constants.js";
import "./Footer.css";

const logoUrl = `${import.meta.env.BASE_URL}alpfa-logo.png`;

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <img
          className="site-footer__logo"
          src={logoUrl}
          alt="ALPFA at the University of Notre Dame"
          width="120"
          height="120"
          loading="lazy"
        />
        <div className="site-footer__text">
          <p>
            Email the board member directly at addresses in the{" "}
            <strong>Meet the board</strong> tab.
          </p>
          <p>
            Looking for resume templates, guides, and prep material? Browse the{" "}
            <a href={DRIVE_URL} target="_blank" rel="noopener noreferrer">
              Recruiting Resources Drive
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
