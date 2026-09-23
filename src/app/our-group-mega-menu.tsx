"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import arrowDown from "../../assets/arrow-down.svg";
import aboutCard from "../../assets/mega menu images/About.jpg";
import careersCard from "../../assets/mega menu images/Careers.jpg";
import contactCard from "../../assets/mega menu images/Contact us.jpg";
import { acquireMegaLock, releaseMegaLock } from "./mega-menu-lock";
import { useMegaMenuDismiss } from "./use-mega-menu-dismiss";

const cards = [
  { image: aboutCard, title: "About", caption: "DISCOVER OUR STORY AND VALUES", href: "#about" },
  { image: careersCard, title: "Careers", caption: "JOIN OUR GROWING TEAM", href: "#careers" },
  { image: contactCard, title: "Contact", caption: "GET IN TOUCH TODAY", href: "/contact/" },
];

export default function OurGroupMegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const beginClose = (restoreMobileNav = false) => {
    setIsClosing(true);
    closeTimer.current = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      if (restoreMobileNav) {
        window.dispatchEvent(new CustomEvent("mega-menu-close"));
      }
    }, 350);
  };

  useEffect(() => {
    const handleOtherMenu = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== "group" && isOpen) {
        beginClose();
      }
    };
    window.addEventListener("mega-menu-open", handleOtherMenu);
    return () => {
      window.removeEventListener("mega-menu-open", handleOtherMenu);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!(isOpen || isClosing)) {
      return;
    }
    acquireMegaLock();
    return () => releaseMegaLock();
  }, [isOpen, isClosing]);

  useMegaMenuDismiss({
    isOpen,
    isClosing,
    panelId: "our-group-mega-panel",
    triggerSelector: ".business-menu.is-open > .business-menu-trigger",
    onDismiss: beginClose,
  });

  const toggleMenu = () => {
    if (isOpen) {
      beginClose();
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

      {(isOpen || isClosing) && isMounted && createPortal(
        <div className={`our-group-mega-panel${isClosing ? " is-closing" : ""}`} id="our-group-mega-panel">
          <div className="mega-panel-toolbar">
            <p className="mega-panel-title">Our Group</p>
            <button className="mega-menu-close" type="button" aria-label="Close our group menu" onClick={() => beginClose(true)}>
              <span />
              <span />
            </button>
          </div>
          <div className="our-group-mega-cards">
            {cards.map((card) => (
              <a className="our-group-mega-card" href={card.href} key={card.title} onClick={() => beginClose()}>
                <Image src={card.image} alt="" fill sizes="(max-width: 1024px) 70vw, 320px" />
                <span className="business-mega-card-shade" />
                <span className="business-mega-card-copy">
                  <strong>{card.title}</strong>
                  <small>{card.caption}</small>
                </span>
              </a>
            ))}
          </div>
          <div className="business-mega-footer">
            <a href="/contact/" onClick={() => beginClose()}>CONTACT</a>
            <div>
              <a href="#instagram">INSTAGRAM</a>
              <a href="#facebook">FACEBOOK</a>
              <a href="#linkedin">LINKEDIN</a>
            </div>
            <span>© 2026 DOLMEN GROUP</span>
          </div>
        </div>,
        document.body,
      )}
    </li>
  );
}
