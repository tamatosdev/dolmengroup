import type { Metadata } from "next";
import heroImage from "../../../assets/career page/hero scetion image.png";
import heroMobileImage from "../../../assets/career page/mobile hero section image.jpg";
import CareerApply from "../career-apply";
import FutureMarquee from "../future-marquee";
import ProjectHero from "../project-hero";
import ScrollReveal from "../scroll-reveal";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "Careers | Dolmen Group",
  description:
    "Discover rewarding opportunities across Pakistan’s premier retail and commercial destinations. Grow your career with a legacy of excellence.",
};

function BuildingIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M8 35V8.5L22 4v31M22 14h10v21M4 35h32" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 12h4M13 18h4M13 24h4M26.5 20h1M26.5 26h1M15 35v-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="30" height="22" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M15 11V8.5A2.5 2.5 0 0 1 17.5 6h5A2.5 2.5 0 0 1 25 8.5V11" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="26" cy="24" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M26 22.2v1.8l1.2 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const careerAreas = [
  {
    icon: <BuildingIcon />,
    title: "Real Estate & Development",
    text: "Shape premier architectural landmarks, manage large-scale construction projects and lead urban development initiatives from vision to completion.",
  },
  {
    icon: <BriefcaseIcon />,
    title: "Corporate & Retail Management",
    text: "Drive operational excellence across our flagship retail centers, leasing operations, marketing, finance and corporate strategy.",
  },
];

export default function CareerPage() {
  return (
    <div className="site-shell" id="top">
      <SiteHeader />
      <ProjectHero
        category="Careers"
        titleLines={["Build your Future", "with us"]}
        description="Discover rewarding opportunities across Pakistan’s premier retail and commercial destinations. Grow your career with a legacy of excellence."
        image={heroImage}
        mobileImage={heroMobileImage}
      />
      <CareerApply />
      <section className="career-discover" aria-labelledby="career-discover-title">
        <div className="career-discover-intro" data-reveal>
          <h2 id="career-discover-title">
            Discover Your Next
            <br />
            Career Chapter
          </h2>
          <p>
            Join Pakistan’s leading real estate development and asset management organization. Dolmen Group offers
            dynamic career pathways across commercial, residential and retail developments. We empower driven
            professionals to lead transformative projects, grow within an innovative workplace and shape the
            benchmark of urban living.
          </p>
        </div>
        <div className="career-discover-areas">
          {careerAreas.map((area) => (
            <article className="career-discover-area" key={area.title} data-reveal>
              <span className="career-discover-icon">{area.icon}</span>
              <h3>{area.title}</h3>
              <p>{area.text}</p>
            </article>
          ))}
        </div>
      </section>
      <FutureMarquee />
      <SiteFooter />
      <ScrollReveal />
    </div>
  );
}
