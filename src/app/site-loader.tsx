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
          { threshold: 0.15 },
        )
      : undefined;

    if (aboutSection && aboutObserver) {
      aboutObserver.observe(aboutSection);
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
