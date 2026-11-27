"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import brush from "../../assets/brush.svg";

type GallerySlide = {
  src: StaticImageData;
  title: string;
};

type ProjectGalleryProps = {
  /** Heading text before the highlighted word, e.g. "Life at The". */
  titleLead: React.ReactNode;
  highlight: string;
  /** Optional words after the highlight, e.g. "Connects Here" in "Karachi Connects Here". */
  titleTrail?: string;
  slides: GallerySlide[];
  /** Hide the title overlay (and its dark shade) on the large image. */
  hideCaption?: boolean;
};

/** Project inner page gallery: one large image with its title, every image as a thumbnail. */
export default function ProjectGallery({ titleLead, highlight, titleTrail, slides, hideCaption = false }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];

  return (
    <section className="project-gallery" aria-labelledby="project-gallery-title">
      <h2 className="project-gallery-title" id="project-gallery-title" data-reveal>
        {titleLead ? <>{titleLead} </> : null}
        <span className="project-intro-highlight">
          {highlight}
          <Image className="title-brush" src={brush} alt="" aria-hidden="true" />
        </span>
        {titleTrail ? ` ${titleTrail}` : null}
      </h2>

      {/* Frame: on desktop the thumbnails overlay the stage; on phones they sit below it. */}
      <div className="project-gallery-frame" data-reveal="scale">
        <div className={`project-gallery-stage${slides.length === 1 ? " is-single" : ""}`}>
          {slides.map((slide, index) => (
            <Image
              className={`project-gallery-image${index === activeIndex ? " is-active" : ""}`}
              src={slide.src}
              alt={slide.title}
              fill
              sizes="100vw"
              key={slide.title}
              aria-hidden={index !== activeIndex}
            />
          ))}
          {hideCaption ? null : (
            <>
              <span className="project-gallery-shade" aria-hidden="true" />
              <p className="project-gallery-caption" aria-live="polite">
                {activeSlide.title}
              </p>
            </>
          )}
        </div>

        {slides.length > 1 ? (
          <div className="project-gallery-thumbs">
            {slides.map((slide, index) => (
              <button
                className={`project-gallery-thumb${index === activeIndex ? " is-active" : ""}`}
                type="button"
                key={slide.title}
                onClick={() => setActiveIndex(index)}
                aria-label={`Show ${slide.title}`}
                aria-pressed={index === activeIndex}
              >
                <Image src={slide.src} alt="" fill sizes="(max-width: 640px) 28vw, 12vw" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
