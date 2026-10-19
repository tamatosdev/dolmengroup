"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import arrowRight from "../../assets/arrow-right.svg";
import arrowUp from "../../assets/arrow-up.svg";
import footerLogo from "../../assets/footer-logo.png";
import { SHOW_DOLMEN_CITY_ISLAMABAD } from "./project-visibility";
import { submitMail } from "./submit-mail";

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        d="M13.2 19.2v-6.4h2.1l.3-2.4h-2.4V8.9c0-.7.2-1.2 1.2-1.2h1.3V5.5c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.2-3.2 3.3v1.8H8.4v2.4h2.2v6.4h2.6Z"
        fill="#111111"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="3.2" fill="currentColor" />
      <path
        d="M7.4 10.1H5.2V18h2.2v-7.9ZM6.3 6.2c-.7 0-1.3.6-1.3 1.3s.6 1.3 1.3 1.3 1.3-.6 1.3-1.3-.6-1.3-1.3-1.3ZM18.8 13.3c0-1.9-1-3.2-2.7-3.2-.9 0-1.6.5-1.9 1.1h-.1v-.9h-2.1V18h2.2v-4.2c0-1.1.2-2.2 1.6-2.2s1.4 1 1.4 2.3V18h2.2v-4.7Z"
        fill="#111111"
      />
    </svg>
  );
}

export default function SiteFooter() {
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [newsletterFeedback, setNewsletterFeedback] = useState("");

  const handleNewsletterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "");

    setNewsletterStatus("loading");
    setNewsletterFeedback("");

    const result = await submitMail({
      type: "newsletter",
      email,
    });

    if (!result.ok) {
      setNewsletterStatus("error");
      setNewsletterFeedback(result.error || "Something went wrong. Please try again.");
      return;
    }

    setNewsletterStatus("success");
    setNewsletterFeedback(result.message || "Subscribed successfully.");
    form.reset();
  };

  return (
    <footer className="site-footer" id="site-footer">
      <div className="footer-top">
        <Link className="footer-brand" href="/" aria-label="Dolmen home">
          <Image src={footerLogo} alt="Dolmen - Building a better future" />
        </Link>

        <div className="newsletter">
          <h2>Stay Updated</h2>
          <p>
            Subscribe to get fresh property listings, market updates, and expert tips delivered
            straight to your inbox.
          </p>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit} noValidate>
            <label className="sr-only" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Type your email"
              required
              suppressHydrationWarning
            />
            <button type="submit" disabled={newsletterStatus === "loading"}>
              {newsletterStatus === "loading" ? "Sending..." : "Subscribe"}
              <Image src={arrowRight} alt="" aria-hidden="true" />
            </button>
          </form>
          {newsletterFeedback ? (
            <p className={`newsletter-feedback is-${newsletterStatus}`} role="status">
              {newsletterFeedback}
            </p>
          ) : null}
        </div>
      </div>

      <div className="footer-nav">
        <div className="footer-link-group">
          <h2>Company</h2>
          <Link href="/#about">About</Link>
          <a href="#reit">REIT</a>
          <Link href="/#updates">Updates</Link>
          <Link href="/#careers">Careers</Link>
          <Link href="/contact/">Contact</Link>
        </div>

        <div className="footer-link-group">
          <h2>Malls</h2>
          <a href="#dolmen-mall-clifton">Dolmen Mall Clifton</a>
          <a href="#dolmen-mall-lahore">Dolmen Mall Lahore</a>
          <a href="#dolmen-mall-tariq-road">Dolmen Mall Tariq Road</a>
          <a href="#dolmen-mall-hyderi">Dolmen Mall Hyderi</a>
        </div>

        <div className="footer-link-group">
          <h2>Offices</h2>
          <a href="#the-harbour-front">The Harbour Front</a>
          <a href="#sky-towers">Sky Towers</a>
          <a href="#corporate-office-block">Corporate Office Block</a>
          <a href="#executive-tower">Executive Tower</a>
        </div>

        <div className="footer-link-group">
          <h2>Residences</h2>
          <a href="#the-grove-residency">The Grove Residency</a>
          {SHOW_DOLMEN_CITY_ISLAMABAD ? (
            <a href="#dolmen-city-islamabad">Dolmen City Islamabad</a>
          ) : null}
        </div>

        <div className="footer-link-group">
          <h2>Entertainment</h2>
          <a href="#sindbads-wonderland">Sindbad&apos;s Wonderland</a>
        </div>

        <div className="footer-link-group">
          <h2>Retail</h2>
          <a href="#giordano">Giordano</a>
          <a href="#bala-bala">Bala Bala</a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-socials">
          <a href="#facebook" aria-label="Facebook">
            <FacebookIcon />
          </a>
          <a href="#instagram" aria-label="Instagram">
            <InstagramIcon />
          </a>
          <a href="#linkedin" aria-label="LinkedIn">
            <LinkedInIcon />
          </a>
        </div>

        <span className="footer-copy">
          © 2026 Dolmen Group. All rights reserved. Design and Developed by{" "}
          <a className="footer-credit" href="https://tamatos.com/" target="_blank" rel="noopener noreferrer">
            tamatos
          </a>
        </span>

        <a className="back-to-top" href="#top" aria-label="Back to top">
          <Image src={arrowUp} alt="" aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
