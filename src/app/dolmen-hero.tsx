"use client";

import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import thumbnail from "../../assets/Dolmanmall-video-thumbnail.png";

/** ~30fps — skip seeks smaller than half a frame to reduce decoder thrash. */
const FRAME_DURATION = 1 / 30;

export default function DolmenHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const revealRef = useRef(false);
  const targetTimeRef = useRef(0);
  const isSeekingRef = useRef(false);
  const rafRef = useRef(0);

  const bumpReveal = (time: number) => {
    const shouldReveal = time >= 2;
    if (shouldReveal === revealRef.current) {
      return;
    }
    revealRef.current = shouldReveal;
    setIsRevealed(shouldReveal);
  };

  const queueSeek = () => {
    if (rafRef.current) {
      return;
    }

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = 0;
      const video = videoRef.current;
      if (!video?.duration || video.readyState < HTMLMediaElement.HAVE_METADATA) {
        return;
      }

      const target = Math.min(video.duration, Math.max(0, targetTimeRef.current));
      if (Math.abs(video.currentTime - target) < FRAME_DURATION * 0.45) {
        bumpReveal(video.currentTime);
        return;
      }

      // Coalesce: never stack seeks while decoder is busy.
      if (isSeekingRef.current || video.seeking) {
        return;
      }

      isSeekingRef.current = true;
      video.currentTime = target;
    });
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.pause();

    const handleSeeked = () => {
      isSeekingRef.current = false;
      bumpReveal(video.currentTime);

      if (Math.abs(video.currentTime - targetTimeRef.current) >= FRAME_DURATION * 0.45) {
        queueSeek();
      }
    };

    const handleReady = () => queueSeek();

    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("loadedmetadata", handleReady);
    video.addEventListener("loadeddata", handleReady);

    return () => {
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("loadedmetadata", handleReady);
      video.removeEventListener("loadeddata", handleReady);
      window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useLenis(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video?.duration) {
      return;
    }

    const scrollDistance = Math.max(1, section.offsetHeight - window.innerHeight);
    // Layout-based progress stays correct under Lenis (avoids window.scrollY drift).
    const progress = Math.min(
      1,
      Math.max(0, -section.getBoundingClientRect().top / scrollDistance),
    );

    targetTimeRef.current = progress * video.duration;
    queueSeek();
  });

  return (
    <section ref={sectionRef} className="dolmen-hero" aria-label="Building a Better Future">
      <div className="dolmen-hero-stage">
        <video
          ref={videoRef}
          className="dolmen-hero-video"
          src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/dolmen-video-2.mp4?v=scrub1`}
          muted
          playsInline
          preload="auto"
          poster={`${thumbnail.src}?v=3`}
          aria-hidden="true"
        />
        <div className={`dolmen-hero-content${isRevealed ? " is-visible" : ""}`}>
          <h1>
            <span>Building a Better</span>
            <span>Future</span>
          </h1>
          <p>
            From everyday rituals to defining moments, Dolmen creates destinations designed to live beyond their architecture.
          </p>
        </div>
      </div>
    </section>
  );
}
