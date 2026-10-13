"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import thumbnail from "../../assets/Dolmanmall-video-thumbnail.png";

/** Preview loop length while idle / static. */
const LOOP_END_SECONDS = 12;

function PlayIcon() {
  return (
    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
      <path d="M0 0v12l10-6L0 0Z" fill="currentColor" />
    </svg>
  );
}

export default function DolmenHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const isExpandedRef = useRef(false);
  const loopingRef = useRef(false);

  useEffect(() => {
    isExpandedRef.current = isExpanded;
  }, [isExpanded]);

  const playMuted = async (video: HTMLVideoElement) => {
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    try {
      await video.play();
      return true;
    } catch {
      return false;
    }
  };

  const startPreviewLoop = async () => {
    const video = videoRef.current;
    if (!video || loopingRef.current) {
      return;
    }

    loopingRef.current = true;
    video.loop = false;

    // Avoid hard seek when already near the start — prevents visible jerk.
    if (video.currentTime > LOOP_END_SECONDS || video.ended) {
      try {
        video.currentTime = 0;
      } catch {
        // ignore
      }
    }

    const ok = await playMuted(video);
    loopingRef.current = false;
    if (!ok) {
      // Will retry on next user gesture / visibility
    }
  };

  const playFullVideo = async () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.loop = false;

    // Keep playback continuous from the preview — no seek = no jerk.
    // Play muted first (gesture-safe), then unmute.
    const playing = await playMuted(video);
    if (!playing) {
      return;
    }

    try {
      video.muted = false;
      video.defaultMuted = false;
      video.removeAttribute("muted");
    } catch {
      video.muted = true;
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");
    video.setAttribute("muted", "");

    let started = false;

    const tryStart = () => {
      if (started || isExpandedRef.current) {
        return;
      }
      started = true;
      void startPreviewLoop();
    };

    const onTimeUpdate = () => {
      if (isExpandedRef.current) {
        return;
      }

      // Soft wrap for the 3s preview loop.
      if (video.currentTime >= LOOP_END_SECONDS) {
        try {
          video.currentTime = 0;
        } catch {
          // ignore
        }
      }
    };

    const onEnded = () => {
      if (isExpandedRef.current) {
        isExpandedRef.current = false;
        setIsExpanded(false);
      }
      void startPreviewLoop();
    };

    const onVisibility = () => {
      if (document.hidden || isExpandedRef.current) {
        return;
      }
      if (video.paused) {
        void startPreviewLoop();
      }
    };

    // Unlock autoplay after first interaction if blocked.
    const unlock = () => {
      if (!isExpandedRef.current && video.paused) {
        void startPreviewLoop();
      }
    };

    video.addEventListener("loadeddata", tryStart);
    video.addEventListener("canplay", tryStart);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointerdown", unlock, { passive: true });

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      tryStart();
    }

    return () => {
      video.removeEventListener("loadeddata", tryStart);
      video.removeEventListener("canplay", tryStart);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointerdown", unlock);
    };
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (isExpanded) {
      setIsExpanded(false);
      isExpandedRef.current = false;
      void startPreviewLoop();
      return;
    }

    setIsExpanded(true);
    isExpandedRef.current = true;
    void playFullVideo();
  };

  const handleBannerClick = () => {
    if (!isExpanded) {
      return;
    }
    togglePlayback();
  };

  const handleWatchClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    togglePlayback();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      togglePlayback();
    }
  };

  return (
    <section
      className={`dolmen-hero${isExpanded ? " is-expanded" : ""}`}
      aria-label="Building a Better Future"
      onClick={handleBannerClick}
    >
      <div className="dolmen-hero-stage">
        <video
          ref={videoRef}
          className="dolmen-hero-video"
          src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/dolmen-video-3.mp4?v=hero-fast1`}
          autoPlay
          muted
          playsInline
          preload="auto"
          poster={`${thumbnail.src}?v=5`}
          aria-hidden="true"
          disablePictureInPicture
          controls={false}
        />
        <div className={`dolmen-hero-content${!isExpanded ? " is-visible" : ""}`}>
          <button
            className="dolmen-hero-watch"
            type="button"
            onClick={handleWatchClick}
            onKeyDown={handleKeyDown}
            aria-pressed={isExpanded}
          >
            <PlayIcon />
            Watch Full Video
          </button>
          <h1>
            <span className="dolmen-hero-title-top">Building a Better</span>
            <span className="dolmen-hero-title-row">
              <span className="dolmen-hero-title-future">Future</span>
              <span className="dolmen-hero-copy">
                For over 35 years, Dolmen Group has redefined Pakistan’s real estate landscape with landmark destinations.
              </span>
            </span>
          </h1>
        </div>
        <a
          className="dolmen-hero-scroll"
          href="#about"
          onClick={(event) => event.stopPropagation()}
        >
          Scroll
        </a>
      </div>
    </section>
  );
}
