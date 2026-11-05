"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import arrowRight from "../../assets/arrow-right.svg";
import careerImage1 from "../../assets/career-image-1.png";
import careerImage3 from "../../assets/career-image-3.png";
import careerImage4 from "../../assets/career-image-4.png";
import careerImage5 from "../../assets/career-image-5.png";
import placesSectionBackground from "../../assets/places-section-bg.png";

// One photo per corner of the card, around the centred copy.
const careerImages = [
  {
    src: careerImage1,
    alt: "Team member working on a laptop in a bright workspace",
    className: "contact-photo contact-photo-tl",
  },
  {
    src: careerImage4,
    alt: "Team member smiling while working on a laptop",
    className: "contact-photo contact-photo-tr",
  },
  {
    src: careerImage3,
    alt: "Team member reviewing documents at a desk",
    className: "contact-photo contact-photo-bl",
  },
  {
    src: careerImage5,
    alt: "Team meeting around a table with laptops",
    className: "contact-photo contact-photo-br",
  },
] as const;

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
    <section ref={sectionRef} className="contact-section" id="careers" aria-labelledby="careers-title">
      <div className={`contact-section-inner${isVisible ? " is-visible" : ""}`}>
        <Image className="contact-section-background" src={placesSectionBackground} alt="" fill aria-hidden="true" />

        {careerImages.map((image) => (
          <figure key={image.className} className={image.className}>
            <Image src={image.src} alt={image.alt} sizes="(max-width: 768px) 34vw, 20vw" />
          </figure>
        ))}

        <div className="contact-section-content">
          <h2 id="careers-title">Grow Your{" "}<br />Career At Dolmen</h2>
          <p>
            Join a team that brings together diverse talent, ideas, and perspectives to create meaningful places, experiences, and opportunities that shape the future of our cities.
          </p>
          <a className="contact-section-button" href="#careers">
            Explore Careers
            <Image src={arrowRight} alt="" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
