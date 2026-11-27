import type { Metadata } from "next";
import Image from "next/image";
import brush from "../../../assets/brush.svg";
import heroImage from "../../../assets/Our group page/web/hero-updated.jpg";
import rect2 from "../../../assets/Our group page/web/strip/rect-2.jpg";
import frame406 from "../../../assets/Our group page/web/strip/frame-2147237406.jpg";
import rect4 from "../../../assets/Our group page/web/strip/rect-4.jpg";
import frame409 from "../../../assets/Our group page/web/strip/frame-2147237409.jpg";
import rect5 from "../../../assets/Our group page/web/strip/rect-5.jpg";
import rect6 from "../../../assets/Our group page/web/strip/rect-6.jpg";
import frame401 from "../../../assets/Our group page/web/strip/frame-2147237401.jpg";
import rect7 from "../../../assets/Our group page/web/strip/rect-7.jpg";
import rect8 from "../../../assets/Our group page/web/strip/rect-8.jpg";
import rect9 from "../../../assets/Our group page/web/strip/rect-9.jpg";
import rect10 from "../../../assets/Our group page/web/strip/rect-10.jpg";
import rect11 from "../../../assets/Our group page/web/strip/rect-11.jpg";
import frame395 from "../../../assets/Our group page/web/strip/frame-2147237395.jpg";
import rect0 from "../../../assets/Our group page/web/strip/rect-0.jpg";
import rect1 from "../../../assets/Our group page/web/strip/rect-1.jpg";
import FutureMarquee from "../future-marquee";
import GroupMilestones from "../group-milestones";
import GroupStrip from "../group-strip";
import ScrollReveal from "../scroll-reveal";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "Our Group | Dolmen Group",
  description:
    "From landmark developments to everyday experiences, Dolmen Group creates spaces that bring people, businesses and communities together.",
};

/** Auto-slider photos, in the prototype's order (from the "auto slider" folder). */
const stripImages = [
  rect2,
  frame406,
  rect4,
  frame409,
  rect5,
  rect6,
  frame401,
  rect7,
  rect8,
  rect9,
  rect10,
  rect11,
  frame395,
  rect0,
  rect1,
];

function BuildingIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M9 42V9.5L27 5v37M27 17h12v25M5 42h38" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 14h6M15 21h6M15 28h6M32 24h2M32 31h2M18 42v-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="18" cy="16" r="7" stroke="currentColor" strokeWidth="2.2" />
      <path d="M5 40c0-7.2 5.8-13 13-13s13 5.8 13 13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M29 9.6a7 7 0 0 1 0 12.8M35 27.8c4.7 1.9 8 6.6 8 12.2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function GrowthIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="7" y="30" width="7" height="12" rx="3.5" stroke="currentColor" strokeWidth="2.2" />
      <rect x="20.5" y="24" width="7" height="18" rx="3.5" stroke="currentColor" strokeWidth="2.2" />
      <rect x="34" y="18" width="7" height="24" rx="3.5" stroke="currentColor" strokeWidth="2.2" />
      <path d="M7 22 19 12l7 5L40 6M32 6h8v8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const impacts = [
  {
    icon: <BuildingIcon />,
    title: "Empowering Businesses",
    text: "Creating world-class destinations that enable businesses to thrive, brands to grow and opportunities to emerge.",
  },
  {
    icon: <PeopleIcon />,
    title: "Enriching Lives",
    text: "Shaping meaningful experiences through spaces that bring people together and elevate everyday living.",
  },
  {
    icon: <GrowthIcon />,
    title: "Building the Future",
    text: "Driving urban transformation, creating lasting economic value and setting new benchmarks for Pakistan’s real estate landscape.",
  },
];

export default function OurGroupPage() {
  return (
    <div className="site-shell" id="top">
      <SiteHeader />

      <section className="group-hero" aria-label="Dolmen Group">
        <Image className="group-hero-image" src={heroImage} alt="" fill priority sizes="100vw" />
        {/* The hero photo already carries the Dolmen logo. */}
        <h1 className="sr-only">Dolmen Group — Building a Better Future</h1>
      </section>

      <section className="group-statement" aria-labelledby="group-statement-title">
        <h2 className="group-statement-title" id="group-statement-title" data-reveal>
          From landmark developments to everyday experiences, we create spaces that bring people businesses and{" "}
          <span className="project-intro-highlight">
            communities together
            <Image className="title-brush" src={brush} alt="" aria-hidden="true" />
          </span>
          .
        </h2>
        <GroupStrip images={stripImages} />
      </section>

      <GroupMilestones />

      <section className="group-impact" aria-labelledby="group-impact-title">
        <h2 className="group-impact-title" id="group-impact-title" data-reveal>
          Dolmen’s <span>Impact</span>
        </h2>
        <div className="group-impact-grid">
          {impacts.map((impact) => (
            <article className="group-impact-card" key={impact.title} data-reveal>
              <span className="group-impact-icon">{impact.icon}</span>
              <h3>{impact.title}</h3>
              <p>{impact.text}</p>
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
