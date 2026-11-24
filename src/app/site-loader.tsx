"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import darkLogo from "../../assets/dark-Logo.png";

export default function SiteLoader() {
  const [progress, setProgress] = useState(8);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let completeTimer: ReturnType<typeof setTimeout> | undefined;
    let revealTimer: ReturnType<typeof setTimeout> | undefined;
    const aboutSection = document.querySelector<HTMLElement>(".about-section");
    const aboutObserver = aboutSection
      ? new IntersectionObserver(
          ([entry], observer) => {
            if (entry.isIntersecting) {
              aboutSection.classList.add("is-visible");
              observer.unobserve(aboutSection);
            }
          },
          // Viewport-based, not a share of the (very tall) section: a 15% threshold of
          // ~1800px never fits a short screen, leaving About hidden for good.
          { threshold: 0, rootMargin: "0px 0px -15% 0px" },
        )
      : undefined;

    if (aboutSection && aboutObserver) {
      // Already scrolled past it (e.g. a restored scroll position): just show it.
      if (aboutSection.getBoundingClientRect().bottom < 0) {
        aboutSection.classList.add("is-visible");
      } else {
        aboutSection.classList.add("reveal-armed");
        aboutObserver.observe(aboutSection);
      }
    }

    const finishLoading = () => {
      setProgress(100);
      completeTimer = setTimeout(() => {
        setIsComplete(true);
        revealTimer = setTimeout(() => {
          document.body.classList.add("site-loaded");
        }, 450);
      }, 450);
    };

    if (document.readyState === "complete") {
      finishLoading();
    } else {
      window.addEventListener("load", finishLoading, { once: true });
    }

    // Large hero video can delay window "load"; don't leave the page blank.
    const maxWaitTimer = window.setTimeout(finishLoading, 2200);

    const progressTimer = setInterval(() => {
      setProgress((currentProgress) => {
        if (currentProgress >= 88) {
          return currentProgress;
        }

        return currentProgress + 4;
      });
    }, 160);

    return () => {
      window.removeEventListener("load", finishLoading);
      clearInterval(progressTimer);
      window.clearTimeout(maxWaitTimer);
      if (completeTimer) {
        clearTimeout(completeTimer);
      }
      if (revealTimer) {
        clearTimeout(revealTimer);
      }
      aboutObserver?.disconnect();
    };
  }, []);

  return (
    <div className={`site-loader${isComplete ? " is-complete" : ""}`} aria-hidden="true">
      <Image className="site-loader-logo" src={darkLogo} alt="" priority />
      <div className="site-loader-track">
        <div className="site-loader-progress" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
