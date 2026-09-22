"use client";

import { useEffect, useRef, useState } from "react";
import thumbnail from "../../assets/Dolmanmall-video-thumbnail.png";

export default function DolmenHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;

    if (!section || !video) {
      return;
    }

    let frameId = 0;
    let targetTime = 0;
    let sectionTop = 0;
    let scrollDistance = 1;
    let isSeeking = false;
    let videoFrameCallbackId: number | undefined;
    let isContentRevealed = false;

    const updateMeasurements = () => {
      const sectionBounds = section.getBoundingClientRect();
      sectionTop = sectionBounds.top + window.scrollY;
      scrollDistance = Math.max(1, section.offsetHeight - window.innerHeight);
    };

    const getTargetTime = () => {
      const progress = Math.min(
        1,
        Math.max(0, (window.scrollY - sectionTop) / scrollDistance),
      );
      return progress * video.duration;
    };

    const updateRevealState = (currentTime: number) => {
      const shouldRevealContent = currentTime >= 2;
      if (shouldRevealContent !== isContentRevealed) {
        isContentRevealed = shouldRevealContent;
        setIsRevealed(shouldRevealContent);
      }
    };

    const animateVideo = () => {
      frameId = 0;

      if (video.readyState < HTMLMediaElement.HAVE_METADATA || !video.duration) {
        return;
      }

      if (isSeeking) {
        return;
      }

      const difference = targetTime - video.currentTime;
      if (Math.abs(difference) <= 0.003) {
        updateRevealState(video.currentTime);
        return;
      }

      const nextTime = Math.min(
        video.duration,
        Math.max(0, video.currentTime + difference * 0.35),
      );
      isSeeking = true;
      video.currentTime = nextTime;

      if ("requestVideoFrameCallback" in video) {
        videoFrameCallbackId = video.requestVideoFrameCallback(() => {
          updateRevealState(video.currentTime);
        });
      }
    };

    const handleSeeked = () => {
      isSeeking = false;
      updateRevealState(video.currentTime);

      if (Math.abs(targetTime - video.currentTime) > 0.003) {
        frameId = window.requestAnimationFrame(animateVideo);
      }
    };

    const requestVideoSync = () => {
      if (video.readyState < HTMLMediaElement.HAVE_METADATA || !video.duration) {
        return;
      }

      targetTime = getTargetTime();
      if (!frameId) {
        frameId = window.requestAnimationFrame(animateVideo);
      }
    };

    updateMeasurements();
    const handleResize = () => {
      updateMeasurements();
      requestVideoSync();
    };

    video.addEventListener("loadedmetadata", requestVideoSync);
    video.addEventListener("seeked", handleSeeked);
    window.addEventListener("scroll", requestVideoSync, { passive: true });
    window.addEventListener("resize", handleResize);
    requestVideoSync();

    return () => {
      video.removeEventListener("loadedmetadata", requestVideoSync);
      video.removeEventListener("seeked", handleSeeked);
      window.removeEventListener("scroll", requestVideoSync);
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(frameId);
      if (videoFrameCallbackId !== undefined && "cancelVideoFrameCallback" in video) {
        video.cancelVideoFrameCallback(videoFrameCallbackId);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="dolmen-hero" aria-label="Building a Better Future">
      <div className="dolmen-hero-stage">
        <video
          ref={videoRef}
          className="dolmen-hero-video"
          src="/dolmen-video-2.mp4"
          muted
          playsInline
          preload="auto"
          poster={thumbnail.src}
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
