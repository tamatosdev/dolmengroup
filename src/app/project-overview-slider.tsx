"use client";

import Image from "next/image";
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

export default function ProjectOverviewSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "previous">("next");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeSlide = slides[activeIndex];

  const move = (direction: number) => {
    if (isTransitioning) {
      return;
    }

    setOutgoingIndex(activeIndex);
    setDirection(direction > 0 ? "next" : "previous");
    setActiveIndex((activeIndex + direction + slides.length) % slides.length);
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

  const outgoingSlide = outgoingIndex === null ? null : slides[outgoingIndex];

  return (
    <section className="project-overview" aria-label="Project overview">
      {outgoingSlide && (
        <Image
          key={`background-outgoing-${outgoingSlide.background.src}`}
          className={`project-overview-background project-overview-background-exiting is-${direction}`}
          src={outgoingSlide.background}
          alt=""
          fill
          sizes="100vw"
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
              sizes="(max-width: 540px) calc(100vw - 48px), 38vw"
            />
          )}
          <Image
            key={`thumbnail-entering-${activeSlide.thumbnail.src}`}
            className={`project-overview-thumbnail project-overview-thumbnail-entering is-${direction}`}
            src={activeSlide.thumbnail}
            alt={`${activeSlide.title} overview`}
            fill
            sizes="(max-width: 540px) calc(100vw - 48px), 38vw"
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
