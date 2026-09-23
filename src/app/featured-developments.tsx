"use client";

import Image from "next/image";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useRef, useState } from "react";
import arrowRight from "../../assets/arrow-right.svg";
import corporateOfficeBlock from "../../assets/Development Project/Corporate-office-block.png";
import dolmenCityIslamabad from "../../assets/Development Project/Dolmen City Islamabad.png";
import dolmenMallHyderi from "../../assets/Development Project/Dolman-Mall-Hyderi.png";
import dolmenMallClifton from "../../assets/Development Project/Dolman-mall-clifton.png";
import dolmenMallLahore from "../../assets/Development Project/Dolman-mall-lahore.png";
import dolmenMallTariqRoad from "../../assets/Development Project/Dolman-Mall-tariq-road.png";
import executiveTower from "../../assets/Development Project/Executive Tower.jpg";
import groveResidency from "../../assets/Development Project/Grove Residency.png";
import harbourFront from "../../assets/Development Project/The-Harbour-Front.png";
import skyTower from "../../assets/Development Project/Sky-Tower.png";

type Development = {
  image: typeof dolmenMallClifton;
  subtitle: string;
  title: string;
};

const developments: Development[] = [
  { image: dolmenMallClifton, subtitle: "REVOLUTIONIZING SHOPPING EXPERIENCE", title: "Dolmen Mall Clifton" },
  { image: dolmenMallLahore, subtitle: "DESTINATION OF CHOICE", title: "Dolmen Mall Lahore" },
  { image: dolmenCityIslamabad, subtitle: "RESORT STYLE LIVING", title: "Dolmen City Islamabad" },
  { image: harbourFront, subtitle: "WHERE BUSINESS MEETS THE SEA", title: "The Harbour Front" },
  { image: skyTower, subtitle: "ELEVATED BUSINESS, REDEFINED", title: "Sky Towers" },
  { image: dolmenMallTariqRoad, subtitle: "AT THE HEART OF KARACHI", title: "Dolmen Mall Tariq Road" },
  { image: corporateOfficeBlock, subtitle: "PRESTIGE IN EVERY DETAIL", title: "Corporate Office Block" },
  { image: executiveTower, subtitle: "THE ADDRESS OF DISTINCTION", title: "Executive Tower" },
  { image: groveResidency, subtitle: "A PLACE CALLED HOME", title: "Grove Residency" },
  { image: dolmenMallHyderi, subtitle: "YOUR NEIGHBOURHOOD MALL", title: "Dolmen Mall Hyderi" },
];

const DRAG_THRESHOLD = 64;

export default function FeaturedDevelopments() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const didDrag = useRef(false);
  const maxIndex = developments.length - 1;

  const move = (direction: number) => {
    setActiveIndex((currentIndex) => Math.min(maxIndex, Math.max(0, currentIndex + direction)));
  };

  const goTo = (index: number) => {
    setActiveIndex(Math.min(maxIndex, Math.max(0, index)));
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    didDrag.current = false;
    dragStartX.current = event.clientX;
    setIsDragging(true);
    setDragOffset(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return;
    }

    const delta = event.clientX - dragStartX.current;

    if (Math.abs(delta) > 6) {
      didDrag.current = true;
    }

    const resistance =
      (activeIndex === 0 && delta > 0) || (activeIndex === maxIndex && delta < 0) ? 0.35 : 1;

    setDragOffset(delta * resistance);
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return;
    }

    const delta = event.clientX - dragStartX.current;

    setIsDragging(false);
    setDragOffset(0);

    if (delta <= -DRAG_THRESHOLD) {
      move(1);
      return;
    }

    if (delta >= DRAG_THRESHOLD) {
      move(-1);
    }
  };

  return (
    <section className="featured-developments" id="projects" aria-labelledby="featured-developments-title">
      <div className="featured-developments-header">
        <h2 id="featured-developments-title">Featured Developments</h2>
        <div className="featured-developments-controls" aria-label="Development navigation">
          <button
            className="featured-developments-arrow is-previous"
            type="button"
            onClick={() => move(-1)}
            disabled={activeIndex === 0}
            aria-label="Previous development"
          >
            <Image src={arrowRight} alt="" aria-hidden="true" />
          </button>
          <button
            className="featured-developments-arrow"
            type="button"
            onClick={() => move(1)}
            disabled={activeIndex === maxIndex}
            aria-label="Next development"
          >
            <Image src={arrowRight} alt="" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        className={`featured-developments-viewport${isDragging ? " is-dragging" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className="featured-developments-track"
          style={{
            "--development-index": activeIndex,
            "--drag-offset": `${dragOffset}px`,
            transition: isDragging ? "none" : undefined,
          } as CSSProperties}
          onClickCapture={(event) => {
            if (didDrag.current) {
              event.preventDefault();
              event.stopPropagation();
              didDrag.current = false;
            }
          }}
        >
          {developments.map((development) => (
            <article className="development-card" key={development.title}>
              <Image
                className="development-card-image"
                src={development.image}
                alt=""
                fill
                sizes="(max-width: 700px) 86vw, 62vw"
                draggable={false}
              />
              <div className="development-card-content">
                <p>{development.subtitle}</p>
                <h3>{development.title}</h3>
                <a href={`#${development.title.toLowerCase().replaceAll(" ", "-")}`}>
                  Explore
                  <Image src={arrowRight} alt="" aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="featured-developments-progress">
        <button
          className="featured-developments-progress-track"
          type="button"
          aria-label={`Slide ${activeIndex + 1} of ${developments.length}`}
          onClick={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
            goTo(Math.min(maxIndex, Math.floor(ratio * developments.length)));
          }}
        >
          <span
            className="featured-developments-progress-fill"
            style={{
              width: `${((activeIndex + 1) / developments.length) * 100}%`,
            }}
          />
        </button>
      </div>
    </section>
  );
}
