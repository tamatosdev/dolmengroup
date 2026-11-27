"use client";

import Image from "next/image";
import { useLenis } from "lenis/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import domenLogo from "../../assets/domen-logo.png";
import EntertainmentMegaMenu from "./entertainment-mega-menu";
import ProjectMegaMenu from "./project-mega-menu";
import RetailMegaMenu from "./retail-mega-menu";

const leadingLinks = [
  { label: "OUR GROUP", href: "/our-group/" },
];

const simpleLinks = [
  { label: "CAREERS", href: "/career/" },
  { label: "CONTACT", href: "/contact/" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const lenis = useLenis();
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
          {leadingLinks.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                onClick={(event) => {
                  restoreMobileNavRef.current = false;
                  setIsMobileNavOpen(false);
                  // Already on this page: glide back to the top instead.
                  const trim = (path: string) => path.replace(/\/+$/, "") || "/";
                  if (pathname && trim(pathname) === trim(item.href)) {
                    event.preventDefault();
                    if (lenis) lenis.scrollTo(0);
                    else window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <ProjectMegaMenu />
          <EntertainmentMegaMenu />
          <RetailMegaMenu />
          {simpleLinks.map((item) => (
            <li key={item.label}>
              {item.href.startsWith("/") ? (
                <Link
                  href={item.href}
                  onClick={() => {
                    restoreMobileNavRef.current = false;
                    setIsMobileNavOpen(false);
                  }}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  href={item.href}
                  onClick={() => {
                    restoreMobileNavRef.current = false;
                    setIsMobileNavOpen(false);
                  }}
                >
                  {item.label}
                </a>
              )}
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
