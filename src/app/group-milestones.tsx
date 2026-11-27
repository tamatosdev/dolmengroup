"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import arrowRight from "../../assets/arrow-right.svg";
import groveResidency from "../../assets/Our group page/web/card-1.jpg";
import dolmenMallLahore from "../../assets/Our group page/web/card-3.jpg";
import skyTowers from "../../assets/Our group page/web/card-4.jpg";
import corporateOfficeBlock from "../../assets/Our group page/web/card-5.jpg";
import dolmenMallClifton from "../../assets/Our group page/web/card-6.jpg";
import dolmenMallHyderi from "../../assets/Our group page/web/card-7.jpg";
import harbourFront from "../../assets/Our group page/web/card-8.jpg";
import executiveTower from "../../assets/Our group page/web/card-9.jpg";
import dolmenMallTariqRoad from "../../assets/Our group page/web/card-10.jpg";
import { projectHref } from "./project-pages";

type Milestone = {
  year: string;
  title: string;
  caption: string;
  image: typeof groveResidency;
};

/** Newest first, as in the design. */
const milestones: Milestone[] = [
  {
    year: "2026",
    title: "Grove Residency",
    caption: "A PLACE CALLED HOME",
    image: groveResidency,
  },
  {
    year: "2025",
    title: "Dolmen Mall Lahore",
    caption: "A PLACE CALLED HOME",
    image: dolmenMallLahore,
  },
  {
    year: "2020",
    title: "Sky Towers",
    caption: "DESTINATION OF CHOICE",
    image: skyTowers,
  },
  {
    year: "2015",
    title: "Corporate Office Block",
    caption: "PRESTIGE IN EVERY DETAIL",
    image: corporateOfficeBlock,
  },
  {
    year: "2011",
    title: "Dolmen Mall Clifton",
    caption: "REVOLUTIONIZING RETAIL EXPERIENCE",
    image: dolmenMallClifton,
  },
  {
    year: "2008",
    title: "Dolmen Mall Hyderi",
    caption: "YOUR NEIGHBORHOOD MALL",
    image: dolmenMallHyderi,
  },
  {
    year: "2008",
    title: "The Harbour Front",
    caption: "WHERE BUSINESS MEETS THE SEA",
    image: harbourFront,
  },
  {
    year: "2006",
    title: "Executive Tower",
    caption: "THE ADDRESS OF DISTINCTION",
    image: executiveTower,
  },
  {
    year: "2001",
    title: "Dolmen Mall Tariq Road",
    caption: "AT THE HEART OF KARACHI",
    image: dolmenMallTariqRoad,
  },
];

const DRAG_THRESHOLD = 60;

export default function GroupMilestones() {
  const [active, setActive] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const didDrag = useRef(false);
  const last = milestones.length - 1;
  const current = milestones[active];

  const timelineRef = useRef<HTMLDivElement>(null);

  const goTo = (index: number) => setActive(Math.min(last, Math.max(0, index)));

  // On narrow screens the year row scrolls sideways: keep the active year in view.
  useEffect(() => {
    const timeline = timelineRef.current;
    const year = timeline?.querySelectorAll<HTMLElement>(".group-timeline-year")[active];
    if (!timeline || !year || timeline.scrollWidth <= timeline.clientWidth) return;
    const target = year.offsetLeft + year.offsetWidth / 2 - timeline.clientWidth / 2;
    timeline.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [active]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    didDrag.current = false;
    dragStartX.current = event.clientX;
    setIsDragging(true);
    setDragOffset(0);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const delta = event.clientX - dragStartX.current;
    if (Math.abs(delta) > 6 && !didDrag.current) {
      didDrag.current = true;
      // Capture only for a real drag, so a plain click still reaches the slide link.
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    const atEdge =
      (active === 0 && delta > 0) || (active === last && delta < 0);
    setDragOffset(delta * (atEdge ? 0.35 : 1));
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const delta = event.clientX - dragStartX.current;
    setIsDragging(false);
    setDragOffset(0);
    if (delta <= -DRAG_THRESHOLD) goTo(active + 1);
    else if (delta >= DRAG_THRESHOLD) goTo(active - 1);
  };

  // Trackpads / shift+wheel: a sideways scroll gesture moves one slide at a time.
  const viewportRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    let accumulated = 0;
    let lockedUntil = 0;

    const onWheel = (event: WheelEvent) => {
      const sideways = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.shiftKey ? event.deltaY : 0;
      if (!sideways) return;
      event.preventDefault();
      const now = performance.now();
      if (now < lockedUntil) return;
      accumulated += sideways;
      if (Math.abs(accumulated) < 40) return;
      const next = activeRef.current + (accumulated > 0 ? 1 : -1);
      accumulated = 0;
      if (next < 0 || next > last) return;
      lockedUntil = now + 750;
      setActive(next);
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [last]);

  return (
    <section className="group-milestones" aria-labelledby="group-milestones-title">
      <h2 className="group-milestones-title" id="group-milestones-title" data-reveal>
        Milestones that shaped Dolmen
      </h2>

      <div
        ref={timelineRef}
        className="group-timeline"
        data-reveal
        style={{ "--timeline-progress": last ? active / last : 0, "--reveal-delay": "150ms" } as CSSProperties}
      >
        <div className="group-timeline-inner">
          <span className="group-timeline-line" aria-hidden="true">
            <span className="group-timeline-fill" />
          </span>
          <ol className="group-timeline-years">
            {milestones.map((milestone, index) => (
              <li key={milestone.title}>
                <button
                  className={`group-timeline-year${index <= active ? " is-reached" : ""}${index === active ? " is-active" : ""}`}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`${milestone.year}: ${milestone.title}`}
                  aria-current={index === active ? "step" : undefined}
                >
                  <span className="group-timeline-label">{milestone.year}</span>
                  <span className="group-timeline-dot" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {current.year}: {current.title}, {current.caption}
      </p>

      <div className="group-milestone-stage" data-reveal style={{ "--reveal-delay": "300ms" } as CSSProperties}>
        <div
          ref={viewportRef}
          className={`group-milestone-viewport${isDragging ? " is-dragging" : ""}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div
            className="group-milestone-track"
            style={
              {
                "--milestone-index": active,
                "--drag-offset": `${dragOffset}px`,
                transition: isDragging ? "none" : undefined,
              } as CSSProperties
            }
            onClickCapture={(event) => {
              if (didDrag.current) {
                event.preventDefault();
                event.stopPropagation();
                didDrag.current = false;
              }
            }}
          >
            {/* Each slide keeps the same element across changes, so it glides
                (title, caption and photo together) instead of being re-created. */}
            {milestones.map((milestone, index) => {
              const isActive = index === active;
              return (
                <div
                  className={`group-milestone-slide${isActive ? " is-active" : ""}`}
                  key={milestone.title}
                  aria-hidden={!isActive}
                >
                  <div className="group-milestone-text">
                    <h3>{milestone.title}</h3>
                    <p>{milestone.caption}</p>
                  </div>
                  <Link
                    className="group-milestone-media"
                    href={projectHref(milestone.title)}
                    draggable={false}
                    tabIndex={isActive ? 0 : -1}
                    aria-label={`${milestone.title} (${milestone.year})`}
                    onClick={(event) => {
                      if (!isActive) {
                        event.preventDefault();
                        goTo(index);
                      }
                    }}
                  >
                    <Image
                      src={milestone.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 84vw, 54vw"
                      draggable={false}
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <button
          className="group-milestone-arrow is-previous"
          type="button"
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          aria-label="Previous milestone"
        >
          <Image src={arrowRight} alt="" aria-hidden="true" />
        </button>
        <button
          className="group-milestone-arrow"
          type="button"
          onClick={() => goTo(active + 1)}
          disabled={active === last}
          aria-label="Next milestone"
        >
          <Image src={arrowRight} alt="" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
