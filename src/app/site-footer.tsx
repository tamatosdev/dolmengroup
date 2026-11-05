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
      <path
        d="M13.5 21v-7.5h2.53l.38-2.94H13.5V8.69c0-.85.24-1.43 1.46-1.43h1.54V4.63a21 21 0 0 0-2.26-.13c-2.24 0-3.77 1.37-3.77 3.88v2.18H7.94v2.94h2.53V21h3.03Z"
        fill="currentColor"
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
      <path
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125Zm1.782 13.019H3.555V9h3.564v11.452Z"
        fill="currentColor"
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

      <nav className="footer-nav" aria-label="Footer">
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

        {/* Entertainment and Retail share the last column, one above the other. */}
        <div className="footer-nav-stack">
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
      </nav>

      <div className="footer-bottom">
        <div className="footer-socials">
          <a href="#facebook" aria-label="Facebook">
            <FacebookIcon />
          </a>
          <a href="#instagram" aria-label="Instagram">
            <InstagramIcon />
          </a>
          <a
            href="https://www.linkedin.com/company/dolmengroup/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </a>
        </div>

        <span className="footer-copy">
          © 2026 Dolmen Group. All rights reserved. Designed and Developed by{" "}
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
