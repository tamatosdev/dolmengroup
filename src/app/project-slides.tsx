"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import cultivatPassion from "../../assets/cultivat-passion.png";
import sustainableConcepts from "../../assets/sustainable concepts.png";
import nextLandmark from "../../assets/next landmark.png";

type ProjectSlide = {
  image: typeof cultivatPassion;
  title: string;
};

const slides: ProjectSlide[] = [
  {
    image: cultivatPassion,
    title: "We Cultivate our Passion\nThrough Bold Projects.",
  },
  {
    image: sustainableConcepts,
    title: "We make innovative and\nsustainable concepts.",
  },
  {
    image: nextLandmark,
    title: "The next landmark\nstarts with a better question.",
  },
];

export default function ProjectSlides() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    let frameId = 0;

    const updateActiveSlide = () => {
      frameId = 0;
      const sectionTop = section.getBoundingClientRect().top;
      const scrollDistance = section.offsetHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -sectionTop / scrollDistance));
      setScrollProgress(progress);
      setActiveSlide(Math.min(slides.length - 1, Math.floor(progress * (slides.length - 1) + 0.5)));
      setIsSectionVisible(
        sectionTop < window.innerHeight && sectionTop + section.offsetHeight > 0,
      );
    };

    const requestUpdate = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(updateActiveSlide);
      }
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <section ref={sectionRef} className={`project-slides${isSectionVisible ? " is-visible" : ""}`} aria-label="Dolmen projects">
      <div className={`project-slides-heading${isSectionVisible ? " is-visible" : ""}`}>
        <h2>
          {slides[activeSlide].title.split("\n").map((line, lineIndex) => (
            <span key={line}>
              {line}
              {lineIndex === 0 && <br />}
            </span>
          ))}
        </h2>
      </div>

      <div className="project-slides-list">
        {slides.map((slide, index) => (
          <article
            className={`project-slide${index < 2 ? " project-slide-inset" : " project-slide-third"}`}
            style={{
              zIndex: index + 1,
              ...(index === 2 ? {
                "--third-progress": Math.min(1, Math.max(0, (scrollProgress - 0.5) / 0.5)),
              } : {}),
            } as CSSProperties}
            key={slide.title}
          >
            <Image
              className="project-slide-background"
              src={slide.image}
              alt=""
              fill
              sizes="100vw"
              priority={index === 0}
              style={index === 0 ? {
                transform: `scale(${isSectionVisible ? 1 : 0.5})`,
              } : undefined}
            />
          </article>
        ))}
      </div>
    </section>
  );
}
