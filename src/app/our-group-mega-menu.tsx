"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import arrowDown from "../../assets/arrow-down.svg";
import aboutCard from "../../assets/aboutus-card.png";
import careersCard from "../../assets/careers-card.png";
import contactCard from "../../assets/contact-card.png";

const cards = [
  { image: aboutCard, title: "About", caption: "DISCOVER OUR STORY AND VALUES", href: "#about" },
  { image: careersCard, title: "Careers", caption: "JOIN OUR GROWING TEAM", href: "#careers" },
  { image: contactCard, title: "Contact", caption: "GET IN TOUCH TODAY", href: "#contact" },
];

export default function OurGroupMegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleOtherMenu = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== "group" && isOpen) {
        setIsClosing(true);
        closeTimer.current = setTimeout(() => { setIsOpen(false); setIsClosing(false); }, 350);
      }
    };
    window.addEventListener("mega-menu-open", handleOtherMenu);
    return () => {
      window.removeEventListener("mega-menu-open", handleOtherMenu);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    if (isOpen) {
      setIsClosing(true);
      closeTimer.current = setTimeout(() => { setIsOpen(false); setIsClosing(false); }, 350);
      return;
    }
    window.dispatchEvent(new CustomEvent("mega-menu-open", { detail: "group" }));
    setIsOpen(true);
  };

  return (
    <li className={`business-menu${isOpen ? " is-open" : ""}`}>
      <button
        className="business-menu-trigger"
        type="button"
        aria-expanded={isOpen}
        aria-controls="our-group-mega-panel"
        onClick={toggleMenu}
      >
        OUR GROUP
        <Image className="navigation-arrow" src={arrowDown} alt="" aria-hidden="true" />
      </button>

      {(isOpen || isClosing) && (
        <div className={`our-group-mega-panel${isClosing ? " is-closing" : ""}`} id="our-group-mega-panel">
          <div className="our-group-mega-cards">
            {cards.map((card) => (
              <a className="our-group-mega-card" href={card.href} key={card.title}>
                <Image src={card.image} alt="" fill sizes="(max-width: 540px) 160px, 220px" />
                <span className="business-mega-card-shade" />
                <span className="business-mega-card-copy">
                  <strong>{card.title}</strong>
                  <small>{card.caption}</small>
                </span>
              </a>
            ))}
          </div>
          <div className="business-mega-footer">
            <a href="#contact">CONTACT</a>
            <div>
              <a href="#instagram">INSTAGRAM</a>
              <a href="#facebook">FACEBOOK</a>
              <a href="#linkedin">LINKEDIN</a>
            </div>
            <span>© 2026 DOLMEN GROUP</span>
          </div>
        </div>
      )}
    </li>
  );
}
