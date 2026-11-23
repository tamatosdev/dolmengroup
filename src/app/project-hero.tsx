"use client";

import { getImageProps, type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

type ProjectHeroProps = {
  /** Small label above the title, e.g. "Residence". */
  category: string;
  /** Title lines; each entry renders on its own line on desktop. */
  titleLines: string[];
  description: string;
  /** Wide banner for landscape screens (desktop, laptop, landscape tablet). */
  image: StaticImageData;
  /** Tall banner (1080 × 2400) for portrait screens (phones, upright tablets). */
  mobileImage?: StaticImageData;
};

/** Portrait screens get the tall mobile banner. */
const MOBILE_MEDIA = "(max-aspect-ratio: 1/1)";

/** Full-screen hero for project inner pages. */
export default function ProjectHero({ category, titleLines, description, image, mobileImage }: ProjectHeroProps) {
  // Art direction: one <picture>, so each screen downloads only the banner it shows.
  const common = { alt: "", fill: true, sizes: "100vw", loading: "eager", fetchPriority: "high" } as const;
  const { props: desktopProps } = getImageProps({ ...common, src: image });
  const mobileProps = mobileImage ? getImageProps({ ...common, src: mobileImage }).props : null;

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

    // Y position of the text baseline at the end of an element (its last line).
    const baselineOf = (element: HTMLElement) => {
      const marker = document.createElement("span");
      marker.style.cssText = "display:inline-block;width:0;height:0;vertical-align:baseline";
      element.appendChild(marker);
      const y = marker.getBoundingClientRect().top;
      marker.remove();
      return y;
    };

    const measure = () => {
      row.style.setProperty("--hero-last-line", `${lastLine.offsetWidth}px`);
      row.classList.add("is-measured");

      // Put the description's last baseline on the title's last baseline.
      const description = row.querySelector("p");
      if (!description) return;
      const descent = description.getBoundingClientRect().bottom - baselineOf(description);
      const bottom = row.getBoundingClientRect().bottom - baselineOf(lastLine) - descent;
      row.style.setProperty("--hero-desc-bottom", `${bottom}px`);

      // A one-line title can be shorter than the description beside it: make room
      // above so the description never rises into the category label.
      const title = row.querySelector("h1");
      const room = title ? description.offsetHeight + bottom - title.offsetHeight : 0;
      row.style.setProperty("--hero-desc-room", `${Math.max(0, room)}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    observer.observe(lastLine);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`project-hero${isVisible ? " is-visible" : ""}`} aria-labelledby="project-hero-title">
      <picture>
        {mobileProps ? (
          // srcset splits on spaces, and the asset file names contain them: encode the URL.
          <source media={MOBILE_MEDIA} srcSet={mobileProps.srcSet ?? encodeURI(mobileProps.src)} />
        ) : null}
        <img {...desktopProps} alt="" className="project-hero-image" aria-hidden="true" />
      </picture>
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
