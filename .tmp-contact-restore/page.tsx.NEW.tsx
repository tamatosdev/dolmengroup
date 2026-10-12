import Image from "next/image";
import arrowRight from "../../assets/arrow-right.svg";
import brush from "../../assets/brush.svg";
import DolmenNumbers from "./dolmen-numbers";
import DolmenHero from "./dolmen-hero";
import FeaturedDevelopments from "./featured-developments";
import FutureMarquee from "./future-marquee";
import LatestUpdates from "./latest-updates";
import ProjectSlides from "./project-slides";
import ProjectOverviewSlider from "./project-overview-slider";
import ContactSection from "./contact-section";
import SiteFooter from "./site-footer";
import SiteHeader from "./site-header";

export default function Home() {
  return (
    <div className="site-shell" id="top">
      <SiteHeader />

      <DolmenHero />

      <section className="about-section" id="about" aria-labelledby="about-title">
        <h2 className="about-title" id="about-title">
          Where Life, Business
          <br />
          and Cities{" "}
          <span>
            Meet.
            <Image
              className="title-brush"
              src={brush}
              alt=""
              aria-hidden="true"
              style={{ width: "100%", height: "9px" }}
            />
          </span>
        </h2>

        <div className="about-content">
          <p className="about-statement">
            A building occupies space.
            <br />
            Destination creates meaning.
          </p>

          <div className="about-copy">
            <p>
              Dolmen approaches development through the way people experience a place — how they arrive, move, meet, work, shop, unwind and return.
            </p>
            <p>
              For over 35 years, Dolmen Group has been shaping Pakistan&apos;s real estate landscape with landmark destinations.
            </p>
            <p className="about-claim">We create places with a life beyond their walls.</p>
            <a className="about-button" href="#about-story">
              Discover Our Story
              <Image src={arrowRight} alt="" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <ProjectSlides />

      <FeaturedDevelopments />

      <DolmenNumbers />

      <ContactSection />

      <ProjectOverviewSlider />

      <LatestUpdates />

      <FutureMarquee />

      <SiteFooter />
    </div>
  );
}