"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import arrowDown from "../../assets/arrow-down.svg";
import menuIcon from "../../assets/menu-icon.png";
import dolmenMallTariqRoad from "../../assets/Project Menu/dolman-mall-tariqroad.png";
import dolmenMallLahore from "../../assets/Project Menu/dolman-mall-lahore.png";
import dolmenMallHyderi from "../../assets/Project Menu/dolman-mall-hyderi.png";
import dolmenMallClifton from "../../assets/Project Menu/Dolman-mall-clifton.png";
import dolmenCityIslamabad from "../../assets/Project Menu/dolman-city-islamabad.png";
import skyTowers from "../../assets/Project Menu/sky-towers.png";
import executiveTower from "../../assets/Project Menu/executive-tower.png";
import corporateOfficeBlock from "../../assets/Project Overview/Corporate Office Block thumbnail.png";
import domencity from "../../assets/Project Menu/domencity.png";
import groveResidency from "../../assets/Project Menu/the-grove-resedency.png";
import harbourFront from "../../assets/Project Menu/the-harbor-front.png";
import { acquireMegaLock, releaseMegaLock } from "./mega-menu-lock";

type ProjectCategory = "COMMUNITY" | "MALLS" | "OFFICES" | "RESIDENCES";
type Project = { category: Exclude<ProjectCategory, "COMMUNITY">; image: typeof dolmenMallTariqRoad; title: string; caption: string };

const projects: Project[] = [
  { category: "MALLS", image: dolmenMallClifton, title: "Dolmen Mall Clifton", caption: "REVOLUTIONIZING SHOPPING EXPERIENCE" },
  { category: "MALLS", image: dolmenMallLahore, title: "Dolmen Mall Lahore", caption: "DESTINATION OF CHOICE" },
  { category: "MALLS", image: dolmenMallTariqRoad, title: "Dolmen Mall Tariq Road", caption: "AT THE HEART OF KARACHI" },
  { category: "MALLS", image: dolmenMallHyderi, title: "Dolmen Mall Hyderi", caption: "YOUR NEIGHBOURHOOD MALL" },
  { category: "OFFICES", image: harbourFront, title: "The Harbour Front", caption: "WHERE BUSINESS MEETS THE SEA" },
  { category: "OFFICES", image: skyTowers, title: "Sky Towers", caption: "ELEVATED BUSINESS, REDEFINED" },
  { category: "OFFICES", image: corporateOfficeBlock, title: "Corporate Office Block", caption: "PRESTIGE IN EVERY DETAIL" },
  { category: "OFFICES", image: executiveTower, title: "Executive Tower", caption: "THE ADDRESS OF DISTINCTION" },
  { category: "RESIDENCES", image: groveResidency, title: "The Grove Residency", caption: "A PLACE CALLED HOME" },
  { category: "RESIDENCES", image: domencity, title: "Dolmen City Islamabad", caption: "RESORT STYLE LIVING" },
];

const categories: ProjectCategory[] = ["COMMUNITY", "MALLS", "OFFICES", "RESIDENCES"];

export default function ProjectMegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("COMMUNITY");
  const [isMounted, setIsMounted] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visibleProjects = activeCategory === "COMMUNITY"
    ? [{ image: dolmenCityIslamabad, title: "Dolmen City Islamabad", caption: "RESORT STYLE LIVING" }]
    : projects.filter((project) => project.category === activeCategory);

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
      if ((event as CustomEvent<string>).detail !== "projects" && isOpen) {
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
    window.dispatchEvent(new CustomEvent("mega-menu-open", { detail: "projects" }));
    setIsOpen(true);
  };

  return (
    <li className={`business-menu${isOpen ? " is-open" : ""}`}>
      <button
        className="business-menu-trigger"
        type="button"
        aria-expanded={isOpen}
        aria-controls="project-mega-panel"
        onClick={toggleMenu}
      >
        PROJECTS
        <Image className="navigation-arrow" src={arrowDown} alt="" aria-hidden="true" />
      </button>

      {(isOpen || isClosing) && isMounted && createPortal(
        <div className={`business-mega-panel project-mega-panel${isClosing ? " is-closing" : ""}`} id="project-mega-panel">
          <div className="mega-panel-toolbar">
            <p className="mega-panel-title">Projects</p>
            <button className="mega-menu-close" type="button" aria-label="Close projects menu" onClick={() => beginClose(true)}>
              <span />
              <span />
            </button>
          </div>
          <div className="business-mega-tabs" role="tablist" aria-label="Project categories">
            {categories.map((category) => (
              <button
                className={`business-mega-tab${activeCategory === category ? " is-active" : ""}`}
                type="button"
                role="tab"
                aria-selected={activeCategory === category}
                key={category}
                onClick={() => setActiveCategory(category)}
              >
                {activeCategory === category && (
                  <Image className="business-mega-tab-icon" src={menuIcon} alt="" aria-hidden="true" />
                )}
                {category}
              </button>
            ))}
          </div>
          <div className="business-mega-cards" key={activeCategory}>
            {visibleProjects.map((project) => (
              <a
                className="business-mega-card"
                href={`#${project.title.toLowerCase().replaceAll(" ", "-")}`}
                key={project.title}
                onClick={beginClose}
              >
                <Image src={project.image} alt="" fill sizes="(max-width: 1024px) 70vw, 220px" />
                <span className="business-mega-card-shade" />
                <span className="business-mega-card-copy">
                  <strong>{project.title}</strong>
                  <small>{project.caption}</small>
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
