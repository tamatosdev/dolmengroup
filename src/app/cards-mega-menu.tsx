"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import arrowDown from "../../assets/arrow-down.svg";
import { acquireMegaLock, releaseMegaLock } from "./mega-menu-lock";
import { useIsClient } from "./use-is-client";
import { useMegaMenuDismiss } from "./use-mega-menu-dismiss";

export type MegaCard = {
  image: StaticImageData;
  title: string;
  caption?: string;
  href?: string;
};

type CardsMegaMenuProps = {
  menuKey: string;
  label: string;
  title: string;
  panelId: string;
  cards: MegaCard[];
  showCopyright?: boolean;
};

type PanelPosition = {
  left: number;
};

const MEGA_MENU_TOP = 90;

export default function CardsMegaMenu({
  menuKey,
  label,
  title,
  panelId,
  cards,
  showCopyright,
}: CardsMegaMenuProps) {
  const shouldShowCopyright = showCopyright ?? cards.length > 1;
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [panelPosition, setPanelPosition] = useState<PanelPosition | null>(null);
  const isMounted = useIsClient();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const beginClose = (restoreMobileNav = false) => {
    setIsClosing(true);
    closeTimer.current = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      setPanelPosition(null);
      if (restoreMobileNav) {
        window.dispatchEvent(new CustomEvent("mega-menu-close"));
      }
    }, 350);
  };

  const updatePanelPosition = () => {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }

    // Mobile uses full-screen panel styles — skip anchor positioning.
    if (window.matchMedia("(max-width: 1024px)").matches) {
      setPanelPosition(null);
      return;
    }

    const triggerRect = trigger.getBoundingClientRect();
    const panel = panelRef.current;
    const panelWidth = panel?.offsetWidth
      || cards.length * 320 + Math.max(0, cards.length - 1) * 12 + 60;
    const viewportPadding = 16;
    const preferredLeft = triggerRect.left + triggerRect.width / 2 - panelWidth / 2;
    const maxLeft = Math.max(viewportPadding, window.innerWidth - panelWidth - viewportPadding);
    const left = Math.min(Math.max(preferredLeft, viewportPadding), maxLeft);

    setPanelPosition({ left });
  };

  useEffect(() => {
    const handleOtherMenu = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== menuKey && isOpen) {
        beginClose();
      }
    };
    window.addEventListener("mega-menu-open", handleOtherMenu);
    return () => {
      window.removeEventListener("mega-menu-open", handleOtherMenu);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, [isOpen, menuKey]);

  useEffect(() => {
    if (!(isOpen || isClosing)) {
      return;
    }
    acquireMegaLock();
    return () => releaseMegaLock();
  }, [isOpen, isClosing]);

  useLayoutEffect(() => {
    if (!(isOpen || isClosing)) {
      return;
    }

    updatePanelPosition();

    const handleReposition = () => updatePanelPosition();
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [isOpen, isClosing, cards.length]);

  useMegaMenuDismiss({
    isOpen,
    isClosing,
    panelId,
    triggerSelector: ".business-menu.is-open > .business-menu-trigger",
    onDismiss: beginClose,
  });

  const toggleMenu = () => {
    if (isOpen) {
      beginClose();
      return;
    }

    const trigger = triggerRef.current;
    if (trigger && window.matchMedia("(min-width: 1025px)").matches) {
      const triggerRect = trigger.getBoundingClientRect();
      const panelWidth = cards.length * 320 + Math.max(0, cards.length - 1) * 12 + 60;
      const viewportPadding = 16;
      const preferredLeft = triggerRect.left + triggerRect.width / 2 - panelWidth / 2;
      const maxLeft = Math.max(viewportPadding, window.innerWidth - panelWidth - viewportPadding);
      setPanelPosition({
        left: Math.min(Math.max(preferredLeft, viewportPadding), maxLeft),
      });
    } else {
      setPanelPosition(null);
    }

    window.dispatchEvent(new CustomEvent("mega-menu-open", { detail: menuKey }));
    setIsOpen(true);
  };

  return (
    <li className={`business-menu${isOpen ? " is-open" : ""}`}>
      <button
        ref={triggerRef}
        className="business-menu-trigger"
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={toggleMenu}
      >
        {label}
        <Image className="navigation-arrow" src={arrowDown} alt="" aria-hidden="true" />
      </button>

      {(isOpen || isClosing) && isMounted && createPortal(
        <div
          ref={panelRef}
          className={`our-group-mega-panel${isClosing ? " is-closing" : ""}${panelPosition ? " is-anchored" : ""}`}
          id={panelId}
          style={
            panelPosition
              ? {
                  left: panelPosition.left,
                  top: MEGA_MENU_TOP,
                  right: "auto",
                  transform: "none",
                }
              : undefined
          }
        >
          <div className="mega-panel-toolbar">
            <p className="mega-panel-title">{title}</p>
            <button
              className="mega-menu-close"
              type="button"
              aria-label={`Close ${title} menu`}
              onClick={() => beginClose(true)}
            >
              <span />
              <span />
            </button>
          </div>
          <div className="our-group-mega-cards">
            {cards.map((card) => (
              <a
                className="our-group-mega-card"
                href={card.href ?? `#${card.title.toLowerCase().replaceAll(" ", "-").replaceAll("'", "")}`}
                key={card.title}
                onClick={() => beginClose()}
              >
                <Image src={card.image} alt="" fill sizes="(max-width: 1024px) 70vw, 320px" />
                <span className="business-mega-card-shade" />
                <span className="business-mega-card-copy">
                  <strong>{card.title}</strong>
                </span>
              </a>
            ))}
          </div>
          <div className="business-mega-footer">
            <div>
              <a href="#instagram" onClick={() => beginClose()}>INSTAGRAM</a>
              <a href="#facebook" onClick={() => beginClose()}>FACEBOOK</a>
              <a href="#linkedin" onClick={() => beginClose()}>LINKEDIN</a>
            </div>
            {shouldShowCopyright ? <span>© 2026 DOLMEN GROUP</span> : null}
          </div>
        </div>,
        document.body,
      )}
    </li>
  );
}
