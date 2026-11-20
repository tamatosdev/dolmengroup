"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

type ProjectHeroProps = {
  /** Small label above the title, e.g. "Residence". */
  category: string;
  /** Title lines; each entry renders on its own line on desktop. */
  titleLines: string[];
  description: string;
  image: StaticImageData;
};

/** Full-screen hero for project inner pages. */
export default function ProjectHero({ category, titleLines, description, image }: ProjectHeroProps) {
  const [isVisible, setIsVisible] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const lastLineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsVisible(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  // The description sits right after the last title line (not after the widest one),
  // so CSS needs that line's width.
  useEffect(() => {
    const row = rowRef.current;
    const lastLine = lastLineRef.current;
    if (!row || !lastLine) return;

    const measure = () => {
      row.style.setProperty("--hero-last-line", `${lastLine.offsetWidth}px`);
      row.classList.add("is-measured");
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    observer.observe(lastLine);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`project-hero${isVisible ? " is-visible" : ""}`} aria-labelledby="project-hero-title">
      <Image
        className="project-hero-image"
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        aria-hidden="true"
      />
      <div className={`project-hero-content${isVisible ? " is-visible" : ""}`}>
        <span className="project-hero-category">{category}</span>
        <div className="project-hero-title-row" ref={rowRef}>
          <h1 id="project-hero-title">
            {titleLines.map((line, index) => (
              <span key={line} ref={index === titleLines.length - 1 ? lastLineRef : undefined}>
                {line}
                {index < titleLines.length - 1 ? " " : null}
              </span>
            ))}
          </h1>
          <p>{description}</p>
        </div>
      </div>
    </section>
  );
}
