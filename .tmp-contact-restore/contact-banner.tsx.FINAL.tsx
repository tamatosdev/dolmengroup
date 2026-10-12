"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import contactBanner from "../../assets/contact-banner.jpg";

export default function ContactBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsVisible(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="contact-banner" aria-labelledby="contact-banner-title">
      <Image
        className="contact-banner-image"
        src={contactBanner}
        alt=""
        fill
        priority
        sizes="100vw"
        aria-hidden="true"
      />
      <div className={`contact-banner-content${isVisible ? " is-visible" : ""}`}>
        <h1 id="contact-banner-title">
          Connect with
          <br />
          Dolmen
        </h1>
        <p>
          From landmark developments to everyday experiences, we create spaces that bring people,
          businesses, and communities together.
        </p>
      </div>
      <a className={`contact-banner-scroll${isVisible ? " is-visible" : ""}`} href="#talk-to-us">
        Scroll
      </a>
    </section>
  );
}
