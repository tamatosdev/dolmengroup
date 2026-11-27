"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef } from "react";

type GroupStripProps = {
  images: StaticImageData[];
};

/** How far (as a share of the tile width) a photo drifts inside its tile. */
const HORIZONTAL_SHIFT = 0.1;
/** How far (px) photos drift up/down as the page scrolls past the strip. */
const VERTICAL_SHIFT = 40;

/**
 * Auto-scrolling photo strip (CSS marquee) with parallax: each photo is a bit
 * wider than its tile and slides inside it, against the strip's movement, based
 * on where the tile sits on screen; page scroll adds a gentle vertical drift.
 */
export default function GroupStrip({ images }: GroupStripProps) {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layers = Array.from(strip.querySelectorAll<HTMLElement>(".group-strip-parallax"));
    let frame = 0;
    let visible = false;

    const update = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const stripRect = strip.getBoundingClientRect();
      // -1 when the strip enters from the bottom, +1 as it leaves at the top.
      const scrollProgress = Math.max(
        -1,
        Math.min(1, (viewportHeight / 2 - (stripRect.top + stripRect.height / 2)) / (viewportHeight / 2 + stripRect.height / 2)),
      );
      const shiftY = scrollProgress * VERTICAL_SHIFT;

      for (const layer of layers) {
        const tile = layer.parentElement!.getBoundingClientRect();
        if (tile.right < -tile.width || tile.left > viewportWidth + tile.width) continue;
        // -1 at the left edge of the screen, +1 at the right edge.
        const position = Math.max(
          -1,
          Math.min(1, (tile.left + tile.width / 2 - viewportWidth / 2) / (viewportWidth / 2 + tile.width / 2)),
        );
        const shiftX = -position * HORIZONTAL_SHIFT * tile.width;
        layer.style.transform = `translate3d(${shiftX.toFixed(1)}px, ${shiftY.toFixed(1)}px, 0)`;
      }

      frame = visible ? requestAnimationFrame(update) : 0;
    };

    // Only animate while the strip is on screen.
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(update);
    });
    observer.observe(strip);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="group-strip" ref={stripRef} aria-hidden="true">
      {/* The set is rendered twice so the marquee loops seamlessly. */}
      <div className="group-strip-track">
        {[0, 1].map((copy) =>
          images.map((image, index) => (
            <div className="group-strip-item" key={`${copy}-${index}`}>
              <div className="group-strip-parallax">
                <Image src={image} alt="" fill sizes="(max-width: 768px) 60vw, 38vw" />
              </div>
            </div>
          )),
        )}
      </div>
    </div>
  );
}
