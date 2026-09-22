"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import domenLogo from "../../assets/domen-logo.png";
import BusinessMegaMenu from "./business-mega-menu";
import OurGroupMegaMenu from "./our-group-mega-menu";
import ProjectMegaMenu from "./project-mega-menu";

const simpleLinks = [
  { label: "REIT", href: "#reit" },
  { label: "UPDATES", href: "#updates" },
];

export default function SiteHeader() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const isMobileNavOpenRef = useRef(false);
  const restoreMobileNavRef = useRef(false);

  useEffect(() => {
    isMobileNavOpenRef.current = isMobileNavOpen;
  }, [isMobileNavOpen]);

  useEffect(() => {
    const handleMegaOpen = () => {
      if (isMobileNavOpenRef.current) {
        restoreMobileNavRef.current = true;
      }
      setIsMobileNavOpen(false);
    };

    const handleMegaClose = () => {
      if (
        restoreMobileNavRef.current &&
        window.matchMedia("(max-width: 1024px)").matches
      ) {
        setIsMobileNavOpen(true);
      }
      restoreMobileNavRef.current = false;
    };

    const closeMobileNav = () => {
      restoreMobileNavRef.current = false;
      setIsMobileNavOpen(false);
    };

    const handleResize = () => {
      if (window.matchMedia("(min-width: 1025px)").matches) {
        restoreMobileNavRef.current = false;
        setIsMobileNavOpen(false);
      }
    };

    window.addEventListener("mega-menu-open", handleMegaOpen);
    window.addEventListener("mega-menu-close", handleMegaClose);
    window.addEventListener("mobile-nav-close", closeMobileNav);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mega-menu-open", handleMegaOpen);
      window.removeEventListener("mega-menu-close", handleMegaClose);
      window.removeEventListener("mobile-nav-close", closeMobileNav);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("mobile-nav-open", isMobileNavOpen);
    return () => document.body.classList.remove("mobile-nav-open");
  }, [isMobileNavOpen]);

  useEffect(() => {
    if (!isMobileNavOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        restoreMobileNavRef.current = false;
        setIsMobileNavOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileNavOpen]);

  return (
    <header className={`site-header${isMobileNavOpen ? " is-mobile-open" : ""}`}>
      <div className="site-header-bar">
        <Link className="brand" href="/" aria-label="Dolmen home">
          <Image src={domenLogo} alt="Dolmen" priority />
        </Link>

        <button
          className={`mobile-nav-toggle${isMobileNavOpen ? " is-open" : ""}`}
          type="button"
          aria-expanded={isMobileNavOpen}
          aria-controls="primary-navigation"
          aria-label={isMobileNavOpen ? "Close menu" : "Open menu"}
          onClick={() => {
            restoreMobileNavRef.current = false;
            setIsMobileNavOpen((open) => !open);
          }}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav
        className={`site-nav${isMobileNavOpen ? " is-open" : ""}`}
        id="primary-navigation"
        aria-label="Primary navigation"
      >
        <ul className="navigation-list">
          <OurGroupMegaMenu />
          <ProjectMegaMenu />
          <BusinessMegaMenu />
          {simpleLinks.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                onClick={() => {
                  restoreMobileNavRef.current = false;
                  setIsMobileNavOpen(false);
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {isMobileNavOpen && (
        <button
          className="mobile-nav-backdrop"
          type="button"
          aria-label="Close menu"
          onClick={() => {
            restoreMobileNavRef.current = false;
            setIsMobileNavOpen(false);
          }}
        />
      )}
    </header>
  );
}
