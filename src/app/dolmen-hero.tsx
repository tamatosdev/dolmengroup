"use client";

import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import thumbnail from "../../assets/Dolmanmall-video-thumbnail.png";

/** ~30fps — skip seeks smaller than ~2 frames to reduce decoder thrash. */
const FRAME_DURATION = 1 / 30;
const REVEAL_AT_SECONDS = 2;

export default function DolmenHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const revealedRef = useRef(false);
  const targetTimeRef = useRef(0);
  const lastAppliedRef = useRef(-1);
  const unlockedRef = useRef(false);
  const isSeekingRef = useRef(false);
  const seekTimeoutRef = useRef<number | null>(null);

  const bumpReveal = (time: number) => {
    if (!revealedRef.current && time >= REVEAL_AT_SECONDS) {
      revealedRef.current = true;
      setIsRevealed(true);
    }
  };

  const clearSeekTimeout = () => {
    if (seekTimeoutRef.current !== null) {
      window.clearTimeout(seekTimeoutRef.current);
      seekTimeoutRef.current = null;
    }
  };

  const finishSeek = () => {
    clearSeekTimeout();
    isSeekingRef.current = false;
    applyScrub();
  };

  const applyScrub = () => {
    const video = videoRef.current;
    if (!video?.duration || video.readyState < HTMLMediaElement.HAVE_METADATA) {
      return;
    }

    if (isSeekingRef.current) {
      return;
    }

    if (!video.paused) {
      video.pause();
    }

    const target = Math.min(video.duration, Math.max(0, targetTimeRef.current));
    bumpReveal(target);

    if (Math.abs(lastAppliedRef.current - target) < FRAME_DURATION * 2) {
      return;
    }
    if (Math.abs(video.currentTime - target) < FRAME_DURATION * 2) {
      lastAppliedRef.current = target;
      bumpReveal(video.currentTime);
      return;
    }

    try {
      isSeekingRef.current = true;
      clearSeekTimeout();
      seekTimeoutRef.current = window.setTimeout(finishSeek, 200);
      video.currentTime = target;
      lastAppliedRef.current = target;
      if (target > 0.05) {
        video.removeAttribute("poster");
      }
    } catch {
      isSeekingRef.current = false;
      clearSeekTimeout();
      lastAppliedRef.current = -1;
    }
  };

  const updateFromScroll = () => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video?.duration) {
      return;
    }

    const scrollDistance = Math.max(1, section.offsetHeight - window.innerHeight);
    const progress = Math.min(
      1,
      Math.max(0, -section.getBoundingClientRect().top / scrollDistance),
    );

    targetTimeRef.current = progress * video.duration;
    applyScrub();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");
    video.muted = true;
    video.defaultMuted = true;
    video.pause();

    const onSeeked = () => {
      bumpReveal(video.currentTime);
      finishSeek();
    };

    const unlockOnGesture = () => {
      if (unlockedRef.current) {
        updateFromScroll();
        return;
      }

      video.muted = true;
      video.defaultMuted = true;

      // iOS needs play/pause inside a user gesture before seeks stick.
      // Never leave play() hanging — that blocks later currentTime writes.
      const playAttempt = video.play();
      const finish = () => {
        video.pause();
        unlockedRef.current = true;
        lastAppliedRef.current = -1;
        updateFromScroll();
      };

      if (playAttempt !== undefined) {
        const timeout = window.setTimeout(finish, 150);
        void playAttempt
          .then(() => {
            window.clearTimeout(timeout);
            finish();
          })
          .catch(() => {
            window.clearTimeout(timeout);
            finish();
          });
      } else {
        finish();
      }
    };

    video.addEventListener("seeked", onSeeked);
    video.addEventListener("loadedmetadata", updateFromScroll);
    video.addEventListener("loadeddata", updateFromScroll);
    video.addEventListener("canplay", updateFromScroll);
    window.addEventListener("touchstart", unlockOnGesture, { passive: true });
    window.addEventListener("pointerdown", unlockOnGesture, { passive: true });
    window.addEventListener("wheel", unlockOnGesture, { passive: true, once: true });

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      updateFromScroll();
    }

    return () => {
      clearSeekTimeout();
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadedmetadata", updateFromScroll);
      video.removeEventListener("loadeddata", updateFromScroll);
      video.removeEventListener("canplay", updateFromScroll);
      window.removeEventListener("touchstart", unlockOnGesture);
      window.removeEventListener("pointerdown", unlockOnGesture);
      window.removeEventListener("wheel", unlockOnGesture);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => updateFromScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useLenis(() => {
    updateFromScroll();
  });

  return (
    <section ref={sectionRef} className="dolmen-hero" aria-label="Building a Better Future">
      <div className="dolmen-hero-stage">
        <video
          ref={videoRef}
          className="dolmen-hero-video"
          src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/dolmen-video-3.mp4?v=scrub-smooth1`}
          muted
          playsInline
          preload="auto"
          poster={`${thumbnail.src}?v=5`}
          aria-hidden="true"
          disablePictureInPicture
          controls={false}
        />
        <div className={`dolmen-hero-content${isRevealed ? " is-visible" : ""}`}>
          <h1>
            <span>Building a Better</span>
            <span>Future</span>
          </h1>
          <p>
            For over 35 years, Dolmen Group has shaped Pakistan’s real estate landscape with landmark destinations.
          </p>
        </div>
      </div>
    </section>
  );
}
