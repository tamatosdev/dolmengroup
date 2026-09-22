"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import arrowDown from "../../assets/arrow-down.svg";
import menuIcon from "../../assets/menu-icon.png";
import sindbadWonderland from "../../assets/sindbad-wonderland.png";
import griordano from "../../assets/griordano.png";
import balabala from "../../assets/balabala.png";
import { acquireMegaLock, releaseMegaLock } from "./mega-menu-lock";

type BusinessTab = "ENTERTAINMENT" | "RETAIL";

const businessItems = {
  ENTERTAINMENT: [
    { image: sindbadWonderland, title: "Sindbad's Wonderland", caption: "BRINGING FAMILIES TOGETHER" },
  ],
  RETAIL: [
    { image: griordano, title: "Giordano", caption: "BRINGING PREMIUM FASHION" },
    { image: balabala, title: "Bala Bala", caption: "GROWING IN STYLE" },
  ],
};

export default function BusinessMegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeTab, setActiveTab] = useState<BusinessTab>("ENTERTAINMENT");
  const [isMounted, setIsMounted] = useState(false);
  const items = businessItems[activeTab];

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
      if ((event as CustomEvent<string>).detail !== "business" && isOpen) {
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

  const toggleMenu = () => {
    if (isOpen) {
      beginClose();
      return;
    }
    window.dispatchEvent(new CustomEvent("mega-menu-open", { detail: "business" }));
    setIsOpen(true);
  };

  return (
    <li className={`business-menu${isOpen ? " is-open" : ""}`}>
      <button
        className="business-menu-trigger"
        type="button"
        aria-expanded={isOpen}
        aria-controls="business-mega-panel"
        onClick={toggleMenu}
      >
        BUSINESSES
        <Image className="navigation-arrow" src={arrowDown} alt="" aria-hidden="true" />
      </button>

      {(isOpen || isClosing) && isMounted && createPortal(
        <div className={`business-mega-panel${isClosing ? " is-closing" : ""}`} id="business-mega-panel">
          <div className="mega-panel-toolbar">
            <p className="mega-panel-title">Businesses</p>
            <button className="mega-menu-close" type="button" aria-label="Close businesses menu" onClick={() => beginClose(true)}>
              <span />
              <span />
            </button>
          </div>
          <div className="business-mega-tabs" role="tablist" aria-label="Business categories">
            {(Object.keys(businessItems) as BusinessTab[]).map((tab) => (
              <button
                className={`business-mega-tab${activeTab === tab ? " is-active" : ""}`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                key={tab}
                onClick={() => setActiveTab(tab)}
              >
                {activeTab === tab && (
                  <Image className="business-mega-tab-icon" src={menuIcon} alt="" aria-hidden="true" />
                )}
                {tab}
              </button>
            ))}
          </div>
          <div className="business-mega-cards" key={activeTab}>
            {items.map((item) => (
              <a
                className="business-mega-card"
                href={`#${item.title.toLowerCase().replaceAll(" ", "-")}`}
                key={item.title}
                onClick={beginClose}
              >
                <Image src={item.image} alt="" fill sizes="(max-width: 1024px) 70vw, 220px" />
                <span className="business-mega-card-shade" />
                <span className="business-mega-card-copy">
                  <strong>{item.title}</strong>
                  <small>{item.caption}</small>
                </span>
              </a>
            ))}
          </div>
          <div className="business-mega-footer">
            <a href="#contact" onClick={beginClose}>CONTACT</a>
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
