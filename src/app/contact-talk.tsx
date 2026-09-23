"use client";

import Image from "next/image";
import { FormEvent } from "react";
import arrowDown from "../../assets/arrow-down.svg";
import arrowRight from "../../assets/arrow-right.svg";

const enquiryOptions = [
  "Shopping Mall (Retail Outlets)",
  "Shopping Mall (Activation, Carts & Kiosks)",
  "Commercial Offices",
  "Residential Project",
  "General Queries",
];

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M2.25 4.5h13.5v9H2.25v-9Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="m2.25 5.25 6.75 5.25L15.75 5.25"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M6.2 3.6c.3-.7 1.1-.9 1.7-.5l1.3.9c.6.4.7 1.2.3 1.8l-.5.8c.7 1.3 1.8 2.4 3.1 3.1l.8-.5c.6-.4 1.4-.3 1.8.3l.9 1.3c.4.6.2 1.4-.5 1.7-.9.4-2 .6-3.1.2C8.8 12 6 9.2 5.3 6.1c-.4-1.1-.2-2.2.9-3.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M9 1.75c2.9 0 5.25 2.25 5.25 5.1 0 3.4-3.6 7.55-4.9 8.9a.5.5 0 0 1-.7 0C7.35 14.4 3.75 10.25 3.75 6.85 3.75 4 6.1 1.75 9 1.75Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="9" cy="6.75" r="1.75" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export default function ContactTalk() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <section className="contact-talk" id="talk-to-us" aria-labelledby="talk-to-us-title">
      <div className="contact-talk-info">
        <h2 id="talk-to-us-title">Talk to us</h2>
        <p className="contact-talk-intro">
          Whether you&apos;re looking to connect, explore opportunities, discuss partnerships or simply
          learn more, get in touch with our team and we will be happy to assist.
        </p>

        <div className="contact-talk-details">
          <div className="contact-talk-detail">
            <h3>Contact</h3>
            <a href="mailto:info@dolmengroup.com">
              <MailIcon />
              info@dolmengroup.com
            </a>
            <a href="tel:+922100000000">
              <PhoneIcon />
              +92 21 0000 0000
            </a>
          </div>

          <div className="contact-talk-detail">
            <h3>Address</h3>
            <p>
              <PinIcon />
              <span>Abdul Sattar Edhi Avenue, Road, Block 4 Clifton, Karachi</span>
            </p>
          </div>
        </div>

        <div className="contact-talk-map">
          <iframe
            title="Dolmen Group head office map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.8146724451635!2d67.0261608857379!3d24.801798790808633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33d46c229528d%3A0x5e4e32b036b27f38!2sSky%20Tower!5e0!3m2!1sen!2s!4v1790166465917!5m2!1sen!2s"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>

      <form className="contact-talk-form" onSubmit={handleSubmit} noValidate>
        <div className="contact-talk-form-row">
          <label className="contact-talk-field">
            <span>Name *</span>
            <input type="text" name="name" placeholder="Insert your name" required autoComplete="name" />
          </label>
          <label className="contact-talk-field">
            <span>Phone Number *</span>
            <input
              type="tel"
              name="phone"
              placeholder="+92 333 000-0000"
              required
              autoComplete="tel"
            />
          </label>
        </div>

        <label className="contact-talk-field">
          <span>Email *</span>
          <input
            type="email"
            name="email"
            placeholder="myemail@email.com"
            required
            autoComplete="email"
          />
        </label>

        <label className="contact-talk-field contact-talk-select">
          <span>What is your enquiry about?</span>
          <select name="enquiry" defaultValue={enquiryOptions[0]} required>
            {enquiryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <Image className="contact-talk-select-arrow" src={arrowDown} alt="" aria-hidden="true" />
        </label>

        <label className="contact-talk-field">
          <span>Message *</span>
          <textarea name="message" placeholder="Type your message..." rows={6} required />
        </label>

        <button className="contact-talk-submit" type="submit">
          Send Message
          <Image src={arrowRight} alt="" aria-hidden="true" />
        </button>
      </form>
    </section>
  );
}
