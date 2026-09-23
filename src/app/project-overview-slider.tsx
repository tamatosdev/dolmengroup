"use client";

import Image from "next/image";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import arrowRight from "../../assets/arrow-right.svg";
import sliderArrowNext from "../../assets/slider-arrow-next.png";
import sliderArrowPrevious from "../../assets/slider-arrow-prev.svg";
import dolmenCityBackground from "../../assets/Project Overview/Dolmen City bg.png";
import dolmenCityThumbnail from "../../assets/Project Overview/Dolmen City thumbnail.png";
import skyTowersBackground from "../../assets/Project Overview/Sky Towers bg.png";
import skyTowersThumbnail from "../../assets/Project Overview/Sky Towers thumbnail.png";
import groveResidencyBackground from "../../assets/Project Overview/Grove Residency bg.png";
import groveResidencyThumbnail from "../../assets/Project Overview/Grove Residency thumbnail.png";
import dolmenMallLahoreBackground from "../../assets/Project Overview/Dolmen Mall Lahore bg.png";
import dolmenMallLahoreThumbnail from "../../assets/Project Overview/Dolmen Mall Lahore thumbnail.png";

type OverviewSlide = {
  background: typeof dolmenCityBackground;
  location: string;
  thumbnail: typeof dolmenCityThumbnail;
  title: string;
};

const slides: OverviewSlide[] = [
  { background: dolmenCityBackground, location: "ISLAMABAD", thumbnail: dolmenCityThumbnail, title: "Dolmen City" },
  { background: skyTowersBackground, location: "KARACHI", thumbnail: skyTowersThumbnail, title: "Sky Towers" },
  { background: groveResidencyBackground, location: "KARACHI", thumbnail: groveResidencyThumbnail, title: "Grove Residency" },
  { background: dolmenMallLahoreBackground, location: "LAHORE", thumbnail: dolmenMallLahoreThumbnail, title: "Dolmen Mall" },
];

const DRAG_THRESHOLD = 64;

export default function ProjectOverviewSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "previous">("next");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStartX = useRef(0);
  const dragCurrentX = useRef(0);
  const didDrag = useRef(false);
  const activeSlide = slides[activeIndex];

  const move = (step: number) => {
    if (isTransitioning) {
      return;
    }

    setOutgoingIndex(activeIndex);
    setDirection(step > 0 ? "next" : "previous");
    setActiveIndex((activeIndex + step + slides.length) % slides.length);
    setIsTransitioning(true);

    transitionTimer.current = setTimeout(() => {
      setOutgoingIndex(null);
      setIsTransitioning(false);
    }, 1200);
  };

  useEffect(() => () => {
    if (transitionTimer.current) {
      clearTimeout(transitionTimer.current);
    }
  }, []);

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0) {
      return;
    }

    const target = event.target as HTMLElement;
    if (target.closest("a, button")) {
      return;
    }

    didDrag.current = false;
    dragStartX.current = event.clientX;
    dragCurrentX.current = event.clientX;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!isDragging) {
      return;
    }

    dragCurrentX.current = event.clientX;

    if (Math.abs(event.clientX - dragStartX.current) > 6) {
      didDrag.current = true;
    }
  };

  const endDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (!isDragging) {
      return;
    }

    setIsDragging(false);

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Capture may already be released.
    }

    // Use last pointermove X — pointerup clientX is often wrong on mobile touch.
    const delta = dragCurrentX.current - dragStartX.current;

    if (Math.abs(delta) < DRAG_THRESHOLD) {
      return;
    }

    // Swipe left → next; swipe right → previous
    move(delta < 0 ? 1 : -1);
  };

  const outgoingSlide = outgoingIndex === null ? null : slides[outgoingIndex];

  return (
    <section
      className={`project-overview${isDragging ? " is-dragging" : ""}`}
      aria-label="Project overview"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={(event) => {
        if (didDrag.current) {
          event.preventDefault();
          event.stopPropagation();
          didDrag.current = false;
        }
      }}
    >
      {outgoingSlide && (
        <Image
          key={`background-outgoing-${outgoingSlide.background.src}`}
          className={`project-overview-background project-overview-background-exiting is-${direction}`}
          src={outgoingSlide.background}
          alt=""
          fill
          sizes="100vw"
          draggable={false}
        />
      )}
      <Image
        key={`background-entering-${activeSlide.background.src}`}
        className={`project-overview-background project-overview-background-entering is-${direction}`}
        src={activeSlide.background}
        alt=""
        fill
        priority
        sizes="100vw"
        draggable={false}
      />
      <div className="project-overview-content">
        <h2>{activeSlide.title}</h2>
        <p>{activeSlide.location}</p>
        <a className="project-overview-button" href={`#${activeSlide.title.toLowerCase().replaceAll(" ", "-")}`}>
          Explore More
          <Image src={arrowRight} alt="" aria-hidden="true" />
        </a>
      </div>

      <div className="project-overview-media">
        <button
          className="project-overview-arrow project-overview-arrow-previous"
          type="button"
          onClick={() => move(-1)}
          aria-label="Previous project"
        >
          <Image src={sliderArrowPrevious} alt="" aria-hidden="true" />
        </button>

        <div className="project-overview-thumbnail-viewport">
          {outgoingSlide && (
            <Image
              key={`thumbnail-outgoing-${outgoingSlide.thumbnail.src}`}
              className={`project-overview-thumbnail project-overview-thumbnail-exiting is-${direction}`}
              src={outgoingSlide.thumbnail}
              alt={`${outgoingSlide.title} overview`}
              fill
              sizes="(max-width: 640px) calc(100vw - 48px), 38vw"
              draggable={false}
            />
          )}
          <Image
            key={`thumbnail-entering-${activeSlide.thumbnail.src}`}
            className={`project-overview-thumbnail project-overview-thumbnail-entering is-${direction}`}
            src={activeSlide.thumbnail}
            alt={`${activeSlide.title} overview`}
            fill
            sizes="(max-width: 640px) calc(100vw - 48px), 38vw"
            draggable={false}
          />
        </div>

        <button
          className="project-overview-arrow project-overview-arrow-next"
          type="button"
          onClick={() => move(1)}
          aria-label="Next project"
        >
          <Image src={sliderArrowNext} alt="" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
