"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import arrowDown from "../../assets/arrow-down.svg";
import arrowRight from "../../assets/arrow-right.svg";
import careerImage from "../../assets/career page/career.png";
import { submitCareer } from "./submit-mail";

const locationOptions = ["Karachi", "Lahore", "Islamabad"];

const categoryOptions = [
  "HR & Talent",
  "Finance & Accounts",
  "Real Estate & Leasing",
  "Mall Operations",
  "Architecture & Design",
  "Project Management",
  "Marketing & PR",
];

const COVER_LETTER_MAX = 1000;
const RESUME_MAX_BYTES = 5 * 1024 * 1024;
const RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"];

function UploadIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M11 14V3.5M11 3.5 6.75 7.75M11 3.5l4.25 4.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 13.5v3.25c0 .97.78 1.75 1.75 1.75h11.5c.97 0 1.75-.78 1.75-1.75V13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function CareerForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [coverLength, setCoverLength] = useState(0);
  const [resume, setResume] = useState<File | null>(null);
  const resumeInput = useRef<HTMLInputElement>(null);

  const handleResume = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setResume(null);
      return;
    }

    const lowerName = file.name.toLowerCase();
    if (!RESUME_EXTENSIONS.some((extension) => lowerName.endsWith(extension))) {
      event.target.value = "";
      setResume(null);
      setStatus("error");
      setFeedback("Please upload your CV as a PDF, DOC or DOCX file.");
      return;
    }

    if (file.size > RESUME_MAX_BYTES) {
      event.target.value = "";
      setResume(null);
      setStatus("error");
      setFeedback("Your CV must be 5 MB or smaller.");
      return;
    }

    setResume(file);
    if (status === "error") {
      setStatus("idle");
      setFeedback("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();

    if (!name || !phone || !email) {
      setStatus("error");
      setFeedback("Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setFeedback("Please enter a valid email address.");
      return;
    }

    if (!resume) {
      setStatus("error");
      setFeedback("Please upload your CV.");
      return;
    }

    if (formData.get("consent") !== "yes") {
      setStatus("error");
      setFeedback("Please agree to the Privacy Policy and Recruitment Terms.");
      return;
    }

    setStatus("loading");
    setFeedback("");

    formData.set("type", "career");
    formData.set("consent", "1");
    const result = await submitCareer(formData);

    if (!result.ok) {
      setStatus("error");
      setFeedback(result.error || "Something went wrong. Please try again.");
      return;
    }

    setStatus("success");
    setFeedback(result.message || "Application sent successfully.");
    form.reset();
    setResume(null);
    setCoverLength(0);
  };

  return (
    <form className="contact-talk-form career-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-talk-form-row">
        <label className="contact-talk-field">
          <span>Name *</span>
          <input type="text" name="name" placeholder="Insert your name" required autoComplete="name" suppressHydrationWarning />
        </label>
        <label className="contact-talk-field">
          <span>Phone Number *</span>
          <input type="tel" name="phone" placeholder="+92 333 000-0000" required autoComplete="tel" suppressHydrationWarning />
        </label>
      </div>

      <div className="contact-talk-form-row">
        <label className="contact-talk-field">
          <span>Email *</span>
          <input type="email" name="email" placeholder="myemail@email.com" required autoComplete="email" suppressHydrationWarning />
        </label>
        <label className="contact-talk-field contact-talk-select">
          <span>Location *</span>
          <select name="location" defaultValue={locationOptions[0]} required suppressHydrationWarning>
            {locationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <Image className="contact-talk-select-arrow" src={arrowDown} alt="" aria-hidden="true" />
        </label>
      </div>

      <label className="contact-talk-field contact-talk-select">
        <span>What position are you applying for? *</span>
        <select name="category" defaultValue={categoryOptions[0]} required suppressHydrationWarning>
          {categoryOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <Image className="contact-talk-select-arrow" src={arrowDown} alt="" aria-hidden="true" />
      </label>

      <div className="contact-talk-field">
        <span id="career-resume-label">Upload your Resume *</span>
        <label className={`career-upload${resume ? " has-file" : ""}`}>
          <input
            ref={resumeInput}
            className="career-upload-input"
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            aria-labelledby="career-resume-label"
            onChange={handleResume}
            suppressHydrationWarning
          />
          <span className="career-upload-icon">
            <UploadIcon />
          </span>
          <span className="career-upload-text">
            <strong>{resume ? resume.name : "Upload CV"}</strong>
            <small>{resume ? `${formatSize(resume.size)} · Click to change` : "PDF, DOC, DOCX · Max 5 MB"}</small>
          </span>
        </label>
      </div>

      <label className="contact-talk-field career-cover">
        <span>Cover Letter</span>
        <textarea
          name="coverLetter"
          placeholder="Tell us about yourself and why you would like to join Dolmen Group..."
          rows={6}
          maxLength={COVER_LETTER_MAX}
          onChange={(event) => setCoverLength(event.target.value.length)}
          suppressHydrationWarning
        />
        <small className="career-cover-count" aria-live="polite">
          {coverLength}/{COVER_LETTER_MAX}
        </small>
      </label>

      <label className="contact-talk-consent">
        <input type="checkbox" name="consent" value="yes" required suppressHydrationWarning />
        <span>
          I agree to the <a href="#privacy-policy">Privacy Policy</a> and{" "}
          <a href="#recruitment-terms">Recruitment Terms</a> and consent to my information being used for
          recruitment purposes.
        </span>
      </label>

      <button className="contact-talk-submit" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Submit Application"}
        <Image src={arrowRight} alt="" aria-hidden="true" />
      </button>

      {feedback ? (
        <p className={`contact-talk-feedback is-${status}`} role="status">
          {feedback}
        </p>
      ) : null}
    </form>
  );
}

export default function CareerApply() {
  // Mount the form after hydration so password-manager extensions cannot alter SSR HTML.
  const [formReady, setFormReady] = useState(false);

  useEffect(() => {
    setFormReady(true);
  }, []);

  return (
    <section className="career-apply" id="apply" aria-label="Apply to Dolmen Group">
      <div className="career-apply-media" data-reveal="scale">
        <Image src={careerImage} alt="Dolmen Mall atrium" fill sizes="(max-width: 1024px) 100vw, 50vw" />
      </div>
      {formReady ? <CareerForm /> : <div className="contact-talk-form career-form" aria-hidden="true" />}
    </section>
  );
}
