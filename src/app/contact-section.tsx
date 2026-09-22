"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import arrowRight from "../../assets/arrow-right.svg";
import darkLogo from "../../assets/dark-Logo.png";
import placesSectionBackground from "../../assets/places-section-bg.png";

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(section);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className={`contact-section-inner${isVisible ? " is-visible" : ""}`}>
        <Image className="contact-section-background" src={placesSectionBackground} alt="" fill aria-hidden="true" />
        <div className="contact-section-content">
          <Image className="contact-section-logo" src={darkLogo} alt="Dolmen - Building a better future" />
          <h2 id="contact-title">Creating places that<br />shape the way cities live</h2>
          <p>
            Whether you&apos;re looking to connect, explore opportunities, discuss partnerships or simply learn more, get in touch with our team and we&apos;ll be happy to assist.
          </p>
          <a className="contact-section-button" href="#contact-form">
            Get In Touch
            <Image src={arrowRight} alt="" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
