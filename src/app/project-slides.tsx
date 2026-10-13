"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import groveProjectImage from "../../assets/grove-project-image.jpg";
import dolmenIslamabadProject from "../../assets/dolmen-islamabad-project.jpg";

type ProjectSlide = {
  image: typeof groveProjectImage;
  title: string;
};

const slides: ProjectSlide[] = [
  {
    image: groveProjectImage,
    title: "Grove Residency Karachi",
  },
  {
    image: dolmenIslamabadProject,
    title: "Dolmen City Islamabad",
  },
];

type TitlePhase = "idle" | "blur-out" | "blur-in";

const BLUR_MS = 180;
const SETTLE_MS = 360;

type SlideMotion = {
  y: number;
  scale: number;
  bgY: number;
};

function getSlideMotion(
  index: number,
  slideProgress: number,
  viewportHeight: number,
  enterProgress: number,
): SlideMotion {
  if (index === 0 && slideProgress <= 0) {
    return {
      y: 0,
      scale: 1.45 - 0.45 * enterProgress,
      bgY: (1 - enterProgress) * -viewportHeight * 0.25,
    };
  }

  if (index > 0 && slideProgress < index - 1) {
    return {
      y: viewportHeight,
      scale: 1.05,
      bgY: 0,
    };
  }

  if (slideProgress < index) {
    const p = slideProgress - (index - 1);
    return {
      y: (1 - p) * viewportHeight,
      scale: 1.05 - 0.05 * p,
      bgY: 0,
    };
  }

  if (slideProgress < index + 1) {
    const p = slideProgress - index;
    return {
      y: -p * viewportHeight * 0.25,
      scale: 1,
      bgY: 0,
    };
  }

  return {
    y: -viewportHeight * 0.25,
    scale: 1,
    bgY: 0,
  };
}

export default function ProjectSlides() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [enterProgress, setEnterProgress] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(1080);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [coverScroll, setCoverScroll] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [displaySlide, setDisplaySlide] = useState(0);
  const [titlePhase, setTitlePhase] = useState<TitlePhase>("idle");
  const displaySlideRef = useRef(0);
  const phaseRef = useRef<TitlePhase>("idle");
  const pendingRef = useRef<number | null>(null);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1025px)");
    const sync = () => setCoverScroll(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    displaySlideRef.current = displaySlide;
  }, [displaySlide]);

  useEffect(() => {
    phaseRef.current = titlePhase;
  }, [titlePhase]);

  useEffect(() => {
    if (displaySlide > slides.length - 1) {
      setDisplaySlide(slides.length - 1);
      displaySlideRef.current = slides.length - 1;
    }
    if (activeSlide > slides.length - 1) {
      setActiveSlide(slides.length - 1);
    }
  }, [activeSlide, displaySlide]);
  useEffect(() => {
    const clearTimers = () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };

    const morphTo = (nextSlide: number) => {
      const clamped = Math.min(Math.max(nextSlide, 0), slides.length - 1);
      clearTimers();
      setTitlePhase("blur-out");
      phaseRef.current = "blur-out";

      const swapId = window.setTimeout(() => {
        setDisplaySlide(clamped);
        displaySlideRef.current = clamped;
        setTitlePhase("blur-in");
        phaseRef.current = "blur-in";
      }, BLUR_MS);

      const settleId = window.setTimeout(() => {
        setTitlePhase("idle");
        phaseRef.current = "idle";

        const queued = pendingRef.current;
        pendingRef.current = null;

        if (queued !== null && queued !== displaySlideRef.current) {
          morphTo(queued);
        }
      }, SETTLE_MS);

      timersRef.current = [swapId, settleId];
    };

    if (activeSlide === displaySlideRef.current) {
      return;
    }

    if (phaseRef.current !== "idle") {
      pendingRef.current = activeSlide;
      return;
    }

    morphTo(activeSlide);
  }, [activeSlide]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    let frameId = 0;

    const update = () => {
      frameId = 0;
      const rect = section.getBoundingClientRect();
      const scrollDistance = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / scrollDistance));
      const enter = Math.min(1, Math.max(0, 1 - rect.top / window.innerHeight));
      // Desktop reserves last ~1/3 for Developments cover; tablet/mobile uses full track
      const slideTrackProgress = coverScroll
        ? Math.min(1, progress / (2 / 3))
        : progress;
      const nextSlide = Math.min(
        slides.length - 1,
        Math.floor(slideTrackProgress * (slides.length - 1) + 0.5),
      );

      setScrollProgress(progress);
      setEnterProgress(enter);
      setViewportHeight(window.innerHeight);
      setActiveSlide(nextSlide);
      setIsSectionVisible(rect.top < window.innerHeight && rect.bottom > 0);
    };

    const requestUpdate = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(update);
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
  }, [coverScroll]);

  const slideTrackProgress = coverScroll
    ? Math.min(1, scrollProgress / (2 / 3))
    : scrollProgress;
  const slideProgress = slideTrackProgress * (slides.length - 1);
  // Desktop: ease out side inset across later track.
  // Mobile: keep inset like slides 1–2 while entering, expand to full width at the top.
  const sideInsetProgress = coverScroll
    ? Math.min(1, Math.max(0, (slideTrackProgress - 0.55) / 0.45))
    : Math.min(1, Math.max(0, (slideTrackProgress - 0.9) / 0.1));
  const lastSlideIndex = slides.length - 1;
  const safeDisplaySlide = Math.min(Math.max(displaySlide, 0), lastSlideIndex);
  const title = slides[safeDisplaySlide]?.title ?? slides[0].title;

  return (
    <section className="latest-developments" aria-labelledby="latest-developments-title">
      <h2 className="latest-developments-title" id="latest-developments-title">
        Latest Developments
      </h2>

      <div
        ref={sectionRef}
        className={`project-slides${isSectionVisible ? " is-visible" : ""}`}
      >
        <div className="project-slides-sticky">
          <div className={`project-slides-heading${isSectionVisible ? " is-visible" : ""}`}>
            <h3 className={`project-slides-title is-${titlePhase}`}>
              {title.split("\n").map((line, lineIndex) => (
                <span key={`${safeDisplaySlide}-${line}`}>
                  {line}
                  {lineIndex < title.split("\n").length - 1 && <br />}
                </span>
              ))}
            </h3>
          </div>

          <div className="project-slides-list">
            {slides.map((slide, index) => {
              const motion = getSlideMotion(index, slideProgress, viewportHeight, enterProgress);
              const isLastSlide = index === lastSlideIndex;

              return (
                <article
                  className={`project-slide${isLastSlide ? " project-slide-third" : " project-slide-inset"}`}
                  style={{
                    zIndex: index + 1,
                    transform: `translate3d(0, ${motion.y}px, 0)`,
                    ...(isLastSlide
                      ? {
                          "--third-progress": sideInsetProgress,
                        }
                      : {}),
                  } as CSSProperties}
                  key={slide.title}
                >
                  <div
                    className="project-slide-background-wrap"
                    style={{
                      transform: `translate3d(0, ${motion.bgY}px, 0) scale(${motion.scale})`,
                    }}
                  >
                    <Image
                      className="project-slide-background"
                      src={slide.image}
                      alt=""
                      fill
                      sizes="100vw"
                      priority={index === 0}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
