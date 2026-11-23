"use client";

import Image from "next/image";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import arrowRight from "../../assets/arrow-right.svg";
import corporateOfficeBlock from "../../assets/Featured Project/Corporate Office Block.jpg";
import dolmenCityIslamabad from "../../assets/Development Project/Dolmen City Islamabad.jpg";
import dolmenMallHyderi from "../../assets/Featured Project/Dolmen Mall Hyderi.jpg";
import dolmenMallClifton from "../../assets/Featured Project/Dolmen Mall Clifton.jpg";
import dolmenMallLahore from "../../assets/Featured Project/Dolmen Mall Lahore.jpg";
import dolmenMallTariqRoad from "../../assets/Featured Project/Dolmen Mall Tariq Road.jpg";
import executiveTower from "../../assets/Featured Project/Executive Tower.jpg";
import groveResidency from "../../assets/Featured Project/Grove Residency.jpg";
import harbourFront from "../../assets/Featured Project/The Harbour Front.jpg";
import skyTower from "../../assets/Featured Project/Sky Towers.jpg";
import Link from "next/link";
import { projectHref } from "./project-pages";
import { SHOW_DOLMEN_CITY_ISLAMABAD } from "./project-visibility";

type Development = {
  image: typeof dolmenMallClifton;
  title: string;
};

const developments: Development[] = [
  { image: groveResidency, title: "Grove Residency" },
  { image: dolmenMallLahore, title: "Dolmen Mall Lahore" },
  { image: skyTower, title: "Sky Towers" },
  { image: corporateOfficeBlock, title: "Corporate Office Block" },
  { image: dolmenMallClifton, title: "Dolmen Mall Clifton" },
  { image: dolmenMallHyderi, title: "Dolmen Mall Hyderi" },
  { image: harbourFront, title: "The Harbour Front" },
  { image: executiveTower, title: "Executive Tower" },
  { image: dolmenMallTariqRoad, title: "Dolmen Mall Tariq Road" },
  ...(SHOW_DOLMEN_CITY_ISLAMABAD
    ? [{ image: dolmenCityIslamabad, title: "Dolmen City Islamabad" } satisfies Development]
    : []),
];

const DRAG_THRESHOLD = 64;

export default function FeaturedDevelopments() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const didDrag = useRef(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  // Measured from the real layout: the distance from one card to the next, and how far
  // the track can move before the last card's right edge meets the viewport's right
  // edge. The last step is shorter, so the slider stops exactly there (no empty space).
  const [layout, setLayout] = useState<{ step: number; maxShift: number; view: number } | null>(null);
  const maxIndex = layout && layout.step > 0 ? Math.ceil(layout.maxShift / layout.step - 0.01) : developments.length - 1;

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = viewport?.firstElementChild as HTMLElement | null;
    if (!viewport || !track) return;
    const measure = () => {
      const cards = track.children;
      if (cards.length < 2) return;
      const first = cards[0] as HTMLElement;
      const second = cards[1] as HTMLElement;
      const last = cards[cards.length - 1] as HTMLElement;
      // The visible area is the viewport minus its side padding, so the last card stops
      // as far from the right edge as the first card starts from the left.
      const style = getComputedStyle(viewport);
      const view = viewport.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const step = second.offsetLeft - first.offsetLeft;
      const maxShift = Math.max(0, last.offsetLeft + last.offsetWidth - first.offsetLeft - view);
      setLayout({ step, maxShift, view });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  // A resize can lower maxIndex; clamp while rendering instead of correcting state.
  const index = Math.min(activeIndex, maxIndex);

  const move = (direction: number) => {
    setActiveIndex(Math.min(maxIndex, Math.max(0, index + direction)));
  };

  const goTo = (target: number) => {
    setActiveIndex(Math.min(maxIndex, Math.max(0, target)));
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
      (index === 0 && delta > 0) || (index === maxIndex && delta < 0) ? 0.35 : 1;

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
            disabled={index === 0}
            aria-label="Previous development"
          >
            <Image src={arrowRight} alt="" aria-hidden="true" />
          </button>
          <button
            className="featured-developments-arrow"
            type="button"
            onClick={() => move(1)}
            disabled={index === maxIndex}
            aria-label="Next development"
          >
            <Image src={arrowRight} alt="" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className={`featured-developments-viewport${isDragging ? " is-dragging" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className="featured-developments-track"
          style={{
            "--development-index": index,
            "--drag-offset": `${dragOffset}px`,
            // Once measured, move in exact pixels and never past the last card.
            transform: layout
              ? `translateX(${-Math.min(index * layout.step, layout.maxShift) + dragOffset}px)`
              : undefined,
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
              <div className="development-card-media">
                <Image
                  className="development-card-image"
                  src={development.image}
                  alt=""
                  fill
                  sizes="(max-width: 700px) 86vw, 40vw"
                  draggable={false}
                />
              </div>
              <div className="development-card-content">
                <h3>{development.title}</h3>
                <Link href={projectHref(development.title)}>
                  Explore
                  <Image src={arrowRight} alt="" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="featured-developments-progress">
        <button
          className="featured-developments-progress-track"
          type="button"
          aria-label={`Slide ${Math.floor(index) + 1} of ${Math.ceil(maxIndex) + 1}`}
          onClick={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
            goTo(Math.round(ratio * maxIndex));
          }}
        >
          <span
            className="featured-developments-progress-fill"
            style={{
              // Share of the whole row that has been seen so far.
              width: layout
                ? `${Math.min(100, ((Math.min(index * layout.step, layout.maxShift) + layout.view) / (layout.maxShift + layout.view)) * 100)}%`
                : `${((index + 1) / developments.length) * 100}%`,
            }}
          />
        </button>
      </div>
    </section>
  );
}
